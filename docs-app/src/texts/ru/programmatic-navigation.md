## Программная навигация

Если у вас есть доступ к объекту роутера, вы можете 
использовать его метод `push`, чтобы перейти на другой
маршрут.

```javascript
// SomeComponent.svelte
<script>
    export let router;
    router.push('/home');
</script>
```