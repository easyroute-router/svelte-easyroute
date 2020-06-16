import {SvelteComponent} from "svelte/internal";

export interface Route {
    path?: string
    component?: SvelteComponent
    name?: string,
    regexpPath?: RegExp
    pathKeys?: any
    children?: Route[],
    nestingDepth?: number
    nested?: any
    id?: string
    parentId?: string | null
}

export interface RouterSettings {
    mode: string
    base: string
    routes: Route[]
}
