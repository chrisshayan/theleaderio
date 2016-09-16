import React, { Component, PropTypes } from 'react';
import moment from 'moment';

export default class FeedbackList extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired
  }
  
  getTimeago(date) {
    const threeDaysAgo = moment();
    threeDaysAgo.subtract(3, 'days');
    const m = moment(date);

    if(m.isBefore(threeDaysAgo)) {
      return m.format('MM-DD-YYYY')
    }
    return m.fromNow();
  }

  render() {
    const { items } = this.props;
    return (
      <div>
        {items.map((item, key) => (
          <div key={item._id} className="ibox">
            <div className="ibox-content">
              <h5 style={{textTransform: 'capitalize'}} className="m-b-md">{item.metric}</h5>
              <p>{item.feedback}</p>
              <small>{this.getTimeago(item.date)}</small>
            </div>
          </div>
        ))}
      </div>
    );
  }
}