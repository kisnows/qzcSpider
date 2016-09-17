/**
 * @author hzyuanqi1
 * @create 2016/8/3.
 */
import React from "react";
import {connect} from "react-redux";
import Header from "../components/header";
import Comment from "../components/comment";
import {getAllComment} from "../actions";

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  static defaultProps = {}

  componentDidMount() {
    this.props.dispatch(getAllComment())
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    console.log(123, this.props)
    const {comment} = this.props
    return (
      <div>
        <Header/>
        {comment.map((comment, i)=> {
          return (
            <Comment {...comment} key={i}/>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    comment: state.comment.comments
  }
}

export default connect(
  mapStateToProps
)(App)
