import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import BlogCard from '../components/UI/BlogCard';
import useAuthCheck from '@/utils/IsAuthorised';

// Animation variants
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  },
  card: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
    hover: { scale: 1.02, y: -5, transition: { duration: 0.2 } }
  }
};

// Reusable components
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

const LoadingSpinner = ({ message = "Loading..." }) => (
  <motion.div 
    className="dashboard-loading"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="loading-spinner"></div>
    {message}
  </motion.div>
);

const InitialLoading = () => (
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
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.span
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay }}
            >•</motion.span>
          ))}
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

const Modal = ({ show, onClose, title, children, actions, icon }) => (
  <AnimatePresence>
    {show && (
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal"
          initial={{ scale: 0.7, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: -50 }}
          transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 500 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="warning-icon">{icon}</div>
            <h3>{title}</h3>
          </div>
          <div className="modal-content">{children}</div>
          <div className="modal-actions">{actions}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const UserDashboard = () => {
  const [state, setState] = useState({
    blogs: [],
    username: '',
    error: '',
    showDeleteModal: false,
    showLogoutModal: false,
    blogToDelete: null,
    showInitialLoading: true,
    isDeleting: false
  });

  const router = useRouter();
  const { authorized, authLoading } = useAuthCheck();

  // Memoized handlers
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleError = useCallback((message) => {
    updateState({ error: message });
  }, [updateState]);

  // API calls
  const apiCall = useCallback(async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Request failed');
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Network error');
    }
  }, []);

  // Initialize dashboard
  useEffect(() => {
    const timer = setTimeout(() => updateState({ showInitialLoading: false }), 1500);
    return () => clearTimeout(timer);
  }, [updateState]);

  useEffect(() => {
    if (!authorized || state.showInitialLoading) return;

    const fetchUserData = async () => {
      try {
        const userData = await apiCall('/api/user/getUser');
        const username = userData.payload?.username || '';
        updateState({ username });

        const blogsData = await apiCall(`/api/blogs?author=${encodeURIComponent(username)}`);
        updateState({ blogs: blogsData, error: '' });
      } catch (error) {
        handleError(error.message);
      }
    };

    fetchUserData();
  }, [authorized, state.showInitialLoading, apiCall, updateState, handleError]);

  // Event handlers
  const handleLogout = useCallback(async () => {
    try {
      await apiCall('/api/user/logout', { method: 'POST' });
      router.push('/loginn');
    } catch {
      alert('Logout failed');
    }
    updateState({ showLogoutModal: false });
  }, [apiCall, router, updateState]);

  const handleDeleteBlog = useCallback(async () => {
    if (!state.blogToDelete) return;
    
    updateState({ isDeleting: true });
    try {
      await apiCall('/api/blogs/deleteBlog', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: state.blogToDelete._id })
      });

      updateState({
        blogs: state.blogs.filter(blog => blog._id !== state.blogToDelete._id),
        showDeleteModal: false,
        blogToDelete: null,
        error: ''
      });
    } catch (error) {
      handleError('Failed to delete blog');
    } finally {
      updateState({ isDeleting: false });
    }
  }, [state.blogToDelete, state.blogs, apiCall, updateState, handleError]);

  const navigation = {
    addBlog: () => router.push('/add-blog'),
    editBlog: (id) => router.push(`/edit-blog/${id}`),
    showDeleteModal: (blog) => updateState({ 
      blogToDelete: blog, 
      showDeleteModal: true 
    }),
    showLogoutModal: () => updateState({ showLogoutModal: true }),
    closeModals: () => updateState({ 
      showDeleteModal: false, 
      showLogoutModal: false, 
      blogToDelete: null 
    })
  };

  // Render conditions
  if (state.showInitialLoading) return <InitialLoading />;
  if (authLoading) return <LoadingSpinner message="Loading your dashboard..." />;

  return (
    <>
      <Navbar />
      <motion.div 
        className="dashboard"
        variants={animations.container}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.section className="dashboard-header" variants={animations.item}>
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Welcome Back, {state.username} 👋
          </motion.h1>
          <motion.button 
            onClick={navigation.showLogoutModal}
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

        {/* Stats */}
        <motion.section className="dashboard-stats" variants={animations.item}>
          <StatCard title="Total Blogs" value={state.blogs.length} />
        </motion.section>

        {/* Blogs Header */}
        <motion.section className="dashboard-blogs-header" variants={animations.item}>
          <h2>Your Blogs</h2>
          <motion.button 
            onClick={navigation.addBlog}
            className="add-blog-btn"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            + Add New Blog
          </motion.button>
        </motion.section>

        {/* Error Message */}
        <AnimatePresence>
          {state.error && (
            <motion.p 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {state.error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!state.error && state.blogs.length === 0 && (
          <motion.p 
            className="no-blogs"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            You haven't created any blogs yet.
          </motion.p>
        )}

        {/* Blogs Grid */}
        <motion.div 
          className="blogs-grid"
          variants={animations.container}
        >
          <AnimatePresence>
            {state.blogs.map((blog, index) => (
              <motion.div 
                key={blog._id}
                className="dashboard-blog-wrapper"
                variants={animations.card}
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
                    onClick={() => navigation.editBlog(blog._id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button 
                    className="delete-btn"
                    onClick={() => navigation.showDeleteModal(blog)}
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

      {/* Logout Modal */}
      <Modal
        show={state.showLogoutModal}
        onClose={navigation.closeModals}
        title="Confirm Logout"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5C4.45 21 4 20.55 4 20V4C4 3.45 4.45 3 5 3H12L20 11V20C20 20.55 19.55 21 19 21H15" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 3V9H22" stroke="currentColor" strokeWidth="2"/>
            <path d="M9 15L15 15" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 12V18" stroke="currentColor" strokeWidth="2"/>
          </svg>
        }
        actions={
          <>
            <motion.button 
              className="cancel-btn"
              onClick={navigation.closeModals}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button 
              className="confirm-logout-btn"
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Yes, Logout
            </motion.button>
          </>
        }
      >
        <p className="warning-text">Are you sure you want to logout?</p>
        <p className="warning-subtext">
          You will be redirected to the login page and will need to sign in again.
        </p>
      </Modal>

      {/* Delete Modal */}
      <Modal
        show={state.showDeleteModal}
        onClose={navigation.closeModals}
        title="Delete Blog Post"
        icon="⚠️"
        actions={
          <>
            <motion.button 
              className="cancel-btn"
              onClick={navigation.closeModals}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button 
              className="confirm-delete-btn"
              onClick={handleDeleteBlog}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={state.isDeleting}
            >
              {state.isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </motion.button>
          </>
        }
      >
        <p className="warning-text">Are you sure you want to delete this blog post?</p>
        {state.blogToDelete && (
          <div className="blog-preview">
            <strong>"{state.blogToDelete.title || 'Untitled Blog'}"</strong>
          </div>
        )}
        <p className="warning-subtext">
          This action cannot be undone. The blog post will be permanently removed.
        </p>
      </Modal>

      <Footer />

      <style jsx global>{`
        /* Initial Loading Styles */
        .initial-loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loading-container {
          text-align: center;
          color: white;
        }

        .loading-logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 2rem;
          position: relative;
        }

        .logo-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .logo-circle {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          margin: 10px auto;
        }

        .logo-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
        }

        .loading-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .loading-dots {
          font-size: 1.5rem;
          margin-bottom: 2rem;
        }

        .loading-dots span {
          margin: 0 0.2rem;
        }

        .loading-progress-bar {
          height: 3px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 1.5px;
          margin-top: 1rem;
        }

        /* Dashboard Loading */
        .dashboard-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          font-size: 1.1rem;
          color: #666;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Dashboard Styles */
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: calc(100vh - 200px);
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          font-size: 1.1rem;
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .logout-btn {
          position: absolute;
          top: 0;
          right: 0;
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #dc2626;
        }

        /* Stats Section */
        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          text-align: center;
          border: 1px solid #e5e7eb;
        }

        .stat-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1f2937;
        }

        /* Blogs Header */
        .dashboard-blogs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-blogs-header h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
        }

        .add-blog-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .add-blog-btn:hover {
          background: #2563eb;
        }

        /* Error and No Blogs */
        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid #fecaca;
          margin-bottom: 2rem;
          text-align: center;
        }

        .no-blogs {
          text-align: center;
          color: #6b7280;
          font-size: 1.1rem;
          padding: 3rem;
          background: #f9fafb;
          border-radius: 1rem;
          border: 2px dashed #d1d5db;
        }

        /* Blogs Grid */
        .blogs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .dashboard-blog-wrapper {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .dashboard-actions {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }

        .edit-btn, .delete-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-btn {
          background: #f59e0b;
          color: white;
        }

        .edit-btn:hover {
          background: #d97706;
        }

        .delete-btn {
          background: #ef4444;
          color: white;
        }

        .delete-btn:hover {
          background: #dc2626;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          max-width: 400px;
          width: 90%;
          max-height: 90vh;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .warning-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #fef3c7;
          border-radius: 50%;
          color: #f59e0b;
          font-size: 1.25rem;
        }

        .modal-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .modal-content {
          padding: 1.5rem;
        }

        .warning-text {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.75rem;
        }

        .warning-subtext {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .blog-preview {
          background: #f3f4f6;
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin: 1rem 0;
          border-left: 4px solid #3b82f6;
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          padding: 1.5rem;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }

        .cancel-btn, .confirm-logout-btn, .confirm-delete-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .cancel-btn:hover {
          background: #e5e7eb;
        }

        .confirm-logout-btn {
          background: #ef4444;
          color: white;
        }

        .confirm-logout-btn:hover {
          background: #dc2626;
        }

        .confirm-delete-btn {
          background: #ef4444;
          color: white;
        }

        .confirm-delete-btn:hover {
          background: #dc2626;
        }

        .confirm-delete-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .dashboard {
            padding: 1rem;
          }

          .dashboard-header {
            margin-bottom: 2rem;
          }

          .dashboard-header h1 {
            font-size: 2rem;
          }

          .logout-btn {
            position: static;
            margin-top: 1rem;
          }

          .dashboard-blogs-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .blogs-grid {
            grid-template-columns: 1fr;
          }

          .modal {
            margin: 1rem;
            width: calc(100% - 2rem);
          }
        }
      `}</style>
    </>
  );
};

export default UserDashboard;