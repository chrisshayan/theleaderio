import React, {Component} from 'react';

export default class IboxContentMetric extends Component {
  render() {
    const {ibcTitle='', ibcContent, classGrid} = this.props;
    return (
      <div className="ibox-content">
        <h5><strong>{ibcTitle}</strong></h5>
        <div className="row">
          {$.map(ibcContent, function (value, key) {
            return (
              <div key={key} className={classGrid}>
                <p className="stats-label">{key}</p>
                <h5>{value}</h5>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}