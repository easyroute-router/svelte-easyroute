## Introduction to SSR

Server side rendering is a generation
HTML code from Svelte application on the Node.js server side,
allowing you to respond to a browser request with ready-made code.

SSR has many advantages, for example it is better for SEO,
time-to-content metric. SSR topic has been raised more than once
in the context of JavaScript application development.

### Development rules for using SSR

You must understand that your application should behave
it is the same in two environments at once: in the browser and in Node.js.
To do this, you need to take into account the peculiarities of the environments (for example,
Node.js does not have a global Window object).

In other words, you need to write universal code. As
for example, you can look at the sources of this application.

### SSR in Svelte Easyroute

Using this router, you will be able to set up rendering to
server side without too much difficulty. Separate advantage -
availability of navigation hooks in which you can load
data for Svelte components on the server side, and give
the client a ready-made code with data. 