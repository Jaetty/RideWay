import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FIND_PWD_REQUEST } from '../../store/modules/userModule';

const PwdSearch = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();

  const inputName = e => {
    setName(e.target.value);
  };
  const inputEmail = e => {
    setEmail(e.target.value);
  };

  const inputId = e => {
    setId(e.target.value);
  };

  const findPwd = e => {
    e.preventDefault();
    dispatch({
      type: FIND_PWD_REQUEST,
      data: {
        id,
        name,
        email,
      },
    });
  };

  return (
    <div>
      <h1>LOGO</h1>
      <div>
        <h3>비밀번호 찾기</h3>
        <h5>회원가입 시 이름과 등록한 이메일로 비밀번호를 찾습니다.</h5>
      </div>
      <form onSubmit={findPwd}>
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
          <label htmlFor="inputId">아이디</label>
          <br />
          <input
            required
            value={id}
            onChange={inputId}
            id="inputId"
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

export default PwdSearch;
