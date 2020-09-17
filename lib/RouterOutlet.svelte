<script>
    import { setContext, getContext, onDestroy, onMount } from 'svelte'
    import { getTransitionDurations, delay } from 'easyroute-core/lib/utils'

    export let router = null
    export let transition = null
    export let forceRemount = false

    if (router) {
        console.warn('[Easyroute] Passing router as a prop in outlet is deprecated in v2.1.5.' +
            'Use <EasyrouteProvider> component instead. This will break in the next version.')
    }

    const context = getContext('easyrouteContext')
    const currentDepth = context ? context.depth + 1 || 0 : 0
    const _router = context ? context.router || router : router
    const transitionData = transition ? getTransitionDurations(transition) : null
    const attrs = Object.assign({}, $$props)
    const passedClasses = attrs.class

    let currentComponent = null
    let routeData = {}
    let transitionClassName = ''
    let prevRouteId = null
    let previousRutePath = null
    let unsubscribe = undefined
    let outletElement = null

    if (!_router) {
        throw new Error('[Easyroute] RouterOutlet: no router instance found. Did you forget to wrap your ' +
            'root component with <EasyrouteProvider>?')
    }

    setContext('easyrouteContext', {
        depth: currentDepth,
        router: _router
    })

    async function changeComponent(component, currentRouteId) {
        if (prevRouteId === currentRouteId && !forceRemount) return
        if (!transitionData) {
            currentComponent = component
        } else {
            transitionClassName = `${transition}-leave-active ${transition}-leave-to`
            await delay(transitionData.leavingDuration + 10)
            transitionClassName += ` ${transition}-leave`
            await delay(5)
            transitionClassName = `${transition}-enter`
            transitionClassName = `${transition}-enter-active`
            currentComponent = component
            transitionClassName += ` ${transition}-enter-to`
            await delay(transitionData.enteringDuration + 10)
            transitionClassName = ''
        }
        prevRouteId = currentRouteId
    }

    async function pickRoute(routes) {
        const currentRoute = routes.find(route => route.nestingDepth === currentDepth)
        if (currentRoute) {
            const component = currentRoute.component
            try {
                const value = await component()
                changeComponent(value.default, currentRoute.id)
            } catch (e) {
                changeComponent(component, currentRoute.id)
            }
            await delay(transitionData ? transitionData.leavingDuration : 0)
            routeData = _router.currentRoute
        } else {
            currentComponent = null
        }
    }

    function sanitizeAttrs() {
        delete attrs.to
        delete attrs.$$slots
        delete attrs.$$scope
        delete attrs.router
        delete attrs.transition
        delete attrs.forceRemount
        delete attrs.class
    }

    sanitizeAttrs()

    onDestroy(() => {
        unsubscribe && unsubscribe()
    })

    onMount(() => {
        unsubscribe = _router.currentMatched.subscribe((routes) => { pickRoute(routes) })
    })
</script>

<div
    bind:this={outletElement}
    class="easyroute-outlet{ passedClasses ? ` ${passedClasses}` : '' }{ transitionClassName ? ` ${transitionClassName}` : '' }"
    {...attrs}
>
    <svelte:component this={currentComponent} currentRoute={routeData} router={_router} outlet={outletElement} />
</div>
