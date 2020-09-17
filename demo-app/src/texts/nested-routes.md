## Nested routes
Working with nested routes is pretty similar to Vue Router.

First, you should define `children` property in route:
```javascript
routes:[
    {
        path: '/',
        component: Index,
        name: 'Index',
        children: [
            {
                path: 'nested',
                component: Nested,
                name: 'Nested'
            }
        ]
    },
```

Then, add into `Index` component RouterOutlet:
```javascript
// Index.svelte
<script>
import { RouterOutlet } from 'svelte-easyroute'
</script>

<RouterOutlet />
```
Now you will see both rendered
components on the screen.

#### Important:
Svelte Easyroute ecosystem uses [Svelte context API](https://svelte.dev/docs#setContext).
Context name is `easyrouteContext`. Never redefine it in 
your components!
