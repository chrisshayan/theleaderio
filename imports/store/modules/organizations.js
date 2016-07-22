import { Meteor } from 'meteor/meteor';
// define state name
export const name = 'organizations';

// default state
export const initialState = {
	pageSize: 9,
	page: 1,
	limit: 9,
	q: '',
};

// define constant
export const SET_PAGE = 'ORGANIZATION_SET_PAGE';
export const LOAD_MORE = 'ORGANIZATION_LOAD_MORE';
export const SET_QUERY = 'ORGANIZATION_SET_QUERY';
export const RESET = 'ORGANIZATION_RESET';

// define actions

/**
 * Pagination
 */
const setPage = ({ page = 1 }) => {
	return new Promise((resolve, reject) => {
		Meteor.AppState.dispatch({
			type: SET_PAGE,
			page,
		});
		resolve();
	});
}

const loadMore = () => {
	return new Promise((resolve, reject) => {
		Meteor.AppState.dispatch({ type: LOAD_MORE });
		resolve();
	});
}

/**
 * Search with keyword
 */
const setQuery = ({ q }) => {
	return new Promise((resolve, reject) => {
		Meteor.AppState.dispatch({ type: SET_QUERY, q });
		resolve();
	});
}


/**
 * Reset state
 */
const reset = () => { 
	return new Promise((resolve, reject) => {
		Meteor.AppState.dispatch({ type: RESET });
		resolve();
	});
}

const reducer_set_page = (state = initialState, action) => {
	return {
		...state,
		page: action.page,
		limit: state.pageSize * action.page
	};
}

const reducer_load_more = (state = initialState, action) => {
	const page = state.page + 1;
	return {
		...state,
		page,
		limit: state.pageSize * page
	};
}

const reducer_set_query = (state = initialState, action) => {
	return {
		...state,
		q: action.q
	};
}

const reducer_reset = () => {
	return initialState;
}

export const reducers = {
	[SET_PAGE]: reducer_set_page,
	[LOAD_MORE]: reducer_load_more,
	[SET_QUERY]: reducer_set_query,
	[RESET]: reducer_reset
};

export const actions = {
	setPage,
	loadMore,
	setQuery,
	reset,
};
