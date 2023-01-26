import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import storeConfigure from './store/index';
import App from './App';
// import { ThemeProvider } from '@mui/material';
// import { theme } from './utils/config';
const store = storeConfigure();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store.store}>
    <App />
  </Provider>,
  // </React.StrictMode>,
);
