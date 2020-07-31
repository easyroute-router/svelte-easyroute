import { Route } from '../Router/types'

export function uniqueById(routesArray: Route[]) {
  const uniqueIds = [...new Set(routesArray.map((route) => route.id))]
  return uniqueIds.map(
    (id) => routesArray.find((route) => route.id === id) as Route
  )
}
