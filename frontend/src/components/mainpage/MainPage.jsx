import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'
import style from './MainPage.module.css'

const MainPage = () => {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState('dashboard');

    const handleNavigation = (route) => {
        setActiveItem(route);
        navigate(route);
    };

    return (
        <div className={style.MainPage}>
            <Navbar />

            <div className={style.sidebar_parent}>
                {/* Sidebar */}
                <div className={style.sideBar}>
                    <div className={style.dashboard}
                        onClick={() => handleNavigation('dashboard')}
                        style={{
                            backgroundColor: activeItem === 'dashboard' ? '#F3F7FD' : 'transparent'
                        }}
                    >
                        <i className="fa-solid fa-house"></i>
                        <p>Dashboard</p>
                    </div>
                    <div className={style.link}
                        onClick={() => handleNavigation('link')}
                        style={{
                            backgroundColor: activeItem === 'link' ? '#F3F7FD' : 'transparent'
                        }}
                    >
                        <i className="fa-solid fa-link"></i>
                        <p>Links</p>
                    </div>
                    <div className={style.analytics}
                        onClick={() => handleNavigation('analytic')}
                        style={{
                            backgroundColor: activeItem === 'analytic' ? '#F3F7FD' : 'transparent'
                        }}
                    >
                        <i className="fa-solid fa-arrow-trend-up"></i>
                        <p>Analytics</p>
                    </div>

                    <div className={style.setting}
                        onClick={() => handleNavigation('setting')}
                        style={{
                            backgroundColor: activeItem === 'setting' ? '#F3F7FD' : 'transparent'
                        }}
                    >
                        <i className="fa-solid fa-gear"></i>
                        <p>Settings</p>
                    </div>
                </div>



                {/* Main Content */}
                <div className={style.outlet}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default MainPage
