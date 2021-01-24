## Динамическое сопоставление маршрутов

Svelte Easyroute поддерживает параметры маршрутов. Это 
маршруты, которые имеют динамические сегменты в своём пути
(прямо как в Vue.js). Взгляните на пример:

```javascript
routes: [
  ...
		{
			path: "/playground/:param1/params/:param2",
			component: ParamsPlayground,
			name: "ParamsPlayground"
		}
	]
```

Этот маршрут имеет 4 части: playground, param1, params 
и param2. Здесь "playground" и "params" - статические 
части пути: вы не можете их поменять. Но "param1" и 
"param2" - динамические, так что вы можете использовать их,
чтобы передать какие-либо данные. Доступ к ним вы можете 
получить через объект `currentRoute`.

