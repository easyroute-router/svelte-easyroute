<script>
  export let router
  import {default as NestedOutlet} from "../../RouterNestedOutlet.svelte"
  console.log('neeeee',router)
</script>

<h1>Nested!</h1>
<NestedOutlet router={router}/>

