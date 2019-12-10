<script>
export let currentRoute
console.log(currentRoute)
</script>

<div class="container-fluid mt-3 text-center">
    <h1>Params Playground</h1><br>
    <p>This is a dynamic route. It's url defined like:</p>
    <pre style="background:lightgray; color: black;">path: "/playground/:param1/params/:param2"</pre>
    <p>And here what we have in currentRoute:</p>
    <pre>{JSON.stringify(currentRoute.params,false,2)}</pre>
    <p>Feel free to change parameters in URL and see the results.</p>
    <br>
</div>