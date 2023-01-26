import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './modules/index';
import rootSaga from './sagas/index';

const storeConfigure = () => {
  const sagaMiddleware = createSagaMiddleware({});
  // const middlewares = [sagaMiddleware];
  const store = configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware],
  });
  sagaMiddleware.run(rootSaga);
  return { store };
};

// export const reducers = reducer.actions;

export default storeConfigure;
