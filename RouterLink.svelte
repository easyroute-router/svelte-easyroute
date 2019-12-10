<script>
  export let to

  const link = '#' + to

  function navigate (evt) {
    evt.preventDefault()
    evt.stopPropagation()
    window.location.hash = link
  }
</script>

<a href="{link}" on:click={navigate}>
  <slot></slot>
</a>
