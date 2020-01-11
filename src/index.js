import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose  } from 'redux'
import { Provider } from 'react-redux'

import App from 'Modules/app/components/App/';
import { collisionsMiddleware } from 'Modules/screens';
import reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(collisionsMiddleware)));

ReactDOM.render(
    <Provider store={ store }>
        <App />
    </Provider>,
    document.getElementById('app')
);