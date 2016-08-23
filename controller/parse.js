/**
 * Parse Html and get Comment List.
 * @author kisnows
 * @create 2016/8/23.
 */
const fs = require('fs')
const path = require('path')
const jsdom = require('jsdom').jsdom
const moment = require('moment')

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
    const today = moment(new Date())
    const document = window.document
    const commentList = []
    // {
    //  userId: Number,
    //   userName: String,
    //     userAvatar:String,
    //   content: {
    //   type: String,
    //     required: true
    // },
    //   beforeContent: [],
    //     date: Date,
    //   isDelete: {
    //   type: String,
    // default: false
    // },
    //   subComment: [subCommentSchema]
    // }
    //TODO    解析 HTML 中的 comment 内容，并进行格式化后存入到 commentList 中
    //TODO    处理没有 comment 时，Array.from 报错问题
    const itemDomList = Array.from(document.querySelectorAll('#msg-list>item.dataItem'))
    itemDomList.forEach((v, k)=> {

    })

    function parseComment(comment) {
      const imgUrlReg = /url\("\/\/(\S+)"\)/
      const userId = comment.querySelector('.hd>.avatar').dataset.params
      const userName = comment.querySelector('.info>.fn').textContent
      const userAvatar = (()=> {
        // TODO     用正则匹配
        // let imageStr = comment.querySelector('.hd>.avatar>.pic').style['background-image']
        // 格式 "url("//qzonestyle.gtimg.cn/qzone/em/recommendedImages/149.gif?pt=3&ek=1#kp=1&sce=31-0-0")"
        // let url = imageStr.match(/^url\("\/\/(\S)+"\);?$/)
        return `https://qlogo4.store.qq.com/qzone/${userId}/${userId}/100`
      })()
      const content = comment.querySelector('.bd>p').innerHTML
      const pic = comment.querySelector('.bd>p.img').style['background-image'].match(imgUrlReg)[1]
      const createDate = (()=> {
        let dateText = comment.querySelector('.info .time').textContent
        let tmpDate = today
        let date
        switch (dateText) {
          case dateText.length < 6:
            date = moment()
            break
          case dateText.includes('昨天'):
            dateText = dateText.replace('昨天', '')
            date = tmpDate.subtract(1, 'days')
              .set({
                'hour': dateText.split(':')[0],
                'minute': dateText.split(':')[1]
              }).toDate()
            break
          case dateText.includes('前天'):
            dateText = dateText.replace('前天', '')
            date = tmpDate.subtract(2, 'days')
              .set({
                'hour': dateText.split(':')[0],
                'minute': dateText.split(':')[1]
              }).toDate()
            break
          case dateText.includes('月'):
            let matches = /(\d{1,2})月(\d{1,2})日\s+(\d{1,2}):(\d{1,2})/.exec(dateText)
            date = tmpDate.set({
              'year': matches[1],
              'month': matches[2] - 1,
              'hour': matches[3],
              'minute': matches[4]
            }).toString()
            break
          default:
            date = new Date(dateText)
        }
        return date
      })()
      const subComment = (()=> {
        comment.querySelectorAll('.bd>.replys')
      })()
    }

    if (!commentList.length) {
      reject('HTML Parse Error!')
    }
    resolve(commentList)
  })
}

module.exports = function (htmlString) {
  return new Promise((resolve, reject)=> {
    makeDom(htmlString)
      .then(window=>parse(window))
      .then(commentList =>resolve(commentList))
      .then(err=>reject(err))
  })
}
