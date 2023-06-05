import React from 'react';
import ReactDOM from 'react-dom';
import './app/layout/styles.css';
import App from './app/layout/App';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ContextProvider } from './app/context/StoreContext';

export const history = createBrowserHistory({ window });

ReactDOM.render(
  <React.StrictMode>
    <HistoryRouter history={history}>
      <ContextProvider>
        <App />
      </ContextProvider>
    </HistoryRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
