import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import GlobalStyle from './GlobalStyle';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import updateUserReducer from './redux/authentication/userUpdate';
// import rootReducer from './redux/rootReducer';

// const enhancer =
//   process.env.NODE_ENV === "production"
//     ? compose(applyMiddleware())
//     : composeWithDevTools(applyMiddleware(logger));

const store = createStore(
  updateUserReducer,
  composeWithDevTools(applyMiddleware(logger))
);

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
