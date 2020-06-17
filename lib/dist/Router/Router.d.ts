import { RouterSettings } from "./types";
export default class Router {
    private settings;
    private pathService;
    private readonly routes;
    private parser;
    private ignoreEvents;
    beforeEach: any;
    afterEach: any;
    currentMatched: any;
    currentRouteData: any;
    constructor(settings: RouterSettings);
    private setParser;
    private getTo;
    private getFrom;
    private changeUrl;
    parseRoute(url: string): Promise<void>;
    navigate(url: string): void;
    push(data: string): void;
    private beforeHook;
    private afterHook;
    get mode(): string;
    get base(): string;
    get currentRoute(): any;
}
