<script>
  export let router
  let comp = false
  let passingRouter
  if (router._nested && router._nested.component) {
    comp = router._nested.component
    passingRouter = JSON.parse(JSON.stringify(router));
    passingRouter._nested = router._nested.nested || false;
  }
</script>

<div class="svelte-easyroute-outlet">
  <svelte:component this={comp} router={passingRouter}/>
</div>
