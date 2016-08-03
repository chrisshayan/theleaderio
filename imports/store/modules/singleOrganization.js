import { Meteor } from 'meteor/meteor';
import * as Actions from '/imports/api/organizations/methods';
import { getErrors } from '/imports/utils';
import moment from 'moment';

// define state name
export const name = 'singleOrganization';

// default state
const endTime = moment();
const startTime = endTime.clone();
startTime.subtract(1, 'year');
export const initialState = {
	loaded: false,
	doc: {
		startTime: startTime.toDate(),
		endTime: endTime.toDate(),
	},
	error: {},
};

// define constant
export const RESET = 'SINGLE_ORGANIZATION_RESET';
export const FORM_CHANGE = 'SINGLE_ORGANIZATION_FORM_CHANGE';
export const SUBMIT_REQUEST = 'SINGLE_ORGANIZATION_SUBMIT_REQUEST';
export const SUBMIT_SUCCESS = 'SINGLE_ORGANIZATION_SUBMIT_SUCCESS';
export const SUBMIT_FAILED = 'SINGLE_ORGANIZATION_SUBMIT_FAILED';
export const FETCH_DETAILS_REQUEST = 'SINGLE_ORGANIZATION_FETCH_DETAILS_REQUEST';
export const FETCH_DETAILS_SUCCESS = 'SINGLE_ORGANIZATION_FETCH_DETAILS_SUCCESS';
export const FETCH_DETAILS_FAILED = 'SINGLE_ORGANIZATION_FETCH_DETAILS_FAILED';

// define actions
const change = (data) => {
	return { type: FORM_CHANGE, doc: data };
}

const reset = () => {
	return { type: RESET };
}

const create = (data) => {
	return (dispatch) => {
		dispatch({ type: SUBMIT_REQUEST, doc: data });
		Actions.create.call(data, (err, orgId) => {
			if(err) {
				return dispatch({ type: SUBMIT_FAILED, error: getErrors(err) });
			} else {
				return dispatch({ type: SUBMIT_SUCCESS, orgId });
			}
		});
	}
}

const update = (_id, data) => {
	return (dispatch) => {
		dispatch({ type: SUBMIT_REQUEST, doc: data });
		Actions.update.call({...data, _id}, (err) => {
			if(err) {
				return dispatch({ type: SUBMIT_FAILED, error: getErrors(err) });
			} else {
				return dispatch({ type: SUBMIT_SUCCESS });
			}
		});
	}
}

const fetchDetails = _id => {
	return dispatch => {
		dispatch({ type: FETCH_DETAILS_REQUEST, orgId: _id });
		Actions.details.call({ _id }, (err, doc) => {
			if(err) {
				return dispatch({ type: FETCH_DETAILS_FAILED, error: getErrors(err) });
			} else {
				return dispatch({ type: FETCH_DETAILS_SUCCESS, doc });
			}
		});
	};
}

/**
 * REDUCERS
 */

const reducer_reset = (state = initialState, action) => {
	return initialState;
}

const reducer_change = (state = initialState, action) => {
	return {
		...state,
		doc: action.doc
	};
}

const reducer_submit_request = (state = initialState, action) => {
	return {
		...state,
		doc: action.doc,
		orgId: action.orgId,
		error: {},
		loading: true,
	};
}

const reducer_submit_success = (state = initialState, action) => {
	return {
		...state,
		loading: false,
		success: true,
		orgId: action.orgId,
		error: {}
	};
}

const reducer_submit_failed = (state = initialState, action) => {
	return {
		...state,
		loading: false,
		error: action.error
	};
}

const reducer_fetch_request = (state = initialState, action) => {
	return {
		...state,
		error: {},
		loading: true,
		orgId: action.orgId
	};
}

const reducer_fetch_failed = (state = initialState, action) => {
	return {
		...state,
		loading: false,
		error: action.error,
	};
}

const reducer_fetch_success = (state = initialState, action) => {
	return {
		...state,
		loaded: true,
		loading: false,
		doc: action.doc,
	};
}

export const reducers = {
	[RESET]: reducer_reset,
	[FORM_CHANGE]: reducer_change,
	[SUBMIT_REQUEST]: reducer_submit_request,
	[SUBMIT_SUCCESS]: reducer_submit_success,
	[SUBMIT_FAILED]: reducer_submit_failed,
	[FETCH_DETAILS_REQUEST]: reducer_fetch_request,
	[FETCH_DETAILS_FAILED]: reducer_fetch_failed,
	[FETCH_DETAILS_SUCCESS]: reducer_fetch_success,
};

export const actions = {
	change,
	reset,
	create,
	update,
	fetchDetails,
};
