import {Route, RouterSettings} from "./types";
import PathService from "../Services/PathService";
import HashParser from "../Parsers/HashParser";
import Observable from "../Utils/Observable";
import UrlParser from "../Services/UrlParser";

export default class Router {
    private pathService = new PathService()
    private readonly routes: Route[] = []
    private parser: HashParser | null = null

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
            case 'hash':
            default:
                this.parser = new HashParser(this.routes)
                this.parseRoute(window.location.hash)
                window.addEventListener('hashchange', () => {
                    this.parseRoute(window.location.hash)
                })
                break
        }
    }

    private getTo(matched: Route[]): Route {
        const depths: number[] = matched.map(route => route.nestingDepth as number)
        const maxDepth = Math.max(...depths)
        return matched.find(route => route.nestingDepth === maxDepth) as Route
    }

    private getFrom(): Route {
        const current: Route[] = this.currentMatched.getValue
        const depths: number[] = current.map(route => route.nestingDepth as number)
        const maxDepth = Math.max(...depths)
        return current.find(route => route.nestingDepth === maxDepth) as Route
    }

    public async parseRoute(url: string) {
        if (this.mode === 'hash' && url.includes('#')) url = url.replace('#', '')
        const matched = this.parser?.parse(url.split('?')[0])
        const to = this.getTo(matched)
        const from = this.getFrom()
        await this.beforeHook(to, from)
        this.currentRouteData.setValue(UrlParser.createRouteObject(matched, url))
        this.currentMatched.setValue(matched)
        this.afterHook(to, from)
    }

    public navigate(url: string) {
        if (this.mode === 'hash') {
            window.location.hash = url
        }
    }

    public push(data: string) {
        this.navigate(data)
    }

    private beforeHook(to: Route, from: Route) {
        return new Promise(resolve => {
            if (!this.beforeEach) resolve()
            this.beforeEach(to, from, resolve)
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