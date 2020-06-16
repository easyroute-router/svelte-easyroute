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
  }
}
```