import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './components/Register/Register'
import Login from './components/Login/Login'

const App = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    </>
  )
}

export default App
