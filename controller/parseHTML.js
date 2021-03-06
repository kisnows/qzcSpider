/**
 * Parse Html and return a Promise can that get Comment List.
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
    console.log('Start make dom')
    if (htmlString) {
      const jsDocument = jsdom(htmlString.toString(), {})
      const window = jsDocument.defaultView
      resolve(window)
    } else {
      //根据文件名，找到最新的文件（comment-2016-8-21.html）
      fs.readdir('./data', (err, file)=> {
        if (err) return false
        let latestFile = file.length ? file[0] : null
        let createdDate
        let tmp = new Date(0)
        file.forEach((v, k)=> {
          //拿到创建时间
          createdDate = new Date(v.match(/comment-([\d]{4}-[\d]{1,2}-[\d]{2})\.html/)[1])
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
          if (err) return reject(`parseHTML.js 43 error: ${err}`)
          const jsDocument = jsdom(data.toString(), {})
          const window = jsDocument.defaultView
          resolve(window)
          console.log('End make dom')
        })
      })
    }
  })
}

/**
 * 解析 HTML 字符串，返回一个 Promise，用来获得一个包含所有 comment 的列表
 * @param window
 * @returns {Promise}
 */
function parse(window) {
  return new Promise((resolve, reject)=> {
    console.log('start parse')
    const today = moment(new Date())
    const document = window.document
    const commentList = []
    const itemDomList = Array.from(document.querySelectorAll('#msg-list>.item.dataItem') || [])
    itemDomList.forEach((v)=> {
      commentList.push(parseComment(v))
    })

    /**
     * 解析每一条 comment ，并返回格式化后的数据
     * @param comment {Object} 要处理的回复 DOM 对象
     * @returns {{userId: *, userName, userAvatar, pic: *, content, date, subComment}}
     */
    function parseComment(comment) {
      const imgUrlReg = /url\("?\/\/(\S+)"?\)/
      const _id = comment.getAttribute('data-params').match(/id=(\d+)&uin/)[1]
      const userId = comment.querySelector('.hd>.avatar').getAttribute('data-params')
      const userName = comment.querySelector('.info>.fn').textContent
      const userAvatar = (()=> {
        let imageStr = comment.querySelector('.hd>.avatar>.pic').style['background-image']
        // 格式 "url("//qzonestyle.gtimg.cn/qzone/em/recommendedImages/149.gif?pt=3&ek=1#kp=1&sce=31-0-0")"
        let url = imageStr.match(imgUrlReg)
        return url ? url[1] : `qlogo4.store.qq.com/qzone/${userId}/${userId}/100`
      })()
      const pic = (()=> {
        let imgTag = comment.querySelector('.bd>p.img')
        let picUrl = null
        if (imgTag) {
          let urlStr = comment.querySelector('.bd>p.img').style['background-image']
          picUrl = urlStr.match(imgUrlReg) ? urlStr.match(imgUrlReg)[1] : null
        }
        return picUrl
      })()
      const content = comment.querySelector('.bd>p').innerHTML
      const date = (()=> {
        let dateText = comment.querySelector('.info .time').textContent
        let tmpDate = today
        let date
        if (dateText.length < 6) {
          date = moment()
        } else if (dateText.includes('昨天')) {
          dateText = dateText.replace('昨天', '').trim()
          date = tmpDate.subtract(1, 'days')
            .set({
              'hour': dateText.split(':')[0],
              'minute': dateText.split(':')[1]
            }).toDate()
        } else if (dateText.includes('前天')) {
          dateText = dateText.replace('前天', '').trim()
          date = tmpDate.subtract(2, 'days')
            .set({
              'hour': dateText.split(':')[0],
              'minute': dateText.split(':')[1]
            }).toDate()
        } else if (dateText.includes('月')) {
          let matches = /(\d{1,2})月(\d{1,2})日\s+(\d{1,2}):(\d{1,2})/.exec(dateText)
          date = tmpDate.set({
            'year': new Date().getFullYear(),
            'month': matches[1] - 1,
            'day': matches[2],
            'hour': matches[3],
            'minute': matches[4]
          }).toDate()
        } else {
          date = new Date(dateText)
        }
        return date
      })()
      //格式 [{userId:'60******',userName:'你的微笑',content:'你的微笑的内容'}]
      const subComment = (()=> {
        let subList = []
        let replys = comment.querySelectorAll('.bd>.replys p')
        if (replys.length) {
          Array.from(replys).forEach((v)=> {
            let userId = v.querySelector('a').getAttribute('data-params')
            let userName = v.querySelector('a').textContent
            let content = v.textContent.replace(userName, '')
            subList.push({
              userId,
              userName,
              content
            })
          })
        }
        return subList
      })()
      return {
        _id,
        userId,
        userName,
        userAvatar,
        pic,
        content,
        date,
        subComment
      }
    }

    if (!commentList.length) {
      reject('HTML Parse Error!')
    }
    resolve(commentList)
    console.log('Parse ending')
  })
}

module.exports = function (htmlString) {
  return new Promise((resolve, reject)=> {
    makeDom(htmlString)
      .then(window=>parse(window))
      .then(commentList => {
        let fileName = `./data/comment-${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}.json`
        fs.writeFile(fileName, JSON.stringify(commentList), err=> {
          if (err) console.error(`fetchHtml.js 175 error: ${err}`)
        })
        resolve(commentList)
      })
      .catch(err=>reject(`fetchHtml.js 179 error: ${err}`))
  })
}
