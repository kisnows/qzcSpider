/**
 * 抓取展示所有回复的页面，保存下来，并把 html 字符串 resolve 出去
 * @author kisnows
 * @create 2016/8/23.
 */
const fs = require('fs')

const BA = require('./browserAction')
let driverIn
let fileName = `./data/comment-${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}.html`
module.exports = ()=> {
  return new Promise((resolve, reject)=> {
    BA.login()
      .then(driver => BA.goToCommentPage(driver))
      .then(driver => BA.loadAllComment(driver))
      .then(driver => {
        driverIn = driver
        return driver.getPageSource()
      })
      .then(resource => {
        fs.writeFile(fileName, resource,
          err=> {
            if (err) return reject(err)
            driverIn.quit()
            resolve(resource)
          })
      })
      .catch(err => reject(err))
  })
}


