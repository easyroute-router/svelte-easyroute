<script>
    import { setContext, getContext, onDestroy, onMount } from 'svelte'
    import { getTransitionDurations, delay } from 'easyroute-core'

    export let router = null
    export let transition = null
    export let forceRemount = false

    const context = getContext('easyrouteContext')
    const currentDepth = context ? context.depth + 1 || 0 : 0
    const _router = context ? context.router || router : router
    const transitionData = transition ? getTransitionDurations(transition) : null

    let currentComponent = null
    let routeData = {}
    let transitionClassName = ''
    let prevRouteId = null
    let previousRutePath = null
    let unsubscribe = undefined
    let outletElement = null

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
            await delay(transitionData.enteringDuration)
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

    onDestroy(() => {
        unsubscribe && unsubscribe()
    })

    onMount(() => {
        unsubscribe = _router.currentMatched.subscribe((routes) => { pickRoute(routes) })
    })
</script>

<div bind:this={outletElement} class="easyroute-outlet{ transitionClassName ? ` ${transitionClassName}` : '' }">
    <svelte:component this={currentComponent} currentRoute={routeData} router={_router} outlet={outletElement} />
</div>
