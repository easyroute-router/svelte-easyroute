## CSS-переходы

Использование CSS-переходов в Easyroute - это просто, особенно
если вы работали с Vue.js. К примеру, давайте создадим переход
"fade". Прежде всего, в ГЛОБАЛЬНОМ css файле, создайте следующие
классы:

```css
/* Приложение входит на новую страницу */
.fade-enter {
	opacity: 0;
	transform: translateX(50px);
}

/* Приложение завершило выход со страницы */
.fade-leave-to {
	opacity: 0;
	transform: translateX(50px);
}

/* Начался процесс входа */
.fade-enter-active {
	transition: opacity .2s ease, transform .2s ease;
}

/* Начался процесс выхода */
.fade-leave-active {
	transition: opacity .2s ease, transform .2s ease;
}

/* Приложение вошло в новый маршрут */
.fade-enter-to {
	opacity: 1;
	transform: translateX(0px);
}

/* Приложение начало покидать страницу */
.fade-leave {
	opacity: 1;
	transform: translateX(0px);
}
```

Конечно, вы можете записать это более аккуратно:
```css
.fade-enter, .fade-leave-to {
	opacity: 0;
	transform: translateX(50px);
}
.fade-enter-active, .fade-leave-active {
	transition: opacity .2s ease, transform .2s ease;
}
.fade-enter-to, .fade-leave {
	opacity: 1;
	transform: translateX(0px);
}
```

В этом примере `fade` - название анимации перехода. Каждая
анимация должна иметь имя, так как мы можем использовать 
разные анимации на разных представлениях. 

Теперь вы можете вписать имя в свойство `transition` компонента
представления, который вы хотите анимировать:
```javascript
<RouterOutlet transition={'fade'} />
```

Вот и всё, теперь вы анимированы :)
