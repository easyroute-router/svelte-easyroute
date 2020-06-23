import { Route } from "../Router/types";
export default class SilentModeService {
    private history;
    private currentHistoryPosition;
    constructor(firstRoute: Route);
    appendHistory(data: Route | Route[]): void;
    back(): string;
    go(howFar: number): string;
}
