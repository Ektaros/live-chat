const Router = require('@koa/router')

const rooms = require('./rooms')
const messages = require('./messages')

const router = new Router()

router.use('/rooms', rooms.routes())
router.use('/messages', messages.routes())

module.exports = router
