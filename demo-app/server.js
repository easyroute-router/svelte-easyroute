const express = require('express')
const app = express()
const fs = require('fs')
const demoApp = require('./ssr/demo-app.ssr').default
const renderer = require('../lib/ssr')()

app.use('/', express.static(__dirname + '/public'))

const html = fs.readFileSync(__dirname + '/public/app.html', 'utf8')

function insertRendered(rendered, template) {
  return template
    .replace('{$ HTML $}', rendered.html)
    .replace('{$ STYLES $}', rendered.css.code)
    .replace('{$ HEAD $}', rendered.head)
}

app.get('*', async (req, res) => {
  const rendered = await renderer({
    component: demoApp,
    props: {},
    url: req.url
  })
  const ssrHtml = insertRendered(rendered, html)
  res.send(ssrHtml)
})

app.listen(3456, () => {
  console.log('Svelte Easyroute demo app started!')
})
