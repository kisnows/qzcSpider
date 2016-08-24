const fs = require('fs')
const getCommentList = require('./controller/parse')
const Comment = require('./db/modal')

fs.readFile('./data/comment.html',(err,data)=>{
  if(err) return console.error(err)
  getCommentList(data.toString())
    .then(commentList=> {
      fs.writeFile('commentList.json',commentList,err=>{
        console.error(err)
      })
      commentList.forEach((v,k)=>{
        const comment = new Comment(v)
        comment.pureSave(comment)
          .then(data=>{
            console.log(data)
          })
          .catch(err=>{
            console.error(err)
          })
      })
    })
    .catch(err=>console.error(err))
})


