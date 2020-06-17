import QueryString from 'query-string';
import { Route } from "../Router/types";
export default class UrlParser {
    private static getQueryParams;
    private static getPathParams;
    static createRouteObject(matchedRoutes: Route[], url: string): {
        params: {
            [key: string]: string;
        };
        query: QueryString.ParsedQuery<string>;
        name: string | undefined;
        fullPath: string;
        meta: any;
        url?: undefined;
    } | {
        params: {};
        query: {};
        name: null;
        url: null;
        fullPath?: undefined;
        meta?: undefined;
    };
}
