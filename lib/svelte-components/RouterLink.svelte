<script>
    import { getContext } from 'svelte'
    export let to;

    const context = getContext('easyrouteContext')
    const router = context.router
    const attrs = Object.assign({}, $$props)

    function routerNavigate(evt) {
        evt.preventDefault()
        evt.stopPropagation()
        if (!router) {
            throw new Error('[Easyroute] Router instance not found in RouterLink')
        }
        router.navigate(to)
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
