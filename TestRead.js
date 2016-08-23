/**
 * @author kisnows
 * @create 2016/8/22.
 */
const fs = require('fs')
const path = require('path')
const jsdom = require('jsdom').jsdom

const getCommentList = require('./controller/parse')

getCommentList()
  .then(data=>console.log(data))

