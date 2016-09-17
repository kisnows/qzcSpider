/**
 * @author hzyuanqi1
 * @create 2016/8/3.
 */
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config')
const config = require('./env')
const db = require('./db')
const app = express()
const port = 3000

const compiler = webpack(webpackConfig)

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true
  }
}))

app.use(webpackHotMiddleware(compiler))

app.get('/api/getComments', (req, res) => {
  db.find({}, null, {sort: {_id: -1}}, (err, comments)=> {
    if (err) return res.send(err)
    console.log(comments)
    res.json(comments.sort)
  })
})

// 对于所有的请求全部返回 index.html，又 react-route 来控制路由
// app.get('*', (req, res)=> {
//   res.sendFile(path.join(webpackConfig.output.publicPath, 'dist/index.html'))
// })


app.listen(port, err => {
  if (err) {
    console.error(err)
  } else {
    console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
  }
})
