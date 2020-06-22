import App from './App.svelte';
import './global.css'
import 'uikit/dist/css/uikit.css'
import 'uikit/dist/js/uikit'

import router from './Router'

async function bootstrap() {
	const app = new App({
		target: document.body,
		props: {
			name: 'world',
			router: await router()
		}
	});
	window.app = app
}

bootstrap()
