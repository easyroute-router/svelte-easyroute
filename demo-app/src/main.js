import App from './App.svelte';
import 'uikit/dist/css/uikit.css'
import 'uikit/dist/js/uikit'

import router from './Router'

const app = new App({
	target: document.body,
	props: {
		name: 'world',
		router
	}
});

window.app = app