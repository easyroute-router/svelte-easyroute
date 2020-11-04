<script>
    import { RouterLink, useCurrentRoute } from '@router'
    import { onDestroy } from 'svelte'
    let routePath = ''

    const unsubscribe = useCurrentRoute((route) => {
        routePath = route.fullPath
    })

    const menu = [
        {
            title: 'header',
            label: 'Introduction'
        },
        {
            url: '/page/installation',
            title: 'Installation'
        },
        {
            url: '/page/getting-started',
            title: 'Getting started'
        },
        {
            title: 'header',
            label: 'Basic features'
        },
        {
            url: '/page/dynamic-matching',
            title: 'Dynamic route matching'
        },
        {
            url: '/page/current-route-info',
            title: 'Current route info'
        },
        {
            url: '/page/router-links',
            title: 'Router links'
        },
        {
            url: '/page/programmatic-navigation',
            title: 'Programmatic navigation'
        },
        {
            url: '/page/nested-routes',
            title: 'Nested routes'
        },
        {
            url: '/page/navigation-guards',
            title: 'Navigation hooks'
        },
        {
            url: '/page/loading-data-in-hooks',
            title: 'Loading route data'
        },
        {
            url: '/page/css-transitions',
            title: 'CSS transitions'
        },
        {
            url: '/page/named-outlets',
            title: 'Named outlets (views)'
        },
        {
            url: '/page/silent-mode',
            title: 'Silent mode'
        },
        {
            title: 'header',
            label: 'Server-side rendering'
        },
        {
            url: '',
            title: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg> SSR template`
        },
        {
            title: 'divider',
        },
        {
            url: '/page/ssr-introduction',
            title: 'SSR: introduction'
        },
        {
            url: '/page/application-requirements',
            title: 'Application requirements'
        },
        {
            url: '/page/ssr-build-setup',
            title: 'Build setup'
        },
        {
            url: '/page/ssr-configuring-server',
            title: 'Server config'
        },
        {
            title: 'header',
            label: 'Playground'
        },
        {
            url: '/playground/demo/params?text=query',
            title: 'Playground'
        }
    ]

    onDestroy(unsubscribe)
</script>

<ul class="uk-nav uk-nav-default">

    {#each menu as item}
        {#if item.title === 'header'}
            <h4>{ item.label }</h4>
        {:else if item.title === 'divider'}
            <li class="uk-nav-divider"></li>
        {:else}
            <li class:uk-active={ routePath === item.url }>
                <RouterLink to="{ item.url }">
                    {@html item.title }
                </RouterLink>
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