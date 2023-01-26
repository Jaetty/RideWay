import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FIND_ID_REQUEST } from '../../store/modules/userModule';
// import { useDispatch } from 'react-redux';

const IDSearch = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();

  const inputName = e => {
    setName(e.target.value);
  };
  const inputEmail = e => {
    setEmail(e.target.value);
  };

  const findId = e => {
    e.preventDefault();
    dispatch({
      type: FIND_ID_REQUEST,
      data: { name, email },
    });
  };
  return (
    <div>
      <h1>LOGO</h1>
      <div>
        <h3>아이디 찾기</h3>
        <h5>회원가입 시 이름과 등록한 이메일로 아이디를 찾습니다.</h5>
      </div>
      <form onSubmit={findId}>
        <div>
          <label htmlFor="nameInput">성명</label>
          <br />
          <input
            required
            value={name}
            onChange={inputName}
            id="nameInput"
            type="text"
          />
        </div>
        <div>
          <label htmlFor="inputEmail">이메일</label>
          <br />
          <input
            required
            value={email}
            onChange={inputEmail}
            id="inputEmail"
            type="text"
          />
        </div>
        <div>
          <button>확인</button>
          <Link to="/user/login">
            <button>취소</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default IDSearch;
