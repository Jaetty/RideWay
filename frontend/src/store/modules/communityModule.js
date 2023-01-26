/* eslint-disable */
import produce from 'immer';

const initialStatement = {
  loadFreeBoardLoading: false,
  loadFreeBoardDone: false,
  loadFreeBoardError: null,
  loadFreeDetailLoading: false,
  loadFreeDetailDone: false,
  loadFreeDetailError: null,
  createBoardLoading: false,
  createBoardDone: false,
  createBoardError: null,
  page: 0,
  freeBoards: [],
  freeDetail: [],
};

// 커뮤니티 목록
export const LOAD_FREE_BOARD_REQUEST = 'LOAD_FREE_BOARD_REQUEST';
export const LOAD_FREE_BOARD_SUCCESS = 'LOAD_FREE_BOARD_SUCCESS';
export const LOAD_FREE_BOARD_FAILURE = 'LOAD_FREE_BOARD_FAILURE';
// 커뮤니티 디테일
export const LOAD_FREE_DETAIL_REQUEST = 'LOAD_FREE_DETAIL_REQUEST';
export const LOAD_FREE_DETAIL_SUCCESS = 'LOAD_FREE_DETAIL_SUCCESS';
export const LOAD_FREE_DETAIL_FAILURE = 'LOAD_FREE_DETAIL_FAILURE';
// 게시글 작성
export const CREATE_BOARD_REQUEST = 'CREATE_BOARD_REQUEST';
export const CREATE_BOARD_SUCCESS = 'CREATE_BOARD_SUCCESS';
export const CREATE_BOARD_FAILURE = 'CREATE_BOARD_FAILURE';

const reducer = (state = initialStatement, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_FREE_BOARD_REQUEST:
        draft.loadFreeBoardLoading = true;
        draft.loadFreeBoardDone = false;
        draft.loadFreeBoardError = null;
        break;
      case LOAD_FREE_BOARD_SUCCESS:
        draft.loadFreeBoardLoading = false;
        draft.loadFreeBoardDone = true;
        draft.freeBoards = action.data;

        break;
      case LOAD_FREE_BOARD_FAILURE:
        draft.loadFreeBoardDone = false;
        draft.loadFreeBoardError = action.error;
        break;
      case LOAD_FREE_DETAIL_REQUEST:
        draft.loadFreeDetailLoading = true;
        draft.loadFreeDetailDone = false;
        draft.loadFreeDetailError = null;
        break;
      case LOAD_FREE_DETAIL_SUCCESS:
        draft.loadFreeDetailLoading = false;
        draft.loadFreeDetailDone = true;
        draft.freeDetail = action.data;

        break;
      case LOAD_FREE_DETAIL_FAILURE:
        draft.loadFreeDetailDone = false;
        draft.loadFreeDetailError = action.error;
        break;
      case CREATE_BOARD_REQUEST:
        draft.createBoardLoading = true;
        draft.createBoardDone = false;
        draft.createBoardError = null;
        break;
      case CREATE_BOARD_SUCCESS:
        draft.createBoardLoading = false;
        draft.createBoardDone = true;

        break;
      case CREATE_BOARD_FAILURE:
        draft.createBoardDone = false;
        draft.createBoardError = action.error;
        break;
      default:
        break;
    }
  });
export default reducer;
