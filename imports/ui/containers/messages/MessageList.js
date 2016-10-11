import React, {Component, PropTypes} from 'react';
import moment from 'moment';

import {STATUS} from '/imports/api/user_messages/index';

export default class MessageList extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired
  }

  render() {
    const {items} = this.props;

    return (
      <div>
        {items.map((item, key) => (
          <div key={item._id} className="vote-item">
            {(item.status === STATUS.READ) ? (
              <div className="row">
                <div className="col-md-10">
                  <a href="#" className="vote-title">
                    {item.message.name}
                    <br/>
                    {item.message.detail}
                  </a>
                  <div className="vote-info">
                    <i className="fa fa-clock-o"></i> <a href="#">{"on "}{moment(item.date).format('MMMM Do, YYYY')}</a>
                  </div>
                </div>
                <div className="col-md-2 ">
                  <div className="vote-icon"
                       onClick={() => {
                         this.props.onClickReadMessage(item._id);
                       }}
                  >
                    <i className="fa fa-envelope-o"></i>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-10">
                  <a href="#" className="vote-title">
                    <strong>{item.message.name}</strong>
                    <br/>
                    {item.message.detail}
                  </a>
                  <div className="vote-info">
                    <i className="fa fa-clock-o"></i> <a href="#">{"on "}{moment(item.date).format('MMMM Do, YYYY')}</a>
                  </div>
                </div>
                <div className="col-md-2 ">
                  <div className="vote-icon"
                       onClick={() => {
                         this.props.onClickUnReadMessage(item._id);
                       }}
                  >
                    <i className="fa fa-envelope"></i>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}