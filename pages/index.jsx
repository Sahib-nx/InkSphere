import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import HeroSection from '../components/Home/HeroSection';
import BlogPreview from '../components/Home/BlogPreview';
import styles from '../styles/Home.module.css';
import { dummyBlogs } from '../lib/blogData'

export default function Home() {
  const [blogs, setBlogs] = useState([]); //  Initialize as empty array
  const [loading, setLoading] = useState(false);
  const [showInitialLoadingg, setShowInitialLoadingg] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialLoadingg(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs(dummyBlogs); // ← fallback to static blogs
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (showInitialLoadingg) {
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
              Loading Home
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
        }
      `}</style>
      </AnimatePresence>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <HeroSection />
        <BlogPreview blogs={blogs} loading={loading} />
      </main>
      <Footer />

    </div>
  );
}
