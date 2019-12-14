<script>
  export let router
  import {default as NestedOutlet} from "../../RouterNestedOutlet.svelte"
</script>

<h1>Nested Deep!</h1>
  <NestedOutlet router={router}/>
