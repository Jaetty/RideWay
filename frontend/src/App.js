import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Router } from './router/index';
import Layout from './components/Layout/Layout';

const App = () => {
  console.log('RideWay');
  return (
    <div>
      <BrowserRouter>
        <Layout />
        <Routes>
          <Route path="*" element={<Router />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
