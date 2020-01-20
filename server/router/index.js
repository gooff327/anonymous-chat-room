const Router = require('koa-router')

const router = new Router()
const App = require('../index')
router.get('/check_room', (ctx) => {
  if (Object.keys(App.io.sockets.adapter.rooms).some(item => item === ctx.query.name)) {
    ctx.body = { creatable: false }
  } else {
    ctx.body = { creatable: true }
  }
})
module.exports = {
  router
}
