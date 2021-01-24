<script>
    import {RouterOutlet, EasyrouteProvider} from '@router'
    import router from './Router'
</script>

<EasyrouteProvider {router}>
    <RouterOutlet />
</EasyrouteProvider>
