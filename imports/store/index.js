import { Meteor } from 'meteor/meteor';
import { AppState } from './store';
import Promise from 'bluebird';
import createLogger from 'redux-logger';
const logger = createLogger();

// Modules
import * as pageHeadingModule from './modules/pageHeading';
import * as organizationsModule from './modules/organizations';

export const createStore = () => {
	return new Promise((resolve, reject) => {

		// Apply middlewares
		const middlewares = [logger];
		Meteor.AppState = new AppState({ middlewares });

		// register modules
		Meteor.AppState.loadModule(pageHeadingModule);
		Meteor.AppState.loadModule(organizationsModule);

		// done
		resolve();
	});
}
