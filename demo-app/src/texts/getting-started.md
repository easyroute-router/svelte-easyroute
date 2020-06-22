## Getting started

### Creating a router
To create a router, open your main file (f.e. "main.js") and add the following code:
```javascript
import Router from 'svelte-easyroute'

const router = new Router({
    mode: "hash", // "hash" or "history"
    routes:[
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

"mode" key allows you to specify the navigation mode:
* "hash": based on everything that comes after the "#" sign in the URL (window.location.hash)
* "history": based on [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

### Adding routes
"routes" key is array of registered routes. In the example above we defined two routes. Link `//yoursite.com/#/` will lead to Index component, and link `//yoursite.com/#/about/me` - to About component.

### Next step
After doing everything above, in your App class declaration, in "props" section, add new prop:
```javascript
props: {
		//your props
		...
		router
}
```

### Last step
If you will try to launch your app after creating router 
instance you will see errors in console. This happening 
because there is no outlet - a container for router 
components. To create one, open your main component 
(f.e. "App.svelte") and add this:

```javascript
<script>
import { RouterOutlet } from 'svelte-easyroute'
...
export let router
</script>

<RouterOutlet router={router} />
```
Make sure you passed router instance as a prop to first `RouterOutlet`.
In nested routes it is not necessary. 