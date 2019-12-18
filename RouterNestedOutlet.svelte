<script>
  import { onMount } from 'svelte'
  export let router
  export let callback = () => false;
  let comp;
  let _router = router
  let passingRouter
  let element
  let component
  let index = 0
  const delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      },ms)
    })
  }

  function getElementIndex(node) {
    let allOutlets = document.querySelectorAll('.svelte-easyroute-outlet');
    console.log('NDND',[...allOutlets].indexOf(node));
    return [...allOutlets].indexOf(node)
  }

  async function changeComponent (routerUpdate = true) {
    let nestingTo = router.currentRoute.nestingTo;
    index = getElementIndex(element);
    console.log(index, nestingTo)
    if (nestingTo === index) {
      if (router && router.currentRoute.routeObject.nested && router.currentRoute.routeObject.nested.component) {
        if (!routerUpdate) {
          comp = false;
          await delay(2);
        }
        await callback('out')
        comp = component
        await callback('in');
        console.log(comp)
        passingRouter = router;
      }
    }
  }

  window.addEventListener('RouterUpdate', changeComponent)

  onMount(() => {
    index = getElementIndex(element)
    let route = router.currentRoute.routeObject
    for (let i = 0; i < index; i++) {
      if (!route) break;
      route = route.nested
    }
    if (route) component = route.component
    else component = false
    changeComponent(false)
  })


  $: _comp = comp
</script>

<div class="svelte-easyroute-outlet" bind:this={element}>
  <svelte:component this={_comp} router={router}/>
</div>
