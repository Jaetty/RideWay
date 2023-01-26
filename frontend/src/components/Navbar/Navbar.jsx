import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { LOG_OUT_REQUEST } from '../../store/modules/userModule';

const Navbar = ({ myPageDone, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(user);
  const tempStyle = {
    display: 'flex',
    justifyContent: 'space-between',
  };
  const logOutBtn = () => {
    dispatch({ type: LOG_OUT_REQUEST, navigate });
  };

  return (
    <div style={tempStyle}>
      <Link to="/">Logo</Link>
      {myPageDone ? (
        <span>
          <Link to="/mypage">{user.nickname} 님</Link>
          <button onClick={logOutBtn}>로그아웃</button>
          <Link to="/user/edituser">회원정보수정</Link>
        </span>
      ) : (
        <Link to="/user/login">Login</Link>
      )}
      <Link to="/community/free">커뮤니티</Link>
      <Link to="/">중고장터</Link>
      <Link to="/">추천코스</Link>
      <Link to="/">만남의광장</Link>
      <Link to="/map">지도</Link>
    </div>
  );
};

export default Navbar;
