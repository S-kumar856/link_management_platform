import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'
import style from './MainPage.module.css'

const MainPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <Navbar />

            <div style={{ display: 'flex', height: '100vh' }}>
                {/* Sidebar */}
                <div className={style.sideBar}>
                    <div className={style.dashboard}>
                        <p onClick={() => navigate('dashboard')}>Dashboard</p>
                    </div>
                    <div className={style.link}>
                        <p onClick={() => navigate('link')}>Links</p>
                    </div>
                    <div className={style.analytics}>
                        <p onClick={() => navigate('link')}>Analytics</p>
                    </div>
                </div>

                {/* Main Content */}
                <div>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default MainPage
