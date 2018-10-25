import React from 'react';
import ReactDOM from 'react-dom';
import App from './layout/App';
import './index.css';
import './fontAwesome';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import { reducers as bnReducers, sagaWatchers as bnSagas } from '@bounties-network/modules';
import { reducers as modulesReducers, sagaWatchers as modulesSagas } from './modules';

import client from '@bounties-network/modules'

client.settings = {
  "platforms": {
    "bounties-network": ["bounties-network", "starter-kit"]
  },
  "postingPlatform": "starter-kit",
  "postingSchema": "standardSchema",
  "postingSchemaVersion": "0.1",
  "categoryPlatform": "main",
  "networkName": "Bounties Starter Kit",
  "requiredNetwork": "rinkeby",
  "url": {
    "mainNet": "https://rinkebystaging.api.bounties.network",
    "rinkeby": "https://rinkebystaging.api.bounties.network"
  },
  "deployments": {
    "StandardBounties": {
      "rinkeby": "0xdd1636b88e9071507e859e61991ed4be6647f420"
    }
  }
}

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