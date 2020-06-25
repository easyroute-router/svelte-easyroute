import { Route } from '../Router/types'

export function getRoutesTreeChain(allRoutes: Route[], currentId: string) {
  const tree: Route[] = []
  let currentSeekingIds: string | null = currentId
  const currentRoute = allRoutes.find((route) => route.id === currentSeekingIds)
  do {
    const currentRoute = allRoutes.find(
      (route) => route.id === currentSeekingIds
    )
    if (currentRoute) {
      const seed = allRoutes.find((route) => route.id === currentRoute.parentId)
      if (seed) {
        tree.push(seed)
        currentSeekingIds = seed.id as string
      } else {
        currentSeekingIds = null
      }
    } else break
  } while (currentSeekingIds)
  currentRoute && tree.push(currentRoute)
  return tree
}
