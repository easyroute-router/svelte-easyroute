### Habitual router in your projects


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
npm install --save svelte-easyroute
```

Then, in your main.js file put this code
```javascript
import {Router} from './router.js'
export var router = new Router({
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
import RouterLink from './RouterLink'

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
    let fullPath = currentRoute.query.fullPath
    let breadcrumbs = currentRoute.query.route
}
```
* Programmaticaly navigate 
You can use push method to navigate inside your app
```javascript
    export let router

    router.push('/?name=RouterPushUsed')
```

***
# What is next?
#### TODO list: 
1. Selecting between History API and Hash mode;
2. Fully programaticaly navigation;
3. Router hooks (for accessing states before and after navigation)

### Thank you for reading this! I hope you'll enjoy Svelte Easyroute!