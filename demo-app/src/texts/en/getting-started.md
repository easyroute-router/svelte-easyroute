## Getting started

### Creating a router
To create a router, create a file (for example, "router.js") and add the following code:
```javascript
import Router from 'svelte-easyroute'

const router = new Router({
    mode: "hash", // "hash", "history" or "silent"
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
        },
        {
            path: '/lazy-load',
            component: () => import('src/LazyPage.svelte'),
            name: 'This is a lazy-loading page'
        }
    ]
})

export default router
```

"mode" key allows you to specify the navigation mode:
* "hash": based on everything that comes after the "#" sign in the URL (window.location.hash)
* "history": based on [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
* "silent": navigation mode without updating the URL in the browser bar

### Adding routes
"routes" key is array of registered routes. In the example above we defined two routes. Link `//yoursite.com/#/` will lead to Index component, and link `//yoursite.com/#/about/me` - to About component.

### Next step
Then, in your root component, wrap all data in EasyrouteProvider component and pass
router instance to it as a prop. Don't worry: it
doesn't create a real DOM element ant won't break your styles, it is just a logical wrapper.
```javascript
<script>
// ./App.svelte
import { EasyrouteProvider } from 'svelte-easyroute'
import router from './router.js'
</script>

<EasyrouteProvider {router}>
    ...
</EasyrouteProvider>
```
**It is important** to wrap your **root** component with `<EasyrouteProvider>`. Without it 
`<RouterOutlet>` and `<RouterLink>` will have no access to the router instance.

### Last step
If you will try to launch your app after creating router 
instance you will see errors in console. This happening 
because there is no outlet - a container for router 
components. To create one, add this to your component:

```javascript
<script>
import { RouterOutlet } from 'svelte-easyroute'
</script>

<RouterOutlet />
```