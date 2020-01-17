const Router = require('koa-router')
const consola = require('consola')
const router = new Router()
router.get('/rooms', (ctx) => {
  consola.log('room')
  ctx.body = [1, 2, 3]
})
module.exports = {
  router
}
