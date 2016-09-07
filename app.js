const fs = require('fs')
const fetchHTML = require('./controller/fetchHtml')
const getCommentList = require('./controller/parse')
const Comment = require('./db/modal')

// N()
// H()
fetchHTML()
  .then(data=>H(data))
  .catch(err=>console.error(err))

function N() {
  fs.readFile('./data/comment.html', (err, data)=> {
    if (err) return console.error(err)
    getCommentList(data.toString())
      .then(commentList=> {
        fs.writeFile('commentList.json', JSON.stringify(commentList), err=> {
          console.error(err)
        })
        commentList.forEach((v, k)=> {
          const comment = new Comment(v)
          comment.pureSave(comment)
            .then(data=> {
              if (k === commentList.length - 1) {
                console.log(`Save ${k} comments, all comment has saved`)
              }
            })
            .catch(err=> {
              console.error(err)
            })
        })
      })
      .catch(err=>console.error(err))
  })
}

function H(data) {
  getCommentList(data)
    .then(commentList=> {
      fs.writeFile('commentList.json', JSON.stringify(commentList), err=> {
        console.error(err)
      })
      commentList.forEach((v, k)=> {
        const comment = new Comment(v)
        comment.pureSave(comment)
          .then(data=> {
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
