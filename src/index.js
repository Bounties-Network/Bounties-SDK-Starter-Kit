import React from 'react';
import ReactDOM from 'react-dom';
import App from './layout/App';
import './index.css';
import './fontAwesome';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { initialize as initBountiesModules } from '@bounties-network/modules';

import { reducers as bnReducers, sagaWatchers as bnSagas } from '@bounties-network/modules';
import { reducers as modulesReducers, sagaWatchers as modulesSagas } from './modules';

// initBountiesModules({

// });

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({
    ...bnReducers,
    ...modulesReducers
  }),
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

[...modulesSagas, ...bnSagas]
  .map(saga => sagaMiddleware.run(saga, store.dispatch));

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
);