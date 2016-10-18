import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {setPageHeading, resetPageHeading} from '/imports/store/modules/pageHeading';

// collections
import {UserMessages} from '/imports/api/user_messages/index';

// methods
import {setStatus} from '/imports/api/user_messages/methods';

// constants
import {STATUS} from '/imports/api/user_messages/index';

// components
import Spinner from '/imports/ui/common/Spinner';
import Indicator from '/imports/ui/common/LoadingIndicator';
import NoMessage from './NoMessage';
import MessageList from './MessageList';


class Messages extends Component {
  constructor() {
    super();

    Session.setDefault('MESSAGE_PAGE', 1);

    setPageHeading({
      title: 'Messages',
      breadcrumb: [{
        label: 'Messages',
        active: true
      }]
    });

    this.state = {
      ready: false,
      error: ""
    };
  }

  componentWillUnmount() {
    resetPageHeading();
  }

  onLoadMore = e => {
    e.preventDefault();
    const currentPage = Session.get('MESSAGE_PAGE');
    Session.set('MESSAGE_PAGE', currentPage + 1);
  }

  onClickUnReadMessage(messageId) {
      setStatus.call({
        messageId: messageId,
        status: STATUS.READ
      });
  }

  onClickReadMessage(messageId) {
    setStatus.call({
      messageId: messageId,
      status: STATUS.UNREAD
    });
  }

  render() {
    const {ready, page, items, hasMore} = this.props;
    const loaded = ready || page > 1;
    return (
      <div className="row">
        {!loaded && (<Spinner />)}
        {loaded && !!items.length && (
          <div className="col-md-8">
            <MessageList
              items={items}
              onClickUnReadMessage={this.onClickUnReadMessage}
              onClickReadMessage={this.onClickReadMessage}
            />
            {/* Show loading*/}
            {!ready && page > 1 && (
              <Indicator />
            )}
            {hasMore && (
              <button className="btn btn-primary btn-block" onClick={this.onLoadMore}>Load more</button>
            )}
          </div>
        ) }
        {loaded && !items.length && ( <NoMessage /> )}
      </div>
    );
  }
}

const withMeteor = () => {
  let page = parseInt(Session.get('MESSAGE_PAGE'));
  if (_.isNaN(page)) page = 1;
  let sub = Meteor.subscribe('user_messages', page);
  const limit = page * 10;
  const option = {
    sort: {date: -1},
    limit: limit
  };

  let cursor = UserMessages.find({}, option);
  let total = UserMessages.find({}).count();
  return {
    ready: sub.ready(),
    items: cursor.fetch(),
    page,
    hasMore: total > limit
  };
}

export default MessagesContainer = createContainer(withMeteor, Messages);