declare module 'regexparam'

/**
 * Data to define route
 */
declare interface RouteDefineData {
    path: string
    component?: RouteComponent
    components?: { [key: string]: RouteComponent }
    name?: string
    meta?: any
    beforeEnter?: RouterHook
    children?: RouteDefineData
}

/**
 * Parsed route data
 */
declare interface RouteMatchData extends RouteDefineData {
    nestingDepth: number
    id: string
    parentId: string
    regexpPath: RegExp
    pathKeys: string[]
}

/**
 * Data to send into currentRoute and hooks
 */
declare interface RouteInfoData {
    fullPath: string
    params: { [key: string]: string }
    query: ParsedQueryObject
    name?: string
    meta?: string
}

/**
 * Misc declarations
 */

declare type RouteComponent = any

declare type NextCallback = (arg?: boolean | string) => void

declare type ParsedQueryObject = {
    [key: string]: string | string[] | null
}

declare type RouterMode = 'hash' | 'history' | 'silent'

declare type RouterSettings = {
    mode: RouterMode
    routes: RouteDefineData[]
    base?: string
}

declare type RouterHook = (to: RouteInfo, from: RouteInfo | null, next?: NextCallback) => void | Promise<void>

declare type HookCommand = boolean | string

declare type ObservableListener<T> = (value: T) => void
