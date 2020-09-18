import React from 'react';
import { Route, Router } from 'react-router';
import App from './App';

export default <Router history={hashHistory}>
  <Route path='/' component={App} />
</Router>