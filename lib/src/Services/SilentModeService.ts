import {Route} from "../Router/types";

export default class SilentModeService {
    private history: any[] = []
    private currentHistoryPosition = 0

    constructor(firstRoute: Route) {
        this.appendHistory(firstRoute)
    }

    public appendHistory(data: Route | Route[]) {
        if (Array.isArray(data)) {
            this.history.push(...data)
            this.currentHistoryPosition += data.length
        } else {
            this.history.push(data)
            this.currentHistoryPosition++
        }
    }

    public back() {
        return this.go(-1)
    }

    public go(howFar: number): string {
        const goResult = this.currentHistoryPosition + howFar
        const previousObject = this.history[goResult]
        console.log(this.history)
        if (previousObject) {
            this.currentHistoryPosition = goResult
            return previousObject.fullPath
        }
        return ''
    }
}