// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CreateGroupPage from './containers/CreateGroupPage';
import CheckinPage from './containers/CheckinPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/create" component={CreateGroupPage} />
    <Route path="/checkin" component={CheckinPage} />
  </Route>
);
