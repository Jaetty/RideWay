// 비회원, 회원 권한에 따라 페이지 접근 허용 여부
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

const PrivateRoute = ({ element: RouteComponent, fallback: fallbackUrl }) => {
  const isLogin = useSelector(state => state.user.logInDone);

  if (!isLogin) {
    return <Navigate to={`/${fallbackUrl}`} />;
  }

  return <RouteComponent />;
};

export default PrivateRoute;
