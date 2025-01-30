import React, { useEffect, useState } from 'react';
import style from './Navbar.module.css';
import logo from '../../assets/logo.svg';
import axios from 'axios';
import { useAppContext } from '../../components/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { toggleCreateForm } = useAppContext();
    const [showLogout, setShowLogout] = useState(false);
    const [userName, setUserName] = useState("");
    const [greeting, setGreeting] = useState("");

    const { searchTerm, setSearchTerm } = useAppContext();

    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, [])

    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/user/getusers',
                {
                    headers: { Authorization: `${localStorage.getItem("token")}` },
                });
            const userData = response.data.user;
            setUserName({
                name: userData.name,
            })

        } catch (error) {
            console.log("Failed to fetch user data", error)
        }

        // greeting
        if (d.getHours() >= 0 && d.getHours() < 12) {
            setGreeting("morning");
          }
          if (d.getHours() >= 12 && d.getHours() < 16) {
            setGreeting("afternoon");
          } else {
            setGreeting("evening");
          }
    };


    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("user Logged out successfully")
        navigate('/login')
    };

    const d = new Date();
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" }); 
    const monthName = d.toLocaleDateString("en-US", { month: "short" }); 
    const yearLastTwo = d.getFullYear().toString().slice(-2); // 25

    const formattedDate = `${dayName} ${monthName} ${yearLastTwo}`;
    // const date = new Date();

    return (
        <>
            <div className={style.Navbar}>
                <div className={style.Logo}>
                    <img src={logo} alt="Logo.png" />
                </div>
                <div className={style.right_navbar}>
                    <div className={style.profile_name}>
                    <span>☀️</span>
                    <div>
                        <span>Good {greeting}, {userName.name}</span>
                        <p>{formattedDate}</p>
                    </div>
                    </div>
                    <div className={style.Nav_Acton}>
                        <button className={style.create_button} onClick={toggleCreateForm}>+ Create new</button>
                        <div className={style.search}>

                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input type="text"
                                placeholder='Search by remarks'
                                className={style.Nav_search}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {showLogout &&
                            <div className={style.logoutDiv}>
                                <button className={style.logoutBtn} onClick={handleLogout}>Logout</button>
                            </div>
                        }

                        <div className={style.profile_circle} onClick={() => setShowLogout(!showLogout)}>
                            {userName?.name?.slice(0, 2).toUpperCase()}
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar


