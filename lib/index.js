import Router from 'easyroute-core'
import { getContext } from 'svelte'

const useCurrentRoute = (listener) => {
  const context = getContext('easyrouteContext')
  if (!context) throw new Error('[Easyroute] No router context found')
  return context.router.currentRouteData.subscribe(listener)
}

export default Router
export { default as RouterOutlet } from './RouterOutlet.svelte'
export { default as RouterLink } from './RouterLink.svelte'
export { default as EasyrouteProvider } from './EasyrouteProvider.svelte'
export { useCurrentRoute }
export { registerRouter as registerRouterSSR } from './ssr/registerRouter'
