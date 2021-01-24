import App from './App.svelte'
import './global.css'
import 'uikit/dist/css/uikit.css'
import 'uikit/dist/js/uikit'
import 'nprogress/nprogress.css'

const app = new App({
  target: document.getElementById('app'),
  hydrate: true
})
window.app = app
