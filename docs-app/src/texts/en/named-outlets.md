## Named outlets

If you need to display multiple route-depending
views on a single page, for example, creating 
a layout with sidebar views and main views - 
this is where you may need named outlets (or
named views, like in Vue.js). 
Instead of having one single outlet 
in your view, you can have multiple and give 
each of them a name. A `RouterOutlet` without a 
name will be given default as its name.

```html
<RouterOutlet /> <!-- "default" outlet -->
<RouterOutlet name="sidebar-left" /> <!-- "sidebar-left" outlet -->
<RouterOutlet name="sidebar-right" /> <!-- "sidebar-right" outlet -->
```
An outlet is rendered by using a component, 
therefore multiple outlets require multiple 
components for the same route. Make sure to 
use the components (with an s) option:

```javascript
const router = new Router({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        'sidebar-left': Bar,
        'sidebar-right': Baz
      }
    }
  ]
})
```

You can use named outlets on each level, even in 
nested routes: just put a name attribute to `<RouterOutlet>`