import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { DELETE_USER_REQUEST } from '../../store/modules/userModule';

const UserDelete = () => {
  const [password, setPassword] = useState('');
  const userToken = sessionStorage.getItem('userToken');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputPassword = e => {
    setPassword(e.target.value);
  };
  const deleteUser = e => {
    e.preventDefault();
    dispatch({
      type: DELETE_USER_REQUEST,
      data: { password, userToken, navigate },
    });
  };
  return (
    <div>
      <h1>회원탈퇴</h1>
      <form onSubmit={deleteUser}>
        <h5>회원탈퇴를 하시려면 비밀번호를 입력해주세요</h5>
        <br />
        <input
          required
          value={password}
          onChange={inputPassword}
          id="inputPassword"
          type="password"
        />
        <button type="submit">탈퇴</button>
      </form>
    </div>
  );
};

export default UserDelete;
