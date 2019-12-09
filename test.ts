import Router from "./src";

let window = {};

let router = new Router({
    routes: [
        {
            path: '/test/:param/test2/:paramtwo'
        }
    ]
});

// console.log(JSON.stringify(router.routes, null, 2));

router.parseRoute('/test/word1/test2/word2?queryparam[]=sobachka&queryparam[]=gusenica&queryparam[]=myach&queryparam[]=straus');
