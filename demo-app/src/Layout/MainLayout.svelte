<script>
    import {RouterOutlet, RouterLink} from "../../../lib/dist";
    import MainMenu from "../Components/MainMenu.svelte";

    import logo from '../assets/logo.png'

    export let currentRoute = null
    $: activeRoute = currentRoute.name
</script>

<div class="main-layout">
    <header>
        <div class="uk-navbar-container uk-navbar">
            <div class="uk-navbar-left">
                <RouterLink class="uk-navbar-item uk-logo" to="/"><img alt="easyroute-logo" style="width: 25rem" src="{ logo }"></RouterLink>
            </div>
            <div class="uk-navbar-right">
                <div style="margin-right: 2rem">
                    <a class="github-button" href="https://github.com/lyohaplotinka/svelte-easyroute" data-size="large" data-show-count="true" aria-label="Star lyohaplotinka/svelte-easyroute on GitHub">GitHub</a>
                </div>
            </div>
        </div>
    </header>
    <div uk-grid style="margin-top: 2rem">
        <div class="uk-width-1-4@m">
            <nav>
                <div class="uk-card uk-card-default uk-card-body">
                    <div>
                        <MainMenu />
                    </div>
                </div>
            </nav>
        </div>
        <div class="uk-width-expand">
            <main>
                <div class="uk-card uk-card-default uk-card-body">
                    <RouterOutlet transition="fade" forceRemount={true} />
                </div>
            </main>
        </div>
    </div>
</div>

<style>

</style>