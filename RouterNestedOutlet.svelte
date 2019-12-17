<script>
  import { onDestroy } from 'svelte'
  export let router
  export let callback
  let comp;
  let _router = router
  let passingRouter
  const delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      },ms)
    })
  }
  (async () => {
    await callback('out');

    if (router && router._nested && router._nested.component) {
//      comp = false;
      //await delay(2);
      comp = router._nested.component
      await callback('in');
      passingRouter = JSON.parse(JSON.stringify(router));
      passingRouter._nested = router._nested.nested || false;
    }
  })();
</script>

<div class="svelte-easyroute-outlet">
  <svelte:component this={comp} router={passingRouter}/>
</div>
