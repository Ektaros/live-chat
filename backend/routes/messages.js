const Router = require('@koa/router')
const { getMessages } = require('../roomsStore')

const router = new Router()

router.get('/', ctx => {
  console.log(ctx.query)
  ctx.body = getMessages(ctx.query.roomId)
})

module.exports = router
