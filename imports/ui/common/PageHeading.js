import React, { Component, PropTypes } from 'react';

class PageHeading extends Component {
	propTypes: {
		title: PropTypes.string.isRequired,
		breadcrumb: PropTypes.array
	}

	render() {
		const { title = '', breadcrumb = [], actions = null } = this.props;
		return (
			<div className="row wrapper border-bottom white-bg page-heading">
				<div className="col-md-9">
					<h2>{ title }</h2>
					{breadcrumb.length && (
						<ol className="breadcrumb">
							<li>
								<a href={FlowRouter.url('app.dashboard')}>Home</a>
							</li>
							{breadcrumb.map((bc = {}, key) => (
								<li key={key} className={bc.active ? 'active': null}>
									{bc.active ? (
										<strong>{ bc.label }</strong>
									) : (
										<a href={ bc.route }>{ bc.label }</a>
									)}
								</li>
							))}
						</ol>
					)}
				</div>
				
				<div className="col-md-3 page-heading-actions">
					{actions}
				</div>
			</div>
		);
	}
}

export default PageHeading;
