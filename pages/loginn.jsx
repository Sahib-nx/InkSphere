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

function Logn() {
  const [formData, setFormData] = useState({
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

  const handleLogin = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.email.trim() || !formData.password.trim()) {
      showNotification('Please fill in all fields', 'error')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        showNotification(data.message || 'Login successful!', 'success')
        
        // Clear form
        setFormData({
          email: '',
          password: ''
        })
        
        // Redirect after showing success message
        setTimeout(() => {
          router.push('/UserDashboard')
        }, 1500)
      } else {
        showNotification(data.message || 'Login failed. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Login error:', error)
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
      
      <div className="login-container">
        <div className="login-card">
          <div className="card-header">
            <h2>Welcome Back</h2>
            <p>Log in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
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

            <div className="forgot-password">
              <Link href="/forgot-password">Forgot password?</Link>
            </div>

            <button 
              type="submit" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span>Signing In...</span>
                  <i className="fa fa-spinner fa-spin"></i>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <i className="fa fa-sign-in-alt"></i>
                </>
              )}
            </button>
          </form>

          <div className="social-login">
            <p>Or sign in with</p>
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

          <div className="register-link">
            <p>Don't have an account? <Link href="/register">Sign Up</Link></p>
          </div>
        </div>
      </div>
      
      <Footer />
      
      <style jsx global>{`
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
        
        .login-btn.loading {
          opacity: 0.8;
          cursor: not-allowed;
        }
        
        .login-btn:disabled {
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

export default Logn