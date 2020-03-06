const process = require('process')

const mongoose = require('mongoose')
const consola = require('consola')
exports.connectDatabase = () => {
  const url = process.env.NODE_ENV === 'production'
    ? `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@database:27017/chat`
    : 'mongodb://gooff:gooff@127.0.0.1:27017/chat'
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
}
