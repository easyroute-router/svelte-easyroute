<script>
  export let router;
  let _routeComponent = false;
  router.afterUpdate = () => {
    console.log(router.currentRoute);
    _routeComponent = false;
    setTimeout(() => {
      _routeComponent = router.currentRoute.routeObject.component
    },2)
  }

  $: routeComponent = _routeComponent
</script>

<svelte:component this={routeComponent}/>

