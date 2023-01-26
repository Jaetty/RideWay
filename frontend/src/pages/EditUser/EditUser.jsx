import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { address } from '../../components/Address';
import {
  checkNickAPI,
  sendMailAPI,
  checkCertiAPI,
} from '../../store/apis/userApi';
import { EDIT_USER_REQUEST } from '../../store/modules/userModule';
import { EditUserContentRow } from './EditUser.style';

const editUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.myPage);
  useEffect(() => {}, [user]);
  const token = sessionStorage.getItem('userToken');

  // 회원정보수정 변수 목록
  const [si, setSi] = useState(user.si);
  const [gun, setGun] = useState(user.gun);
  const [dong, setDong] = useState(user.dong);
  const [email, setEmail] = useState(user.email);
  const [emailSend, setEmailSend] = useState(true);
  const [emailCerti, setEmailCerti] = useState(true);
  const [nick, setNick] = useState(user.nickname);
  const [weight, setWeight] = useState(user.weight ? user.weight : '');
  const [bikeweight, setBikeweight] = useState(
    user.cycle_weight ? user.cycle_weight : '',
  );
  const [imagePath, setImagePath] = useState(user.imagePath);
  const [open, setOpen] = useState(user.open);

  // 주소지 목록
  const options1 = ['전체', ...Object.keys(address)];
  const [options2, setOptions2] = useState([]);
  const [options3, setOptions3] = useState([]);

  // 주소 최신화
  useEffect(() => {
    if (si === '전체') {
      setOptions2([]);
      setOptions3([]);
    } else {
      setOptions2(['전체', ...Object.keys(address[si])]);
      setOptions3([]);
    }
    if (gun === '전체') {
      setOptions3([]);
    } else {
      setOptions3(['전체', ...address[si][gun]]);
    }
  }, []);

  // 중복 체크 및 이메일 인증 체크
  const [nickCheck, setNickCheck] = useState(true);
  const [emailCheck, setEmailCheck] = useState(true);

  // 오류메시지 상태저장
  const [nickMessage, setNickMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  // 유효성 검사
  const [isNick, setIsNick] = useState(true);
  const [isEmail, setIsEmail] = useState(true);

  // Handler Function
  const inputSi = e => {
    if (e.target.value === '전체') {
      setOptions2([]);
      setGun('');
      setOptions3([]);
      setDong('');
    } else {
      setOptions2(['전체', ...Object.keys(address[e.target.value])]);
      setGun('');
      setOptions3([]);
      setDong('');
    }
    setSi(e.target.value);
  };
  const inputGun = e => {
    if (e.target.value === '전체') {
      setOptions3([]);
      setDong('');
    } else {
      setOptions3(['전체', ...address[si][e.target.value]]);
      setDong('');
    }
    setGun(e.target.value);
  };
  const inputDong = e => {
    setDong(e.target.value);
  };
  const inputEmailCerti = e => {
    setEmailCerti(e.target.value);
  };
  const inputNick = e => {
    setNick(e.target.value);
    setNickCheck(false);
    setNickMessage('');
  };
  const inputWeight = e => {
    setWeight(e.target.value);
  };
  const inputBikeweight = e => {
    setBikeweight(e.target.value);
  };
  const inputOpen = e => {
    if (e.target.value === 'on') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  // 이메일 유효성 검사
  const onChangeEmail = useCallback(e => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const emailCurrent = e.target.value;
    setEmail(emailCurrent);
    setEmailCheck(false);
    setEmailSend(false);
    setEmailCerti(false);

    if (!emailRegex.test(emailCurrent)) {
      setEmailMessage('이메일 형식이 틀렸습니다. 다시 확인해주세요');
      setIsEmail(false);
    } else {
      setEmailMessage('올바른 이메일 형식이에요 :)');
      setIsEmail(true);
    }
  }, []);

  // 이미지 미리보기
  const encodeFileToBase64 = fileBlob => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise(resolve => {
      reader.onload = () => {
        setImagePath(reader.result);
        resolve();
      };
    });
  };

  // Email 인증 보내기  ==>  String으로 return이 와서 지금은 다 true임
  const sendMail = e => {
    e.preventDefault();
    try {
      const result = sendMailAPI(email);
      setEmailSend(true);
      return result;
    } catch {
      setEmailSend(false);
      return false;
    }
  };

  // Email 인증 확인  ==>  String으로 return이 와서 지금은 다 true임
  const checkCerti = async e => {
    e.preventDefault();
    try {
      const result = await checkCertiAPI(emailCerti);
      setEmailCheck(true);
      alert('인증이 완료되었습니다.');
      return result;
    } catch {
      setEmailCheck(false);
      alert('인증번호가 틀립니다.');
      return false;
    }
  };

  // 닉네임 중복 체크
  const CheckNick = async e => {
    e.preventDefault();
    const result = await checkNickAPI(nick);
    console.log(result);
    if (!result) {
      setNickMessage('사용가능한 닉네임입니다');
      setNickCheck(true);
      setIsNick(true);
    } else {
      setNickMessage('이미 존재하는 닉네임입니다');
      setNickCheck(false);
      setIsNick(false);
    }
  };

  // 수정 버튼
  const editUserBtn = e => {
    e.preventDefault();
    if (si === '' || gun === '' || dong === '') {
      alert('주소를 입력해주세요');
    } else if (email === '') {
      alert('이메일을 입력해주세요');
    } else if (nick === '') {
      alert('닉네임을 입력해주세요');
    } else if (!nickCheck) {
      alert('닉네임 중복검사를 해주세요');
    } else if (!isEmail) {
      alert('올바른 이메일을 입력해주세요');
    } else {
      console.log({
        si,
        gun,
        dong,
        email,
        nick,
        weight,
        bikeweight,
        imagePath,
        open,
        token,
      });
      dispatch({
        type: EDIT_USER_REQUEST,
        data: {
          si,
          gun,
          dong,
          email,
          nick,
          weight,
          bikeweight,
          imagePath,
          open,
          token,
          navigate,
        },
      });
    }
  };

  return (
    <div>
      {user && (
        <div>
          <h1>회원정보수정</h1>
          <Link to="/user/editPwd">비밀번호 변경</Link>
          <Link to="/user/delete">회원탈퇴</Link>
          <form onSubmit={editUserBtn} encType="multipart/form-data">
            <div>
              <label htmlFor="address">주소</label>
              <br />
              <select
                onChange={inputSi}
                value={si}
                placeholder="시를 선택해주세요"
              >
                {options1.map(item => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                onChange={inputGun}
                value={gun}
                placeholder="구를 선택해주세요"
              >
                {options2?.map(item => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                onChange={inputDong}
                value={dong}
                placeholder="동을 선택해주세요"
              >
                {options3?.map(item => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <EditUserContentRow>
              <label htmlFor="email">Email</label>
              <br />
              <input
                type="text"
                id="email"
                className="input check-input"
                placeholder="Email"
                value={email}
                onChange={onChangeEmail}
              />
              <button onClick={sendMail} hidden={emailCheck}>
                인증번호 전송
              </button>
              <br />
              {email?.length > 0 && (
                <span className={`message ${isEmail ? 'success' : 'error'}`}>
                  {emailMessage}
                </span>
              )}
            </EditUserContentRow>
            {emailSend && (
              <div hidden={emailCheck}>
                <div>
                  <input
                    type="text"
                    id="mailcerti"
                    className="input check=input"
                    placeholder="인증번호 입력"
                    onChange={inputEmailCerti}
                  />
                </div>
                <button onClick={checkCerti}>확인</button>
              </div>
            )}
            <div>
              <label htmlFor="profileImg">프로필 사진</label>
              <br />
              <input
                type="file"
                id="profileImg"
                className="input check-input"
                placeholder="Profile Image"
                value={imagePath}
                onChange={e => {
                  encodeFileToBase64(e.target.files[0]);
                }}
              />
            </div>
            <div className="preview">
              {imagePath && <img src={imagePath} alt="preview-img" />}
            </div>
            <EditUserContentRow>
              <label htmlFor="nickname">닉네임</label>
              <br />
              <input
                type="text"
                id="nickname"
                className="input check-input"
                placeholder="Nickname"
                value={nick}
                onChange={inputNick}
              />
              <button onClick={CheckNick} hidden={nickCheck}>
                중복검사
              </button>
              <br />
              {nick?.length > 0 && (
                <span className={`message ${isNick ? 'success' : 'error'}`}>
                  {nickMessage}
                </span>
              )}
            </EditUserContentRow>
            <EditUserContentRow>
              <label htmlFor="weight">몸무게</label>
              <span className="message success"> (선택 사항입니다)</span>
              <br />
              <input
                type="text"
                id="weight"
                className="input check-input"
                placeholder="Weight"
                value={weight === null ? '' : weight}
                onChange={inputWeight}
              />
            </EditUserContentRow>
            <EditUserContentRow>
              <label htmlFor="bike-weight">자전거 무게</label>
              <span className="message success"> (선택 사항입니다)</span>
              <br />
              <input
                type="text"
                id="bike-weight"
                className="input check-input"
                placeholder="Bike Weight"
                value={bikeweight === null ? '' : bikeweight}
                onChange={inputBikeweight}
              />
            </EditUserContentRow>
            <div>
              <input
                type="checkbox"
                id="open"
                className="input check-input"
                placeholder="Open"
                value={open}
                onChange={inputOpen}
              />
              <label htmlFor="open">정보를 공개하시겠습니까?</label>
            </div>
            <div>
              <button className="signup-btn" type="submit">
                가입
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default editUser;
