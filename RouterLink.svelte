<div class="router-link" on:click={navigateRouter}>
<a href={(window.routermode == 'hash' ? '/#' : '')+to} on:click={preventClickLink}>
{#if text && text !== ""}
{text}
{/if}
<slot></slot>
</a>
</div>

<script>
    export let to
    export let text

    function preventClickLink(e) {
        e.preventDefault()
        e.stopPropagation()
        navigateRouter()
    }

    function navigateRouter() {
        if (window.routermode == 'hash') window.location.hash = to
        if (window.routermode == 'history') {
            let stateObj = { path: to, needAddBase: true };
            let event = new CustomEvent('svelteEasyrouteLinkClicked', 
                { 
                    'detail': stateObj
                });
            window.dispatchEvent(event)
        }
        if (window.routermode == 'silent') {
            let stateObj = { path: to, needAddBase: true };
            let event = new CustomEvent('svelteEasyrouteSilentNavigated', 
                { 
                    'detail': stateObj
                });
            window.dispatchEvent(event)
        }
    }
</script>

<style>
    div.router-link {
        color: blue;
        text-decoration: underline;
        cursor: pointer;
        display: inline-block;
    }
</style>