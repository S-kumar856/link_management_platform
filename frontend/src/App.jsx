import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import MainPage from './components/mainpage/MainPage'
import Dashboard from './components/Dashboard/Dashboard'
import LinkPage from './components/Dashboard/links'


const App = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path='/mainpage' element={<MainPage/>}>
              <Route path='dashboard' element={<Dashboard/>} />
              <Route path='link' element={<LinkPage/>} />
            </Route>
        </Routes>
    </>
  )
}

export default App;
