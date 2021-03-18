## Информация о текущем маршруте
Из каждого дочернего для представления компонента вы 
можете получить доступ к текущему маршруту.

В каждом компоненте, обёрнутом в `<EasyrouteProvider>`,
на любом уровне вложенности, вы можете использовать хук
`useCurrentRoute`. Это имплементация паттерна Observable, так
что вы можете "подписаться" на объект текущего маршрута. Вот так:

```html
<script>
    // Component.svelte

    import useCurrentRoute from "svelte-easyroute/useCurrentRoute"
    import { onDestroy } from "svelte"
    
    const unsubscribe = useCurrentRoute((currentRoute) => {
        console.log(currentRoute)
    })
    
    onDestroy(unsubscribe)
</script>
```

**Не забудьте** отписаться (`unsubscribe`), когда покидаете
компонент! Если этого не сделать, возможны утечки памяти.

