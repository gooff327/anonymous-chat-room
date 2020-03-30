const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const _ = require('lodash')
const cors = require('koa-cors')
const { connectDatabase } = require('./models/index')
const router = require('./router/index').router

const app = new Koa()
app.use(cors())
//connectDatabase()
const server = require('http').Server(app.callback())

const io = require('socket.io')(server, { 'transports': ['websocket', 'polling'] })
server.listen(3000)

const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'
io.on('connection', onSocketConnected)
exports.io = io
const USER_SOCKET_MAP = {}
const roomFilter = () => {
  const ROOMS = []
  _.map(io.sockets.adapter.rooms, ({ length, sockets }, name) => {
    if (name.length <= 10) {
      ROOMS.push({ name, length, members: _.map(sockets, (_, key) => USER_SOCKET_MAP[key]) })
    }
  })
  consola.error(ROOMS)
  return ROOMS
}
function onSocketConnected (socket) {
  socket.on('submitUsername', (name) => {
    USER_SOCKET_MAP[socket.id] = name
  })
  socket.on('getRooms', () => {
    socket.emit('rooms', roomFilter())
  })
  socket.on('disconnect', () => {
    consola.warn(`${socket.id} has disconnected`)
  })
  // JOIN ROOM
  socket.on('join', (room, user) => {
    if (USER_SOCKET_MAP[socket.id] === undefined) {
      USER_SOCKET_MAP[socket.id] = user || socket.id
    }
    if (io.sockets.adapter.rooms[room] !== undefined) {
      socket.join(room)
      io.to(room).emit('message', { username: user, room, action: 'JOIN', content: null })
      const ROOM = {
        name: room,
        length: io.sockets.adapter.rooms[room].length,
        members: _.map(io.sockets.adapter.rooms[room].sockets, (_, key) => USER_SOCKET_MAP[key]) }
      io.to(room).emit('rooms::update', ROOM)
    } else {
      socket.join(room)
      consola.info(`${socket.id} create ROOM__${room}`)
      io.sockets.emit('rooms', roomFilter())
    }
  })

  socket.on('message', ({ room, content, username }) => {
    io.to(room).emit('message', { username, room, action: 'DEFAULT', content })
  })
  socket.on('leave', (room, user) => {
    const ROOM = {
      name: room,
      length: io.sockets.adapter.rooms[room].length - 1,
      members: _.map(io.sockets.adapter.rooms[room].sockets, (_, key) => USER_SOCKET_MAP[key])
    }
    ROOM.members.splice(ROOM.members.indexOf(USER_SOCKET_MAP[socket.id]), 1)
    io.to(room).emit('rooms::update', ROOM)
    socket.leave(room)
    io.to(room).emit('message', { username: user, room, action: 'LEAVE', content: null })
  })
}

async function start () {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || 'localhost',
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
  consola.info(host, port)
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
