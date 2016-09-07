import React, {Component} from 'react';

export default class IboxDashboard extends Component {
  render() {
    const
      {
        interval = "",
        label = "",
        content = "",
        description = ""
      } = this.props
      ;

    return (
      <div className="ibox float-e-margins">
        <div className="ibox-title">
          <span className="label label-info pull-right">{interval}</span>
          <h5>{label}</h5>
        </div>
        <div className="ibox-content">
          <h1 className="no-margins">{content}</h1>
          <small>{description}</small>
        </div>
      </div>
    );
  }
}