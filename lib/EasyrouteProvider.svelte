<script>
    import Router from '/Users/alexeysolovjov/CODE/Github/easyroute-all/easyroute-core/lib/dist'
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