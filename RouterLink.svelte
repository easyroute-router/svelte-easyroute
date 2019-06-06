<div class="router-link" on:click={navigateRouter}>
{#if text && text !== ""}
{text}
{/if}
<slot></slot>
</div>

<script>
    export let to
    export let text

    function navigateRouter() {
        if (window.routermode == 'hash') window.location.hash = to
        if (window.routermode == 'history') {
            let stateObj = { path: to };
            history.pushState(stateObj, "", to);
            var event = new CustomEvent('svelteEasyrouteLinkClicked', 
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