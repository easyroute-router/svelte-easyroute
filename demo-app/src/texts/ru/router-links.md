## Ссылки

Чтобы добавить ссылку на другой маршрут, используйте
компонент `RouterLink`.

```javascript
import { RouterLink } from 'svelte-easyroute'
</script>

<RouterLink to={'/route'} />
```

Свойство "to" - это URL, на который вы хотите перейти. 
Вы можете использовать query-параметры, если это необходимо.
