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
        this.getTransitionDurations();
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

    private getTransitionDurations () {
        let enteringDuration: number = 0;
        let leavingDuration: number = 0;

        const styles : CSSStyleSheet[] = <CSSStyleSheet[]>Array.from(document.styleSheets);

        let stylesArray = [];

        for (let style of styles) {
            let rules : CSSRuleList | null;
            try {
                rules = style.rules;
            } catch (e) {
                rules = null;
            }
            if (!rules) continue;
            let rulesArray : Array<CSSRule> = Object.values(rules);
            let filteredRules = rulesArray.filter(rule => {
                let operateRule : CSSStyleRule = rule as CSSStyleRule;
                if (!operateRule.selectorText) return false;
                return operateRule.selectorText.match(this.rule);
            });
            stylesArray.push(...filteredRules);
        }

        for (let _styleRule of stylesArray) {
            let styleRule : CSSStyleRule = _styleRule as CSSStyleRule;
            const styleText = styleRule.cssText;

            // Case 1: One rule for both entering and leaving
            if (styleText.match(this.rule)!.length === 2) {
                enteringDuration = leavingDuration = this.getDurationFromRule(styleRule);
            }

            // Case 2: single rule for enter and leaving
            // Entering
            if (styleText.match(this.enterRule)) {
                enteringDuration = this.getDurationFromRule(styleRule);
            }
            // Leaving
            if (styleText.match(this.leaveRule)) {
                leavingDuration = this.getDurationFromRule(styleRule);
            }
        }

        this.enteringDuration = enteringDuration;
        this.leavingDuration = leavingDuration;
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
}
