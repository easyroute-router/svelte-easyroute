## Application Requirements

Svelte Easyroute has three main application requirements:
1. "Universal" code that runs both in the browser and in Node.js;
2. No dynamically imported components in
router configuration;
3. Only "history" router mode supports SSR.

The second condition is due to the fact that dynamic loading
components (for example, in webpack) uses the browser
API for downloading JS files.

**However** if you want to keep this functionality in
client application, you can create a duplicate
file with router settings exclusively for SSR (for example,
"router.ssr.js").