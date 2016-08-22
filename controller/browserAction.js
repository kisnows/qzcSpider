const fs = require('fs')
const config = require('../config')
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const By = webdriver.By
const until = webdriver.until
const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options()
    .setMobileEmulation({deviceName: 'Google Nexus 5'}))
  .build();

let startTime = null
const url = {
  'login': 'http://ui.ptlogin2.qq.com/cgi-bin/login?style=9&pt_ttype=1&appid=549000929&pt_no_auth=1&pt_wxtest=1&daid=5&s_url=https%3A%2F%2Fh5.qzone.qq.com%2Fmqzone%2Findex',
  'comment': `https://h5.qzone.qq.com/mqzone/profile?starttime=${startTime}&hostuin=${config.account.user}#${config.target}/list/msg?res_uin=850146129&starttime=${new Date().getTime()}`
}

function login() {
  return new Promise((resolve, reject) => {
    driver.get(url.login)
      .then(driver.findElement(By.id('guideSkip')).click())
      .then(driver.findElement(By.id('u')).sendKeys(config.account.user))
      .then(driver.findElement(By.id('p')).sendKeys(config.account.password))
      .then(driver.findElement(By.id('go')).click())
      .then(()=> {
        isLoadingComplete(driver, resolve, reject, 'Login')
      })
  })
}

function goToComment(driver) {
  return new Promise((resolve, reject) => {
    driver.wait(until.elementLocated(By.id('nav_bar_main')), 10000).click()
    driver.getCurrentUrl()
      .then(url => {
        try {
          startTime = url.match(/starttime=(\d{1,})/)[2]
        } catch (err) {
          console.log(err)
        }
        return Promise.resolve()
      })
      .then(driver.get(url.comment))
      .then(()=> {
        isLoadingComplete(driver, resolve, reject, 'go to comment page')
      })
  })
}

function loadAllComment(driver) {
  return new Promise((resolve) => {
    const more = driver.wait(until.elementLocated(By.css('p.J_loading')), 10000)
    let timer = null
    let timeout = 3000
    let windowHeight = 0
    driver.executeScript(`document.body.scrollHeight`)
      .then(top => {
        windowHeight = top
      })
      .then(driver.findElement(By.css('.nt-close.js-close-bottom')).click())
      .then(()=> {
        console.log('loading all comment,may need lots of time.')
        timer = setInterval(() => {
          windowHeight = windowHeight * 1.1
          more.findElement(By.css('span')).getText().then(txt => {
            console.log(txt, new Date().getTime())
            if (txt.match(/查看更多/g)) {
              js = `window.scrollTo(0,${windowHeight})`
              driver.executeScript(js)
              driver.wait(more.click(), 10000)
              timeout = Math.random() * (2.5 - 1.5) + 1.5
            } else if (txt.match(/更多內容/g)) {
              clearInterval(timer)
              console.log('loading all comment complete!')
              resolve(driver)
            }
          })
        }, timeout)
      })
  })
}

/**
 * is page loading complete
 * @param driver {Object}
 * @param resolve {Function}
 * @param reject {Function}
 * @param type {String} The action type
 */
function isLoadingComplete(driver, resolve, reject, type) {
  let isLoadingComplete = false
  let timer = setInterval(() => {
    driver.executeScript('return document.readyState')
      .then(result => {
        if (result === 'complete') {
          clearInterval(timer)
          console.log(`${type} complete`)
          isLoadingComplete = true
          resolve(driver)
        }
      })
  }, 300)
  setTimeout(() => {
    if (!isLoadingComplete) {
      reject(`${type} Timeout`)
    }
  }, 10000)
}

module.exports = {
  login,
  goToComment,
  loadAllComment
}
