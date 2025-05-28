
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import BlogCard from '../components/UI/BlogCard';
import useAuthCheck from '@/utils/IsAuthorised';


const UserDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [showInitialLoading, setShowInitialLoading] = useState(true);
  const router = useRouter();
  const { authorized, authLoading } = useAuthCheck();

  // Initial loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      const res = await fetch('/api/user/logout', {
        method: 'POST',
      });
      if (res.ok) {
        router.push('/logn');
      } else {
        alert('Logout failed');
      }
    } catch (err) {
      alert('Logout failed');
    } finally {
      setShowLogoutModal(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const userRes = await fetch('/api/user/getUser');
        const userData = await userRes.json();
        const name = userData.payload?.username;
        setUsername(name || '');

        const blogsRes = await fetch(`/api/blogs?author=${encodeURIComponent(name)}`);
        const blogsData = await blogsRes.json();
        setBlogs(blogsData);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setShowInitialLoading(false);
      }
    };

    if (authorized && !showInitialLoading) {
      fetchUserBlogs();
    }
  }, [authorized, showInitialLoading]);

  const handleAddBlog = () => {
    router.push('/add-blog');
  };

  const handleEditBlog = (blogId) => {
    router.push(`/edit-blog/${blogId}`);
  };

  const handleDeleteBlog = (blogId) => {
    const blogToDelete = blogs.find(blog => blog._id === blogId);
    setBlogToDelete(blogToDelete);
    setShowDeleteModal(true);
  };

  const confirmDeleteBlog = async () => {
    if (!blogToDelete) return;
    
    try {
      setShowInitialLoading(true);
      const res = await fetch('/api/blogs/deleteBlog', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: blogToDelete._id }),
      });
      if (res.ok) {
        setBlogs(prev => prev.filter(blog => blog._id !== blogToDelete._id));
        setShowDeleteModal(false);
        setBlogToDelete(null);
      } else {
        setError('Failed to delete blog.');
      }
    } catch (err) {
      setError('An error occurred while deleting.');
    } finally {
      setShowInitialLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  // StatCard component
  const StatCard = ({ title, value }) => (
    <motion.div 
      className="stat-card"
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </motion.div>
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2
      }
    }
  };

  // Show initial loading animation
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
              Loading Dashboard
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

  if (authLoading) {
    return (
      <motion.div 
        className="dashboard-loading"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="loading-spinner"></div>
        Loading your dashboard...
      </motion.div>
    );
  }

  return (
    <>
      <Navbar />
      <motion.div 
        className="dashboard"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.section className="dashboard-header" variants={itemVariants}>
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Welcome Back, {username} 👋
          </motion.h1>
          <motion.button 
            onClick={handleLogout} 
            className="logout-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </motion.button>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Here's a quick overview of your blog activity.
          </motion.p>
        </motion.section>

        <motion.section className="dashboard-stats" variants={itemVariants}>
          <StatCard title="Total Blogs" value={blogs.length} />
        </motion.section>

        <motion.section className="dashboard-blogs-header" variants={itemVariants}>
          <h2>Your Blogs</h2>
          <motion.button 
            onClick={handleAddBlog} 
            className="add-blog-btn"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            + Add New Blog
          </motion.button>
        </motion.section>

        <AnimatePresence>
          {error && (
            <motion.p 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {!error && blogs.length === 0 && (
          <motion.p 
            className="no-blogs"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            You haven't created any blogs yet.
          </motion.p>
        )}

        <motion.div 
          className="blogs-grid"
          variants={containerVariants}
        >
          <AnimatePresence>
            {blogs.map((blog, index) => (
              <motion.div 
                key={blog._id} 
                className="dashboard-blog-wrapper"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
                layout
              >
                <BlogCard blog={blog} />
                <motion.div 
                  className="dashboard-actions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button 
                    className="edit-btn" 
                    onClick={() => handleEditBlog(blog._id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button 
                    className="delete-btn" 
                    onClick={() => handleDeleteBlog(blog._id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="logout-modal"
              initial={{ scale: 0.7, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: -50 }}
              transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 500 }}
            >
              <div className="modal-header">
                <div className="warning-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5C4.45 21 4 20.55 4 20V4C4 3.45 4.45 3 5 3H12L20 11V20C20 20.55 19.55 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3V9H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 15L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Confirm Logout</h3>
              </div>
              
              <div className="modal-content">
                <p className="warning-text">
                  Are you sure you want to logout?
                </p>
                <p className="warning-subtext">
                  You will be redirected to the login page and will need to sign in again to access your dashboard.
                </p>
              </div>

              <div className="modal-actions">
                <motion.button 
                  className="cancel-btn"
                  onClick={cancelLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button 
                  className="confirm-logout-btn"
                  onClick={confirmLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Yes, Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="delete-modal"
              initial={{ scale: 0.7, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: -50 }}
              transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 500 }}
            >
              <div className="modal-header">
                <div className="warning-icon">⚠️</div>
                <h3>Delete Blog Post</h3>
              </div>
              
              <div className="modal-content">
                <p className="warning-text">
                  Are you sure you want to delete this blog post?
                </p>
                {blogToDelete && (
                  <div className="blog-preview">
                    <strong>"{blogToDelete.title || 'Untitled Blog'}"</strong>
                  </div>
                )}
                <p className="warning-subtext">
                  This action cannot be undone. The blog post will be permanently removed.
                </p>
              </div>

              <div className="modal-actions">
                <motion.button 
                  className="cancel-btn"
                  onClick={cancelDelete}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button 
                  className="confirm-delete-btn"
                  onClick={confirmDeleteBlog}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={showInitialLoading}
                >
                  {showInitialLoading ? 'Deleting...' : 'Yes, Delete'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      <style jsx global>{`
       
      `}</style>
    </>
  );
};

export default UserDashboard;