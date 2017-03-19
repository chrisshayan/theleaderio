import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// collections
import {Feedbacks} from '/imports/api/feedbacks';
import {Employees} from '/imports/api/employees/index';
import {Organizations} from '/imports/api/organizations/index';

// components
import Spinner from '/imports/ui/common/Spinner';
import Indicator from '/imports/ui/common/LoadingIndicator';
import NoFeedback from '/imports/ui/components/NoContent';
import FeedbackList from './FeedbackList';


class FeedbackToEmployees extends Component {
  onLoadMore = e => {
    e.preventDefault();
    const currentPage = Session.get('FEEDBACK_TO_EMPLOYEES_PAGE');
    Session.set('FEEDBACK_TO_EMPLOYEES_PAGE', currentPage + 1);
  }

  render() {
    const {ready, page, items, hasMore} = this.props;
    const loaded = ready || page > 1;
    return (
      <div className="row">
        {!loaded && (<Spinner />)}
        {loaded && !!items.length && (
          <div className="">
            <FeedbackList items={items}/>
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
  let
    ready = false,
    page = parseInt(Session.get('FEEDBACK_TO_EMPLOYEES_PAGE'))
    ;
  if (_.isNaN(page)) page = 1;
  let
    sub = Meteor.subscribe('feedbackToEmployee', page),
    subEmployees = Meteor.subscribe("employees"),
    subOrg = Meteor.subscribe("organizations"),
    items = [],
    employee = {},
    org = {}
    ;
  const limit = page * 10;
  const option = {
    sort: {date: -1},
    limit: limit
  };

  ready = sub.ready() & subEmployees.ready() & subOrg.ready();
  let cursor = Feedbacks.find({}, option);
  let total = Feedbacks.find({}).count();

  if (total > 0) {
    items = cursor.fetch();
    items.map((feedback, index) => {
      employee = Employees.findOne({_id: feedback.employeeId});
      if (!_.isEmpty(employee)) {
        items[index].employeeName = `${employee.firstName} ${employee.lastName}`;
      }
      org = Organizations.findOne({_id: feedback.organizationId});
      if (!_.isEmpty(org)) {
        items[index].orgName = org.name;
      }
    });
  }

  return {
    ready,
    items,
    page,
    hasMore: total > limit
  };
}

export default FeedbackToEmployeesContainer = createContainer(withMeteor, FeedbackToEmployees);
