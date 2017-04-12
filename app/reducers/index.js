// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import candidates from './candidates';
import focusGroup from './focusGroup';
import ui from './ui';

const rootReducer = combineReducers({
  ui,
  candidates,
  focusGroup,
  routing
});

export default rootReducer;
