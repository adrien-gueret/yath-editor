import React from 'react';
import ReactDOM from 'react-dom';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { createStore, applyMiddleware, compose  } from 'redux'
import { Provider } from 'react-redux'

import App from 'Modules/app/components/App/';
import { downloadGameMiddleware } from 'Modules/game';
import { logicDeletionMiddleware } from 'Modules/logic';
import { collisionsMiddleware, moveScreensMiddleware } from 'Modules/screens';

import reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(
    applyMiddleware(logicDeletionMiddleware, downloadGameMiddleware, moveScreensMiddleware, collisionsMiddleware)
));

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#0d4bb8',
            light: '#5b76eb',
            dark: '#002587',
            contrastText: '#fafafa',
        },
        secondary: {
            main: '#8c6d62',
            light: '#bd9b8f',
            dark: '#5e4238',
            contrastText: '#fafafa',
        },
    },
    overrides: {
        MuiDialogActions: {
            root: {
                padding: '8px 0',
            },
        },
    },
});

/*
const response = await fetch('/api/names');
  const names = await response.json();
  */

const queryString = window.location.search;
let fileToLoad = null;

if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    fileToLoad = urlParams.get('file');
}

ReactDOM.render((
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <App fileToLoad={fileToLoad} />
            </Provider>
        </ThemeProvider>
    ),
    document.getElementById('app')
);