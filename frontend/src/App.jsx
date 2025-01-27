import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import MainPage from './components/mainpage/MainPage'
import Dashboard from './components/Dashboard/Dashboard'
import Linkpage from './components/Links/Linkpage'
import Analytic from './components/Analytics/Analytic'



const App = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path='/mainpage' element={<MainPage/>}>
              <Route path='dashboard' element={<Dashboard/>} />
              <Route path='link' element={<Linkpage/>} />
              <Route path='analytic' element={<Analytic/>} />
            </Route>
        </Routes>
    </>
  )
}

export default App;
