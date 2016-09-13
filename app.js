const fs = require('fs')
const fetchHTML = require('./controller/fetchHtml')
const getCommentList = require('./controller/parseHTML')
const Comment = require('./db/modal')

fetchHTML()
  .then(data=>storeComment(data))
  .catch(err=>console.error(err))

/**
 * 存储 comment 到数据库
 * @param data
 */
function storeComment(data) {
  getCommentList(data)
    .then(commentList=> {
      let fileName = `./data/comment-${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}.json`
      fs.writeFile(fileName, JSON.stringify(commentList), err=> {
        console.error(err)
      })
      commentList.forEach((v, k)=> {
        const comment = new Comment(v)
        comment.pureSave(comment)
          .then(()=> {
            if (k === commentList.length - 1) {
              console.log(`Process end,saved ${k} comments`)
              process.exit()
            }
          })
          .catch(err=>console.error(err))
      })
    })
    .catch(err=>console.error(err))
}
