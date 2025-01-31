import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import style from './Login.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../../assets/logo.svg';

const Login = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    // uesState for login form
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    // handling the form input
    const handleLoginForm = (e) => {
        const { name, value } = e.target;
        setLoginForm({ ...loginForm, [name]: value })
    }

    // handling the form submission
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        // sending the loginform data to the backend
        try {
            const response = await axios.post(`${apiUrl}/api/user/login`, loginForm);

            if (response.status === 200) {
                setLoginForm({
                    email: '',
                    password: ''
                });
                console.log(response.data.token)
                
                toast.success('User logged in successfully')
                localStorage.setItem('token', response.data.token);
                navigate('/mainpage/dashboard')
            }
            else {
                console.log(response.data)
                toast.error('Login failed')
            }

        } catch (error) {
            console.error(error.response.data)
            toast.error(error.response.data.message)
            // navigate('/')
        }
    };

    // if user already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
          toast.success("User Already Logged In");
          navigate('/mainpage/dashboard')
        }
      },[])


    return (
        <>
            <div className={style.registerMain_container}>
                <div className={style.registerLeft_container}>
                    <div className={style.logo}>
                        <img src={logo} alt="logo.png" />
                    </div>
                </div>
                <div className={style.registerRight_container}>
                    <div className={style.buttons}>
                        <button className={style.signUpBtn} onClick={()=> navigate('/')}>SignUp</button>
                        <button className={style.loginBtn} onClick={()=> navigate('/login')}>Login</button>
                    </div>
                    <div className={style.registerForm_contant}>
                        <div className={style.join_us}>
                            <p>Login</p>
                        </div>


                        <form onSubmit={handleLoginSubmit} className={style.registerForm}>
                            <input type="email"
                                name='email'
                                id='email'
                                placeholder='Email id'
                                value={loginForm.email}
                                onChange={handleLoginForm}
                                required
                            /> <br />

                            <input type="password"
                                name='password'
                                id='password'
                                placeholder='Password'
                                value={loginForm.password}
                                onChange={handleLoginForm}
                                required
                            /> <br />
                            <button type='submit'>Login</button>
                        </form>
                        <div className={style.already_have_account}>
                            <p>Don’t have an account? <Link to={'/'}>SignUp</Link></p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
