<script>
  export let to

  function navigate (evt) {
    evt.preventDefault()
    evt.stopPropagation()
    window.location.hash = `#${to}`
  }
</script>

<a href="{to}" on:click={(evt) => {navigate(evt)}}>
  <slot></slot>
</a>
