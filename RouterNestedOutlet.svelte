<script>
  import { onMount, onDestroy } from 'svelte'
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
    return [...allOutlets].indexOf(node)
  }

  function getComponent () {
    let route = router.currentRoute.routeObject
    for (let i = 0; i < index; i++) {
      if (!route) break;
      route = route.nested
    }
    if (route) component = route.component
    else component = false
  }

  async function changeComponent (routerUpdate = true) {
    let nestingTo = router.currentRoute.nestingTo;
    index = getElementIndex(element);
    if (index <= nestingTo) {
      if (router && router.currentRoute.routeObject.nested && router.currentRoute.routeObject.nested.component) {
        //if (!routerUpdate) {
          comp = false;
          await delay(2);
        //}
        await callback('out')
        getComponent()
        comp = component
        await callback('in');
        passingRouter = router;
      }
    }
  }

  window.addEventListener('RouterUpdate', changeComponent)

  onMount(() => {
    index = getElementIndex(element)
    getComponent()
    changeComponent(false)
  })

  onDestroy(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      },3000)
    })
  })


  $: _comp = comp
</script>

<div class="svelte-easyroute-outlet" bind:this={element}>
  <svelte:component this={_comp} router={router}/>
</div>
