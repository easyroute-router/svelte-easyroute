import {SvelteComponent} from "svelte/internal";
import {Key} from "path-to-regexp";

export default interface IRoute {
    path: string,
    name?: string,
    component?: SvelteComponent,
    regexpPath?: RegExp,
    pathKeys?: Key[],
    query?: object | null
}
