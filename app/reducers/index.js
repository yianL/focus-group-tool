// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import data from './data';

const rootReducer = combineReducers({
  counter,
  data,
  routing
});

export default rootReducer;
