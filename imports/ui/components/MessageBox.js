import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {FlowRouter} from 'meteor/kadira:flow-router';

// collections
import {UserMessages} from '/imports/api/user_messages/index';

// methods
import {setStatus} from '/imports/api/user_messages/methods';

// constants
import {STATUS} from '/imports/api/user_messages/index';

// components
import NavBox from '/imports/ui/components/NavBox';

class MessageBox extends Component {
  render() {
    const
      {
        totalMess = 0,
        messages = []
      } = this.props,
      messageBox = {
        icon: "fa fa-envelope",
        label: "label label-warning",
        labelContent: totalMess,
        mediaBody: messages,
        readMore: {
          url: FlowRouter.url("app.messages"),
          icon: "fa fa-envelope",
          message: "Read All Messages"
        },
        onClickMedia: (mediaId) => {
          setStatus.call({
            messageId: mediaId,
            status: STATUS.READ
          });
        }
      }
      ;

    return (
      <NavBox
        icon={messageBox.icon}
        label={messageBox.label}
        labelContent={messageBox.labelContent}
        mediaBody={messageBox.mediaBody}
        readMore={messageBox.readMore}
        onClickMedia={messageBox.onClickMedia}
      />
    );
  }
}

export default MessageBoxContainer = createContainer(({params}) => {
  const
    userId = Meteor.userId(),
    sub = Meteor.subscribe('user_messages'),
    ready = sub.ready(),
    limit = 3
    ;
  let
    totalMess = 0,
    messages = [],
    query = {},
    options = {}
    ;

  query = {
    userId,
    status: STATUS.UNREAD
  };
  options = {
    sort: {date: -1},
    limit
  };
  totalMess = UserMessages.find(query).count();
  if (totalMess > 0) {
    messages = UserMessages.find(query, options).fetch();
  }

  return {
    totalMess,
    messages
  };

}, MessageBox);