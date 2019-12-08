import Router from "./src";

let window = {};

let router = new Router({
    routes: [
        {
            path: '/test/:param/test2/:suka'
        }
    ]
});

// console.log(JSON.stringify(router.routes, null, 2));

router.parseRoute('/test/gay/test2/malchik');
