### v2.1.5
* Fixed: unable to use RouterLink outside of RouterOutlet (via EasyrouteProvider, see next);
* EasyrouteProvider component: top-level wrapper for app which provides all required data
for outlets and links;
* added extra 10ms to entering transition for better UX;
* ability to pass extra attributes (classes etc.) to RouterOutlet wrapper element;
* better error throwing;
* deleted extra files from repository (left after v2.1.4);
* DemoApp: github buttons script are connecting in onMount hook.

### v2.1.4-1
* Updated easyroute-core to 1.0.1 (due to modules bug).

### v2.1.4
* Core logic of router is now in separated package - `easyroute-core` [(repo)](https://github.com/lyohaplotinka/easyroute).

### v2.1.3
* Seamless compatibility with both Rollup and Webpack: building router with Rollup now;
* renamed main router export file for TypeScript declarations reasons;
* from now, you can access outlet HTML element in components inside the router-outlet.

### v2.1.1
* Building router with Webpack and ts-loader;
* all dependencies went to dev-dependencies;
* updated directory structure.

### v2.1.0
* Lodash is no longer required;
* fixed possible memory leak.

### v2.0.0
* Completely rewritten code base;
* introducing nested routes;
* one module for both Rollup and Webpack projects;
* unit tests;
* including demo application.