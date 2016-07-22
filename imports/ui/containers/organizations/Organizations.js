import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { createContainer } from 'meteor/react-meteor-data';
import { Organizations as OrganizationCollection } from '/imports/api/organizations';

import { setPageHeading, resetPageHeading } from '/imports/store/modules/pageHeading';
import { actions as orgActions  } from '/imports/store/modules/organizations';

// Views
import NoOrganization from './NoOrganization';
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
				{!organizations.length && (
					<NoOrganization />
				)}
				{/* Organization list */}
				<div className="row">
					{organizations.map((org, key) => (

						<div className="col-md-4" key={key}>
							<Box title={ org.name } tools={<a className="fa fa-edit" href={org.editUrl()}></a>}>
								<div className="team-members">
									<a href="#" style={{marginRight: '3px'}}><img alt="member" className="img-circle" src="/img/a1.jpg" /></a>
									<a href="#" style={{marginRight: '3px'}}><img alt="member" className="img-circle" src="/img/a2.jpg" /></a>
									<a href="#" style={{marginRight: '3px'}}><img alt="member" className="img-circle" src="/img/a3.jpg" /></a>
									<a href="#" style={{marginRight: '3px'}}><img alt="member" className="img-circle" src="/img/a4.jpg" /></a>
									<a href="#" style={{marginRight: '3px'}}><img alt="member" className="img-circle" src="/img/a5.jpg" /></a>
								</div>
								<h4>Info about { org.name }</h4>
								{/* Description */}
								<p>{ org.description }</p>
								{/* Status of response */}
								<div>
	                <span>Status of current month:</span>
	                <div className="stat-percent">48%</div>
	                <div className="progress progress-mini">
                    <div style={{width: '48%'}} className="progress-bar"></div>
	                </div>
		            </div>
		            {/* Some numbers*/}
								<div className="row  m-t-sm">
									<div className="col-sm-4">
										<div className="font-bold">EMPLOYEES</div>
										{ org.employees ? org.employees.length: 0 }
									</div>
									<div className="col-sm-4">
										<div className="font-bold">FEEDBACK</div>
										23
									</div>
									<div className="col-sm-4 text-right">
										<div className="font-bold">OVERALL</div>
										3.4 <i className="fa fa-level-up text-navy"></i>
									</div>
								</div>
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
