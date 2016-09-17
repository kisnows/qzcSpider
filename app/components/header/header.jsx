/**
 * Created by yq123 on 2016/9/17.
 */
import React, {Component, PropTypes} from "react";
import classNames from "classnames";
import {Link} from "react-router";

export default class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {}

  static defaultProps = {}

  render() {
    const {className, ...others} = this.props
    const cls = classNames({
      ui_header: true,
      [className]: className
    })
    return (
      <header {...others} className={cls}>
        <h1><Link to="\">DYQ</Link></h1>
        {this.props.children}
      </header>
    )
  }
}
