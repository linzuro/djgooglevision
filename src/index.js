import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import history from './history'
import {Router} from 'react-router-dom'

const root = document.querySelector('#root');
render(
    <ThemeProvider theme={theme}>
    <Provider store={ store }>
    <Router history={history}>
        <CssBaseline />
        <App />
    </Router>
    </Provider>
    </ThemeProvider>, root);



