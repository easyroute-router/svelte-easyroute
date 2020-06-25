import QueryString, { ParsedQuery } from 'query-string'
import { Route, RouteObject } from '../Router/types'

export default class UrlParser {
  private static getQueryParams(queryString: string): ParsedQuery {
    return QueryString.parse(queryString)
  }

  private static getPathParams(
    matchedRoute: Route,
    url: string
  ): { [key: string]: string } {
    let pathValues: string[] = matchedRoute.regexpPath!.exec(url) as string[]
    pathValues = pathValues.slice(1, pathValues.length)
    const urlParams: { [key: string]: string } = {}
    for (const pathPart in pathValues) {
      const value = pathValues[pathPart]
      const key = matchedRoute.pathKeys![pathPart].name
      if (typeof key !== 'number') urlParams[key] = value
    }
    return urlParams
  }

  public static createRouteObject(
    matchedRoutes: Route[],
    url: string
  ): RouteObject {
    const depths: number[] = matchedRoutes.map(
      (route) => route.nestingDepth as number
    )
    const maxDepth = Math.max(...depths)
    const currentMatched = matchedRoutes.find(
      (route) => route.nestingDepth === maxDepth
    )
    const [pathString, queryString]: string[] = url.split('?')
    if (currentMatched) {
      const pathParams = UrlParser.getPathParams(currentMatched, pathString)
      const queryParams = UrlParser.getQueryParams(queryString)
      return {
        params: pathParams,
        query: queryParams,
        name: currentMatched.name,
        fullPath: url,
        meta: currentMatched.meta ?? {}
      }
    }
    return {
      params: {},
      query: {}
    }
  }
}
