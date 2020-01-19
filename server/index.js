const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const router = require('./router/index').router

const app = new Koa()
const server = require('http').Server(app.callback())

const io = require('socket.io')(server, { 'transports': ['websocket', 'polling'] })
server.listen(3000)

const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'
io.on('connection', onSocketConnected)
exports.io = io
function onSocketConnected (socket) {
  const CLIENT_COUNT = io.sockets.server.engine.clientsCount
  socket.on('getRooms', () => {
    socket.emit('rooms', Object.keys(io.sockets.adapter.rooms).slice(CLIENT_COUNT))
  })
  socket.on('disconnect', () => {
    consola.warn(`${socket.id} has disconnected`)
  })
  socket.on('join', (room) => {
    consola.info(`${socket.id} has joined ROOM__${room}`)
    socket.join(room)
  })
  socket.on('leave', (room) => {
    consola.info(`${socket.id} has leave ROOM__${room}`)
    socket.leave(room)
  })
}

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(router.routes())
    .use(router.allowedMethods())

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  }
  )
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
