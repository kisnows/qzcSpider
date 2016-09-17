/**
 * @author hzyuanqi1
 * @create 2016/8/3.
 */
import {combineReducers} from "redux";

function comment(state = {
  comments: []
}, action) {
  switch (action.type) {
    case 'GET_COMMENT_SUCCESS':
      return Object.assign({}, state, {
        comments: action.payload.comments
      })
    case 'GET_COMMENT_ERROR':
      return action.payload.msg
    default:
      return state
  }
}

const rootReducer = combineReducers({
  comment
})
export default rootReducer
