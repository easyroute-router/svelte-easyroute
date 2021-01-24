## Вложенные маршруты

Работа с вложенными маршрутами очень похожа на работу с ними
в Vue Router.

Прежде всего, создайте массив `children` в маршруте:
```javascript
routes:[
    {
        path: '/',
        component: Index,
        name: 'Index',
        children: [
            {
                path: 'nested',
                component: Nested,
                name: 'Nested'
            }
        ]
    },
```

Далее, в компонент `Index` добавьте RouterOutlet:
```javascript
// Index.svelte
<script>
import { RouterOutlet } from 'svelte-easyroute'
</script>

<RouterOutlet />
```

Теперь вы увидите оба компонента на экране.

#### Важно: 
Svelte Easyroute использует [Svelte context API](https://ru.svelte.dev/docs#setContext).
Имя контекста - `easyrouteContext`. Никогда не переопределяйте его в компонентах!
