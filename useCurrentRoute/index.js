import { getContext } from 'svelte'

const useCurrentRoute = (listener) => {
  const context = getContext('easyrouteContext')
  if (!context) throw new Error('[Easyroute] No router context found')
  return context.router.currentRouteData.subscribe(listener)
}

export default useCurrentRoute
