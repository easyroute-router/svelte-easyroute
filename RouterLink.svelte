<span class="router-link" on:click={navigateRouter}>{text}</span>

<script>
    export let to
    export let text

    function navigateRouter() {
        window.location.hash = to
    }
</script>

<style>
    span.router-link {
        color: blue;
        text-decoration: underline;
        cursor: pointer;
    }
</style>