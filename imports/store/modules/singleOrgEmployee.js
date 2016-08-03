import { Meteor } from 'meteor/meteor';

export const name = 'singleOrganizationEmployee';

export const initialState = {
	loaded: false,
	doc: {},
	error: {},
};

export const RESET = 'SINGLE_ORGANIZATION_EMPLOYEE_RESET';
export const FORM_CHANGE = 'SINGLE_ORGANIZATION_EMPLOYEE_FORM_CHANGE';
export const SUBMIT_REQUEST = 'SINGLE_ORGANIZATION_EMPLOYEE_SUBMIT_REQUEST';
export const SUBMIT_SUCCESS = 'SINGLE_ORGANIZATION_EMPLOYEE_SUBMIT_SUCCESS';
export const SUBMIT_FAILED = 'SINGLE_ORGANIZATION_EMPLOYEE_SUBMIT_FAILED';

