class LCore {
	constructor() {
		this._models = {};
		this._formModels = {};
		this._collections = {};
		this._apis = [];
		this._methods = {};
		this._publications = {};
		this._bgTasks = {}; // background tasks
	}

	/**
	 * API PATH
	 *
	 * @returns {string}
	 */
	static get BASE_URI() {
		return Meteor.settings.API_BASE_URI || 'api/';
	}

	/**
	 * get all collections
	 *
	 * @returns {object}
	 */
	get collections() {
		return this._collections;
	}

	/**
	 * Get all data models
	 *
	 * @returns {object}
	 */
	get models() {
		return this._models;
	}

	/**
	 * Get all form models
	 *
	 * @returns {object}
	 */
	get formModels() {
		return this._formModels;
	}

	/**
	 * Register data model
	 *
	 * @param {string} name
	 * @param {Astro.Class} model
	 */
	registerModel(name, model) {
		check(name, String);
		this._models[name] = model;
	}

	/**
	 * Register form model
	 * Form model is an adapter to validate + process raw data
	 *
	 * @param {string} name
	 * @param {Astro.Class} model
	 */
	registerFormModel(name, model) {
		check(name, String);
		this._formModels[name] = model;
	}

	/**
	 * Register collection
	 *
	 * @param {string} name
	 * @param {Mongo.Collection} coll
	 */
	registerCollection(name, coll) {
		this._collections[name] = coll;
	}

	/**
	 * Register methods for both client and server
	 *
	 * @param {string} name
	 * @param {function} action
	 */
	registerMethod(name, action) {
		check(name, String);
		check(action, Function);
		Meteor.methods({
			[name]: action
		});
	}

	/**
	 * Register server publications
	 *
	 * @param {string} name
	 * @param {string} action
	 */
	registerPublish(name, action) {
		if (Meteor.isServer) {
			check(name, String);
			check(action, Function);
			Meteor.publishComposite(name, action);
		}
	}

	/**
	 * Register server background task (Job collection)
	 *
	 * @param {string} type
	 * @param {object} data
	 * @param {object} options
	 * @return {boolean}
	 */
	registerTask(type, data, options) {
		if (Meteor.isServer) {
			check(type, String);
			check(data, Object);
			check(options, Object);
			return new Job(Meteor.JC, type, data, options).save();
		}
	}

	/**
	 * Register server task worker(Job collection)
	 *
	 * @param {string} name
	 * @param {object} options
	 * @param {function} action
	 */
	registerTaskWorker(name, options, action) {
		if (Meteor.isServer) {
			check(name, String);
			check(options, Object);
			check(action, Function);
			Meteor.JC.processJobs(name, options, action);
		}
	}

	/**
	 * Register api (method)
	 *
	 * @param name
	 * @param route
	 * @param method
	 * @param action
	 * @param parseArgs
	 */
	registerApi({name, route, method, action, parseArgs}) {
		check(name, String);
		check(route, String);
		check(method, String);
		check(action, Function);
		check(parseArgs, Match.Optional(Function));

		if (Meteor.isServer) {
			const options = {
				url: [LCore.BASE_URI, route].join('').replace(/\/\//g, '/'),
				httpMethod: method
			};

			if(parseArgs) {
				options.getArgsFromRequest = parseArgs;
			} else {
				options.getArgsFromRequest = function(req) {
					const {body, params, query} = req;
					return [body, params, new LQueryParams(query)];
				};
			}

			Meteor.method(name, action, options);
		} else {

		}
	}
}

this.LCore = LCore;
