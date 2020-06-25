import { Route } from '../Router/types';
export default class PathService {
    private readonly pathToRegexp;
    private parsePaths;
    getPathInformation(routes: Route[]): Route[];
    static stripBase(url: string, base: string): string;
    static constructUrl(url: string, base: string): string;
}
