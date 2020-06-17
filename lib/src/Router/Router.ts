import {Route, RouterSettings, HookCommand} from "./types";
import PathService from "../Services/PathService";
import HashParser from "../Parsers/HashParser";
import Observable from "../Utils/Observable";
import UrlParser from "../Services/UrlParser";
import urljoin from "url-join";

export default class Router {
    private pathService = new PathService()
    private readonly routes: Route[] = []
    private parser: HashParser | null = null
    private ignoreEvents = false

    public beforeEach: any = null
    public afterEach: any = null

    public currentMatched: any = Observable<Route[]>([])
    public currentRouteData: any = Observable({params: {}, query: {}, name: ''})

    constructor(private settings: RouterSettings) {
        this.routes = this.pathService.getPathInformation(settings.routes)
        console.log(this.routes)
        this.setParser()
    }

    private setParser() {
        switch (this.mode) {
            case 'history':
                this.parser = new HashParser(this.routes)
                this.parseRoute(window.location.pathname)
                window.addEventListener('popstate', (ev) => {
                    ev.state ? this.parseRoute(PathService.stripBase(ev.state.url, this.base)) : this.parseRoute('/')
                })
                break
            case 'hash':
            default:
                this.parser = new HashParser(this.routes)
                this.parseRoute(PathService.stripBase(window.location.hash, this.base) || '/')
                window.addEventListener('hashchange', () => {
                    if (this.ignoreEvents) {
                        this.ignoreEvents = false
                        return
                    }
                    this.parseRoute(PathService.stripBase(window.location.hash, this.base))
                })
                break
        }
    }

    private getTo(matched: Route[], url: string): any {
        const depths: number[] = matched.map(route => route.nestingDepth as number)
        const maxDepth = Math.max(...depths)
        const currentRoute = matched.find(route => route.nestingDepth === maxDepth) as Route
        if (!currentRoute) return null
        return UrlParser.createRouteObject([currentRoute], url)
    }

    private getFrom(): any {
        const current: Route[] = this.currentMatched.getValue
        const depths: number[] = current.map(route => route.nestingDepth as number)
        const maxDepth = Math.max(...depths)
        const currentRoute = current.find(route => route.nestingDepth === maxDepth) as Route
        if (!currentRoute) return null
        const url = this.currentRouteData.getValue.fullPath
        return UrlParser.createRouteObject([currentRoute], url)
    }

    private changeUrl(url: string) {
        if (this.mode === 'hash') {
            window.location.hash = url
        }
        if (this.mode === 'history') {
            window.history.pushState(
                {
                    url
                },
                'Test',
                url
            )
        }
    }

    public async parseRoute(url: string) {
        console.log(url)
        if (this.mode === 'hash' && url.includes('#')) url = url.replace('#', '')
        if (this.mode === 'history' && url.includes('#')) url = url.replace('#', '')
        const matched = this.parser?.parse(url.split('?')[0])
        const to = this.getTo(matched, url)
        const from = this.getFrom()
        const allowNext = await this.beforeHook(to, from)
        if (!allowNext) return
        this.changeUrl(PathService.constructUrl(url, this.base))
        this.currentRouteData.setValue(UrlParser.createRouteObject(matched, url))
        this.currentMatched.setValue(matched)
        this.afterHook(to, from)
    }

    public navigate(url: string) {
        this.ignoreEvents = true
        this.parseRoute(url)
    }

    public push(data: string) {
        this.navigate(data)
    }

    private beforeHook(to: Route, from: Route) {
        return new Promise(resolve => {
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

    get mode() {
        return this.settings.mode
    }

    get base() {
        return this.settings.base
    }

    get currentRoute() {
        return this.currentRouteData.getValue
    }
}