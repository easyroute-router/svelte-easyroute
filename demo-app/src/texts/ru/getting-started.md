## Введение

### Создаём роутер

Для создания экземпляра роутера, необходимо указать его режим работы и
сопоставления между путями и соответствующими этим путям компопонентами:

**router.js**
```javascript
import Router from 'svelte-easyroute'
import Index from './pages/Index.svelte'
import About from './pages/About.svelte'

export const router = new Router({
    mode: "hash", // "hash", "history" или "silent"
    omitTrailingSlash: true, // нужно ли удалять последний слэш в пути, 
                             // например "/my/path/" => "/my/path"
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
            component: () => import('src/pages/LazyPage.svelte'),
            name: 'This is a lazy-loading page'
        }
    ]
})
```

Ключ `mode` позволяет вам выбрать режим навигации:
* `hash`: используется всё, что следует за знаком `#` в URL (`window.location.hash`)
* `history`: основан на [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
* `silent`: тихий режим навигации без обновления URL в строке браузера

### Добавление маршрутов
Ключ `routes` - перечисляет массив зарегистрированных маршрутов.
В примере выше мы указали два маршрута:
- ссылка `//yoursite.com/#/` отобразит компонент `Index`
- ссылка `//yoursite.com/#/about/me` отобразит компонент `About`

### Следующий шаг
Далее, в вашем компоненте верхнего уровня, оберните все элементы в `EasyrouteProvider`, и передайте в него экземпляр роутера. Не волнуйтесь: он не создать DOM-элемент и не нарушит ваши стили. Это всего лишь логическая обёртка.

**App.svelte**
```svelte
<script>
  import { EasyrouteProvider } from 'svelte-easyroute'
  import { router } from './router.js'
</script>

<EasyrouteProvider {router}>
  ...
</EasyrouteProvider>
```

**Очень важно** обернуть ваш **корневой** компонент в `<EasyrouteProvider>`.
Без этого `<RouterOutlet>` и `<RouterLink>` не будут иметь доступа к экземпляру роутера.

### Последний шаг
Сейчас, если вы запустите ваше приложение, то вы увидите ошибки
в консоли. Это происходит потому, что мы не указали место,
куда нужно помещать компонент, сопоставленный в `routes`.

Для указания места, куда вставить сопоставленный компонент из `routes`, 
служит `<RouterOutlet/>`:

**Layout.svelte**
```svelte
<script>
  import { RouterOutlet, RouterLink } from 'svelte-easyroute'
</script>

<main>
  <RouterOutlet />
</main>  
<aside>
  <RouterLink to={'/anotherPage'} />
</aside>
```

Если под текущий URL сопоставлено сразу несколько компонент из `routes`, 
то выбрать конкретное сопоставление можно с помощью свойства `name`:
`<RouterOutlet name="..."/>`, иначе будет вставлен первый компонент, 
подходящий под сопоставление.
