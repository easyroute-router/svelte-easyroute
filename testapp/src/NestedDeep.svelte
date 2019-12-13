<script>
  export let route
  import {default as NestedOutlet} from "../../RouterNestedOutlet.svelte"
  console.log('deeeep',route)
</script>

<h1>Nested Deep!</h1>
{#if route}
  <NestedOutlet route={route}/>
{/if}
