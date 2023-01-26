import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LOG_IN_REQUEST } from '../../store/modules/userModule';

const Login = () => {
  const dispatch = useDispatch();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const inputId = e => {
    setId(e.target.value);
  };
  const inputPassword = e => {
    setPassword(e.target.value);
  };
  const navigate = useNavigate();

  const LoginButton = e => {
    e.preventDefault();
    // if (id === '') {
    //   alert('아이디를 입력하세요');
    // } else if (password === '') {
    //   alert('패스워드를 입력하세요');
    // } else {
    dispatch({
      type: LOG_IN_REQUEST,
      data: {
        id,
        password,
        navigate,
      },
    });

    setId('');
    setPassword('');

    // return navigate('/');
  };

  return (
    <div>
      <h1>Login</h1>
      <div>
        <form onSubmit={LoginButton}>
          <div>
            <input
              required
              onChange={inputId}
              value={id}
              type="text"
              placeholder="아이디를 입력해주세요."
            />
          </div>
          <div>
            <input
              required
              onChange={inputPassword}
              value={password}
              type="password"
              placeholder="비밀번호를 입력해주세요."
            />
          </div>
          <input type="submit" value="로그인" />
        </form>
        <div>
          <Link to="/user/findId">아이디 찾기</Link>
          <Link to="/user/findPwd">비밀번호 찾기</Link>
          <Link to="/user/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
