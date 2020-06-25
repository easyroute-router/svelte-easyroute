<script>
    import {RouterOutlet, RouterLink} from "../../../lib";
    import MainMenu from "../Components/MainMenu.svelte";

    import logo from '../assets/logo.png'

    export let currentRoute
    export let router
    $: activeRoute = currentRoute.name
</script>

<div class="main-layout">
    <header>
        <div class="uk-navbar-container uk-navbar">
            <div class="uk-navbar-left">
                <RouterLink class="uk-navbar-item uk-logo" to="/"><img style="width: 25rem" src="{ logo }"></RouterLink>
            </div>
            <div class="uk-navbar-right">
                <div style="margin-right: 2rem">
                    <button type="button" on:click={ () => router.back() }>Back</button>
                    <button type="button" on:click={ () => router.go(1) }>Forward</button>
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