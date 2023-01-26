import React, { useState } from 'react';

const Navbar = ({ user }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const menuArr = [
    { name: '활동내역', content: '활동내역' },
    { name: '운동기록', content: '운동기록' },
    { name: '모임일정', content: '모임일정' },
  ];

  const selectMenu = index => {
    setCurrentTab(index);
  };

  return (
    // bootstrap의 tab 적용하기
    <div>
      {menuArr.map((el, index) => (
        <button
          key={el.name}
          className={index === currentTab ? 'submenu focused' : 'submenu'}
          onClick={() => selectMenu(index)}
        >
          {el.name}
        </button>
      ))}
      <div>
        {user.nickname}님의
        {menuArr[currentTab].content}
      </div>
    </div>
  );
};

export default Navbar;
