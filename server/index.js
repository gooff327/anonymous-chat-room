const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const _ = require('lodash')
const router = require('./router/index').router

const app = new Koa()
const server = require('http').Server(app.callback())

const io = require('socket.io')(server, { 'transports': ['websocket', 'polling'] })
server.listen(3000)

const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'
io.on('connection', onSocketConnected)
exports.io = io
const USER_SOCKET_MAP = {}
function onSocketConnected (socket) {
  socket.on('getRooms', () => {
    consola.info(_.map(io.sockets.adapter.rooms, (item, key) => { return [item.length, key] }))
    socket.emit('rooms', Object.keys(io.sockets.adapter.rooms).filter(item => item.length <= 10))
  })
  socket.on('disconnect', () => {
    consola.warn(`${socket.id} has disconnected`)
  })
  socket.on('join', (room, user) => {
    if (USER_SOCKET_MAP[socket.id] === undefined) {
      USER_SOCKET_MAP[socket.id] = user
    }

    if (io.sockets.adapter.rooms[room] !== undefined) {
      socket.join(room)
      io.to(room).emit('message', { username: user, room, action: 'join', content: null })
      consola.info(`${socket.id} has joined ROOM__${room}`)
    } else {
      socket.join(room)
      consola.info(`${socket.id} create ROOM__${room}`)
      io.sockets.emit('rooms', Object.keys(io.sockets.adapter.rooms).filter(item => item.length <= 10))
    }
  })
  socket.on('message', ({ room, content, username }) => {
    io.to(room).emit('message', { username, room, action: 'default', content })
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
