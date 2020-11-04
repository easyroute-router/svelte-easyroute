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
Далее, в вашем компоненте верхнего уровня, оберните все элементы в EasyrouteProvider, и 
передайте в него экземпляр роутера. Не волнуйтесь: он не создать DOM-элемент и не нарушит
ваши стили. Это всего лишь логическая обёртка.

```javascript
<script>
// ./App.svelte
import { EasyrouteProvider } from 'svelte-easyroute'
import router from './router.js'
</script>

<EasyrouteProvider {router}>
    ...
</EasyrouteProvider>
```

**Очень важно** обернуть ваш **корневой** компонент в `<EasyrouteProvider>`. Без этого
`<RouterOutlet>` и `<RouterLink>` не будут иметь доступа к экземпляру роутера.

### Последний шаг
Сейчас если вы запустите ваше приложение, вы увидите ошибки
в консоли. Это происходит из-за того, что мы не добавили
представление - контейнер для компонентов роутера. Чтобы 
его создать, добавьте это в ваш компонент:

```javascript
<script>
import { RouterOutlet } from 'svelte-easyroute'
</script>

<RouterOutlet />
```