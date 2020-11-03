<script>
    import { RouterLink, useCurrentRoute } from '@router'
    import { onDestroy } from 'svelte'
    let routePath = ''

    const unsubscribe = useCurrentRoute((route) => {
        routePath = route.fullPath
    })

    const menu = [
        {
            url: '/page/installation',
            title: 'Installation'
        },
        {
            url: '/page/getting-started',
            title: 'Getting started'
        },
        {
            title: 'divider'
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
            title: 'Navigation guards'
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
            title: 'divider'
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
        {#if item.title === 'divider'}
            <li class="uk-nav-divider"></li>
        {:else}
            <li class:uk-active={ routePath === item.url }>
                <RouterLink to="{ item.url }">
                    { item.title }
                </RouterLink>
            </li>
        {/if}
    {/each}

</ul>
