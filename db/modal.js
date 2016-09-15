/**
 * @author kisnows
 * @create 2016/8/22.
 */
const db = require('./db.js')
const Schema = db.Schema

const subCommentSchema = new Schema({
  userId: Number,
  userName: String,
  userAvatar: String,
  content: String,
  isDelete: {
    type: String,
    default: false
  }
})

const commentSchema = new Schema({
  _id: Number,
  userId: Number,
  userName: String,
  userAvatar: String,
  pic: String,
  content: String,
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
commentSchema.methods.pureSave = function (comment) {
  return new Promise((resolve, reject) => {
    this.model('Comment').findById(comment.id, (err, res) => {
      if (err) return reject(`modal.js 43 error: ${err}`)
      //DONE 根据 ID 做更新，如果留言修改则吧以前的留言放到 beforeContent 中
      if (res.content === '睡不着') {
        debugger
      }
      let shouldSave = false
      if (res !== null) {
        if (res.content !== comment.content) {
          res.beforeContent.push(comment.content)
          shouldSave = true
        }
        if (res.date !== comment.date) {
          res.date = comment.date
          shouldSave = true
        }
        updateSubComment()

        if (shouldSave) {
          res.save((err, comment) => {
            if (err) return reject(`modal.js 62 ${res} save err: ${err}`)
            resolve(comment)
          })
        } else {
          resolve(comment)
        }
        // shouldSave ?
        //   res.update((err, comment) => {
        //     if (err) return reject(err)
        //     resolve(comment)
        //   })
        //   : resolve(comment)

        /**
         * 更新 subComment，如果有新的 comment 则添加进来，如果有删除掉的则标记为已删除
         */
        function updateSubComment() {
          let resSubCommentList = []
          let saveSubCommentList = []
          res.subComment.forEach((v, k) => {
            resSubCommentList[k] = v
          })
          comment.subComment.forEach((v, k) => {
            saveSubCommentList[k] = v
          })
          // 判断 subComment 是否有删掉的
          resSubCommentList.forEach((v, k) => {
            let isDelete = true
            for (const sv of saveSubCommentList) {
              //TODO 判断对象是否相等,暂时用 comment.content 来代替
              if (sv.content === v.content && sv.userId === v.userId) {
                isDelete = false
                break
              }
            }
            if (isDelete) {
              res.subComment[k].isDelete = true
              shouldSave = true
            }
          })
          // 判断是否添加了新的 subComment
          saveSubCommentList.forEach((v, k) => {
            let isHave = true
            //TODO 判断对象是否相等,暂时用 comment.content 来代替
            for (const sv of resSubCommentList) {
              if (sv.content !== v.content && sv.userId !== v.userId) {
                isHave = false
                break
              }
            }
            if (!isHave) {
              res.subComment.push(saveSubCommentList[k])
              shouldSave = true
            }
          })
        }
      } else {
        comment.save((err, comment) => {
          if (err) return reject(`modal.js 120 error:${err}`)
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
