<script>
    import { RouterOutlet, RouterLink } from "@router";
    import MainMenu from "../Components/MainMenu.svelte";
    import { onMount } from 'svelte'
    import logo from '../assets/logo.png'
    import { langStore } from '../Store'
    const pkg = require('../../../package.json')

    onMount(() => {
        const githubScript = document.createElement('script')
        githubScript.src = 'https://buttons.github.io/buttons.js'
        githubScript.async = true
        document.body.append(githubScript)
    })

    const changeLang = (lang) => langStore.set(lang)
</script>

<div class="main-layout">
    <header>
        <div class="uk-navbar-container uk-navbar">
            <div class="uk-navbar-left">
                <RouterLink class="uk-navbar-item uk-logo" to="/?lang={ $langStore }"><img alt="easyroute-logo" style="width: 25rem" src="{ logo }"></RouterLink>
            </div>
            <div class="uk-navbar-right">
                <button type="button" on:click={ () => changeLang('ru') }>RU</button>
                <button type="button" on:click={ () => changeLang('en') }>EN</button>
                <div style="margin-right: 2rem">
                    <span style="color:lightgray; margin-right: 1rem">v{ pkg.version }</span>
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
                    <RouterOutlet transition="fade" forceRemount={true} class="test-class" />
                </div>
            </main>
        </div>
    </div>
</div>

<style>

</style>