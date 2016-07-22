import { Meteor } from 'meteor/meteor';
// define state name
export const name = 'pageHeading';

// default state
export const initialState = { title: null, breadcrumb: [], actions: null };

// define constant
export const SET_PAGE_HEADING = 'SET_PAGE_HEADING';
export const RESET_PAGE_HEADING = 'RESET_PAGE_HEADING';

// define actions
export const setPageHeading = ({ title = '', breadcrumb = [], actions = null }) => {
  return new Promise((resolve, reject) => {
    Meteor.AppState.dispatch({
      type: SET_PAGE_HEADING,
      title,
      breadcrumb,
      actions
    });
    resolve();
  });
}

export const resetPageHeading = () => {
  return new Promise((resolve, reject) => {
    Meteor.AppState.dispatch({ type: RESET_PAGE_HEADING });
    resolve();
  });
}

const reducer_set_page_heading = (state = initialState, action) => {
  return {
    title: action.title,
    breadcrumb: action.breadcrumb,
    actions: action.actions,
  };
}

const reducer_reset_page_heading = (state = initialState, action) => {
  return initialState;
}

export const reducers = {
  [SET_PAGE_HEADING]: reducer_set_page_heading,
  [RESET_PAGE_HEADING]: reducer_reset_page_heading,
};
