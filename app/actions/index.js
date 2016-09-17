/**
 * @author hzyuanqi1
 * @create 2016/8/3.
 */

export function getAllComment() {
  return (dispatch, getState)=> {
    fetch('/api/getComments')
      .then(res => res.json())
      .then(
        res => dispatch({
          type: 'GET_COMMENT_SUCCESS',
          payload: {
            comments: res
          }
        })
      )
      .catch(
        err => dispatch({
          type: 'GET_COMMENT_ERROR',
          payload: {
            'msg': err
          }
        })
      )
  }
}
