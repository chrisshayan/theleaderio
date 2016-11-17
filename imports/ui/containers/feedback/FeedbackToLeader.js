import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {Feedbacks} from '/imports/api/feedbacks';
import Spinner from '/imports/ui/common/Spinner';
import Indicator from '/imports/ui/common/LoadingIndicator';
import NoFeedback from '/imports/ui/components/NoContent';
import FeedbackList from './FeedbackList';


class FeedbackToLeader extends Component {
  onLoadMore = e => {
    e.preventDefault();
    const currentPage = Session.get('FEEDBACK_TO_LEADER_PAGE');
    Session.set('FEEDBACK_TO_LEADER_PAGE', currentPage + 1);
  }

  render() {
    const { ready, page, items, hasMore } = this.props;
    const loaded = ready || page > 1;
    return (
      <div className="row">
        {!loaded && (<Spinner />)}
        {loaded && !!items.length && (
          <div className="col-md-8">
            <FeedbackList items={items} />
            {/* Show loading*/}
            {!ready && page > 1 && (
              <Indicator />
            )}
            {hasMore && (
              <button className="btn btn-primary btn-block" onClick={this.onLoadMore}>Load more</button>
            )}
          </div>
        ) }
        {loaded && !items.length && ( <NoFeedback icon="fa fa-comments-o" message="There is no feedback."/> )}
      </div>
    );
  }
}

const withMeteor = () => {
  let page = parseInt(Session.get('FEEDBACK_TO_LEADER_PAGE'));
  if(_.isNaN(page)) page = 1;
  let sub = Meteor.subscribe('feedbacks', page);
  const limit = page * 10;
  const option = {
    sort: {date: -1},
    limit: limit
  };

  let cursor = Feedbacks.find({type: {$not: /LEADER_TO_EMPLOYEE/}}, option);
  let total = Feedbacks.find({type: {$not: /LEADER_TO_EMPLOYEE/}}).count();
  return {
    ready: sub.ready(),
    items: cursor.fetch(),
    page,
    hasMore: total > limit
  };
}

export default FeedbackToLeaderContainer = createContainer(withMeteor, FeedbackToLeader);