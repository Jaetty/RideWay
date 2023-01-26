import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
// import { PrivateRoute } from './PrivateRoute';

const MainPage = lazy(() => import('../pages/Main/Main'));
const LoginPage = lazy(() => import('../pages/Login/Login'));
const SignupPage = lazy(() => import('../pages/Signup/Signup'));
const MyPage = lazy(() => import('../pages/MyPage/MyPage'));
const IDSearchPage = lazy(() => import('../pages/Login/IDSearch'));
const PwdSearchPage = lazy(() => import('../pages/Login/PwdSearch'));
const PwdEditPage = lazy(() => import('../pages/Login/PwdEdit'));
const MapPage = lazy(() => import('../pages/Map/Map'));
const CreateArticlePage = lazy(() =>
  import('../pages/Community/CreateArticle'),
);
const FreePage = lazy(() => import('../pages/Community/Free'));
const DetailArticlePage = lazy(() =>
  import('../pages/Community/DetailArticle'),
);
const EditUser = lazy(() => import('../pages/EditUser/EditUser'));
const UserDelete = lazy(() => import('../pages/Login/UserDelete'));

const Router = () => {
  console.log('Router.jsx');
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/user/login" element={<LoginPage />} />
        <Route path="/user/signup" element={<SignupPage />} />
        <Route path="/user/edituser" element={<EditUser />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/user/findId" element={<IDSearchPage />} />
        <Route path="/user/findPwd" element={<PwdSearchPage />} />
        <Route path="/user/editPwd" element={<PwdEditPage />} />
        <Route path="/community/create" element={<CreateArticlePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/community/free" element={<FreePage />} />
        <Route path="/community/free/detail" element={<DetailArticlePage />} />
        <Route path="/user/delete" element={<UserDelete />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
