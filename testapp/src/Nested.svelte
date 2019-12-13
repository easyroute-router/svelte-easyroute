<script>
  export let route
  import {default as NestedOutlet} from "../../RouterNestedOutlet.svelte"
  console.log('neeeee',route)
</script>

<h1>Nested!</h1>
{#if route}
<NestedOutlet route={route}/>
{/if}

