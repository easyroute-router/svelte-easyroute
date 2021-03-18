## Конфигурация сервера

Svelte Easyroute позволяет использовать любой Node.js сервер
или фреймворк на ваше усмотрение. В данной документации будет
рассмотрена настройка сервера на Express.

Сама настройка Express остаётся прежней. SSR в Easyroute не 
является view-движком для Express, поэтому вам нужно импортировать
и создать рендерер:

```javascript
const renderer = require('svelte-easyroute/ssr')()
```

Дальше, импортируйте собранное для SSR приложение:

```javascript
const App = require('./ssr/app.ssr.js').default
```

### Подготовка HTML

Так как Svelte (по умолчанию) генерирует только код приложения,
вам нужно создать HTML-шаблон, в который вы будете вписывать
код. Вы можете использовать любой шаблонизатор (EJS, etc.), или
же простой HTML-файл с плейсхолдерами. В самом упрощённом 
виде он может выглядеть так:

```html
<html>
  <head>
    <!-- CSS, собранный для клиента -->
    <link href="/client/css/bundle.css" rel="stylesheet">
    {$ HEAD $}
    <style>{$ STYLES $}</style>
  </head>
  <body>
    <div id="app">
      {$ HTML $}
    </div>
    <!-- JS, собранный для клиента -->
    <script src="/client/js/bundle.js"></script>
  </body>
</html>
```

### Рендеринг приложения

Вся "магия" происходит в обработчике маршрутов. Лучше сделать
коллбэк-функцию асинхронной, так как `renderer`, созданный выше,
является асинхронной функцией. 

```javascript
// Читаем подготовленный HTML
const template = fs.readFileSync(__dirname + './app.template.html', 'utf8')

app.get('*', async (req, res) => {
  const rendered = await renderer({
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

Вы можете передавать любые props в компонент. В результате 
выполнения кода выше Easyroute перейдёт по URL из объекта 
Request, запустит все глобальные и индивидуальные хуки, 
подготовит список компонентов маршрутов и вызовет метод 
`render` у компонента App. Полученные данные подставит в 
HTML-шаблон. 
