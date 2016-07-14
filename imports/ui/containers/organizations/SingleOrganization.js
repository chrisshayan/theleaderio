import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import moment from 'moment';
import { Organizations } from '/imports/api/organizations/index';
import * as Actions from '/imports/api/organizations/methods';

import {ScrollBox, FastTrack} from 'react-scroll-box'; // ES6


// import views
import Box from '/imports/ui/components/Box';
import FormInput from '/imports/ui/components/FormInput';
import HrDashed from '/imports/ui/components/HrDashed';
import DatePicker from '/imports/ui/components/DatePicker';

// import actions
import { setPageHeading, resetPageHeading } from '/imports/store/modules/pageHeading';

class SingleOrganization extends Component {

	constructor(props) {
		super(props);

		// initial time
		const endTime = moment();
		const startTime = endTime.clone();
		startTime.subtract(1, 'year');

		this.state = {
			doc: {
				name: '',
				description: '',
				startTime: startTime.toDate(),
				endTime: endTime.toDate(),
				isPresent: false,
			},
			error: {}
		};

		// Setup page heading
		let title = 'Create new organization';
		if (props._id)
			title = 'Update organization';
		let breadcrumb = [{
			label: 'Organizations',
			route: FlowRouter.url('app.organizations')
		}, {
			label: title,
			active: true
		}];
		setPageHeading({ title, breadcrumb });
	}

