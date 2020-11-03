<script context="module">
    import router from './Router/index.ssr'
    import {RouterOutlet, EasyrouteProvider, registerRouterSSR} from '../../lib'

    registerRouterSSR(router)
</script>

<script>

</script>

<EasyrouteProvider {router}>
    <RouterOutlet />
</EasyrouteProvider>
