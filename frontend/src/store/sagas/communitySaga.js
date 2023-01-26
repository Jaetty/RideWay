/* eslint-disable */
import {
  all,
  call,
  fork,
  getContext,
  put,
  takeLatest,
} from '@redux-saga/core/effects';
import Swal from 'sweetalert2';
import { CONTEXT_URL } from '../../utils/urls';
import {
  createBoardAPI,
  FreeBoardAPI,
  FreeDetailAPI,
} from '../apis/communityApi';
import {
  CREATE_BOARD_FAILURE,
  CREATE_BOARD_REQUEST,
  CREATE_BOARD_SUCCESS,
  LOAD_FREE_BOARD_FAILURE,
  LOAD_FREE_BOARD_REQUEST,
  LOAD_FREE_BOARD_SUCCESS,
  LOAD_FREE_DETAIL_FAILURE,
  LOAD_FREE_DETAIL_REQUEST,
  LOAD_FREE_DETAIL_SUCCESS,
} from '../modules/communityModule';
// 자유게시판 목록
function* getFreeBoardList(action) {
  try {
    const result = yield call(FreeBoardAPI, action.data);
    yield put({
      type: LOAD_FREE_BOARD_SUCCESS,
      data: result,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: LOAD_FREE_BOARD_FAILURE,
    });
  }
}

function* watchFreeBoardList() {
  yield takeLatest(LOAD_FREE_BOARD_REQUEST, getFreeBoardList);
}
// 자유게시판 상세
function* getFreeBoardDetail(action) {
  try {
    const result = yield call(FreeDetailAPI, action.data);
    yield put({
      type: LOAD_FREE_DETAIL_SUCCESS,
      data: result,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: LOAD_FREE_DETAIL_FAILURE,
    });
  }
}

function* watchFreeBoardDetail() {
  yield takeLatest(LOAD_FREE_DETAIL_REQUEST, getFreeBoardDetail);
}
// 게시글 작성
function* createBoard(action) {
  try {
    yield call(createBoardAPI, action.data);
    yield put({
      type: CREATE_BOARD_SUCCESS,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: CREATE_BOARD_FAILURE,
    });
  }
}

function* watchCreateBoard() {
  yield takeLatest(CREATE_BOARD_REQUEST, createBoard);
}

export default function* communitySaga() {
  yield all([
    fork(watchFreeBoardList),
    fork(watchFreeBoardDetail),
    fork(watchCreateBoard),
  ]);
}
