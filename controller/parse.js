/**
 * Parse Html and get Comment List.
 * @author kisnows
 * @create 2016/8/23.
 */
const fs = require('fs')
const path = require('path')
const jsdom = require('jsdom').jsdom

makeDom()
  .then(window=>parse(window))
  .then(commentList => module.exports = commentList)
  .catch(err=>console.error('Error', err))

/**
 * 创建 DOM 对象，如果有 data 则以 data 为数据创建，否则直接从 data 目录下面读取最新的 html 文件
 * @param htmlString {String|optional} 用来创建 DOM 对象的 HTML 字符串
 * @returns {Promise}
 */
function makeDom(htmlString) {
  return new Promise((resolve, reject)=> {
    if (htmlString) {
      const jsDocument = jsdom(htmlString.toString(), {})
      const window = jsDocument.defaultView
      resolve(window)
    } else {
      fs.readdir('./data', (err, file)=> {
        if (err) return false
        let latestFile = file.length ? file[0] : null
        let createdDate
        let tmp = new Date(0)
        file.forEach((v, k)=> {
          createdDate = new Date(v.match(/^comment-([\d]{4}-[\d]{2}-[\d]{2}).html$/)[1])
          if (k === 0) {
            latestFile = v
          } else {
            if (createdDate > tmp) {
              tmp = createdDate
              latestFile = v
            }
          }
        })
        fs.readFile(path.join(`${__dirname}`, '../', `/data/${latestFile}`), (err, data)=> {
          if (err) return reject(err)
          const jsDocument = jsdom(data.toString(), {})
          const window = jsDocument.defaultView
          resolve(window)
        })
      })
    }
  })
}

function parse(window) {
  return new Promise((resolve, reject)=> {
    const document = window.document
    const commentList = [1, 2, 3, 4]
    //TODO    解析 HTML 中的 comment 内容，并进行格式化后存入到 commentList 中
    if (!commentList.length) {
      reject('HTML Parse Error!')
    }
    resolve(commentList)
  })
}

module.exports = function () {
  return new Promise((resolve, reject)=> {
    makeDom()
      .then(window=>parse(window))
      .then(commentList =>resolve(commentList))
      .then(err=>reject(err))
  })
}
