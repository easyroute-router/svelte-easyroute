import QueryString, {ParsedQuery} from "query-string";
import IRoute from "../../interfaces/IRoute";
import IRouteInfo from "../../interfaces/IRouteInfo"

export default class UrlParser {

    private qString : any;

    constructor() {
        this.qString = QueryString;
    }

    private getQueryParams (
        queryString : string
    ) : ParsedQuery {
        return this.qString.parse(queryString);
    }

    private getPathParams (
        matchedRoute : IRoute,
        url : string
    ) : { [key : string] : string } {
        let pathValues = matchedRoute.regexpPath!.exec(url) as string[];
        pathValues = pathValues.slice(1, pathValues.length);
        let urlParams : { [key : string] : string} = {};
        for (let pathPart in pathValues) {
            let value = pathValues[pathPart];
            let key = matchedRoute.pathKeys![pathPart].name;
            urlParams[key] = value;
        }
        return urlParams;
    }

    public createRouteObject (
        matchedRoute : IRoute,
        path : string,
        query: string,
        fullPath: string
    ) : IRouteInfo {
        const pathParams = this.getPathParams(matchedRoute, path);
        const queryParams = this.getQueryParams(query);
        return  {
            fullPath,
            route: path.split('/'),
            query: JSON.parse(JSON.stringify(queryParams)),
            params: pathParams
        }
    }

}
