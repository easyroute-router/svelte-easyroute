<script>
  export let route
  let comp = false
  console.log('Nested Outlet here', route)
  if (route && route.component) {
    comp = route.component
    console.log(comp)
  }
</script>

<div class="svelte-easyroute-outlet">
  <svelte:component this={comp} route={route.nested || false}/>
</div>
