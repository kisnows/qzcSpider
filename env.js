/**
 * @author hzyuanqi1
 * @create 2016/8/4.
 */
module.exports = {
  cdnHost: 'i.epay.126.net',
  cdnPort: process.env.NODE_ENV === 'DEV' ? 3000 : 80,
  cdnPath: 'sparta'
}
