/**
 * @author kisnows
 * @create 2016/8/22.
 */
const fs = require('fs')
const path = require('path')
const jsdom = require('jsdom').jsdom

fs.readdir('./data',(err,file)=>{
  if(err) return false
  file.forEach((v,k)=>{
    fs.readFile(path.join(`${__dirname}/data/${v}`),(err,data)=>{
      if(err) return console.error(err)
      const jsDocument = jsdom(data.toString(),{})
      const window = jsDocument.defaultView
      const document = window.document
      const inputList = Array.prototype.slice.call(document.querySelectorAll('ui-input'))
      inputList.forEach((k,v)=>{
        console.log(k.getAttribute('placeholder'))
      })
    })
  })
})
