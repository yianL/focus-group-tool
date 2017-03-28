// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import candidates from './candidates';

const rootReducer = combineReducers({
  candidates,
  routing
});

export default rootReducer;
