const SockerServer = require('./socketServer')
const HttpServer = require('./httpServer')
const router = require('./routes')
const events = require('./events')

const PORT = 1234

const http = HttpServer(router, PORT)

SockerServer(http, events)
