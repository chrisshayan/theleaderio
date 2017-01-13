import React, {Component} from 'react';

export class Alert extends Component {
  render() {
    const
      // type: ["info", "success", "warning", "danger"]
      {type = 'info', isDismissable = true, content = () => null} = this.props,
      alertClass = `alert alert-${type} ${isDismissable ? 'alert-dismissable' : ''}`
      ;

    return (
      <div className={alertClass}>
        {isDismissable && (
          <button aria-hidden="true" data-dismiss="alert" className="close" type="button">×</button>
        )}
        {content()}
      </div>
    );
  }
}