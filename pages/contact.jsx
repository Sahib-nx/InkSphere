'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useEffect } from 'react';

export default function Contact() {
  const [showInitialLoading, setShowInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState({
    type: '', // 'success', 'error', or ''
    message: '',
    visible: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Name can only contain letters and spaces';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'subject':
        if (!value.trim()) return 'Subject is required';
        if (value.trim().length < 5) return 'Subject must be at least 5 characters';
        return '';
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return '';
      default:
        return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      setSubmitStatus({
        type: 'error',
        message: 'Please fix the errors below before submitting.',
        visible: true
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '', visible: false });
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate random success/error for demo (90% success rate)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
          visible: true
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTouched({});
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Sorry, there was an error sending your message. Please try again or contact us directly.',
        visible: true
      });
    } finally {
      setIsSubmitting(false);
      // Auto hide message after 6 seconds
      setTimeout(() => {
        setSubmitStatus(prev => ({ ...prev, visible: false }));
      }, 6000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const contactCardVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 25px 50px rgba(94, 96, 206, 0.15)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Message notification variants
  const messageVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(94, 96, 206, 0.3)",
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  const inputFocusVariants = {
    focus: {
      scale: 1.02,
      borderColor: "#5e60ce",
      boxShadow: "0 0 0 3px rgba(94, 96, 206, 0.1)",
      transition: {
        duration: 0.2
      }
    }
  };

  if (showInitialLoading) {
    return (
      <AnimatePresence>
        <motion.div
          className="initial-loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="loading-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              className="loading-logo"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div className="logo-inner">
                <div className="logo-circle"></div>
                <div className="logo-dot"></div>
              </div>
            </motion.div>

            <motion.h2
              className="loading-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Loading About
            </motion.h2>

            <motion.div
              className="loading-dots"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              >•</motion.span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              >•</motion.span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              >•</motion.span>
            </motion.div>

            <motion.div
              className="loading-progress-bar"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.3, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
        <style jsx global>{`
        /* Initial Loading Animation Styles */
        .initial-loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            overflow: hidden;
        }

        .initial-loading-overlay::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background:
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 75, 162, 0.4) 0%, transparent 50%);
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {

            0%,
            100% {
                transform: translateY(0px) rotate(0deg);
            }

            50% {
                transform: translateY(-20px) rotate(180deg);
            }
        }

        .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
            z-index: 1;
            position: relative;
        }

        .loading-logo {
            width: 120px;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .logo-inner {
            position: relative;
            width: 80px;
            height: 80px;
        }

        .logo-circle {
            width: 80px;
            height: 80px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid #ffffff;
            border-radius: 50%;
            animation: logoSpin 1.5s linear infinite;
            position: relative;
        }

        .logo-circle::before {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            animation: logoSpin 3s linear infinite reverse;
        }

        .logo-dot {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            background: linear-gradient(45deg, #ffffff, rgba(255, 255, 255, 0.8));
            border-radius: 50%;
            box-shadow:
                0 0 20px rgba(255, 255, 255, 0.6),
                0 0 40px rgba(255, 255, 255, 0.4),
                0 0 60px rgba(255, 255, 255, 0.2);
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes logoSpin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        @keyframes pulse {

            0%,
            100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }

            50% {
                transform: translate(-50%, -50%) scale(1.2);
                opacity: 0.8;
            }
        }

        .loading-title {
            color: #ffffff;
            font-size: 1.8rem;
            font-weight: 600;
            margin: 0;
            text-align: center;
            letter-spacing: 0.5px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .loading-dots {
            display: flex;
            gap: 0.5rem;
            font-size: 2rem;
            color: rgba(255, 255, 255, 0.8);
        }

        .loading-progress-bar {
            height: 3px;
            background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.6));
            border-radius: 2px;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            position: relative;
            overflow: hidden;
            width: 200px;
        }

        .loading-progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
            0% {
                transform: translateX(-100%);
            }

            100% {
                transform: translateX(100%);
            }
        }`}</style>
      </AnimatePresence>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '60%',
        height: '120%',
        background: 'linear-gradient(135deg, rgba(94, 96, 206, 0.03) 0%, rgba(72, 191, 227, 0.05) 100%)',
        borderRadius: '50%',
        zIndex: 0
      }} />

      <Navbar />

      <main style={{
        flex: 1,
        padding: '6rem 0',
        position: 'relative',
        zIndex: 1
      }}>
        <motion.div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 2rem'
          }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            style={{
              textAlign: 'center',
              marginBottom: '5rem'
            }}
            variants={itemVariants}
          >
            <motion.h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '800',
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, #5e60ce 0%, #7400b8 50%, #48bfe3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
                lineHeight: '1.1'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Get In Touch
            </motion.h1>
            <motion.p
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Have a question or want to contribute? We'd love to hear from you!
            </motion.p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
            '@media (max-width: 1100px)': {
              gridTemplateColumns: '1fr',
              gap: '2rem'
            }
          }}>
            <motion.div
              variants={formVariants}
            >
              <motion.form
                onSubmit={handleSubmit}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: 'clamp(2rem, 4vw, 3rem)',
                  borderRadius: '24px',
                  boxShadow: '0 20px 60px rgba(94, 96, 206, 0.08)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                whileHover={{
                  boxShadow: '0 25px 70px rgba(94, 96, 206, 0.12)',
                  transition: { duration: 0.3 }
                }}
              >
                {/* Success/Error Message at top of form */}
                {submitStatus.visible && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={messageVariants}
                    style={{
                      marginBottom: '2rem',
                      padding: '1.25rem 1.5rem',
                      borderRadius: '12px',
                      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      background: submitStatus.type === 'success'
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(21, 128, 61, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(185, 28, 28, 0.95) 100%)',
                      color: 'white'
                    }}
                  >
                    <div style={{ fontSize: '1.2rem' }}>
                      {submitStatus.type === 'success' ? '✓' : '⚠'}
                    </div>
                    <div style={{ flex: 1 }}>
                      {submitStatus.message}
                    </div>
                    <button
                      onClick={() => setSubmitStatus(prev => ({ ...prev, visible: false }))}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      ✕
                    </button>
                  </motion.div>
                )}

                {['name', 'email', 'subject'].map((field, index) => (
                  <motion.div
                    key={field}
                    style={{ marginBottom: '2rem' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <label style={{
                      display: 'block',
                      marginBottom: '0.75rem',
                      fontWeight: '600',
                      color: errors[field] ? '#ef4444' : '#333',
                      fontSize: '1rem',
                      textTransform: 'capitalize',
                      transition: 'color 0.3s ease'
                    }}>
                      {field} {field !== 'subject' && <span style={{ color: '#ef4444' }}>*</span>}
                      {field === 'subject' && <span style={{ color: '#ef4444' }}>*</span>}
                    </label>
                    <motion.input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                      required
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        border: `2px solid ${errors[field] ? '#ef4444' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        backgroundColor: isSubmitting ? '#f8fafc' : '#fafafa',
                        boxSizing: 'border-box',
                        opacity: isSubmitting ? 0.6 : 1
                      }}
                      whileFocus={{
                        borderColor: errors[field] ? '#ef4444' : '#5e60ce',
                        backgroundColor: '#fff',
                        boxShadow: `0 0 0 4px ${errors[field] ? 'rgba(239, 68, 68, 0.1)' : 'rgba(94, 96, 206, 0.1)'}`,
                        scale: 1.01
                      }}
                      onFocus={(e) => {
                        if (!isSubmitting) {
                          e.target.style.borderColor = errors[field] ? '#ef4444' : '#5e60ce';
                          e.target.style.backgroundColor = '#fff';
                          e.target.style.boxShadow = `0 0 0 4px ${errors[field] ? 'rgba(239, 68, 68, 0.1)' : 'rgba(94, 96, 206, 0.1)'}`;
                        }
                      }}
                      onBlurCapture={(e) => {
                        e.target.style.borderColor = errors[field] ? '#ef4444' : '#e2e8f0';
                        e.target.style.backgroundColor = isSubmitting ? '#f8fafc' : '#fafafa';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors[field] && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          color: '#ef4444',
                          fontSize: '0.875rem',
                          marginTop: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <span>⚠</span> {errors[field]}
                      </motion.p>
                    )}
                  </motion.div>
                ))}

                <motion.div
                  style={{ marginBottom: '2.5rem' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <label style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontWeight: '600',
                    color: errors.message ? '#ef4444' : '#333',
                    fontSize: '1rem',
                    transition: 'color 0.3s ease'
                  }}>
                    Message <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <motion.textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    required
                    rows="5"
                    placeholder="Tell us about your project, question, or how we can help you..."
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      border: `2px solid ${errors.message ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: '12px',
                      fontSize: '1rem',
                      resize: 'vertical',
                      minHeight: '120px',
                      backgroundColor: isSubmitting ? '#f8fafc' : '#fafafa',
                      transition: 'all 0.3s ease',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      opacity: isSubmitting ? 0.6 : 1
                    }}
                    whileFocus={{
                      borderColor: errors.message ? '#ef4444' : '#5e60ce',
                      backgroundColor: '#fff',
                      boxShadow: `0 0 0 4px ${errors.message ? 'rgba(239, 68, 68, 0.1)' : 'rgba(94, 96, 206, 0.1)'}`,
                      scale: 1.01
                    }}
                    onFocus={(e) => {
                      if (!isSubmitting) {
                        e.target.style.borderColor = errors.message ? '#ef4444' : '#5e60ce';
                        e.target.style.backgroundColor = '#fff';
                        e.target.style.boxShadow = `0 0 0 4px ${errors.message ? 'rgba(239, 68, 68, 0.1)' : 'rgba(94, 96, 206, 0.1)'}`;
                      }
                    }}
                    onBlurCapture={(e) => {
                      e.target.style.borderColor = errors.message ? '#ef4444' : '#e2e8f0';
                      e.target.style.backgroundColor = isSubmitting ? '#f8fafc' : '#fafafa';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <span>⚠</span> {errors.message}
                    </motion.p>
                  )}
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  variants={buttonVariants}
                  whileHover={!isSubmitting ? "hover" : {}}
                  whileTap={!isSubmitting ? "tap" : {}}
                  style={{
                    width: '100%',
                    background: isSubmitting
                      ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                      : 'linear-gradient(135deg, #5e60ce 0%, #7400b8 50%, #48bfe3 100%)',
                    color: 'white',
                    padding: '1.25rem 2rem',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isSubmitting ? 0.7 : 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <span style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    {isSubmitting ? (
                      <>
                        <motion.div
                          style={{
                            width: '20px',
                            height: '20px',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%'
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </span>
                </motion.button>
              </motion.form>
            </motion.div>

            <motion.div
              variants={contactCardVariants}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}
            >
              {[
                { icon: FaEnvelope, title: 'Email Us', info: 'contact@techbloghub.com', delay: 0.7 },
                { icon: FaPhone, title: 'Call Us', info: '+1 (555) 123-4567', delay: 0.8 },
                { icon: FaMapMarkerAlt, title: 'Visit Us', info: '123 Tech Street\nSilicon Valley, CA 94000', delay: 0.9 }
              ].map((contact, index) => (
                <motion.div
                  key={contact.title}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '2.5rem',
                    borderRadius: '20px',
                    boxShadow: '0 15px 40px rgba(94, 96, 206, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  variants={cardHoverVariants}
                  whileHover="hover"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: contact.delay }}
                >
                  <motion.div
                    style={{
                      fontSize: '2.5rem',
                      background: 'linear-gradient(135deg, #5e60ce 0%, #48bfe3 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '1.5rem',
                      display: 'inline-block'
                    }}
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <contact.icon />
                  </motion.div>
                  <h3 style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    marginBottom: '0.75rem',
                    color: '#333'
                  }}>
                    {contact.title}
                  </h3>
                  <p style={{
                    color: '#666',
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-line'
                  }}>
                    {contact.info}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />

      <style jsx global>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          
          div[style*="padding: 'clamp"] {
            padding: 2rem !important;
          }
        }
        
        @media (max-width: 1100px) {
          div[style*="minmax(500px"] {
            grid-template-columns: 1fr !important;
          }
        }
        
        input:focus,
        textarea:focus {
          outline: none;
        }
        
        button:focus {
          outline: 2px solid #5e60ce;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}