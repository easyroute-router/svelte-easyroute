## Loading data in hooks

By default, the object with information about the current 
route is immutable, however, you can transfer data through 
the "meta" field.

```javascript
console.log(currentRoute)
// console output: 

{
  "fullPath": "/test/value?name=Alex&age=23",
  "params": {
    "param1": "value"
  },
  "query": {
    "name": "Alex",
    "age": "23"
  },
  // "meta": can be passed in hooks 
  "meta": {
    "pageTitle": "Title!"
  }
}
```

Navigation hooks are great for this. They
can be asynchronous, and the router will not go to a new page,
until the hook completes.

Inside the hook, there is a `to` object that represents a route,
to which the transition is made. You can write data
to the key value `to.meta`. The data can be any type.