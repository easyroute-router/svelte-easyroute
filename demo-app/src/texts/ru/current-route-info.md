## Информация о текущем маршруте
Из каждого дочернего для представления компонента вы 
можете получить доступ к текущему маршруту. Есть два пути:

### 1. Экспортируемая переменная 

Если ваш компонент прямой "ребёнок" `<RouterOutlet>`,
просто поместите это в тег <script>:
```javascript
export let currentRoute
```
И всё! 

#### Пример:
```javascript
{
  "fullPath": "/test/value?name=Alex&age=23",
  "params": {
    "param1": "value"
  },
  "query": {
    "name": "Alex",
    "age": "23"
  },
  "meta": {
    "pageTitle": "Title!"
  }
}
```

### 2. Хук useCurrentRoute
В каждом компоненте, обёрнутом в `<EasyrouteProvider>`, 
на любом уровне вложенности, вы можете использовать хук 
`useCurrentRoute`. Это имплементация паттерна Observable, так
что вы можете "подписаться" на объект текущего маршрута. Вот так:

```html
<script>
    // Component.svelte

    import { useCurrentRoute } from "svelte-easyroute"
    import { onDestroy } from "svelte"
    
    const unsubscribe = useCurrentRoute((currentRoute) => {
        console.log(currentRoute)
    })
    
    onDestroy(unsubscribe)
</script>
```

**Не забудьте** отписаться (`unsubscribe`), когда покидаете 
компонент! Если этого не сделать, возможны утечки памяти.

