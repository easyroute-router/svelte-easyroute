<script>
    import { onDestroy } from 'svelte'
    import MarkdownIt from 'markdown-it'
    import { langStore } from '../Store'
    import { fetchSlugMarkdown } from '../Router/utils'
    import useCurrentRoute from '../../../useCurrentRoute'
    import { delay } from 'easyroute-core/lib/utils'

    const md = new MarkdownIt()
    let doDelay = false
    let currentRoute = {
        meta: {
            pageText: null
        },
        params: {
            slug: null
        }
    }

    const unsubscribe = useCurrentRoute(async (data) => {
        doDelay && await delay(220)
        doDelay = true
        currentRoute = data
    })

    langStore.subscribe(async (lang) => {
        if (lang !== 'en' && lang !== 'ru') return
        const { slug } = currentRoute.params
        if (slug) {
            currentRoute.meta.pageText = await fetchSlugMarkdown(slug)
        }
    })

    onDestroy(unsubscribe)

    $: renderedContent = md.render(currentRoute.meta.pageText || '')
</script>

<div class="page-content">
    <article>
        {@html renderedContent}
    </article>
</div>
