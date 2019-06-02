<script>
	export let router;
	let currentRoute = 0
	let route = null
	let drawOutlet = false
	router.afterUpdate = function(r) {
		currentRoute = r
		try {
			let x = router.routes[currentRoute].component
			route = router.currentRoute
			drawOutlet = true
		} catch(error) {
			drawOutlet = false
		}
	}
</script>

<div>
	{#if drawOutlet}
	<svelte:component this={router.routes[currentRoute]["component"]} router={router} currentRoute={route}/>
	{/if}
</div>