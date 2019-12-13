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

  $: routeComponent = _routeComponent
  $: routeInfo = _routeInfo
</script>

<div class="svelte-easyroute-outlet">
  <svelte:component this={routeComponent} currentRoute={routeInfo}/>
</div>
