<script>
    export let currentRoute
    export let router
    export let nested

    import { default as NestedOutlet } from "../../RouterNestedOutlet.svelte"

    import {onMount} from 'svelte'

    console.log('TEST NESTED',nested)

    let parsedRoute = JSON.stringify(currentRoute,false,2)
</script>

<div class="container-fluid index-page mt-3">
    <h3 class="text-center">TEST page</h3>
    <NestedOutlet route={nested}/>
    <div class="container-fluid mt-5">
        <div class="row">
            <div class="col-md-4">
                <h5>Current path:</h5>
                <pre>
                    {parsedRoute}
                </pre>
            </div>
            <div class="col-md-4">
                <h5>Query params:</h5>
                <pre>
                    {#each Object.keys(currentRoute.query) as key}
                        <p>{key} ... {currentRoute.query[key]}</p>
                    {/each}
                </pre>
            </div>
            <div class="col-md-4">
                <h5>Links:</h5>
                <p><a href="https://github.com/lyohaplotinka/svelte-easyroute">GitHub</a></p>
                <p><a href="https://lyoha.info/en/projects/svelterouter">Home page</a></p>
            </div>
        </div>
    </div>
</div>
