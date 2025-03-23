import { useEffect, useState } from 'react';
import './App.css'

import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './pages/login/Login';
import { Dashboard } from './pages/child/dashboard/Dashboard';
import { Courrier } from './pages/child/courrier/Courrier';
import { Rapport } from './pages/child/rapport/Rapport';
import { Profile } from './pages/child/profile/Profile';
import Principal from './pages/principal/Principal';
import Introuvable from './pages/introuvable/Introuvable';
import Parametre from './pages/child/parametre/Parametre';

function App() {

  const token = sessionStorage.getItem('token');

  console.log(!!token);
  const isAuthenticated = !!token;

  useEffect(() => {


    if (localStorage.getItem('theme')) {
      if (localStorage.getItem('theme') == 'dark') {
        document.body.classList.remove('dark-mode-variables');
      } else if (localStorage.getItem('theme') == 'light') {
        document.body.classList.add('dark-mode-variables');
      }
    } else {
      localStorage.setItem('theme', 'light');
    }
  }, []);





  return (
    <BrowserRouter>
      <Routes >
        <Route path="*" element={<Introuvable />} />

        <Route path="/login" element={<Login />} />

        <Route path="/" element={isAuthenticated ? <Principal /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="dashboard" />} />

          <Route path="dashboard" exact element={<Dashboard />} />
          <Route path="courrier" exact element={<Courrier />} />
          <Route path="rapport" exact element={<Rapport />} />


          <Route path="profile" exact element={<Profile />} />

          <Route path="parametre" exact element={<Parametre />} />
        </Route>

      </Routes>

    </BrowserRouter>
  )
}

export default App
