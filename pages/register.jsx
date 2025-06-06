'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Navbar from '../components/Layout/Navbar'
import Footer from '../components/Layout/Footer'
import Link from 'next/link'

// Custom notification component
const Notification = ({ message, type, isVisible, onClose }) => {
  if (!isVisible) return null

  return (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        <span className="notification-message">{message}</span>
        <button onClick={onClose} className="notification-close">
          <i className="fa fa-times"></i>
        </button>
      </div>
    </div>
  )
}

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  
  const [notification, setNotification] = useState({
    message: '',
    type: '',
    isVisible: false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const showNotification = (message, type) => {
    setNotification({
      message,
      type,
      isVisible: true
    })
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }))
    }, 5000)
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }))
  }

  const validateForm = () => {
    const { username, email, password } = formData

    if (!username.trim()) {
      showNotification('Username is required', 'error')
      return false
    }

    if (username.trim().length < 3) {
      showNotification('Username must be at least 3 characters long', 'error')
      return false
    }

    if (!email.trim()) {
      showNotification('Email is required', 'error')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address', 'error')
      return false
    }

    if (!password) {
      showNotification('Password is required', 'error')
      return false
    }

    if (password.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error')
      return false
    }

    return true
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        showNotification(data.message || 'Account created successfully!', 'success')
        
        // Clear form
        setFormData({
          username: '',
          email: '',
          password: ''
        })
        
        // Redirect after showing success message
        setTimeout(() => {
          router.push('/UserDashboard')
        }, 1500)
      } else {
        showNotification(data.message || 'Registration failed. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Registration error:', error)
      showNotification('Network error. Please check your connection and try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      
      {/* Custom Notification */}
      <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      
      <div className="register-container">
        <div className="register-card">
          <div className="card-header">
            <h2>Create Account</h2>
            <p>Join our social community</p>
          </div>

          <form onSubmit={handleRegister} className="register-form">
            <div className="form-group">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={formData.username ? 'has-value' : ''}
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
                required
              />
              <label htmlFor="password">Password</label>
              <i className="fa fa-lock input-icon"></i>
            </div>

            <button 
              type="submit" 
              className={`register-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span>Creating Account...</span>
                  <i className="fa fa-spinner fa-spin"></i>
                </>
              ) : (
                <>
                  <span>Join Now</span>
                  <i className="fa fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          <div className="social-register">
            <p>Or sign up with</p>
            <div className="social-buttons">
              <button className="social-btn facebook" type="button">
                <i className="fab fa-facebook-f"></i>
              </button>
              <button className="social-btn google" type="button">
                <i className="fab fa-google"></i>
              </button>
              <button className="social-btn twitter" type="button">
                <i className="fab fa-twitter"></i>
              </button>
            </div>
          </div>

          <div className="login-link">
            <p>Already have an account? <Link href="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
      
      <Footer />
      
      <style jsx>{`
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          min-width: 300px;
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
          overflow: hidden;
        }
        
        .notification.success {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
        }
        
        .notification.error {
          background: linear-gradient(135deg, #f44336, #d32f2f);
          color: white;
        }
        
        .notification-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
        }
        
        .notification-message {
          flex: 1;
          font-weight: 500;
        }
        
        .notification-close {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 4px;
          margin-left: 12px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .notification-close:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        .register-btn.loading {
          opacity: 0.8;
          cursor: not-allowed;
        }
        
        .register-btn:disabled {
          pointer-events: none;
        }
        
        .form-group input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @media (max-width: 480px) {
          .notification {
            right: 10px;
            left: 10px;
            min-width: auto;
          }
        }
      `}</style>
    </>
  )
}

export default Register