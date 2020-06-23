import {Route} from "../Router/types";

export default class SilentModeService {
    private history: Route[] = []
    private currentHistoryPosition = 0

    constructor(firstRoute: Route) {
        this.history.push(firstRoute)
    }

    public appendHistory(data: Route | Route[]) {
        if (Array.isArray(data)) {
            this.history.push(...data)
        } else {
            this.history.push(data)
        }
    }

    public back() {
        this.go(-1)
    }

    public go(howFar: number) {
        const goResult = this.currentHistoryPosition + howFar
        if (goResult >= 0 && goResult < this.currentHistoryPosition - 1) {
            this.currentHistoryPosition = goResult
        }
    }
}