<script>
    export let currentRoute

    $: param1 = currentRoute.params.param1
    $: param2 = currentRoute.params.param2
</script>

<h2>Playground</h2>
<p>
    This is <code>{param1}</code> page that shows you how <code>{param2}</code> are working.
</p>
<p>Try edit parts of url on this page in your address bar.</p>
<div uk-grid>
    <div>
        Path params
        <pre>
            { JSON.stringify(currentRoute.params, null, 2) }
        </pre>
    </div>
    <div>
        Query
        <pre>
            { JSON.stringify(currentRoute.query, null, 2) }
        </pre>
    </div>
</div>