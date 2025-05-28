'use client'
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import '../styles/Register.css';
import Link from 'next/link';


const register = () => {

    // const [username, setUsername] = useState("");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    //const formData = { username, email, password };

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {

            const url = "/api/user/register"

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {

                toast.success(data.message)

                setTimeout(() => {
                    router.push("/UserDashboard")
                }, 2000);

            } else {

                toast.error(data.message);
            }

        } catch (error) {

            console.log("Server Error Please Try Again:", error)

        }
    }

    return (

        <>
            <Navbar />
            <div className="register-container">
                <div className="register-card">
                    <div className="card-header">
                        <h2>Create Account</h2>
                        <p>Join our social community</p>
                    </div>

                    <form onSubmit={(e) => {
                        handleRegister(e, formData);
                        setFormData({
                            username: '',
                            email: '',
                            password: ''
                        });
                    }} className="register-form">
                        <div className="form-group">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={formData.username ? 'has-value' : ''}
                                required
                            />
                            <label htmlFor="username">Username</label>
                            <i className="fa fa-user input-icon"></i>
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={formData.email ? 'has-value' : ''}
                                required
                            />
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
                                required
                            />
                            <label htmlFor="password">Password</label>
                            <i className="fa fa-lock input-icon"></i>
                        </div>

                        <button type="submit" className="register-btn" onChange={handleRegister}>
                            <span>Join Now</span>
                            <i className="fa fa-arrow-right"></i>
                        </button>
                    </form>

                    <div className="social-register">
                        <p>Or sign up with</p>
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

                    <div className="login-link">
                        <p>Already have an account? <Link href={"/logn"}>Sign In</Link></p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default register