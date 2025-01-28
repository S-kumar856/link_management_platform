import React, { useEffect, useState } from 'react';
import style from './Setting.module.css';
import axios from 'axios';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

const Setting = () => {
    const navigate = useNavigate();
    const [settingForm, setSettingForm] = useState({
        name: '',
        email: '',
        mobile: '',
    })

    // handle setting form
    const handleSettingForm = (e) => {
        const { name, value } = e.target;
        setSettingForm({ ...settingForm, [name]: value })
    }

    useEffect(() => {
        fetchUser();
    }, [])
    // fetching the user data from the dackend
    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/user/getusers',
                {
                    headers: { Authorization: `${localStorage.getItem("token")}` },
                });
            const userData = response.data.user;
            setSettingForm({
                name: userData.name,
                email: userData.email,
                mobile: userData.mobile,
            })

        } catch (error) {
            console.log("Failed to fetch user data", error)
        }
    };

    // submitting the setting form
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const updateUser = {};
        if (settingForm.name) updateUser.name = settingForm.name
        if (settingForm.email) updateUser.email = settingForm.email
        if (settingForm.mobile) updateUser.mobile = settingForm.mobile

        try {
            const response = await axios.put('http://localhost:4000/api/user/updateusers',
                updateUser,
                {
                    headers: { Authorization: `${localStorage.getItem("token")}` },
                })

            toast.success("Profile updated successfully!", {
                position: "top-right",
            });

            // If email is updated, logout user
            if (updateUser.email) {
                logout();
            }
        } catch (error) {
            console.log(error)
        }
    }

    // logout function
    const logout = () => {
        localStorage.removeItem("token");
        navigate('/login')
    };

    // delete the user
    const deleteUser = async () => {
        try {
            const response = await axios.delete('http://localhost:4000/api/user/deleteusers',
                {
                    headers: { Authorization: `${localStorage.getItem("token")}` },
                },
            )

            toast.success("user account deleted successfully")
            navigate('/')
        } catch (error) {
            console.log("error in deleting user account", error);
            toast.error("error in deleting user account")
        }
    };

    return (
        <>
            <div className={style.setting_container}>
                <form onSubmit={handleFormSubmit} className={style.setting_form}>
                    <div className={style.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name"
                            placeholder='kumar'
                            value={settingForm.name}
                            onChange={handleSettingForm}
                        />
                    </div>

                    <div className={style.formGroup}>
                        <label htmlFor="name">Email id</label>
                        <input type="email" name="email"
                            placeholder='kumar@gmail.com'
                            value={settingForm.email}
                            onChange={handleSettingForm}
                        />
                    </div>

                    <div className={style.formGroup}>
                        <label htmlFor="name">Mobile no.</label>
                        <input type="number" name="mobile"
                            placeholder='1234567890'
                            value={settingForm.phone}
                            onChange={handleSettingForm}
                        />
                    </div>

                    <div className={style.setting_Btns}>
                        <div>
                            <button className={style.Save_Btn} type='submit'>Save Changes</button>
                        </div>
                        <div>
                            <button className={style.delete_Btn} onClick={deleteUser}>Delete Account</button>
                        </div>
                    </div>
                </form>
            </div>

        </>
    )
}

export default Setting
