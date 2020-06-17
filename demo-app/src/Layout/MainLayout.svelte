<script>
    import {RouterOutlet, RouterLink} from "../../../lib";
    export let currentRoute
    $: activeRoute = currentRoute.name
</script>

<div class="main-layout">
    <nav class="uk-navbar-container" uk-navbar>
        <div class="uk-navbar-left">
            <a class="uk-navbar-item uk-logo" href="#/">Svelte Easyroute v2</a>
        </div>
        <div class="uk-navbar-right">
            <ul class="uk-navbar-nav">
                <li class:uk-active={activeRoute === 'Index'}>
                    <RouterLink to="/">
                        Docs
                    </RouterLink>
                </li>
                <li class:uk-active={activeRoute === 'Testindex'}>
                    <RouterLink to="/login">
                        API
                    </RouterLink>
                </li>
            </ul>
        </div>
    </nav>
    <div uk-grid style="margin-top: 2rem">
        <div class="uk-width-1-4@m">
            <div class="uk-card uk-card-default uk-card-body">
                <div>
                    <ul class="uk-nav uk-nav-default">
                        <li class="uk-active">
                            <RouterLink to="/page/installation">
                                Installation
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/page/getting-started">
                                Getting started
                            </RouterLink>
                        </li>
                        <li class="uk-nav-divider"></li>
                        <li>
                            <RouterLink to="/page/dynamic-matching">
                                Dynamic route matching
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/page/current-route-info">
                                Current route info
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/page/router-links">
                                Router links
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/page/nested-routes">
                                Nested routes
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="uk-width-expand">
            <div class="uk-card uk-card-default uk-card-body">
                <RouterOutlet transition="fade" forceRemount={true} />
            </div>
        </div>
    </div>
</div>

<style>

</style>