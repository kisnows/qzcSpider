const email = require('../config.js').email
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: email.host,
  secureConnection: true,
  auth: {
    user: email.user,
    pass: email.password
  }
})

module.exports = (content) => {
  transporter.sendMail({
    from: email.user,
    to: email.toUser,
    subject: 'DYQ update',
    text: content || 'Test'
  },(err,res)=>{
    if(err) {
      console.log(err)
      return false
    }else{
      console.log(`Message send: ${res.response}`)
    }
    transporter.close()
  })
}
