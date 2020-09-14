## Current route info
From every child component you can access current 
route state. Just put in the <script> tag:
```javascript
export let currentRoute
```
That's it! 

### Example
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

You can also get current outlet HTML element like this:
```javascript
export let outlet
console.log(outlet) // <div class="easyroute-outlet">...</div>
```

By default route info object is immutable, 
however, you can see `meta` field in the example above. 

Just like in VueRouter, you can pass any data to route
with this field. You can also add data in `beforeEach` hook.
