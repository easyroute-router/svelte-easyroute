const demoApp = require('./ssr/demo-app.ssr').default
const configureEasyrouteSSR = require('../lib/ssr')
const renderer = configureEasyrouteSSR()

async function main() {
  const rendered = await renderer({
    component: demoApp,
    props: {},
    url: '/'
  })
  console.log(rendered)
}

main()