	componentWillUnmount() {
		resetPageHeading();
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEqual(nextProps.doc, this.state.doc)) {
			const updateFields = ['name', 'description', 'startTime', 'endTime', 'isPresent'];
			const newDoc = _.pick(nextProps.doc, ...updateFields);
			const doc = _.extend(this.state.doc, newDoc);
			this.setState({ doc });
		}
	}

	componentDidMount() {
		console.log($('.client-list'));

		$('.client-list').slimscroll({
      height: '500px'
    });
	}

	/**
	 * @event
	 * Form submit
	 */
	_onSubmit = e => {
		e.preventDefault();

		const { _id, onSave, onSaveSuccess } = this.props;
		let data = this.state.doc;

		// add _id to request data if this is update request
		if (_id) {
			data = {
				...data,
				_id
			};
		}

		onSave.call(data, (err, result) => {
			if (err) {
				let details = [];
				let error = {};
				try {
					if (err.details) {
						details = JSON.parse(err.details);
						_.each(details, e => error[e.name] = ' ');
					} else {
						error.GENERAL = err.reason;
					}
				} catch (e) {
					console.log(e)
				}

				this.setState({ error });
			} else {
				onSaveSuccess();
			}
		});
	}

	/**
	 * @event
	 * On click delete button
	 */
	_onClickDelete = e => {
		e.preventDefault();
		const { _id, onRemove, onSaveSuccess } = this.props;
		onRemove.call({ _id }, (err, result) => {
			if (err) {
				this.setState({ error: { GENERAL: err.reason } });
			} else {
				onSaveSuccess();
			}
		});
	}

	render() {
		const { doc, error } = this.state;
		const { _id, isLoading, onCancel } = this.props;
		if (isLoading) return <h1>Loading...</h1>;

		return (
			<div className="col-md-8">
				<Box>
					<h2>Organization</h2>
					<div />
					<ul className="nav nav-tabs" style={{marginBottom: '20px'}}>
						<li className="active"><a data-toggle="tab" href="#tab-1"><i className="fa fa-info-circle"></i> Information</a></li>
            <li className=""><a data-toggle="tab" href="#tab-2"><i className="fa fa-users"></i> Employees</a></li>
          </ul>

          <div className="tab-content">
          	<div id="tab-1" className="tab-pane active">
          		<form onSubmit={this._onSubmit}>
								<FormInput 
									label="Name" 
									placeholder="name" 
									value={doc.name}
									onChangeText={name => this.setState({doc: {...doc, name}})}
									error={error.name}
								/>
								<HrDashed />
								<FormInput 
									label="Description" 
									placeholder="Description"
									value={doc.description}
									onChangeText={description => this.setState({doc: {...doc, description}})}
									error={error.description}
								/>

								<HrDashed />
								<div className="row">
									<div className="col-md-6">
										<DatePicker 
											label="Start time"
											option={{
												startView: 2,
												todayBtn: "linked",
												keyboardNavigation: false,
												forceParse: false,
												autoclose: true
											}}
											isDateObject={true}
											value={doc.startTime}
											onChange={startTime => this.setState({doc: {...doc, startTime}})}
										/>
									</div>
									<div className="col-md-6">
										<DatePicker 
											label="End time"
											option={{
												startView: 2,
												todayBtn: "linked",
												keyboardNavigation: false,
												forceParse: false,
												autoclose: true
											}}
											isDateObject={true}
											value={doc.endTime}
											onChange={endTime => this.setState({doc: {...doc, endTime}})}
										/>
									</div>
								</div>
								<HrDashed />
								<div className="form-group">
									{ error.GENERAL && (
										<div className="row">
											<div className="col-sm-10 col-sm-offset-1">
												<p className="text-danger">{ error.GENERAL }</p>
											</div>
										</div>
									)}
									<div className="row">
										<div className="col-sm-4 col-sm-offset-1">
											<a className="btn btn-white" onClick={onCancel}>Cancel</a>
											{' '}
											<button className="btn btn-primary" type="submit">Save changes</button>
										</div>
										<div className="col-md-2 col-md-offset-3">
											{_id && (
												<a className="btn btn-danger" onClick={this._onClickDelete}>
													Delete Organization
												</a>
											)}
										</div>
									</div>
								</div>
							</form>
          	</div>

          	<div id="tab-2" className="tab-pane">
          		<div className="row">
          			<div className="col-md-9">
          				<div className="input-group">
		                <input type="text" placeholder="Search employee " className="input form-control" />
		                <span className="input-group-btn">
		                  <button type="button" className="btn btn-default"> <i className="fa fa-search"></i> Search</button>
		                </span>
		              </div>
          			</div>
          			<div className="col-md-3">
          				<button className="btn btn-primary btn-block">
          					<i className="fa fa-user-plus" />
          					{' '}
          					Add Employee
          				</button>
          			</div>
          		</div>
          		<ScrollBox style={{height: '500px'}} scrollableY={true} scrollableX={false} fastTrackDuration={100} wheelStepY={80}>
          			
								  <table className="table table-striped table-hover">
								    <tbody>
								      <tr>
								        <td className="client-avatar"><img alt="image" src="/img/a2.jpg" /> </td>
								        <td><a data-toggle="tab" href="#contact-1" className="client-link" aria-expanded="true">Anthony Jackson</a></td>
								        <td> Tellus Institute</td>
								        <td className="contact-type"><i className="fa fa-envelope"> </i></td>
								        <td> gravida@rbisit.com</td>
								        <td className="client-status"><span className="label label-primary">Active</span></td>
								      </tr>
								      <tr>
								        <td className="client-avatar"><img alt="image" src="/img/a3.jpg" /> </td>
								        <td><a data-toggle="tab" href="#contact-2" className="client-link" aria-expanded="true">Rooney Lindsay</a></td>
								        <td>Proin Limited</td>
								        <td className="contact-type"><i className="fa fa-envelope"> </i></td>
								        <td> rooney@proin.com</td>
								        <td className="client-status"><span className="label label-primary">Active</span></td>
								      </tr>
								      <tr>
								        <td className="client-avatar"><img alt="image" src="/img/a4.jpg" /> </td>
								        <td><a data-toggle="tab" href="#contact-3" className="client-link" aria-expanded="true">Lionel Mcmillan</a></td>
								        <td>Et Industries</td>
								        <td className="contact-type"><i className="fa fa-phone"> </i></td>
								        <td> +432 955 908</td>
								        <td className="client-status"></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a5.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-4" className="client-link" aria-expanded="true">Edan Randall</a></td>
								        <td>Integer Sem Corp.</td>
								        <td className="contact-type"><i className="fa fa-phone"> </i></td>
								        <td> +422 600 213</td>
								        <td className="client-status"><span className="label label-warning">Waiting</span></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a6.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-2" className="client-link" aria-expanded="true">Jasper Carson</a></td>
								        <td>Mone Industries</td>
								        <td className="contact-type"><i className="fa fa-phone"> </i></td>
								        <td> +400 468 921</td>
								        <td className="client-status"></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a7.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-3" className="client-link" aria-expanded="true">Reuben Pacheco</a></td>
								        <td>Magna Associates</td>
								        <td className="contact-type"><i className="fa fa-envelope"> </i></td>
								        <td> pacheco@manga.com</td>
								        <td className="client-status"><span className="label label-info">Phoned</span></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a1.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-1" className="client-link" aria-expanded="true">Simon Carson</a></td>
								        <td>Erat Corp.</td>
								        <td className="contact-type"><i className="fa fa-envelope"> </i></td>
								        <td> Simon@erta.com</td>
								        <td className="client-status"><span className="label label-primary">Active</span></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a3.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-2" className="client-link" aria-expanded="true">Rooney Lindsay</a></td>
								        <td>Proin Limited</td>
								        <td className="contact-type"><i className="fa fa-envelope"> </i></td>
								        <td> rooney@proin.com</td>
								        <td className="client-status"><span className="label label-warning">Waiting</span></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a4.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-3" className="client-link" aria-expanded="true">Lionel Mcmillan</a></td>
								        <td>Et Industries</td>
								        <td className="contact-type"><i className="fa fa-phone"> </i></td>
								        <td> +432 955 908</td>
								        <td className="client-status"></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a5.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-4" className="client-link" aria-expanded="true">Edan Randall</a></td>
								        <td>Integer Sem Corp.</td>
								        <td className="contact-type"><i className="fa fa-phone"> </i></td>
								        <td> +422 600 213</td>
								        <td className="client-status"></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a2.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-1" className="client-link" aria-expanded="true">Anthony Jackson</a></td>
								        <td> Tellus Institute</td>
								        <td className="contact-type"><i className="fa fa-envelope"> </i></td>
								        <td> gravida@rbisit.com</td>
								        <td className="client-status"><span className="label label-danger">Deleted</span></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a7.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-2" className="client-link" aria-expanded="true">Reuben Pacheco</a></td>
								        <td>Magna Associates</td>
								        <td className="contact-type"><i className="fa fa-envelope"> </i></td>
								        <td> pacheco@manga.com</td>
								        <td className="client-status"><span className="label label-primary">Active</span></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a5.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-3" className="client-link" aria-expanded="true">Edan Randall</a></td>
								        <td>Integer Sem Corp.</td>
								        <td className="contact-type"><i className="fa fa-phone"> </i></td>
								        <td> +422 600 213</td>
								        <td className="client-status"><span className="label label-info">Phoned</span></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a6.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-4" className="client-link" aria-expanded="true">Jasper Carson</a></td>
								        <td>Mone Industries</td>
								        <td className="contact-type"><i className="fa fa-phone"> </i></td>
								        <td> +400 468 921</td>
								        <td className="client-status"><span className="label label-primary">Active</span></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a7.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-2" className="client-link" aria-expanded="true">Reuben Pacheco</a></td>
								        <td>Magna Associates</td>
								        <td className="contact-type"><i className="fa fa-envelope"> </i></td>
								        <td> pacheco@manga.com</td>
								        <td className="client-status"><span className="label label-primary">Active</span></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a1.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-1" className="client-link" aria-expanded="true">Simon Carson</a></td>
								        <td>Erat Corp.</td>
								        <td className="contact-type"><i className="fa fa-envelope"> </i></td>
								        <td> Simon@erta.com</td>
								        <td className="client-status"></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a3.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-3" className="client-link" aria-expanded="true">Rooney Lindsay</a></td>
								        <td>Proin Limited</td>
								        <td className="contact-type"><i className="fa fa-envelope"> </i></td>
								        <td> rooney@proin.com</td>
								        <td className="client-status"></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a4.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-4" className="client-link" aria-expanded="true">Lionel Mcmillan</a></td>
								        <td>Et Industries</td>
								        <td className="contact-type"><i className="fa fa-phone"> </i></td>
								        <td> +432 955 908</td>
								        <td className="client-status"><span className="label label-primary">Active</span></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a5.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-1" className="client-link" aria-expanded="true">Edan Randall</a></td>
								        <td>Integer Sem Corp.</td>
								        <td className="contact-type"><i className="fa fa-phone"> </i></td>
								        <td> +422 600 213</td>
								        <td className="client-status"><span className="label label-info">Phoned</span></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a2.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-2" className="client-link" aria-expanded="true">Anthony Jackson</a></td>
								        <td> Tellus Institute</td>
								        <td className="contact-type"><i className="fa fa-envelope"> </i></td>
								        <td> gravida@rbisit.com</td>
								        <td className="client-status"><span className="label label-warning">Waiting</span></td>
								      </tr>
								      <tr>
								        <td className="client-avatar">
								          <a href=""><img alt="image" src="/img/a7.jpg" /></a>
								        </td>
								        <td><a data-toggle="tab" href="#contact-4" className="client-link" aria-expanded="true">Reuben Pacheco</a></td>
								        <td>Magna Associates</td>
								        <td className="contact-type"><i className="fa fa-envelope"> </i></td>
								        <td> pacheco@manga.com</td>
								        <td className="client-status"></td>
								      </tr>
								    </tbody>
								  </table>

          		</ScrollBox>
          	</div>
          </div>
				</Box>
			</div>
		);
	}
}

const mapMeteorToProps = params => {
	let
		_id = params._id,
		type = 'insert',
		doc = {},
		isLoading = false,
		onSave = Actions.create,
		onSaveSuccess = () => {
			FlowRouter.go('app.organizations');
		},
		onCancel = () => {
			FlowRouter.go('app.organizations');
		},
		onRemove = () => null

	if (_id) {
		const sub = Meteor.subscribe('organizations.details', { _id });
		type = 'update';
		isLoading = !sub.ready();
		doc = Organizations.findOne(_id) || {};
		onSave = Actions.update;
		onRemove = Actions.remove;
	}

	return {
		_id,
		type,
		doc,
		isLoading,
		onSave,
		onSaveSuccess,
		onCancel,
		onRemove,
	};
}

export default createContainer(mapMeteorToProps, SingleOrganization);
