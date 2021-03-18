## Build setup

The first step is to set up the build of your application for
SSR. The Svelte compiler can generate code like this, so
all you need is to create an additional configuration
in rollup or webpack, which has two main differences:

* As the input file you need to specify the component of the top
a level configured for building in SSR (for example, "App.ssr.svelte");
* in Svelte plugin settings add: `generate: 'ssr'`.

### Main Component Modifications

"App.ssr.svelte" is a copy of the "main" component
in your application. It is very important to do the following in it:
in the block `<script context =" module ">` import
a created instance of a router (or create directly in it), and
then call the special registration method:

```html
<script context = "module">
import router from './Router/index.ssr'
import registerRouterSSR from 'svelte-easyroute/ssr/registerRouterSSR'

registerRouterSSR (router)
</script>
```

### Next steps

After that, you need to build applications for both the client and
server. Optionally - in the input js file of the client application,
in instantiating the top level component class
add `hydrate: true`:

```javascript
new App ({
  target: document.getElementById ('app'),
  hydrate: true,
  props: {}
})
```

This will make the application use the already rendered HTML
for work, and will not duplicate the layout.
