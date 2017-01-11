import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import Spinner from '/imports/ui/common/Spinner';
import Indicator from '/imports/ui/common/LoadingIndicator';
import NoFeedback from '/imports/ui/components/NoContent';
import FeedbackList from './FeedbackList';

// collections
import {Feedbacks} from '/imports/api/feedbacks';
import {Organizations} from '/imports/api/organizations/index';
import {Metrics} from '/imports/api/metrics/index';


class FeedbackToLeader extends Component {
  onLoadMoreForLeader = e => {
    e.preventDefault();
    const currentPage = Session.get('FEEDBACK_TO_LEADER_PAGE');
    Session.set('FEEDBACK_TO_LEADER_PAGE', currentPage + 1);
  }

  render() {
    const {ready, page, items, hasMore} = this.props;
    const loaded = ready || page > 1;
    return (
      <div className="row">
        {!loaded && (<Spinner />)}
        {loaded && !!items.length && (
          <div className="">
            <FeedbackList items={items} toLeader={true}/>
            {/* Show loading*/}
            {!ready && page > 1 && (
              <Indicator />
            )}
            {hasMore && (
              <button className="btn btn-primary btn-block" onClick={this.onLoadMoreForLeader}>Load more</button>
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
  if (_.isNaN(page)) page = 1;

  const limit = page * 10,
    option = {
      sort: {date: -1},
      limit: limit
    },
    subOrg = Meteor.subscribe("organizations"),
    sub = Meteor.subscribe('feedbackToLeader', page),
    subMetric = Meteor.subscribe('metrics')
    ;

  let cursor = Feedbacks.find({}, option),
    total = Feedbacks.find({}).count(),
    items = [],
    org = [],
    metrics = []
    ;


  if (total > 0) {
    items = cursor.fetch();
    items.map((feedback, index) => {
      const {planId, leaderId, organizationId, employeeId, metric} = feedback;
      org = Organizations.findOne({_id: feedback.organizationId});
      if (!_.isEmpty(org)) {
        items[index].orgName = org.name;
      }
      metrics = Metrics.findOne({planId, leaderId, organizationId, employeeId, metric});
      if(!_.isEmpty(metrics)) {
        items[index].score = metrics.score;
      }
    });
  }

  return {
    ready: sub.ready(),
    items,
    page,
    hasMore: total > limit
  };
}

export default FeedbackToLeaderContainer = createContainer(withMeteor, FeedbackToLeader);