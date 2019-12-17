<script>
	import {onMount} from 'svelte'
	import RouterLink from '../../RouterLink.svelte'
	export let router;
	import RouterOutlet from '../../RouterOutlet.svelte'

	onMount(()=> {
	})
</script>

<style type="text/scss">
	h1 {
		text-transform: uppercase;
		font-weight: 300;
		text-align: center;
	}
</style>

<div class="container-fluid mt-3 mb-3 text-center">
	<h1>svelte easyroute demo</h1>
	<p>Check out console for router hooks</p>
	<pre style="max-width: 500px; margin: 0 auto; text-align:left; background:#e2e2e2; color:black;"><br># Try me locally<br>npx degit lyohaplotinka/svelte-easyroute-demo yourapp
	</pre><br>
	<RouterLink to="/"><button type="button">Index</button></RouterLink>
	<RouterLink to="/test"><button type="button">Test page</button></RouterLink>
	<RouterLink to="/test/nested"><button type="button">Nested page</button></RouterLink>
	<RouterLink to="/?name=Lyoha&status=plotinka"><button type="button">Index page with query</button></RouterLink>
	<RouterLink to="/test?name=Alex&age=22"><button type="button">Test page with query</button></RouterLink>
	<RouterLink to="/playground/easy/params/route"><button type="button">Router params playground</button></RouterLink>
	<hr>
</div>
<div class="container mt-5 shadowbox">
			<RouterOutlet router={router} />
</div>
