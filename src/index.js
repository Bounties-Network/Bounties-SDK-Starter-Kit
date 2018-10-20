import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import './index.css';
import App from './layout/App';
import * as serviceWorker from './serviceWorker';

import reducers from './reducers';
import sagaWatchers from './sagas';

import {
  reducers as modulesReducers,
  sagaWatchers as modulesSagas
} from './modules';

import {
  reducers as bnReducers,
  sagaWatchers as bnSagas
} from '@bounties-network/modules';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({
  	...reducers,
    ...bnReducers,
    ...modulesReducers
  }),
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

[...sagaWatchers, ...modulesSagas, ...bnSagas]
  .map(saga => sagaMiddleware.run(saga, store.dispatch));

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
