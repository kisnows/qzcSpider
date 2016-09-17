/**
 * @author kisnows
 * @create 2016/8/22.
 */
const mongoose = require('mongoose')
const DB_URL = require('../config').dbUrl
mongoose.Promise = global.Promise
mongoose.connect(DB_URL)
const db = mongoose.connection

db.once('open', () => {
  console.log('MongoDB Opened')
})
db.on('close', () => {
  console.log('MongoDB closed')
})
db.on('error', err => {
  console.error(`db error: ${err}`)
})

module.exports = mongoose
