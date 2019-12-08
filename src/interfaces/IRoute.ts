import {SvelteComponent} from "svelte/internal";

export default interface IRoute {
    path: string,
    name?: string,
    component?: SvelteComponent,
    regexpPath?: RegExp,
    pathKeys?: string[]
}
