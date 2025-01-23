import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import style from './Login.module.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
    const navigate = useNavigate();

    // uesState for login form
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    // handling the form input
    const handleLoginForm = (e) => {
        const { name, value} = e.target;
        setLoginForm({...loginForm, [name]: value})
    }

    // handling the form submission
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        
        // sending the loginform data to the backend
        try {
            const response = await axios.post('http://localhost:4000/api/user/login', loginForm);

            if(response.status === 200){
                
                setLoginForm({
                    email: '',
                    password: ''
                });
                toast.success('User logged in successfully')
            }
            else{
                console.log(response.data)
                toast.error('Login failed')
            }

        } catch (error) {
            console.error(error.response.data)
            toast.error(error.response.data.message)
            // navigate('/')
        }
    };

    
    return (
        <>
            <div>
                <form onSubmit={handleLoginSubmit}>
                    <input type="email"
                        name='email'
                        id='email'
                        placeholder='Email id'
                        value={loginForm.email}
                        onChange={handleLoginForm}
                    />

                    <input type="password"
                        name='password'
                        id='password'
                        placeholder='Password'
                        value={loginForm.password}
                        onChange={handleLoginForm} 
                        />
                    <button type='submit'>Login</button>
                </form>
                <div>
                    <p>Don’t have an account? <Link to={'/'}>SignUp</Link></p>
                </div>
            </div>

        </>
    )
}

export default Login
