<script>
    import MarkdownIt from 'markdown-it'

    export let currentRoute
    export let router
    console.log(currentRoute)
    const md = new MarkdownIt()
    let currentMdText = ''

    function updateContent() {
        const slug = currentRoute.params.slug
        const xhr = new XMLHttpRequest();

        xhr.open('GET', `/pages/${slug}.md`, true);

        xhr.send(); // (1)

        xhr.onreadystatechange = function() { // (3)
            if (xhr.readyState !== 4) return;

            if (xhr.status !== 200) {
                console.error(xhr.status, xhr.statusText)
                router.push('/not-found')
                currentMdText = ''
            } else {
                currentMdText = xhr.responseText
            }

        }
    }

    $: currentRoute.fullPath && currentRoute.name === 'Page' && updateContent(currentRoute.fullPath)
    $: renderedContent = md.render(currentMdText)
</script>

<div class="page-content">
    {@html renderedContent}
</div>