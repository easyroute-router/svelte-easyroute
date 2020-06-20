<script>
    import {RouterOutlet} from "../../../lib";
    import MainMenu from "../Components/MainMenu.svelte";

    import logo from '../assets/logo.png'

    export let currentRoute
    $: activeRoute = currentRoute.name
</script>

<div class="main-layout">
    <nav class="uk-navbar-container" uk-navbar>
        <div class="uk-navbar-left">
            <a class="uk-navbar-item uk-logo" href="#/"><img style="width: 25rem" src="{ logo }"></a>
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