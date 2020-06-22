const express = require('express')
const app = express()
var fallback = require('express-history-api-fallback')
const fs = require('fs')
const path = require('path')

app.use(express.static(path.resolve(__dirname, '../public')))
app.use(fallback('index.html', { root: path.resolve(__dirname, '../public') }))

app.get('*index.html', (req,res) => {
    console.log('test')
})

app.listen(3003)
