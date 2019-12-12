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

    public transitionOut() {
        console.log(this.leavingDuration);
        let outlet = document.querySelector("#svelte-easyroute-outlet");
        if (outlet) {
            outlet.classList.add(`${this.transition}-leave-active`);
            outlet.classList.add(`${this.transition}-leave-to`);

            outlet.classList.remove(`${this.transition}-enter-active`);
            outlet.classList.remove(`${this.transition}-enter`);
            outlet.classList.remove(`${this.transition}-enter-to`);

            setTimeout(() => {
                outlet!.classList.add(`${this.transition}-leave`);
            }, this.leavingDuration + 10);
        }
    }

    public transitionIn() {
        let outlet = document.querySelector("#svelte-easyroute-outlet");
        if (outlet) {
            outlet.classList.remove(`${this.transition}-leave-active`);
            outlet.classList.remove(`${this.transition}-leave`);
            outlet.classList.remove(`${this.transition}-leave-to`);

            outlet.classList.add(`${this.transition}-enter`)
            outlet.classList.add(`${this.transition}-enter-active`);
            outlet.classList.add(`${this.transition}-enter-to`)

            setTimeout(() => {
                outlet!.classList.remove(`${this.transition}-enter`)
                outlet!.classList.remove(`${this.transition}-enter-active`);
                outlet!.classList.remove(`${this.transition}-enter-to`)
            }, this.enteringDuration + 10);
        }
    }
}
