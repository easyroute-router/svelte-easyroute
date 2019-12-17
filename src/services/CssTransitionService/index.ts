export default class CssTransitionService {

    private readonly transition : string = "";
    private readonly rule : RegExp;
    private readonly enterRule : RegExp;
    private readonly leaveRule : RegExp;

    public enteringDuration : number = 0;
    public leavingDuration : number = 0;

    constructor
    (
        transitionName : string
    ) {
        this.transition = transitionName;
        this.rule = new RegExp(`.(${this.transition})-(enter-active|leave-active)`,"g");
        this.enterRule = new RegExp(`.(${this.transition})-enter-active`,"g");
        this.leaveRule = new RegExp(`.(${this.transition})-leave-active`,"g");
        const durations = this.getTransitionDurations(this.transition);
        this.enteringDuration = durations.enteringDuration;
        this.leavingDuration = durations.leavingDuration;
    }

    private getDurationFromRule (
        styleRule : CSSStyleRule
    ) : number {

        let getMaxFromCSSString = (key: string) => {
            if (key !== "transitionDuration" && key !== "transitionDelay") return 0;
            const durations : string = styleRule.style[key];
            let durationsArrayString = durations.split(",");
            let durationsArray = durationsArrayString.map(duration => {
                let number = parseFloat(duration.replace(/a-zA-Z/g,"").trim());
                let measure = duration.replace(/[0-9](\.[0-9])?/g,"").trim();
                if (measure === "s") number = number * 1000;
                return number;
            });
            return Math.max(...durationsArray);
        };

        let duration = getMaxFromCSSString("transitionDuration");
        let delay = getMaxFromCSSString("transitionDelay");
        return duration + delay;
    }

    private getTransitionDurations (
        transition: string
    ) : any {
        const transRule = new RegExp(`.(${transition})-(enter-active|leave-active)`, "g");
        const transEnterRule = new RegExp(`.(${transition})-enter-active`, "g");
        const transLeaveRule = new RegExp(`.(${transition})-leave-active`, "g");

        let enteringDuration: number = 0;
        let leavingDuration: number = 0;

        const styles: CSSStyleSheet[] = <CSSStyleSheet[]>Array.from(document.styleSheets);

        let stylesArray = [];

        for (let style of styles) {
            let rules: CSSRuleList | null;
            try {
                rules = style.rules;
            } catch (e) {
                rules = null;
            }
            if (!rules) continue;
            let rulesArray: Array<CSSRule> = Object.values(rules);
            let filteredRules = rulesArray.filter(rule => {
                let operateRule: CSSStyleRule = rule as CSSStyleRule;
                if (!operateRule.selectorText) return false;
                return operateRule.selectorText.match(transRule);
            });
            stylesArray.push(...filteredRules);
        }

        for (let _styleRule of stylesArray) {
            let styleRule: CSSStyleRule = _styleRule as CSSStyleRule;
            const styleText = styleRule.cssText;

            // Case 1: One rule for both entering and leaving
            if (styleText.match(transRule)!.length === 2) {
                enteringDuration = leavingDuration = this.getDurationFromRule(styleRule);
            }

            // Case 2: single rule for enter and leaving
            // Entering
            if (styleText.match(transEnterRule)) {
                enteringDuration = this.getDurationFromRule(styleRule);
            }
            // Leaving
            if (styleText.match(transLeaveRule)) {
                leavingDuration = this.getDurationFromRule(styleRule);
            }
        }

        leavingDuration = leavingDuration + 10;
        enteringDuration = enteringDuration + 10;

        return {
            enteringDuration,
            leavingDuration
        };
    }

    public static delay (
        time: number
    ) : Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            },time);
        });
    }

    public async transitionOut(
        depth: number
    ) {
        if (depth === 0) depth = -1;
        // let outlet = document.querySelector(".svelte-easyroute-outlet");
        let outlet = document.querySelectorAll(".svelte-easyroute-outlet")[depth + 1];
        if (outlet) {
            outlet.classList.add(`${this.transition}-leave-active`);
            outlet.classList.add(`${this.transition}-leave`);
            await CssTransitionService.delay(100);
            outlet.classList.remove(`${this.transition}-leave`);
            outlet.classList.add(`${this.transition}-leave-to`);
            await CssTransitionService.delay(this.leavingDuration);
            outlet.classList.remove(`${this.transition}-leave-active`);
            outlet.classList.remove(`${this.transition}-leave-to`);
        }
    }

    public async transitionIn (
        depth: number
    ) {
        if (depth === 0) depth = -1;
        // let outlet = document.querySelector(".svelte-easyroute-outlet");
        let outlet = document.querySelectorAll(".svelte-easyroute-outlet")[depth + 1]
        if (outlet) {
            outlet.classList.add(`${this.transition}-enter-active`);
            outlet.classList.add(`${this.transition}-enter`);
            await CssTransitionService.delay(100);
            outlet.classList.remove(`${this.transition}-enter`);
            outlet.classList.add(`${this.transition}-enter-to`);
            await CssTransitionService.delay(this.enteringDuration);
            outlet.classList.remove(`${this.transition}-enter-active`);
            outlet.classList.remove(`${this.transition}-enter-to`);
        }
    }

    public propTransitionDuration (
        transition: string
    ) : any {
        return this.getTransitionDurations(transition);
    }

    public async propTransitionOut (
        selector: string,
        transition: string,
        leavingDuration: number
    ) {
        let outlet = document.querySelector(selector);
        if (outlet) {
            outlet.classList.add(`${transition}-leave-active`);
            outlet.classList.add(`${transition}-leave`);
            await CssTransitionService.delay(100);
            outlet.classList.remove(`${transition}-leave`);
            outlet.classList.add(`${transition}-leave-to`);
            await CssTransitionService.delay(leavingDuration);
            outlet.classList.remove(`${transition}-leave-active`);
            outlet.classList.remove(`${transition}-leave-to`);
        }
    }

    public async propTransitionIn (
        selector: string,
        transition: string,
        enteringDuration: number
    ) {
        let outlet = document.querySelector(selector);
        if (outlet) {
            outlet.classList.add(`${transition}-enter-active`);
            outlet.classList.add(`${transition}-enter`);
            await CssTransitionService.delay(100);
            outlet.classList.remove(`${transition}-enter`);
            outlet.classList.add(`${transition}-enter-to`);
            await CssTransitionService.delay(enteringDuration);
            outlet.classList.remove(`${transition}-enter-active`);
            outlet.classList.remove(`${transition}-enter-to`);
        }
    }
}
