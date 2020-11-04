## Введение

### Создаём роутер

Чтобы создать экземпляр роутера, откройте файл, являющийся точкой входа 
(к примеру, "main.js"), и добавьте в него код:
```javascript
import Router from 'svelte-easyroute'

const router = new Router({
    mode: "hash", // "hash", "history" или "silent"
    routes:[
        {
            path: '/',
            component: Index,
            name: 'Index'
        },
        {
            path: '/about/me',
            component: About,
            name: 'About me'
        },
        {
            path: '/lazy-load',
            component: () => import('src/LazyPage.svelte'),
            name: 'This is a lazy-loading page'
        }
    ]
})
```

Ключ "mode" позволяет вам выбрать режим навигации:
* "hash": используется всё, что следует за знаком "#" в URL (window.location.hash)
* "history": основан на [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
* "silent": тихий режим навигации без обновления URL в строке браузера

### Добавление маршрутов
Ключ "routes" - массив зарегистрированных маршрутов.
В примере выше мы указали два маршрута. Ссылка `//yoursite.com/#/` 
отобразит компонент Index, а ссылка `//yoursite.com/#/about/me` - 
компонент About.

### Следующий шаг
After doing everything above, in your App class declaration, in "props" section, add new prop:
```javascript
props: {
		//your props
		...
		router
}
```

Then, in your root component, wrap all data in EasyrouteProvider component and pass
router instance to it as a prop. Don't worry: it
doesn't create a real DOM element ant won't break your styles, it is just a logical wrapper.
```javascript
<script>
// ./App.svelte
import { EasyrouteProvider } from 'svelte-easyroute'
export let router;
</script>

<EasyrouteProvider {router}>
    ...
</EasyrouteProvider>
```
**It is important** to wrap your **root** component with `<EasyrouteProvider>`. Without it 
`<RouterOutlet>` and `<RouterLink>` will have no access to the router instance.

### Last step
If you will try to launch your app after creating router 
instance you will see errors in console. This happening 
because there is no outlet - a container for router 
components. To create one, add this to your component:

```javascript
<script>
import { RouterOutlet } from 'svelte-easyroute'
</script>

<RouterOutlet />
```