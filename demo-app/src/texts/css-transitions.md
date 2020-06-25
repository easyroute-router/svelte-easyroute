## CSS transitions

Using CSS transitions in Easyroute is pretty easy, 
especially if you worked with Vue.js 
before. For example, let's create "fade" transition. 
First of all, in a GLOBAL css file (note: you **NEED** 
to use a **globally included CSS file**) create the 
following classes:

```css
/* State when app enters a new page */
.fade-enter {
	opacity: 0;
	transform: translateX(50px);
}

/* State when app finished going out from the route */
.fade-leave-to {
	opacity: 0;
	transform: translateX(50px);
}

/* This class applies when entering process is on */
.fade-enter-active {
	transition: opacity .2s ease, transform .2s ease;
}

/* This class applies when leaving process is on
.fade-leave-active {
	transition: opacity .2s ease, transform .2s ease;
}

/* State when app finished going in new route */
.fade-enter-to {
	opacity: 1;
	transform: translateX(0px);
}

/* State when app starts to leave a page */
.fade-leave {
	opacity: 1;
	transform: translateX(0px);
}
```

Of course, you can write it in more accurate way:
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

In this example `fade` is the name of transition. 
Every transition should have name because we can 
use different transitions on different outlets.

Now you can put this name inside `transition` property
of outlet which you would like to animate:
```javascript
<RouterOutlet transition={'fade'} />
```

That's all, now you're animated :)
