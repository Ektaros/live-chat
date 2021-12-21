const Koa = require('koa')
const http = require('http')

const cors = require('@koa/cors')

const app = new Koa()

app.server = http.createServer(app.callback())
app.listen = (...args) => {
  app.server.listen.call(app.server, ...args)
  return app.server
}

app.use(cors())

module.exports = (router, port) => {
  app.use(router.routes()).use(router.allowedMethods())
  return app.server.listen(port, () => console.log('server running on ' + port))
}
