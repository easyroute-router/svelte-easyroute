<script>
    import { getContext } from 'svelte'
    export let to;

    const context = getContext('easyrouteContext')
    const router = context ? context.router : null
    const attrs = Object.assign({}, $$props)

    if (!router) {
        throw new Error('[Easyroute] RouterLink: no router instance found. Did you forget to wrap your ' +
            'root component with <EasyrouteProvider>?')
    }

    function routerNavigate(evt) {
        evt.preventDefault()
        evt.stopPropagation()
        if (!router) {
            throw new Error('[Easyroute] Router instance not found in RouterLink')
        }
        router.push(to)
    }

    function sanitizeAttrs() {
        delete attrs.to
        delete attrs.$$slots
        delete attrs.$$scope
    }

    sanitizeAttrs()
</script>

<a href={to} {...attrs} on:click={routerNavigate}>
    <slot />
</a>
