<script>
    import { setContext, getContext, onDestroy } from 'svelte'

    export let router
    const context = getContext('easyrouteContext')
    const currentDepth = context ? context.depth + 1 || 0 : 0
    const _router = context ? context.router || router : router
    setContext('easyrouteContext', {
        depth: currentDepth,
        router: _router
    })

    let currentComponent = null
    let routeData = {}

    const unsubscribe = _router.currentMatched.subscribe((routes) => {
        pickRoute(routes)
    })

    function pickRoute(routes) {
        const currentRoute = routes.find(route => route.nestingDepth === currentDepth)
        if (currentRoute) {
            const component = currentRoute.component
            try {
                component()
                .then((value) => {
                    currentComponent = value.default
                })
            } catch (e) {
                currentComponent = component
            }
            routeData = _router.currentRoute
        } else {
            currentComponent = null
        }
    }

    onDestroy(() => {
        unsubscribe && unsubscribe()
    })

    pickRoute(_router.currentMatched.getValue)
</script>

<svelte:component this={currentComponent} currentRoute={routeData} />