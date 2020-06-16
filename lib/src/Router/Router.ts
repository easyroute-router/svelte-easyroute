import {Route, RouterSettings} from "./types";
import PathService from "../Services/PathService";
import HashParser from "../Parsers/HashParser";
import Observable from "../Utils/Observable";
import UrlParser from "../Services/UrlParser";

export default class Router {
    private pathService = new PathService()
    private readonly routes: Route[] = []
    private parser: HashParser | null = null

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

    public parseRoute(url: string) {
        if (this.mode === 'hash' && url.includes('#')) url = url.replace('#', '')
        const matched = this.parser?.parse(url.split('?')[0])
        this.currentRouteData.setValue(UrlParser.createRouteObject(matched, url))
        this.currentMatched.setValue(matched)
    }

    public navigate(url: string) {
        if (this.mode === 'hash') {
            window.location.hash = url
        }
    }

    public push(data: string) {
        this.navigate(data)
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