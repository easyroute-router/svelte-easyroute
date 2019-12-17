<script>
  import { onMount } from 'svelte'
  export let router
  export let callback
  let comp;
  let _router = router
  let passingRouter
  let element
  const delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      },ms)
    })
  }
  (async () => {
    await callback('out');
    console.log(router.nested)

    if (router && router.currentRoute.routeObject.nested && router.currentRoute.routeObject.nested.component) {
      comp = false;
      await delay(2);
      await callback('out')
      comp = router.currentRoute.routeObject.nested.component
      await callback('in');
      passingRouter = JSON.parse(JSON.stringify(router));
      passingRouter._nested = router.currentRoute.routeObject.nested.nested || false;
    }
  })();

  window.addEventListener('RouterUpdate', async () => {
    //comp = false;
    //await delay(2);
    await callback('out')
    comp = router.currentRoute.routeObject.nested.component
    await callback('in');
    passingRouter = JSON.parse(JSON.stringify(router));
    passingRouter._nested = router.currentRoute.routeObject.nested.nested || false;
  })

  onMount(() => {
    console.log(element)
  })

  $: _comp = comp
</script>

<div class="svelte-easyroute-outlet" bind:this={element}>
  <svelte:component this={_comp} router={passingRouter}/>
</div>
