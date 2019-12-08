import Router from "./src";
let router = new Router({
    routes: [
        {
            path: '/test/:param'
        }
    ]
})
console.log(router);
