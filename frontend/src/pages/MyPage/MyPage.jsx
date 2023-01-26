import React from 'react';
import { useSelector } from 'react-redux';
import { UserNavbar } from '../../components/User_Navbar';

const MyPage = () => {
  const user = useSelector(state => state.myPage.user);
  const address = `${user.si} ${user.gun} ${user.dong}`;
  return (
    <div>
      <div>
        <h1>마이페이지</h1>
      </div>
      <div>
        <UserNavbar user={user} />
      </div>
      <div>
        <img src={user.image_path} alt="프로필 사진" />
      </div>
      <div>
        <h3>{user.nickname} 님</h3>
        <p>나이 {user.age}</p>
        <p>성별 {user.gender}</p>
        <p>주소 {address}</p>
      </div>
      <hr />
    </div>
  );
};

export default MyPage;
