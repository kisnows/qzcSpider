/**
 * Created by yq123 on 2016/9/17.
 */
import React, {Component, PropTypes} from "react";
import classNames from "classnames";
import {Link} from "react-router";

const Avatar = (props) => {
  const {userId, userName, userAvatar} = props
  const src = userAvatar.indexOf('http') === -1 ? `https://${userAvatar}` : userAvatar
  return (
    <div className="ui_avatar">
      <Link to={`/userId:${userId}`}>
        <img src={src} alt={userName}/>
      </Link>
    </div>
  )
}

const SubComment = (props) => {
  const {userId, userName, content, isDelete} = props
  const deleteText = isDelete ? '已删除' : ''
  return (
    <div className="ui_subComment">
      <Link to={`/userId:${userId}`}>{userName}</Link>
      <p>{content}</p>
      <span>{deleteText}</span>
    </div>
  )
}

export default class Comment extends React.Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {}

  static defaultProps = {
    beforeContent: [],
    subComment: []
  }

  render() {
    const {_id, userId, userName, userAvatar, pic, content, date, subComment, isDelete, beforeContent, className, showBeforeContent, ...others} = this.props
    const cls = classNames({
      ui_comment: true,
      [className]: className
    })
    const before = beforeContent.map((content, i)=> {
      return (<p key={i}>{content}</p>)
    })
    return (
      <div className={cls} id={_id} {...others}>
        <Avatar userId={userId} userName={userName} userAvatar={userAvatar}/>
        <div>
          <div className="ui_commentHeader"><Link
            to={`/userId:${userId}`}>{userName}</Link><span>{date.toLocaleString()}</span></div>
          <p className="ui_commentContent">{content}</p>
          <div className="ui_commentBeforeContentWrap">{showBeforeContent ? before : null}</div>
          <div className="ui_subCommentWrap">
            {subComment.map((sub, i)=> {
              return (<SubComment {...sub} key={i}/>)
            })}
          </div>
        </div>
      </div>
    )
  }
}

