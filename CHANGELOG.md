### v3.0.7
* easyroute-core updated to v1.3.5 (fix `from` object issue).

### v3.0.6
* easyroute-core updated to v1.3.4-1;
* introducing `omitTrailingSlash` option;
* route paths fixed in demo-app.

### v3.0.5
* fix: `currentRoute` empty on startup (#26);
* fix: outlet auto-restore after visiting unknown route (#27);
* `currentRoute` prop is deprecated and will be removed in 3.1.0;
* demo-app fix: active menu buttons highlighted.

### v3.0.4
* `easyroute-core` updated to 1.3.3 ([changelog](https://github.com/easyroute-router/easyroute-core/blob/master/CHANGELOG.md#v133)).

### v3.0.3
* `easyroute-core` updated to 1.3.2;
* updated docs (https://github.com/easyroute-router/svelte-easyroute/pull/23).

### v3.0.2
* `easyroute-core` updated to 1.3.1;
* fixed errors when using `base` option;
* passing router as a prop inside RouterOutlet has been removed;
* updated test suites.

### v3.0.1
* Size reducing;
* `easyroute-core` updated to 1.3.0;
* RouterLink now uses `router.push()` method due to `easyroute-core` updates.

### v3.0.0
* SSR is here;
* documentation app translated to russian language

### v2.2.1
* `easyroute-core` updated to 1.2.0: size reducing 
[(see changelog)](https://github.com/lyohaplotinka/easyroute-core/blob/master/CHANGELOG.md#v120)

### v2.2.0
* `easyroute-core` updated to 1.1.0;
* named outlets - use two `RouterOutlet` on a single
page, declare components for them by name;
* individual beforeEnter hooks for routes;
* `useCurrentRoute` hook for easy access to current
route object in every route.

### v2.1.6
* `easyroute-core` updated to 1.0.2;
* fixed premature afterHook trigger with lazy loaded components.

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