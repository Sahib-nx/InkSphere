'use client'

import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { FaCode, FaUsers, FaLightbulb, FaHeart } from 'react-icons/fa';
import { useEffect, useState } from 'react';


export default function About() {
  const [showInitialLoading, setShowInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <FaCode />,
      title: "Quality Content",
      description: "In-depth articles about the latest technologies and programming practices."
    },
    {
      icon: <FaUsers />,
      title: "Community Driven",
      description: "A platform where developers share knowledge and learn from each other."
    },
    {
      icon: <FaLightbulb />,
      title: "Innovation Focus",
      description: "Covering cutting-edge technologies and emerging trends in tech."
    },
    {
      icon: <FaHeart />,
      title: "Passion Project",
      description: "Built by developers, for developers, with love for the craft."
    }
  ];

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
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
      </AnimatePresence>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%)'
    }}>
      <Navbar />
      <main style={{
        flex: 1,
        padding: '6rem 0 4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, var(--primary-color, #5e60ce), var(--secondary-color, #48bfe3))',
            borderRadius: '50%',
            filter: 'blur(80px)',
            zIndex: 0
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: '250px',
            height: '250px',
            background: 'linear-gradient(135deg, var(--primary-light, #7400b8), var(--primary-color, #5e60ce))',
            borderRadius: '50%',
            filter: 'blur(60px)',
            zIndex: 0
          }}
        />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          position: 'relative',
          zIndex: 1
        }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              textAlign: 'center',
              marginBottom: '5rem'
            }}
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '800',
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, var(--primary-color, #5e60ce) 0%, var(--primary-light, #7400b8) 50%, var(--secondary-color, #48bfe3) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
                textShadow: '0 4px 20px rgba(94, 96, 206, 0.2)'
              }}
            >
              About TechBlog Hub
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                color: 'var(--text-light, #666)',
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: '1.7',
                fontWeight: '400'
              }}
            >
              Your premier destination for technology insights, programming tutorials, and developer resources.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              marginBottom: '4rem'
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '3rem 2rem',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(94, 96, 206, 0.1), 0 8px 25px rgba(0, 0, 0, 0.05)',
                  textAlign: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onHoverStart={() => { }}
                onHoverEnd={() => { }}
              >
                {/* Hover gradient overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(94, 96, 206, 0.05), rgba(72, 191, 227, 0.05))',
                    borderRadius: '20px',
                    zIndex: 0
                  }}
                />

                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.5 }
                  }}
                  style={{
                    fontSize: '3rem',
                    background: `linear-gradient(135deg, var(--primary-color, #5e60ce), var(--secondary-color, #48bfe3))`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '1.5rem',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {feature.icon}
                </motion.div>

                <motion.h3
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: 'var(--text-color, #333)',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {feature.title}
                </motion.h3>

                <motion.p
                  style={{
                    color: 'var(--text-light, #666)',
                    lineHeight: '1.7',
                    fontSize: '1rem',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <Footer />
      <style jsx global>{`

      `}</style>
    </div>
  );
}
