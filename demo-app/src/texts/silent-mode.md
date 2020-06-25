## Silent mode

Svelte Easyroute has a third router mode - "silent". 
You can use it if you don't want to change URL in 
address bar. Define your routes as usual:
```javascript
export var router = new Router({
mode: "silent",
routes: [
    ...
]
})
```
Then, just place a regular RouterLink anywhere you 
want. 
This mode has it's own history. You can use this two 
methods:
```javascript
export let router

router.back() // navigates your router back in silent mode
router.go(1) // navigates your router forward in silent mode
```
**Why this mode not uses history api by default?**
Because history api is not supported in some older 
versions of browsers. However, you can manipulate 
browser history in this mode using navigation hooks :)