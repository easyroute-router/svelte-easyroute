## Server config

Svelte Easyroute allows you to use any Node.js server
or a framework of your choice. This documentation will
considered setting up a server on Express.

The Express setup itself remains the same. SSR in Easyroute is not
a view engine for Express, so you need to import
and create a renderer:

```javascript
const renderer = require('svelte-easyroute/ssr')()
```

Next, import the application built for SSR:

```javascript
const App = require ('./ssr/app.ssr.js').default
```

### Preparing HTML

Since Svelte (by default) only generates application code,
you need to create an HTML template that you will enter
the code. You can use any template engine (EJS, etc.), or
the same simple HTML file with placeholders. In the most simplified
it might look like this:

```html
<html>
  <head>
    <! - CSS compiled for the client ->
    <link href="/client/css/bundle.css" rel="stylesheet">
    {$ HEAD $}
    <style> {$ STYLES $} </style>
  </head>
  <body>
    <div id="app">
      {$ HTML $}
    </div>
    <! - JS compiled for the client ->
    <script src="/client/js/bundle.js"></script>
  </body>
</html>
```

### Rendering the application

All the "magic" happens in the route handler. Better do
the callback function asynchronous, since the renderer created above
is an asynchronous function.

```javascript
// Read the prepared HTML
const template = fs.readFileSync(__dirname + './app.template.html', 'utf8')

app.get ('*', async (req, res) => {
  const rendered = await renderer ({
    component: App,
    props: {},
    url: req.url
  })
  const ssrHtml = template
                      .replace('{$ HTML $}', rendered.html)
                      .replace('{$ STYLES $}', rendered.css.code)
                      .replace('{$ HEAD $}', rendered.head)
  res.send(ssrHtml)
})
```

You can pass any props to the component. As a result
executing the code above Easyroute will follow the URL from the Request object, will run all global and individual hooks,
prepare a list of route components and call the method
`render` for the App component. The received data will be inserted into
HTML template.
