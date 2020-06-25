import { RouteObject } from '../Router/types';
export default class SilentModeService {
    private history;
    private currentHistoryPosition;
    constructor(firstRoute: RouteObject);
    appendHistory(data: RouteObject | RouteObject[]): void;
    back(): string;
    go(howFar: number): string;
}
