## Current route info
From every child component you can access current 
route state. There are two ways to do this:

### 1. Export variable in outlet's child component

If your component is direct child of `<RouterOutlet>`,
ust put in the <script> tag:
```javascript
export let currentRoute
```
That's it! 

#### Example:
```javascript
{
  "fullPath": "/test/value?name=Alex&age=23",
  "params": {
    "param1": "value"
  },
  "query": {
    "name": "Alex",
    "age": "23"
  },
  "meta": {
    "pageTitle": "Title!"
  }
}
```

### 2. useCurrentRoute hook
In any component wrapped with `<EasyrouteProvider>`, 
on any level of nesting, you can use `useCurrentRoute`
hook. It is a custom implementation of Observable
pattern, so you can "subscribe" to current route
object. It goes like this:

```html
<script>
    // Component.svelte

    import { useCurrentRoute } from "svelte-easyroute"
    import { onDestroy } from "svelte"
    
    const unsubscribe = useCurrentRoute((currentRoute) => {
        console.log(currentRoute)
    })
    
    onDestroy(unsubscribe)
</script>
```
**Don't forget** to `unsibscribe` when leaving your component!
If you will not, it can cause memory leak.

### Bonus

You can also get current outlet HTML element like this:
```javascript
export let outlet
console.log(outlet) // <div class="easyroute-outlet">...</div>
```

By default route info object is immutable, 
however, you can see `meta` field in the example above. 

Just like in VueRouter, you can pass any data to route
with this field. You can also add data in `beforeEach` hook.
