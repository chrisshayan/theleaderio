import React, {Component, PropTypes} from 'react';
import moment from 'moment';

export default class FeedbackList extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired
  }

  getTimeago(date) {
    const threeDaysAgo = moment();
    threeDaysAgo.subtract(3, 'days');
    const m = moment(date);

    if (m.isBefore(threeDaysAgo)) {
      return m.format('MM-DD-YYYY')
    }
    return m.fromNow();
  }

  render() {
    const
      {items, toLeader = false} = this.props
      ;

    return (
      <div className="table-responsive">
        <table className="table table-hover issue-tracker">
          <thead>
            <tr>
              <th>{toLeader ? "Metric" : "Employee"}</th>
              <th>Organization</th>
              {toLeader && (
                <th>Score</th>
              )}
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
          {items.map((item, key) => (
            <tr key={item._id}>
              <td>
                <span className="label label-primary" style={{textTransform: 'capitalize'}}>
                  {toLeader ? item.metric : item.employeeName}
                  </span>
              </td>
              <td>
                {item.orgName}
              </td>
              {toLeader && (
                <td>{item.score}</td>
              )}
              <td className="issue-info">
                {item.feedback}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    );
  }
}