import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { EDIT_PWD_REQUEST } from '../../store/modules/userModule';
import { EditPwdContentRow } from './PwdEdit.style';

const pwdEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 오류메시지 상태저장
  const [pwdMessage, setPwdMessage] = useState('');
  const [pwdChkMessage, setPwdChkMessage] = useState('');

  // 유효성 검사
  const [isPwd, setIsPwd] = useState(false);
  const [isPwdChk, setIsPwdChk] = useState(false);

  // 비밀번호 변경 변수 목록
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const inputCurrentPassword = e => {
    setCurrentPassword(e.target.value);
  };

  // 비밀번호 유효성 검사
  const onChangePassword = useCallback(e => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    const passwordCurrent = e.target.value;
    setNewPassword(passwordCurrent);

    if (!passwordRegex.test(passwordCurrent)) {
      setPwdMessage(
        '숫자+영문자+특수문자 조합으로 8자리 이상 16자 이하로 입력해주세요!',
      );
      setIsPwd(false);
    } else {
      setPwdMessage('안전한 비밀번호에요 : )');
      setIsPwd(true);
    }
  }, []);

  // 비밀번호 확인 유효성 검사
  const onChangePasswordCheck = useCallback(
    e => {
      const passwordCheckCurrent = e.target.value;
      setConfirmPassword(passwordCheckCurrent);

      if (newPassword === passwordCheckCurrent) {
        setPwdChkMessage('비밀번호를 똑같이 입력했어요 : )');
        setIsPwdChk(true);
      } else {
        setPwdChkMessage('비밀번호가 틀려요. 다시 확인해주세요 ㅜ ㅜ');
        setIsPwdChk(false);
      }
    },
    [newPassword],
  );

  const passwordEdit = e => {
    e.preventDefault();
    if (newPassword === '') {
      alert('비밀번호를 입력해주세요');
    } else if (confirmPassword === '') {
      alert('비밀번호확인을 입력해주세요');
    } else if (!isPwd) {
      Swal.fire({
        title: '비밀번호 변경 실패',
        text: '올바른 비밀번호를 입력해주세요',
        icon: 'error',
      });
    } else if (!isPwdChk) {
      Swal.fire({
        title: '비밀번호 변경 실패',
        text: '재확인 비밀번호가 일치하지 않습니다',
        icon: 'error',
      });
    } else {
      dispatch({
        type: EDIT_PWD_REQUEST,
        data: {
          nowPassword: currentPassword,
          newPassword: confirmPassword,
          navigate,
        },
      });
    }
  };

  return (
    <div>
      <h1>LOGO</h1>
      <div>
        <h3>비밀번호 변경</h3>
      </div>
      <form onSubmit={passwordEdit}>
        <EditPwdContentRow>
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <br />
          <input
            required
            value={currentPassword}
            onChange={inputCurrentPassword}
            id="currentPassword"
            type="password"
          />
        </EditPwdContentRow>
        <EditPwdContentRow>
          <label htmlFor="newPassword">변경할 비밀번호</label>
          <br />
          <input
            required
            value={newPassword}
            onChange={onChangePassword}
            id="newPassword"
            type="password"
          />
          <br />
          {newPassword.length > 0 && (
            <span className={`message ${isPwd ? 'success' : 'error'}`}>
              {pwdMessage}
            </span>
          )}
        </EditPwdContentRow>
        <EditPwdContentRow>
          <label htmlFor="confirmPassword">비밀번호 재확인</label>
          <br />
          <input
            required
            value={confirmPassword}
            onChange={onChangePasswordCheck}
            id="confirmPassword"
            type="password"
          />
          <br />
          {confirmPassword.length > 0 && (
            <span className={`message ${isPwdChk ? 'success' : 'error'}`}>
              {pwdChkMessage}
            </span>
          )}
        </EditPwdContentRow>
        <div>
          <input type="submit" value="확인" />
          <button>취소</button>
        </div>
      </form>
    </div>
  );
};

export default pwdEdit;
