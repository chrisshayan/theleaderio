import {Meteor} from 'meteor/meteor';
import React, { Component } from 'react';
import {createContainer} from 'meteor/react-meteor-data';

// collections
import {Measures} from '/imports/api/measures/index';
import {Metrics} from '/imports/api/metrics/index';
import {Feedbacks} from '/imports/api/feedbacks/index';

class Dashboard extends Component {
	render() {
		const {
			loading,
			measures,
			metrics,
			feedbacks
		} = this.props;

		console.log({loading, measures, metrics, feedbacks});

		return (
			<div>
				<h1>Dashboard</h1>
			</div>
		);
	}
}

export default DashboardContainer = createContainer(() => {
	// subscribe
	const
		subMeasures = Meteor.subscribe('measures'),
		subMetrics = Meteor.subscribe('metrics'),
		subFeedbacks = Meteor.subscribe('feedbacks'),
		loading = !(subMeasures.ready() & subMetrics.ready() & subFeedbacks.ready()),
		measures = Measures.find({}).fetch(),
		metrics = Metrics.find({}).fetch(),
		feedbacks = Feedbacks.find({}).fetch()
		;

	console.log(subMeasures.ready())
	console.log(subMetrics.ready())
	console.log(subFeedbacks.ready())

	return {
		loading,
		measures,
		metrics,
		feedbacks
	};
}, Dashboard);