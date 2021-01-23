<script>
    import { RouterLink, useCurrentRoute } from '@router'
    import { onDestroy } from 'svelte'
    import { langStore } from '../Store'
    import menuData from './menuData'
    let routePath = ''

    const unsubscribe = useCurrentRoute((route) => {
        routePath = route.fullPath
    })

    let menu = {}
    let language = 'en'

    langStore.subscribe(lang => {
        if (lang === 'ru' || lang === 'en') {
            menu = menuData[lang]
            language = lang
        } else {
            menu = menuData['en']
            language = 'en'
        }
    })

    function withParams(url) {
        if (url.indexOf('?') === -1) return `${url}?lang=${language}`
        else return `${url}&lang=${language}`
    }

    onDestroy(unsubscribe)
</script>

<ul class="uk-nav uk-nav-default">

    {#each menu as item}
        {#if item.title === 'header'}
            <h4>{ item.label }</h4>
        {:else if item.title === 'divider'}
            <li class="uk-nav-divider"></li>
        {:else}
            <li class:uk-active={ routePath.includes(item.url) }>
                {#if item.url.includes('http')}
                    <a href="{item.url}" target="_blank">
                        {@html item.title}
                    </a>
                {:else}
                    <RouterLink to="{ withParams(item.url) }">
                        {@html item.title }
                    </RouterLink>
                {/if}
            </li>
        {/if}
    {/each}

</ul>

<style>
    h4 {
        margin-top: 10px;
        margin-bottom: 10px;
    }

    h4:first-child {
        margin-top: 0;
    }

    :global(a svg) {
        width: 20px;
    }
</style>