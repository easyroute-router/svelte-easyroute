<script>
    import Router from 'easyroute-core'
    import { setContext } from 'svelte'
    export let router = null

    if (!router || !(router instanceof Router)) {
        throw new Error('[Easyroute] EasyrouteProvider: no router instance passed into EasyrouteProvider')
    }

    setContext('easyrouteContext', {
        depth: -1,
        router
    })
</script>

<slot></slot>