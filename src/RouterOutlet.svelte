<script>
    import { setContext, getContext, onDestroy, onMount } from 'svelte'
    import { getTransitionDurations, delay, isBrowser } from 'easyroute-core/lib/utils'

    export let transition = null
    export let forceRemount = false
    export let name = 'default'

    const SSR_CONTEXT = !isBrowser()
    const context = getContext('easyrouteContext')
    const currentDepth = context ? context.depth + 1 || 0 : 0
    const _router = context ? context.router : null
    const attrs = Object.assign({}, $$props)
    const passedClasses = $$restProps.class
    const transitionData = SSR_CONTEXT ?
      null :
      transition ?
        getTransitionDurations(transition) :
        null

    let currentComponent = null
    let transitionClassName = ''
    let prevRouteId = null
    let previousRutePath = null
    let unsubscribe = undefined
    let outletElement = null
    let firstRouteResolved = SSR_CONTEXT

    delete attrs.class

    if (!_router) {
        throw new Error('[Easyroute] RouterOutlet: no router instance found. Did you forget to wrap your ' +
            'root component with <EasyrouteProvider>?')
    }

    setContext('easyrouteContext', {
        depth: currentDepth,
        router: _router
    })

    async function changeComponent(component, currentRoute) {
        if (prevRouteId === currentRoute.id && !forceRemount) return
        if (!transitionData) {
            currentComponent = component
        } else {
            transitionClassName = `${transition}-leave-active ${transition}-leave-to`
            await delay(transitionData.leavingDuration + 10)
            transitionClassName += ` ${transition}-leave`
            const hooksArray = [..._router.transitionOutHooks]
            if (currentRoute.transitionOut) hooksArray.push(currentRoute.transitionOut)
            await _router.runHooksArray(
              hooksArray,
              _router.currentRouteData.getValue,
              _router.currentRouteFromData.getValue,
              'transition'
            )
            await delay(5)
            transitionClassName = `${transition}-enter`
            transitionClassName = `${transition}-enter-active`
            currentComponent = component
            transitionClassName += ` ${transition}-enter-to`
            await delay(transitionData.enteringDuration + 10)
            transitionClassName = ''
        }
        prevRouteId = currentRoute.id
    }

    async function pickRoute(routes) {
        const currentRoute = routes.find(route => route.nestingDepth === currentDepth)
        if (currentRoute) {
            let component
            if (name === 'default') component = currentRoute.component || currentRoute.components.default
            else component = currentRoute.components ? currentRoute.components[name] : null
            changeComponent(component, currentRoute)
            await delay(transitionData ? transitionData.leavingDuration : 0)
            firstRouteResolved = true
        } else {
            changeComponent(null, `${Date.now()}-nonexistent-route`)
        }
    }

    onDestroy(() => {
        unsubscribe && unsubscribe()
    })

    if (SSR_CONTEXT) {
        pickRoute(_router.currentMatched.getValue)
    }

    onMount(() => {
        if (!SSR_CONTEXT) unsubscribe = _router.currentMatched.subscribe((routes) => { pickRoute(routes) })
    })
</script>

<div
    bind:this={outletElement}
    class="easyroute-outlet{ passedClasses ? ` ${passedClasses}` : '' }{ transitionClassName ? ` ${transitionClassName}` : '' }"
    {...attrs}
>
    {#if firstRouteResolved}
        <svelte:component this={currentComponent} router={_router} outlet={outletElement} />
    {/if}
</div>
