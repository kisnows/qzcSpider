/**
 * @author kisnows
 * @create 2016/8/22.
 */
const db = require('./db.js')
const Schema = db.Schema

const subCommentSchema = new Schema({
  user: String,
  content: String,
  date: Date,
  isDelete: {
    type: String,
    default: false
  }
})

const commentSchema = new Schema({
  user: String,
  content: {
    type: String,
    required: true
  },
  beforeContent: [],
  date: Date,
  isDelete: {
    type: String,
    default: false
  },
  subComment: [subCommentSchema]
})

/**
 * 同一条回复只会存储一条，有变动时，只会原有的基础上更新
 * @params comment {Object} 要存储的回复
 * @params type {String} 用来判断是否存的当前回复的类型
 */
commentSchema.methods.pureSave = function (comment, type = 'date') {
  return new Promise((resolve, reject) => {
    this.model('Comment').findOne({ [type]: comment[type] }, (err, res) => {
      if (err) return reject(err)
      if (res !== null) {
        let resList = []
        let commentList = []
        let shouldSave = false

        res.subComment.forEach((rv, rk) => {
          resList[rk] = rv[type]
        })

        comment.subComment.forEach((v, k) => {
          commentList.push(v[type])
          if (resList.indexOf(v[type]) === -1) {
            res.subComment.push(v)
            shouldSave = true
          }
        })

        resList.forEach((v, k) => {
          if (commentList.indexOf(v) === -1) {
            res.subComment[k].isDelete = true
            shouldSave = true
          }
        })

        shouldSave ?
          res.save((err, comment) => {
            if (err) return reject(err)
            resolve(comment)
          })
          : resolve(comment)
      } else {
        comment.save((err, comment) => {
          if (err) return reject(err)
          resolve(comment)
        })
      }
    })
  })
}

/**
 * Comment Model
 * Comment.pureSave()
 */
const Comment = db.model('Comment', commentSchema)

// const comment = new Comment({
//   user: '你',
//   content: '你好',
//   date: new Date(),
//   subComment: [{
//     user: 'wo',
//     content: '我',
//     date: new Date()
//   }, {
//       user: 'ta',
//       content: '2',
//       date: new Date()
//     }]
// })
//
// comment.pureSave(comment)
//   .then(data => { console.log(data) })
//   .catch(err => console.err(err))


module.exports = Comment
