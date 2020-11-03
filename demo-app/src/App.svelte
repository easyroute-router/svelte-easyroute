<script>
    import {RouterOutlet, EasyrouteProvider} from '@router'
    export let router = null
</script>

<EasyrouteProvider {router}>
    <RouterOutlet />
</EasyrouteProvider>
