import { Meteor } from 'meteor/meteor';
import { AppState } from './store';
import Promise from 'bluebird';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
const logger = createLogger();

// Modules
import * as pageHeadingModule from './modules/pageHeading';
import * as organizationsModule from './modules/organizations';
import * as singleOrganizationModule from './modules/singleOrganization';

export const createStore = () => {
	return new Promise((resolve, reject) => {

		// Apply middlewares
		const middlewares = [thunk, logger];
		Meteor.AppState = new AppState({ middlewares });

		// register modules
		Meteor.AppState.loadModule(pageHeadingModule);
		Meteor.AppState.loadModule(organizationsModule);
		Meteor.AppState.loadModule(singleOrganizationModule);

		// done
		resolve();
	});
}
