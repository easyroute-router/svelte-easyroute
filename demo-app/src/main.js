import App from './App.svelte';
import Login from './Login.svelte'
import MainLayout from './Layout/MainLayout.svelte'
import NotFound from './NotFound.svelte'
import Router from '../../lib/dist/index'

import 'uikit/dist/css/uikit.css'
import 'uikit/dist/js/uikit'

const router = new Router({
	mode: "history", // "hash" or "history"
	routes:[
		{
			path: '/',
			component: MainLayout,
			name: 'Index',
			children: [
				{
					path: '',
					component: () => import(/*webpackChunkName: "Index" */ './Pages/Index.svelte'),
					name: 'Index'
				},
				{
					name: 'Page',
					path: 'page/:slug',
					component: () => import(/*webpackChunkName: "mdpage" */ './Pages/Markdown.svelte')
				}
			]
		},
	]
})

const app = new App({
	target: document.body,
	props: {
		name: 'world',
		router
	}
});

window.app = app