<script>
  export let route
  let comp = false
  if (route && route.component) {
    comp = route.component
  }
</script>

<div class="svelte-easyroute-outlet">
  <svelte:component this={comp} route={route.nested || false}/>
</div>
