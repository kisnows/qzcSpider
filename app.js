const fs = require('fs')

const BA = require('./controller/browserAction')
let driverIn
BA.login()
  .then(driver => BA.goToComment(driver))
  .then(driver => BA.loadAllComment(driver))
  .then(driver => {
    driverIn = driver
    return driver.getPageSource()
  })
  .then(resource => {
    fs.writeFile(`./data/comment-${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}.html`, resource, err=> {
      if (err) return console.log(err)
      driverIn.quit()
        .then(()=>process.exit())
    })
  })
  .catch(err => console.log(err))
