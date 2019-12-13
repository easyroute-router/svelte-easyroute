<script>
  export let router;
  let _routeComponent = false;
  let _routeInfo = {};
  router.afterUpdate = () => {
    _routeComponent = false;
    setTimeout(() => {
      _routeComponent = router.currentRoute.routeObject.component
      _routeInfo = router.currentRoute.routeInfo
    },2)
  }

  let tag = 'div'

  let passingRouter = JSON.parse(JSON.stringify(router))
  passingRouter._nested = router.currentRoute.routeObject.nested || false
  console.log('Passing',passingRouter)

  $: routeComponent = _routeComponent
  $: routeInfo = _routeInfo
</script>

<div class="svelte-easyroute-outlet">
  <svelte:component this={routeComponent} router={passingRouter} currentRoute={routeInfo}/>
</div>
