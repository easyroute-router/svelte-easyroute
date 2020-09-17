<script>
    import {RouterOutlet, EasyrouteProvider} from '../../lib'
    export let router = null
</script>

<EasyrouteProvider {router}>
    <RouterOutlet />
</EasyrouteProvider>
