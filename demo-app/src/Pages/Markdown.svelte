<script>
    import MarkdownIt from 'markdown-it'

    export let currentRoute
    export let router
    const md = new MarkdownIt()
    let currentMdText = ''
    let doDelay = false

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
                const delay = doDelay ? 200 : 0
                setTimeout(() => {
                    currentMdText = xhr.responseText
                }, delay)
                doDelay = true
            }

        }
    }

    $: currentRoute.fullPath && currentRoute.name === 'Page' && updateContent(true)
    $: renderedContent = md.render(currentMdText)
</script>

<div class="page-content">
    {@html renderedContent}
</div>