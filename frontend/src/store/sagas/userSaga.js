import { all, call, fork, put, takeLatest } from '@redux-saga/core/effects';
// import { useDispatch } from 'react-redux';
// import { Route } from 'react-router';
// import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CONTEXT_URL } from '../../utils/urls';
import {
  signUpAPI,
  logInAPI,
  findIdAPI,
  findPwdAPI,
  editPwdAPI,
  editUserAPI,
  userDeleteAPI,
} from '../apis/userApi';
import {
  SIGN_UP_REQUEST,
  LOG_IN_REQUEST,
  FIND_ID_REQUEST,
  FIND_PWD_REQUEST,
  EDIT_PWD_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  SIGN_UP_SUCCESS,
  FIND_ID_SUCCESS,
  FIND_ID_FAILURE,
  FIND_PWD_SUCCESS,
  FIND_PWD_FAILURE,
  EDIT_PWD_SUCCESS,
  EDIT_PWD_FAILURE,
  EDIT_USER_SUCCESS,
  EDIT_USER_FAILURE,
  EDIT_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  DELETE_USER_REQUEST,
} from '../modules/userModule';
/* eslint-disable */
// 회원가입
function* singUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    yield put({ type: SIGN_UP_SUCCESS, data: result.data });
    Swal.fire({
      title: '회원가입 성공',
      text: '',
      icon: 'success',
    }).then(() => {
      const navigate = action.data.navigate;
      navigate('/');
    });
  } catch (err) {
    yield put({
      type: 'SIGN_UP_FAILURE',
      data: err,
    });
    Swal.fire({
      title: '회원가입 실패',
      text: '',
      icon: 'error',
    });
  }
}

function* watchSignup() {
  yield takeLatest(SIGN_UP_REQUEST, singUp);
}

// 로그인
function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({ type: LOG_IN_SUCCESS, data: result.data });
    sessionStorage.setItem('userToken', result.data.token);
    // yield useDispatch({ type: GET_MY_INFO_REQUEST, data: result.data.token });
    // Swal.fire({
    //   title: '로그인 완료',
    //   text: '',
    //   icon: 'success',
    // }).then(() => {
    //   const navigate = action.data.navigate;
    //   navigate('/');
    //   // location.href = `${CONTEXT_URL}`;
    // });
    const navigate = action.data.navigate;
    navigate('/');
  } catch (err) {
    Swal.fire({
      title: '로그인 실패',
      text: '아이디와 비밀번호를 확인해주세요',
      icon: 'error',
    });
    yield put({ type: LOG_IN_FAILURE, data: err });
    // console.log(err);
  }
}

function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

// 로그아웃
function* logOut(action) {
  try {
    // const result = yield call(logOutAPI, action.data);
    yield put({ type: LOG_OUT_SUCCESS });
    sessionStorage.clear();
    const navigate = action.navigate;
    navigate('/');
    window.location.reload();
  } catch (err) {
    console.log(err);
    yield put({ type: LOG_OUT_FAILURE });
    Swal.fire({
      title: '로그아웃 실패',
      text: '',
      icon: 'error',
    });
  }
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

// 아이디 찾기
function* findId(action) {
  try {
    const result = yield call(findIdAPI, action.data);
    console.log(result);
    yield put({ type: FIND_ID_SUCCESS, data: result });
    Swal.fire({
      title: '아이디 찾기 완료',
      text: 'ID : ' + result.id,
      icon: 'success',
    });
  } catch (err) {
    Swal.fire({
      title: '아이디 찾기 실패',
      text: '아이디와 이메일을 확인해주세요',
      icon: 'error',
    });
    yield put({ type: FIND_ID_FAILURE, data: err });
    // console.log(err);
  }
}

function* watchFindId() {
  yield takeLatest(FIND_ID_REQUEST, findId);
}

// 비밀번호 찾기
function* findPwd(action) {
  try {
    const result = yield call(findPwdAPI, action.data);
    // console.log(result);
    yield put({ type: FIND_PWD_SUCCESS, data: result.data });
    Swal.fire({
      title: ' 비밀번호 찾기',
      text: '등록하신 이메일로 새로운 임시 비밀번호를 전송하였습니다.',
      icon: 'success',
      confirmButtonText: '로그인',
      confirmButtonColor: 'success',
    }).then(() => {
      location.href = `${CONTEXT_URL}user/login`;
    });
  } catch (err) {
    Swal.fire({
      title: '비밀번호 찾기 실패',
      text: '성명, 아이디, 이메일을 확인해주세요',
      icon: 'error',
    });
    yield put({ type: FIND_PWD_FAILURE, data: err });
    // console.log(err);
  }
}

function* watchFindPwd() {
  yield takeLatest(FIND_PWD_REQUEST, findPwd);
}

// 비밀번호 변경
function* editPwd(action) {
  try {
    const result = yield call(editPwdAPI, action.data);
    // console.log(result);
    yield put({ type: EDIT_PWD_SUCCESS, data: result.data });
    Swal.fire({
      title: ' 비밀번호 변경',
      text: '새로운 비밀번호로 변경되었습니다.',
      icon: 'success',
    });
    const navigate = action.data.navigate;
    navigate('/mypage');
  } catch (err) {
    Swal.fire({
      title: '비밀번호 변경 실패',
      text: '비밀번호를 다시 작성해주세요',
      icon: 'error',
    });
    yield put({ type: EDIT_PWD_FAILURE, data: err });
  }
}

function* watchEditPwd() {
  yield takeLatest(EDIT_PWD_REQUEST, editPwd);
}

// 회원정보 변경
function* editUser(action) {
  try {
    const result = yield call(editUserAPI, action.data);
    yield put({ type: EDIT_USER_SUCCESS, data: result.data });
    Swal.fire({
      title: '회원정보 변경',
      text: '새로운 회원정보로 변경되었습니다.',
      icon: 'success',
    }).then(() => {
      const navigate = action.data.navigate;
      navigate('/mypage');
      window.location.reload();
    });
  } catch {
    Swal.fire({
      title: '회원정보 변경 실패',
      text: '회원정보를 다시 작성해주세요',
      icon: 'error',
    });
    yield put({ type: EDIT_USER_FAILURE, data: err });
  }
}

function* watchEditUser() {
  yield takeLatest(EDIT_USER_REQUEST, editUser);
}

// 회원탈퇴
function* UserDelete(action) {
  try {
    const result = yield call(userDeleteAPI, action.data);
    yield put({ type: DELETE_USER_SUCCESS, data: result.data });
    Swal.fire({
      title: '회원탈퇴 완료',
      text: '회원탈퇴가 완료되었습니다',
      icon: 'success',
    }).then(() => {
      const navigate = action.data.navigate;
      sessionStorage.clear();
      navigate('/');
      window.location.reload();
    });
  } catch {
    Swal.fire({
      title: '회원탈퇴 실패',
      text: '비밀번호가 틀립니다',
      icon: 'error',
    });
    yield put({ type: DELETE_USER_FAILURE, data: err });
  }
}

function* watchUserDelete() {
  yield takeLatest(DELETE_USER_REQUEST, UserDelete);
}

export default function* userSaga() {
  yield all([
    fork(watchSignup),
    fork(watchLogin),
    fork(watchLogOut),
    fork(watchFindId),
    fork(watchFindPwd),
    fork(watchEditPwd),
    fork(watchEditUser),
    fork(watchUserDelete),
  ]);
}
