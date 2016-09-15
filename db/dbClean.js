/**
 * Created by yq123 on 2016/9/14.
 * 对 subComment 去重
 */
const comment = require('./index')

comment.find({}, (err, res)=> {
  if (err) return console.error(err)
  let sum = 0
  res.forEach((v, k)=> {
    let subComments = v.subComment
    let contentList = []
    let contentHash = {}
    subComments.forEach((sv, sk)=> {
      if (!contentHash[sv.content] && sv.content) {
        contentHash[sv.content] = 1
        contentList.push(sv)
      }
    })
    v.subComment = contentList
    v.save((err, sres)=> {
      if (err) console.error(`${v} save ${err}`)
      sum += 1
      if (sum >= res.length - 1) {
        console.log('subComment 去重成功！')
        process.exit()
      }
    })
  })
})
