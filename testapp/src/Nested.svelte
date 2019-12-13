<script>
  export let route
  import {default as NestedOutlet} from "../../RouterNestedOutlet.svelte"
  console.log('NEEEEEE',route)
</script>

<h1>Nested!</h1>
{#if route}
<NestedOutlet route={route}/>
{/if}

