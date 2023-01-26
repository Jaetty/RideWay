import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { address } from '../../components/Address';
import {
  checkIdAPI,
  checkNickAPI,
  sendMailAPI,
  checkCertiAPI,
} from '../../store/apis/userApi';
import { SIGN_UP_REQUEST } from '../../store/modules/userModule';
import { SignupContentRow } from './Signup.style';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 주소지 목록
  const options1 = ['전체', ...Object.keys(address)];
  const [options2, setOptions2] = useState([]);
  const [options3, setOptions3] = useState([]);

  // 중복 체크 및 이메일 인증 체크
  const [idCheck, setIdCheck] = useState(false);
  const [nickCheck, setNickCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);

  // 오류메시지 상태저장
  const [idMessage, setIdMessage] = useState('');
  const [nickMessage, setNickMessage] = useState('');
  const [ageMessage, setAgeMessage] = useState(
    '숫자만 입력해주세요 ex) 19900101',
  );
  const [emailMessage, setEmailMessage] = useState('');
  const [pwdMessage, setPwdMessage] = useState('');
  const [pwdChkMessage, setPwdChkMessage] = useState('');

  // 유효성 검사
  const [isId, setIsId] = useState(false);
  const [isNick, setIsNick] = useState(false);
  const [isAge, setIsAge] = useState(true);
  const [isEmail, setIsEmail] = useState(false);
  const [isPwd, setIsPwd] = useState(false);
  const [isPwdChk, setIsPwdChk] = useState(false);

  // 회원가입 변수 목록
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [si, setSi] = useState('');
  const [gun, setGun] = useState('');
  const [dong, setDong] = useState('');
  const [email, setEmail] = useState('');
  const [emailSend, setEmailSend] = useState(false);
  const [emailCerti, setEmailCerti] = useState(false);
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdchk, setPwdchk] = useState('');
  const [nick, setNick] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState(0);
  const [bikeweight, setBikeweight] = useState(0);
  const [imagePath, setImagePath] = useState();
  const [open, setOpen] = useState(false);

  // 생년월일 유효성 검사
  const [dicObj, setDicObj] = useState({
    1: 31,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
  });

  // Handler Function
  const inputAge = e => {
    let birth = e.target.value;
    if (birth.length > 0 && birth.length <= 10) {
      birth = birth
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{0,4})(\d{0,2})(\d{0,2})$/g, '$1-$2-$3')
        /* eslint-disable-next-line */
        .replace(/(\-{1,2})$/g, '');
      setAge(birth);
      setAgeMessage('숫자만 입력해주세요 ex) 19900101');
      setIsAge(false);
    } else if (birth.length === 0) {
      setAge(birth);
      setIsAge(true);
    }
    if (birth.length === 10) {
      const year = parseInt(age.slice(0, 4), 10);
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
        setDicObj({ ...dicObj, 2: 29 });
      else setDicObj({ ...dicObj, 2: 28 });
      if (
        parseInt(age.slice(0, 4), 10) > 2023 ||
        parseInt(age.slice(5, 7), 10) > 12 ||
        parseInt(age.slice(5, 7), 10) < 1 ||
        parseInt(birth.slice(8, 10), 10) < 1 ||
        parseInt(birth.slice(8, 10), 10) >
          parseInt(dicObj[parseInt(birth.slice(5, 7), 10)], 10)
      ) {
        setAgeMessage('올바른 생년월일을 입력해주세요');
        setIsAge(false);
        setAge(birth);
      } else {
        setAgeMessage('');
        setIsAge(true);
        setAge(birth);
      }
    }
  };
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
  const inputName = e => {
    setName(e.target.value);
    setIdCheck(false);
  };
  const inputNick = e => {
    setNick(e.target.value);
    setNickCheck(false);
    setNickMessage('');
  };
  const inputGender = e => {
    setGender(e.target.value);
  };
  const inputWeight = e => {
    const num = parseInt(e.target.value, 10);
    setWeight(num);
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

  // ID 유효성 검사
  const onChangeID = useCallback(e => {
    const idCurrent = e.target.value;
    setId(idCurrent);
    const idRegex = /^[a-z0-9]{5,20}$/;
    if (!idRegex.test(idCurrent)) {
      setIdMessage(
        '영어 소문자 + 숫자 조합으로 5자 이상 20자 이하로 입력해주세요!',
      );
      setIsId(false);
    } else {
      setIdMessage('ID 중복확인을 해주세요.');
      setIsId(true);
    }
  }, []);

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

  // 비밀번호 유효성 검사
  const onChangePassword = useCallback(e => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    const passwordCurrent = e.target.value;
    setPwd(passwordCurrent);

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
      setPwdchk(passwordCheckCurrent);

      if (pwd === passwordCheckCurrent) {
        setPwdChkMessage('비밀번호를 똑같이 입력했어요 : )');
        setIsPwdChk(true);
      } else {
        setPwdChkMessage('비밀번호가 틀려요. 다시 확인해주세요 ㅜ ㅜ');
        setIsPwdChk(false);
      }
    },
    [pwd],
  );

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

  // 아이디 중복 체크
  const CheckId = async e => {
    e.preventDefault();
    const result = await checkIdAPI(id);
    console.log(result);
    console.log('로직 바꿔야됨!!');
    if (!result) {
      setIdMessage('사용가능한 ID입니다');
      setIsId(true);
      setIdCheck(true);
    } else {
      setIdMessage('이미 존재하는 ID입니다');
      setIsId(false);
      setIdCheck(false);
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

  // 회원가입 버튼
  const signUpBtn = e => {
    e.preventDefault();
    if (name === '') {
      alert('이름을 입력해주세요');
    } else if (age === '') {
      alert('생년월일을 입력해주세요');
    } else if (
      parseInt(age.slice(0, 4), 10) > 2023 ||
      parseInt(age.slice(5, 7), 10) > 12 ||
      parseInt(age.slice(5, 7), 10) < 1 ||
      parseInt(age.slice(8, 10), 10) < 1 ||
      parseInt(age.slice(8, 10), 10) > dicObj[parseInt(age.slice(5, 7), 10)]
    ) {
      alert('올바른 생년월일을 입력해주세요');
    } else if (si === '' || gun === '' || dong === '') {
      alert('주소를 입력해주세요');
    } else if (email === '') {
      alert('이메일을 입력해주세요');
    } else if (id === '') {
      alert('아이디를 입력해주세요');
    } else if (pwd === '') {
      alert('비밀번호를 입력해주세요');
    } else if (pwdchk === '') {
      alert('비밀번호확인을 입력해주세요');
    } else if (nick === '') {
      alert('닉네임을 입력해주세요');
    } else if (gender === '') {
      alert('성별을 입력해주세요');
    } else if (pwd !== pwdchk) {
      alert('비밀번호를 확인해주세요');
    } else if (!idCheck) {
      alert('ID 중복검사를 해주세요');
    } else if (!nickCheck) {
      alert('닉네임 중복검사를 해주세요');
    } else if (!isId) {
      alert('올바른 ID를 입력해주세요');
    } else if (!isEmail) {
      alert('올바른 이메일을 입력해주세요');
    } else if (!isPwd) {
      alert('올바른 비밀번호를 입력해주세요');
    } else if (!isPwdChk) {
      alert('비밀번호가 일치하지 않습니다');
    } else {
      dispatch({
        type: SIGN_UP_REQUEST,
        data: {
          name,
          age,
          si,
          gun,
          dong,
          email,
          id,
          pwd,
          pwdchk,
          nick,
          gender,
          weight,
          bikeweight,
          imagePath,
          open,
          navigate,
        },
      });
    }
  };

  return (
    <div>
      <h1>회원가입</h1>
      <form onSubmit={signUpBtn} encType="multipart/form-data">
        <div>
          <label htmlFor="name">이름</label>
          <br />
          <input
            type="text"
            id="name"
            className="input check-input"
            placeholder="Name"
            onChange={inputName}
          />
        </div>
        <SignupContentRow>
          <label htmlFor="age">생년월일</label>
          <br />
          <input
            type="text"
            id="age"
            className="input check-input"
            placeholder="Age"
            value={age}
            onChange={inputAge}
          />
          <br />
          <span className={`message ${isAge ? 'success' : 'error'}`}>
            {ageMessage}
          </span>
          {/* {email.length > 0 && (
            <span className={`message ${isAge ? 'success' : 'error'}`}>
              {ageMessage}
            </span>
          )} */}
        </SignupContentRow>
        <div>
          <label htmlFor="address">주소</label>
          <br />
          <select onChange={inputSi} value={si} placeholder="시를 선택해주세요">
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
        <SignupContentRow>
          <label htmlFor="email">Email</label>
          <br />
          <input
            type="text"
            id="email"
            className="input check-input"
            placeholder="Email"
            onChange={onChangeEmail}
          />
          <button onClick={sendMail}>인증번호 전송</button>
          <br />
          {email.length > 0 && (
            <span className={`message ${isEmail ? 'success' : 'error'}`}>
              {emailMessage}
            </span>
          )}
        </SignupContentRow>
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
            onChange={e => {
              encodeFileToBase64(e.target.files[0]);
            }}
          />
        </div>
        <div className="preview">
          {imagePath && <img src={imagePath} alt="preview-img" />}
        </div>
        <SignupContentRow>
          <label htmlFor="id">아이디</label>
          <br />
          <input
            type="text"
            id="id"
            className="input check-input"
            placeholder="Id"
            onChange={onChangeID}
          />
          <button onClick={CheckId}>중복검사</button>
          <br />
          {id.length > 0 && (
            <span className={`message ${isId ? 'success' : 'error'}`}>
              {idMessage}
            </span>
          )}
        </SignupContentRow>
        <SignupContentRow>
          <label htmlFor="pwd">비밀번호</label>
          <br />
          <input
            type="password"
            id="pwd"
            className="input check-input"
            placeholder="Password"
            onChange={onChangePassword}
          />
          <br />
          {pwd.length > 0 && (
            <span className={`message ${isPwd ? 'success' : 'error'}`}>
              {pwdMessage}
            </span>
          )}
        </SignupContentRow>
        <SignupContentRow>
          <label htmlFor="pwdCheck">비밀번호 확인</label>
          <br />
          <input
            type="password"
            id="pwdCheck"
            className="input check-input"
            placeholder="Password Check"
            onChange={onChangePasswordCheck}
          />
          <br />
          {pwdchk.length > 0 && (
            <span className={`message ${isPwdChk ? 'success' : 'error'}`}>
              {pwdChkMessage}
            </span>
          )}
        </SignupContentRow>
        <SignupContentRow>
          <label htmlFor="nickname">닉네임</label>
          <br />
          <input
            type="text"
            id="nickname"
            className="input check-input"
            placeholder="Nickname"
            onChange={inputNick}
          />
          <button onClick={CheckNick}>중복검사</button>
          <br />
          {nick.length > 0 && (
            <span className={`message ${isNick ? 'success' : 'error'}`}>
              {nickMessage}
            </span>
          )}
        </SignupContentRow>
        <div>
          <label htmlFor="gender">성별</label>
          <br />
          <select
            onChange={inputGender}
            value={gender}
            placeholder="성별을 선택해주세요"
          >
            <option value="">성별</option>
            <option value="male">남자</option>
            <option value="female">여자</option>
          </select>
        </div>
        <SignupContentRow>
          <label htmlFor="weight">몸무게</label>
          <span className="message success"> (선택 사항입니다)</span>
          <br />
          <input
            type="text"
            id="weight"
            className="input check-input"
            placeholder="Weight"
            onChange={inputWeight}
          />
        </SignupContentRow>
        <SignupContentRow>
          <label htmlFor="bike-weight">자전거 무게</label>
          <span className="message success"> (선택 사항입니다)</span>
          <br />
          <input
            type="text"
            id="bike-weight"
            className="input check-input"
            placeholder="Bike Weight"
            onChange={inputBikeweight}
          />
        </SignupContentRow>
        <div>
          <input
            type="checkbox"
            id="open"
            className="input check-input"
            placeholder="Open"
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
  );
};

export default SignUp;
