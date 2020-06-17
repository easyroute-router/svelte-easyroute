<script>
    import MarkdownIt from 'markdown-it'

    export let currentRoute
    export let router
    const md = new MarkdownIt()
    let currentMdText = ''
    let doDelay = false

    $: renderedContent = md.render(currentRoute.meta.pageText || '')
</script>

<div class="page-content">
    {@html renderedContent}
</div>