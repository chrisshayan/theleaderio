import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { createContainer } from 'meteor/react-meteor-data';
import { Organizations as OrganizationCollection } from '/imports/api/organizations';

import { setPageHeading, resetPageHeading } from '/imports/store/modules/pageHeading';
import { actions as orgActions  } from '/imports/store/modules/organizations';

// Views
import Box from '/imports/ui/components/Box';

class Organizations extends Component {
	componentWillMount() {
		const actions = (
			<a href={FlowRouter.url('app.organizations.create')} className="btn btn-primary">
				<i className="fa fa-plus" />
				{' '}
				Create Organization
			</a>
		)

		setPageHeading({
			title: 'Organizations',
			breadcrumb: [{
				label: 'Organizations',
				active: true
			}],
			actions,
		})
	}

	componentWillUnmount() {
		resetPageHeading();
		orgActions.reset();
	}

	_onLoadMore = e => {
		e.preventDefault();
		orgActions.loadMore();
	}

	render() {
		const { isLoading, organizations, hasMore } = this.props;
		return (
			<div className="animated fadeInRight">
				{/* Organization list */}
				<div className="row">
					{organizations.map((org, key) => (

						<div className="col-md-4" key={key}>
							<Box title={ org.name } tools={<a className="fa fa-edit" href={org.editUrl()}></a>}>
								<div className="team-members">
									<a href="#" style={{marginRight: '3px'}}><img alt="member" className="img-circle" src="/img/a1.jpg" /></a>
									<a href="#" style={{marginRight: '3px'}}><img alt="member" className="img-circle" src="/img/a1.jpg" /></a>
									<a href="#" style={{marginRight: '3px'}}><img alt="member" className="img-circle" src="/img/a1.jpg" /></a>
									<a href="#" style={{marginRight: '3px'}}><img alt="member" className="img-circle" src="/img/a1.jpg" /></a>
									<a href="#" style={{marginRight: '3px'}}><img alt="member" className="img-circle" src="/img/a1.jpg" /></a>
								</div>
								<p>{ org.description }</p>
							</Box>
						</div>
					))}
				</div>

				{/* show load more button if has more org*/}
				{ hasMore && (
					<div className="rowardui">
						<div className="col-md-12">
							<button className="btn btn-primary btn-block" onClick={this._onLoadMore}>
							Load more
						</button>
						</div>
					</div>	
				)}
			</div>
		);
	}
}

const mapMeteorToProps = params => {
	const { page, limit, q } = Meteor.AppState.get('organizations');
	let selector = {};
	let option = { 
		limit: limit, 
		skip: 0, 
		sort: { createdAt: -1 } 
	};

	// filter by keyword
	if(!_.isEmpty(q)) {
		selector['$or'] = [
			{ name: {$regex: q, $options: 'i'} }
		];
	}

	const sub = Meteor.subscribe('organizations.list', { page, q });
	const isLoading = !sub.ready();
	const total = OrganizationCollection.find(selector).count();
	const organizations = OrganizationCollection.find(selector, option).fetch();
	
	return {
		isLoading,
		organizations,
		total,
		hasMore: (total > limit),
	};
}

export default createContainer(mapMeteorToProps, Organizations);