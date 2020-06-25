## Programmatic navigation

If you have access to route object in your component,
you can use its `push` method to navigate to another
page. 

**Important:** in version 2.0.0 only string literal
is supported

```javascript
// SomeComponent.svelte
<script>
    export let router;
    router.push('/home');
</script>
```