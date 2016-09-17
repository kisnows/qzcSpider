const fs = require('fs')
const fetchHTML = require('./controller/fetchHtml')
const getCommentList = require('./controller/parseHTML')
const Comment = require('./db')
const moment = require('moment')
const start = moment()

function main() {


  // fetchHTML()
  readSpecialFile('./data/comment-2016-9-17.html')
    .then(data=>storeComment(data))
    .then(()=> {
      const end = moment()
      console.log(`Spend ${start.from(end)}`)
    })
    .catch(err=>console.error(`app.js 18, ${err}`))
}

main()

function readSpecialFile(path) {
  return new Promise((resolve, reject)=> {
    fs.readFile(path, (err, data)=> {
      if (err) return reject(`app.js 26 error:${err}`)
      resolve(data)
    })
  })
}
/**
 * 写入格式化后的 JSON 数据
 * @param commentList
 */
function writeParseFile(commentList) {
  let fileName = `./data/comment-${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}.json`
  fs.writeFile(fileName, JSON.stringify(commentList), err=> {
    if (err) console.error(`app.js, writeFile error: ${err}`)
  })
}
/**
 * 存储 comment 到数据库
 * @param data
 */
function storeComment(data) {
  return new Promise((resolve, reject)=> {
    getCommentList(data)
      .then(commentList=> {
        writeParseFile(commentList)
        commentList.forEach((v, k)=> {
          const comment = new Comment(v)
          comment.pureSave(comment)
            .then(()=> {
              if (k === commentList.length - 1) {
                console.log(`Process end,saved ${k} comments`)
                resolve()
                process.exit()
              }
            })
            .catch(err=>reject(`app.js 54 error,${err}`))
        })
      })
      .catch(err=>reject(`app.js 57 error,${err}`))
  })
}
