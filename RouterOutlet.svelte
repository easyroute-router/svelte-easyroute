<script>
  import { tick } from 'svelte'

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
  }

  router.afterUpdate = async () => {
    window.dispatchEvent(new Event('RouterUpdate'))
    if (!router.currentRoute.routeObject.nested) await callback('out')
    if (!router.currentRoute.routeObject.nested) _routeComponent = false;
    await tick();
    await delay(2);
    _routeComponent = router.currentRoute.routeObject.component
    _routeInfo = router.currentRoute.routeInfo
    passingRouter = router
    if (!router.currentRoute.routeObject.nested) callback('in')
  }

  $: routeComponent = _routeComponent
  $: routeInfo = _routeInfo
</script>

<div class="{className}">
  <svelte:component this={routeComponent} router={passingRouter} currentRoute={routeInfo}/>
</div>
