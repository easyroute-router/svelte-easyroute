## Dynamic route matching

Svelte Easyroute supports route parameters. It is routes 
that have dynamic segment in path (just like in Vue.js). 
Take a look at this example:

```javascript
routes: [
  ...
		{
			path: "/playground/:param1/params/:param2",
			component: ParamsPlayground,
			name: "ParamsPlayground"
		}
	]
```
This route has 4 parts: playground, param1, params 
and param2. Here "playground" and "params" 
are static parts of route: you cannot change them. 
But "param1" and "param2" are dynamic, so you can use 
them to pass data. You can access this data from 
currentRoute object.

