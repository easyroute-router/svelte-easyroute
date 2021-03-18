<script>
    import { setContext } from 'svelte'
    export let router = null

    if (!router) {
        throw new Error('[Easyroute] no router instance passed into EasyrouteProvider')
    }

    setContext('easyrouteContext', {
        depth: -1,
        router
    })
</script>

<slot></slot>
