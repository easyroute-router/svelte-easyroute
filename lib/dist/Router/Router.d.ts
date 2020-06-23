import { RouterSettings } from './types';
export default class Router {
    private settings;
    private pathService;
    private readonly routes;
    private parser;
    private ignoreEvents;
    private silentControl;
    beforeEach: any;
    afterEach: any;
    currentMatched: any;
    currentRouteData: any;
    constructor(settings: RouterSettings);
    private setParser;
    private getTo;
    private getFrom;
    private changeUrl;
    parseRoute(url: string, doPushState?: boolean): Promise<void>;
    navigate(url: string): void;
    private beforeHook;
    private afterHook;
    push(data: string): void;
    go(howFar: number): void;
    back(): void;
    get mode(): string;
    get base(): string;
    get currentRoute(): any;
}
