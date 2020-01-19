const Router = require('koa-router')
const consola = require('consola')

const router = new Router()
const App = require('../index')
router.get('/check_room', (ctx) => {
  consola.info(ctx.query.name, Object.keys(App.io.sockets.adapter.rooms))
  consola.log(Object.keys(App.io.sockets.adapter.rooms).some(item => item === 'public***' + ctx.query.name))
  if (Object.keys(App.io.sockets.adapter.rooms).some(item => item === 'public***' + ctx.query.name)) {
    ctx.body = { creatable: false }
  } else {
    ctx.body = { creatable: true }
  }
})
module.exports = {
  router
}
