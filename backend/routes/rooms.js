const Router = require('@koa/router')
const { getRooms } = require('../roomsStore')

const router = new Router()

router.get('/', ctx => {
  ctx.body = getRooms()
})

module.exports = router
