/**
 * Created by hzyuanqi1 on 2016/9/8.
 */
import React from "react";
import classNames from "classnames";
import "./button.scss";

export default class Button extends React.Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    disabled: React.PropTypes.bool,
    type: React.PropTypes.string,
    size: React.PropTypes.string
  }

  static defaultProps = {
    disabled: false,
    type: 'primary',
    size: 'normal'
  }

  render() {
    const {type, size, disabled, className, children, ...others} = this.props
    const Component = this.props.href ? 'a' : 'button'
    const cls = classNames({
      ui_button: true,
      ui_button_primary: type === 'primary',
      ui_button_secondary: type === 'secondary',
      ui_button_warn: type === 'warn',
      ui_button_mini: size === 'small',
      ui_button_disabled: typeof disabled !== 'undefined',
      [className]: className
    })
    return (
      <Component {...others} className={cls} disabled={disabled}>
        {children}
      </Component>
    )
  }
}
