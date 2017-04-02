// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import candidates from './candidates';
import focusGroup from './focusGroup';

const rootReducer = combineReducers({
  candidates,
  focusGroup,
  routing
});

export default rootReducer;
