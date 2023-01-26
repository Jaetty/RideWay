import { combineReducers } from 'redux';
import user from './userModule';
import community from './communityModule';
import myPage from './myPageModule';

const rootReducer = combineReducers({
  user,
  community,
  myPage,
});
export default rootReducer;
