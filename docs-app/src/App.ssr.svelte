<script context="module">
    import router from './Router/index.ssr'
    import {RouterOutlet, EasyrouteProvider} from '@router'
    import registerRouterSSR from '@router/ssr/registerRouterSSR'

    registerRouterSSR(router)
</script>

<script>

</script>

<EasyrouteProvider {router}>
    <RouterOutlet />
</EasyrouteProvider>
