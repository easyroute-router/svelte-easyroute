<script>
    import {RouterOutlet} from "../../../lib";
    import MainMenu from "../Components/MainMenu.svelte";

    import logo from '../assets/logo.png'

    export let currentRoute
    export let router
    $: activeRoute = currentRoute.name
</script>

<div class="main-layout">
    <nav class="uk-navbar-container" uk-navbar>
        <div class="uk-navbar-left">
            <a class="uk-navbar-item uk-logo" href="#/"><img style="width: 25rem" src="{ logo }"></a>
        </div>
        <div class="uk-navbar-right">
            <div style="margin-right: 2rem">
                <button type="button" on:click={ () => router.back() }>Back</button>
                <button type="button" on:click={ () => router.go(1) }>Forward</button>
            </div>
        </div>
    </nav>
    <div uk-grid style="margin-top: 2rem">
        <div class="uk-width-1-4@m">
            <div class="uk-card uk-card-default uk-card-body">
                <div>
                    <MainMenu />
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