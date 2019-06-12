![alt text](https://img.shields.io/npm/v/svelte-easyroute-rollup.svg "npm stats")

If you want to use it with WEBPACK, go [HERE](https://www.npmjs.com/package/svelte-easyroute-webpack)

### Habitual router in your projects
It is good svelte router shich supports history and hash mode, navigation guards, base path. If you need svelte router, try this one.

> v0.3.0
>Here are:
>* Fixed serious issues with History API (browser buttons "back" and "forward" now working in history mode);
>* Added Base Url feature! Now you can specify a base path for your app routes;
>* Router now written in Typescript.

**There are different verions on NPM for webpack and rollup builders:**
* [WEBPACK](https://www.npmjs.com/package/svelte-easyroute-webpack)
* [ROLLUP](https://www.npmjs.com/package/svelte-easyroute-rollup)


![alt text](https://lyoha.info/assets/images/svelte.png "Logo Title Text 1")


**Svelte Easyroute** - is a simple and convenient router for [Svelte](https://svelte.dev/) framework.

Why you should try it? 

>**1. Well-known syntax**
>I was inspired by the router for Vue.js, so this router will be understandable to many of you
>
>**2. Still developing**
>Many features of the router are still ahead. Already now it can be used in projects, and I’m happy to know what will make it better.
>
>**3. Community-friendly**
>Repository cloning and pull requests are welcome! Together we can make the perfect tool for developing on Svelte

## How to use?
In your Svelte project directory run 
```bash
npm install --save svelte-easyroute-rollup@latest
# or "npm install --save svelte-easyroute-webpack@latest"
```

Then, in your main.js file put this code
```javascript
// Since version 0.1.0 Svelte Easyroute supports mode selecting!
import {Router} from 'svelte-easyroute-rollup' // -webpack
export var router = new Router({
base: "", // Since version 0.3.0 you can specify base path
mode: "hash", // "hash" or "history"
routes:	[
		{
			path: '/',
			component: Index,
			name: 'Index'
		},
		{
			path: '/about/me',
			component: About,
			name: 'About me'
		},
		// Since version 0.2.0 Svelte Easyroute supports dynamic
		// route matching!
		{
			path: '/username/:name/:action',
			component: Username,
			name: 'Username'
		}
	]
})
```
Here we defined two routes. Link "//yoursite.com/#/" will lead to Index component, and link "//yoursite.com/#/about/me" - to About component. 

After doing this, in your App class declaration, in "props" section, add new prop:
```javascript
props: {
		//your props
		...
		router: router
}
```

#### We finished here!
But not everything yet.

Go to your main file (f.e. "App.svelte"). In the script tag put this:
```javascript 
import { onMount } from 'svelte'
export let router
import RouterLink from 'svelte-easyroute-rollup/RouterLink.svelte' // -webpack

onMount(()=> {
	router.createOutlet()
})
```
Let me explain. 
We need "onMount" Svelte hook for outlet creating. Also, here we get access to our Router (we passed it as a prop in a previous step). 
We need to import RouterLink to create... links :)

After all, we need to init Router outlet on our page. Let's do it in onMount hook.

Now it's time to put the outlet on your page. 
It is easier than you think! Just put on page element with id "router-outlet". That's all!

### Now you are ready to create your single-page app with Svelte!
 
***

#### Additional controls

For now, what you can do with Svelte Easyroute:
* Access current route info. You can get info about full current path, query params and route breadcrumbs.
For that, in your component, create variable "currentRoute". That's all!
```javascript
export let currentRoute

function someFunc() {
    let queryName = currentRoute.query.name
    let fullPath = currentRoute.fullPath
    let breadcrumbs = currentRoute.route
}
```
* Programmaticaly navigate 
You can use push method to navigate inside your app
```javascript
    export let router

    router.push('/?name=RouterPushUsed')
```

* Router navigation hooks
Since version 0.1.0 you can use navigation hooks. They look pretty like hooks in a Vue.js, but with some difference:
```javascript

var router = new Router(...)

router.beforeEach = (to,from,next) => {
	console.log(to.fullPath)
	console.log(from.fullPath)
	next()
}

router.afterEach = (to,from) => {
	console.log('We are on new page!')
}
```
beforeEach guard will stop transition until "next()" method is called.

* Base path
Since version 0.3.0 you can specify a base path for your app. It will be placed before each route automaticly.
```javascript
export var router = new Router({
	base: "path/to/your/app", // NOT required. You can specify it in any format: with or without slashes in the beginning and in the end.

	/* * */
```

***
# What is next?
#### TODO list: 
1. Bugfixes;
2. Fully programaticaly navigation;
3. Additional interesting routing modes.

### Thank you for reading this! I hope you'll enjoy Svelte Easyroute!

#### Contact me:
* [My website: https://lyoha.info/](https://lyoha.info/) (russian language!)
* [Telegram: https://t.me/alexeysolovjov](https://t.me/alexeysolovjov)
* [Email: plotinka@lyoha.info](mailto:plotinka@lyoha.info)