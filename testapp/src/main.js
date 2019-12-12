import '../node_modules/bootstrap/scss/bootstrap.scss'
import './assets/main.scss'

import App from './App.svelte'
import Index from './Index.svelte'
import Test from './Test.svelte'
import ParamsPlayground from './ParamsPlayground.svelte'

import Router from '../../dist/index'

export var router = new Router({
	base: "", // NOT required
	mode: "hash",
	transition: "fade",
	routes: [
		{
			path: "/",
			component: Index,
			name: "Index"
		},
		{
			path: "/test",
			component: Test,
			name: "Test"
		},
		{
			path: "/playground/:param1/params/:param2",
			component: ParamsPlayground,
			name: "ParamsPlayground"
		}
	]
})

router.beforeEach = (to,from,next) => {
	console.log('BeforeEachHook::TO')
	console.log(to)
	console.log('\nBeforeEachHook::FROM')
	console.log(from)
	next()
}

router.afterEach = (to,from) => {
	console.log('\n\nAfterEachHook::TRANSTION_COMPLETED!')
}

const app = new App({
	target: document.body,
	props: {
		name: 'world',
		router
	}
});

window.app = app;

export default app;
