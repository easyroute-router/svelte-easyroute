<script>
  export let router;
  export let callback;
  export let transition;

  const newTransitionMode = transition !== undefined;
  router.newTransitionMode = newTransitionMode;

  let _routeComponent = false;
  let _routeInfo = {};
  let passingRouter
  let durations;
  let className = "svelte-easyroute-outlet"
  let selector = className
  let id

  const delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      },ms)
    })
  }

  if (newTransitionMode) {
    durations = router.transitionService.propTransitionDuration(transition);
    id = Math.random().toString(36).substring(7);
    className = `${className} router-${id} ${transition}-enter`
    selector = `.${selector}.router-${id}`
    console.log(selector)
  }

  router.afterUpdate = async () => {
    await callback('out')
    _routeComponent = false;
    await delay(2);
    _routeComponent = router.currentRoute.routeObject.component
    _routeInfo = router.currentRoute.routeInfo
    passingRouter = JSON.parse(JSON.stringify(router))
    passingRouter._nested = router.currentRoute.routeObject.nested || false
    callback('in')
    console.log(passingRouter)
  }

  $: routeComponent = _routeComponent
  $: routeInfo = _routeInfo
</script>

<div class="{className}">
  <svelte:component this={routeComponent} router={passingRouter} currentRoute={routeInfo}/>
</div>
