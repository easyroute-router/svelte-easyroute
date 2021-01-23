## Current route info
From every child component you can access current 
route state. There are two ways to do this:

### 1. useCurrentRoute hook
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

### 2. Export variable in outlet's child component
> **Warning!** This is a deprecated method and will be removed in version 3.1.0. 
> I recommend that you use the useCurrentRoute hook as it is more reliable and available within the entire application.

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

