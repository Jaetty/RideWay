import { all, fork } from 'redux-saga/effects';
import communitySaga from './communitySaga';
import userSaga from './userSaga';
import myPageSaga from './myPageSaga';

export default function* rootSaga() {
  yield all([fork(userSaga), fork(communitySaga), fork(myPageSaga)]);
}
