'use client'


import { useRouter } from 'next/navigation'
import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import '../styles/Login.css';
import Navbar from '@/components/Layout/Navbar'
import Footer from '@/components/Layout/Footer'
import Link from 'next/link';

function logn() {

    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const router = useRouter()

    const handleLogin = async (e) => {
        e.preventDefault()

        try {

            const url = "/api/user/login"

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (response.ok) {

                toast.success(data.message)

                setTimeout(() => {
                    router.push("/UserDashboard")
                }, 2000)
            } else {

                toast.error(data.message)
            }
        } catch (error) {

            console.log("Login Failed Try Again!!", error)

        };
    }





    return (

        <>
             <Navbar/>
            <div className="login-container">
                <div className="login-card">
                    <div className="card-header">
                        <h2>Welcome Back</h2>
                        <p>Log in to your account</p>
                    </div>

                    <form onSubmit={(e) => {
                        handleLogin(e, formData)
                        setFormData({
                            email: '',
                            password: ''
                        })
                    }} className="login-form">
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={formData.email ? 'has-value' : ''}
                                required />
                            <label htmlFor="email">Email Address</label>
                            <i className="fa fa-envelope input-icon"></i>
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={formData.password ? 'has-value' : ''}
                                required />
                            <label htmlFor="password">Password</label>
                            <i className="fa fa-lock input-icon"></i>
                        </div>

                        <div className="forgot-password">
                            <a href="#">Forgot password?</a>
                        </div>

                        <button type="submit" className="login-btn" onClick={handleLogin}>
                            <span>Sign In</span>
                            <i className="fa fa-sign-in-alt"></i>
                        </button>
                    </form>

                    <div className="social-login">
                        <p>Or sign in with</p>
                        <div className="social-buttons">
                            <button className="social-btn facebook">
                                <i className="fab fa-facebook-f"></i>
                            </button>
                            <button className="social-btn google">
                                <i className="fab fa-google"></i>
                            </button>
                            <button className="social-btn twitter">
                                <i className="fab fa-twitter"></i>
                            </button>
                        </div>
                    </div>

                    <div className="register-link">
                        <p>Don't have an account? <Link href={"/register"}>Sign Up</Link></p>
                    </div>
                </div>
            </div>
            <Footer/>
        </>

    )
}

export default logn