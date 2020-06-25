import {
  Route,
  RouterSettings,
  HookCommand,
  Callback,
  RouteObject
} from './types'
import PathService from '../Services/PathService'
import HashParser from '../Parsers/HashParser'
import Observable from '../Utils/Observable'
import UrlParser from '../Services/UrlParser'
import SilentModeService from '../Services/SilentModeService'

export default class Router {
  private pathService = new PathService()
  private readonly routes: Route[] = []
  private parser: HashParser | null = null
  private ignoreEvents = false
  private silentControl: SilentModeService | null = null

  public beforeEach: Callback | null = null
  public afterEach: Callback | null = null

  public currentMatched = new Observable<Route[]>([])
  public currentRouteData = new Observable<RouteObject>({
    params: {},
    query: {},
    name: ''
  })

  constructor(private settings: RouterSettings) {
    this.routes = this.pathService.getPathInformation(settings.routes)
    setTimeout(() => {
      this.setParser()
    }, 0)
  }

  private setParser() {
    switch (this.mode) {
      case 'silent':
        this.parser = new HashParser(this.routes)
        this.parseRoute(`${window.location.pathname}${window.location.search}`)
        break
      case 'history':
        this.parser = new HashParser(this.routes)
        this.parseRoute(
          `${window.location.pathname}${window.location.search}`,
          false
        )
        window.addEventListener('popstate', (ev) => {
          ev.state
            ? this.parseRoute(
                PathService.stripBase(ev.state.url, this.base),
                false
              )
            : this.parseRoute('/', false)
        })
        break
      case 'hash':
      default:
        this.parser = new HashParser(this.routes)
        this.parseRoute(
          PathService.stripBase(window.location.hash, this.base) || '/'
        )
        window.addEventListener('hashchange', () => {
          if (this.ignoreEvents) {
            this.ignoreEvents = false
            return
          }
          this.parseRoute(
            PathService.stripBase(window.location.hash, this.base)
          )
        })
        break
    }
  }

  private getTo(matched: Route[], url: string): RouteObject {
    const depths: number[] = matched.map(
      (route) => route.nestingDepth as number
    )
    const maxDepth = Math.max(...depths)
    const currentRoute = matched.find(
      (route) => route.nestingDepth === maxDepth
    ) as Route
    if (!currentRoute)
      return {
        params: {},
        query: {}
      }
    return Object.freeze(UrlParser.createRouteObject([currentRoute], url))
  }

  private getFrom(): RouteObject {
    if (!this.currentMatched.getValue)
      return {
        params: {},
        query: {}
      }
    const current: Route[] = this.currentMatched.getValue
    const depths: number[] = current.map(
      (route) => route.nestingDepth as number
    )
    const maxDepth = Math.max(...depths)
    const currentRoute = current.find(
      (route) => route.nestingDepth === maxDepth
    ) as Route
    if (!currentRoute)
      return {
        params: {},
        query: {}
      }
    const url = this.currentRouteData.getValue.fullPath
    return Object.freeze(
      UrlParser.createRouteObject([currentRoute], url as string)
    )
  }

  private changeUrl(url: string, doPushState = true): void {
    if (this.mode === 'hash') {
      window.location.hash = url
    }
    if (this.mode === 'history' && doPushState) {
      window.history.pushState(
        {
          url
        },
        'Test',
        url
      )
    }
  }

  public async parseRoute(url: string, doPushState = true) {
    if (this.mode === 'hash' && url.includes('#')) url = url.replace('#', '')
    if (this.mode === 'history' && url.includes('#')) url = url.replace('#', '')
    const matched = this.parser?.parse(url.split('?')[0])
    if (!matched) return
    const to = this.getTo(matched, url)
    const from = this.getFrom()
    if (this.mode === 'silent' && !this.silentControl) {
      this.silentControl = new SilentModeService(to)
    }
    if (this.silentControl && doPushState) {
      this.silentControl.appendHistory(to)
    }
    const allowNext = await this.beforeHook(to, from)
    if (!allowNext) return
    this.changeUrl(PathService.constructUrl(url, this.base), doPushState)
    this.currentRouteData.setValue(to)
    this.currentMatched.setValue(matched)
    this.afterHook(to, from)
  }

  public async navigate(url: string) {
    this.ignoreEvents = true
    await this.parseRoute(url)
  }

  private async beforeHook(to: Route, from: Route) {
    return new Promise((resolve) => {
      const next = (command?: HookCommand) => {
        if (command !== null && command !== undefined) {
          if (command === false) {
            resolve(false)
          }
          if (typeof command === 'string') {
            this.parseRoute(command)
            resolve(false)
          }
        } else resolve(true)
      }
      if (!this.beforeEach) resolve(true)
      else this.beforeEach(to, from, next)
    })
  }

  private afterHook(to: Route, from: Route) {
    this.afterEach && this.afterEach(to, from)
  }

  public async push(data: string) {
    await this.navigate(data)
  }

  public go(howFar: number) {
    if (this.mode !== 'silent') {
      window.history.go(howFar)
    } else {
      console.log(this.silentControl!.go(howFar))
      this.parseRoute(this.silentControl!.go(howFar), false)
    }
  }

  public back() {
    this.go(-1)
  }

  get mode() {
    return this.settings.mode
  }

  get base() {
    return this.settings.base ?? ''
  }

  get currentRoute() {
    return this.currentRouteData.getValue
  }
}
