## Current route info
From every child component you can access current 
route state. 

In any component wrapped with `<EasyrouteProvider>`,
on any level of nesting, you can use `useCurrentRoute`
hook. It is a custom implementation of Observable
pattern, so you can "subscribe" to current route
object. It goes like this:

```html
<script>
    // Component.svelte

    import useCurrentRoute from "svelte-easyroute/useCurrentRoute"
    import { onDestroy } from "svelte"
    
    const unsubscribe = useCurrentRoute((currentRoute) => {
        console.log(currentRoute)
    })
    
    onDestroy(unsubscribe)
</script>
```
**Don't forget** to `unsibscribe` when leaving your component!
If you will not, it can cause memory leak.
