import { ReactiveDict } from 'meteor/reactive-dict';

const _STORE = Symbol('STORE');
const _TRIGGER_CHANGE = Symbol('TRIGGER_CHANGE');
const _COMPOSE = Symbol('COMPOSE');
const _DISPATCH = Symbol('DISPATCH');
const _REDUCERS = Symbol('REDUCERS');
const _REDUCER_TYPE = Symbol('REDUCER_TYPE');

export class AppState {
	constructor({ middlewares = [] }) {
		// main object to store state
		this[_STORE] = {};
		// store to trigger change meteor tracker
		this._trigger = new ReactiveDict({});
		// list reducers
		this[_REDUCERS] = {};
		// list reducer - type mapping
		this[_REDUCER_TYPE] = {};

		/**
		 * Dispatch an action
		 * 
		 * @param  {object} action : plain object
		 * @return {void}
		 */
		this.dispatch = function(action) {
			let _dispatch = this[_DISPATCH].bind(this);
			let chain = [];

			let middlewareAPI = {
				getState: this.getState.bind(this),
				dispatch: (action) => _dispatch(action)
			}

			chain = middlewares.map(middleware => middleware(middlewareAPI));
			_dispatch = this[_COMPOSE](...chain)(_dispatch);
			_dispatch(action);
		}

	}

	/**
	 * cloned from https://github.com/reactjs/redux/blob/master/src/compose.js
	 * 
	 * Composes single-argument functions from right to left. The rightmost
	 * function can take multiple arguments as it provides the signature for
	 * the resulting composite function.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing the argument functions
	 * from right to left. For example, compose(f, g, h) is identical to doing
	 * (...args) => f(g(h(...args))).
	 */
	[_COMPOSE](...funcs) {
		if (funcs.length === 0) {
			return arg => arg
		}

		if (funcs.length === 1) {
			return funcs[0]
		}

		const last = funcs[funcs.length - 1]
		const rest = funcs.slice(0, -1)
		return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
	}

	/**
	 * dispatch transaction
	 * @type {object} action
	 */
	[_DISPATCH](action = {}) {
		if (action.type && !_.isEmpty(action.type) && this[_REDUCERS][action.type]) {
			const type = this[_REDUCER_TYPE][action.type];
			if (type) {
				const state = this.getState()[type];
				const nextState = this[_REDUCERS][action.type](state, action);
				this[_STORE][type] = nextState;
				this._trigger.set(type, Date.now());
			}
		}
	}

	/**
	 * Load module, combine to reducers
	 * 
	 * @param  {String} module.name
	 * @param  {Any} module.initialState
	 * @param  {Object} module.reducers
	 * @return {Void}
	 */
	loadModule({ name = '', initialState = null, reducers = {} }) {
		let isValid = _.isString(name) && _.isObject(reducers);
		isValid &= !_.isEmpty(name) && !_.isEmpty(reducers);
		// stop if module invalid
		if (!isValid) return;

		this[_STORE][name] = initialState;
		this._trigger.set(name, 0);
		_.each(reducers, (v, k) => {
			this[_REDUCERS][k] = v;
			this[_REDUCER_TYPE][k] = name;
		});
	}

	/**
	 * Get single state
	 * 
	 * @param  {string} type : string name
	 * @return {any} state's value
	 */
	get(type: string) {
		this._trigger.get(type);
		return this[_STORE][type];
	}

	/**
	 * Get all state
	 * 
	 * @return {object}
	 */
	getState() {
		return { ...this[_STORE] };
	}
}
