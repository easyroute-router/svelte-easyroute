<script>
    import { getContext } from 'svelte'
    export let to;

    const context = getContext('easyrouteContext')
    const router = context.router

    function routerNavigate(evt) {
        evt.preventDefault()
        evt.stopPropagation()
        if (!router) {
            throw new Error('[Easyroute] Router instance not found in RouterLink')
        }
        router.navigate(to)
    }
</script>

<a href={to} on:click={routerNavigate}>
    <slot />
</a>
