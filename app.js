const fs = require('fs')
const fetchHTML = require('./controller/fetchHtml')
const getCommentList = require('./controller/parse')

fetchHTML()
  .then(getCommentList)
