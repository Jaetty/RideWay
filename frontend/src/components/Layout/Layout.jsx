import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../Navbar/Navbar';
import { MY_PAGE_REQUEST } from '../../store/modules/myPageModule';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  // 로그인 확인 변수
  const { logInDone } = useSelector(state => state.user);
  const { myPageDone, user } = useSelector(state => state.myPage);
  const userToken = sessionStorage.getItem('userToken');
  useEffect(() => {
    if (!myPageDone && userToken) {
      dispatch({
        type: MY_PAGE_REQUEST,
        data: {
          token: userToken,
        },
      });
    }
  }, [myPageDone, logInDone]); // dispatch,

  return (
    <div>
      <Navbar myPageDone={myPageDone} user={user} />
      <main>{children}</main>
    </div>
  );
};

Layout.propsTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
