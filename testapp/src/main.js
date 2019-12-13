import "../node_modules/bootstrap/scss/bootstrap.scss";
import "./assets/main.scss";

import App from "./App.svelte";
import Index from "./Index.svelte";
import Test from "./Test.svelte";
import ParamsPlayground from "./ParamsPlayground.svelte";
import Nested from "./Nested.svelte";
import NestedDeep from "./NestedDeep.svelte";
import NestedDeeper from "./NestedDeeper.svelte";

import Router from "../../dist/index";

export var router = new Router({
    base: "", // NOT required
    mode: "hash",
    transition: "xfade",
    routes: [
        {
            path: "/",
            component: Index,
            name: "Index"
        },
        {
            path: "/test*",
            component: Test,
            name: "Test",
            children: [
                {
                    path: "nested*",
                    component: Nested,
                    children: [
                        {
                            path: "deep",
                            component: NestedDeep,
                            children: [
                                {
                                    path: "deeper",
                                    component: NestedDeeper
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            path: "/playground/:param1/params/:param2",
            component: ParamsPlayground,
            name: "ParamsPlayground"
        }
    ]
});

const app = new App({
    target: document.body,
    props: {
        name: "world",
        router
    }
});

window.app = app;

export default app;
