<script>
    import MarkdownIt from 'markdown-it'
    import { langStore } from '../Store'
    import { fetchSlugMarkdown } from '../Router/utils'

    export let currentRoute = null
    const md = new MarkdownIt()
    let currentMdText = ''
    let doDelay = false

    langStore.subscribe(async (lang) => {
        if (lang !== 'en' && lang !== 'ru') return
        const { slug } = currentRoute.params
        if (slug) {
            currentRoute.meta.pageText = await fetchSlugMarkdown(slug)
        }
    })

    $: renderedContent = md.render(currentRoute.meta.pageText || '')
</script>

<div class="page-content">
    <article>
        {@html renderedContent}
    </article>
</div>