import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import useAuthCheck from '@/utils/IsAuthorised';

const EditBlog = () => {
  const router = useRouter();
  const { id } = router.query;
  const { authorized, authLoading } = useAuthCheck();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [error, setError] = useState('');

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  // Render error message if any error occurs during fetch or authorization
  if (error) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1rem', color: 'red', fontWeight: 'bold' }}>
          {error}
        </div>
        <Footer />
      </>
    );
  }
  const [username, setUsername] = useState('');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchUserAndBlog = async () => {
      try {
        // Fetch current user
        const userRes = await fetch('/api/user/getUser');
        const userData = await userRes.json();
        const name = userData.payload?.username || '';
        setUsername(name);

        // Fetch blog data
        const res = await fetch(`/api/blogs?id=${id}`);
        if (!res.ok) throw new Error('Failed to fetch blog data');
        const data = await res.json();
        if (data.length === 0) throw new Error('Blog not found');
        const blog = data[0];

        // Check if blog author matches current user
        if (blog.author !== name) {
          setError('You are not authorized to edit this blog.');
          setLoading(false);
          return;
        }

        setFormData({
          title: blog.title || '',
          slug: blog.slug || '',
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          tags: (blog.tags || []).join(', '),
          image: blog.image || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (authorized) {
      fetchUserAndBlog();
    } else {
      setLoading(false);
    }
  }, [id, authorized]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push('Title is required.');
    if (!formData.slug.trim()) errors.push('Slug is required.');
    if (!formData.excerpt.trim()) errors.push('Excerpt is required.');
    if (!formData.content.trim()) errors.push('Content is required.');
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]);
    setSuccessMessage('');
    const errors = validateForm();
    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }
    try {
      const res = await fetch('/api/blogs/editBlog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          title: formData.title.trim(),
          slug: formData.slug.trim(),
          excerpt: formData.excerpt.trim(),
          content: formData.content.trim(),
          author: username,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
          image: formData.image.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (data.errors) {
          setErrorMessages(data.errors);
        } else if (data.error) {
          setErrorMessages([data.error]);
        } else if (data.message) {
          setErrorMessages([data.message]);
        } else {
          setErrorMessages(['Failed to update blog.']);
        }
        return;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setSuccessMessage('Blog updated successfully!');
      setTimeout(() => router.push('/UserDashboard'), 1500);
    } catch (err) {
      setErrorMessages(['An unexpected error occurred.']);
    }
  };

  if (authLoading || loading) return <div>Loading blog data...</div>;

  return (
    <>
      <style jsx global>{`
        :root {
          --primary-color: #5e60ce;
          --primary-light: #7400b8;
          --secondary-color: #48bfe3;
          --text-color: #333;
          --text-light: #666;
        }

        .add-blog-container {
          min-height: 100vh;
          background: linear-gradient(135deg, 
            rgba(94, 96, 206, 0.1) 0%, 
            rgba(72, 191, 227, 0.1) 50%, 
            rgba(116, 0, 184, 0.1) 100%);
          padding: 2rem 0;
        }

        .form-wrapper {
          max-width: 700px;
          margin: 2rem auto;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          margin-bottom: 2rem;
          letter-spacing: -0.5px;
        }

        .success-message {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .error-list {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          list-style: none;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .error-list li {
          margin-bottom: 0.5rem;
          padding-left: 1rem;
          position: relative;
        }

        .error-list li:before {
          content: "•";
          position: absolute;
          left: 0;
          font-weight: bold;
        }

        .form-grid {
          display: grid;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-weight: 600;
          color: var(--text-color);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input, .form-textarea {
          padding: 1rem 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(94, 96, 206, 0.1);
          transform: translateY(-1px);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-textarea[rows="6"] {
          min-height: 150px;
        }

        .submit-button {
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
          box-shadow: 0 8px 20px rgba(94, 96, 206, 0.3);
        }

        .submit-button:hover:not(:disabled) {
          box-shadow: 0 12px 25px rgba(94, 96, 206, 0.4);
          transform: translateY(-2px);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .image-preview-container {
          margin-top: 1rem;
          border: 2px dashed #e5e7eb;
          border-radius: 12px;
          padding: 1rem;
          background: #f9fafb;
          transition: all 0.3s ease;
        }

        .image-preview-container.has-image {
          border-color: var(--primary-color);
          background: linear-gradient(135deg, 
            rgba(94, 96, 206, 0.05) 0%, 
            rgba(72, 191, 227, 0.05) 50%, 
            rgba(116, 0, 184, 0.05) 100%);
        }

        .image-preview {
          width: 100%;
          max-width: 400px;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .image-preview:hover {
          transform: scale(1.02);
        }

        .image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 120px;
          color: var(--text-light);
          font-style: italic;
          text-align: center;
        }

        .image-error {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .form-wrapper {
            margin: 1rem;
            padding: 1.5rem;
            border-radius: 16px;
          }

          .page-title {
            font-size: 2rem;
          }

          .form-input, .form-textarea {
            padding: 0.875rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .add-blog-container {
            padding: 1rem 0;
          }

          .form-wrapper {
            margin: 0.5rem;
            padding: 1rem;
          }

          .page-title {
            font-size: 1.75rem;
          }
        }
      `}</style>

      <Navbar />
      <div className="add-blog-container">
        <motion.main
          className="form-wrapper"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="page-title" variants={itemVariants}>
            Edit Blog
          </motion.h1>

          <AnimatePresence>
            {successMessage && (
              <motion.p
                className="success-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {successMessage}
              </motion.p>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {errorMessages.length > 0 && (
              <motion.ul
                className="error-list"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {errorMessages.map((err, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {err}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <motion.form onSubmit={handleSubmit} variants={itemVariants}>
            <div className="form-grid">
              <motion.div className="form-group" variants={itemVariants}>
                <label className="form-label">
                  Title*:
                </label>
                <motion.input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="form-input"
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              <motion.div className="form-group" variants={itemVariants}>
                <label className="form-label">
                  Slug*:
                </label>
                <motion.input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="form-input"
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              <motion.div className="form-group" variants={itemVariants}>
                <label className="form-label">
                  Excerpt*:
                </label>
                <motion.textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="form-textarea"
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              <motion.div className="form-group" variants={itemVariants}>
                <label className="form-label">
                  Content*:
                </label>
                <motion.textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className="form-textarea"
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              <motion.div className="form-group" variants={itemVariants}>
                <label className="form-label">
                  Tags (comma separated):
                </label>
                <motion.input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="form-input"
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              <motion.div className="form-group" variants={itemVariants}>
                <label className="form-label">
                  Image URL:
                </label>
                <motion.input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="form-input"
                  whileFocus={{ scale: 1.01 }}
                  placeholder="Paste image URL here (e.g., from Google Images)"
                />

                <motion.div
                  className={`image-preview-container ${formData.image && !false ? 'has-image' : ''}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: 'auto',
                    transition: { duration: 0.3 }
                  }}
                >
                  {formData.image && !false ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={formData.image}
                        alt="Blog post preview"
                        className="image-preview"
                        onError={() => { }}
                        onLoad={() => { }}
                      />
                    </motion.div>
                  ) : formData.image && false ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="image-placeholder"
                    >
                      <div>
                        <p>❌ Unable to load image</p>
                        <p className="image-error">Please check the URL or try a different image</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="image-placeholder">
                      📷 Image preview will appear here when you add a URL
                    </div>
                  )}
                </motion.div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                className="submit-button"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {loading && <span className="loading-spinner"></span>}
                {loading ? 'Updating...' : 'Update Blog'}
              </motion.button>
            </div>
          </motion.form>
        </motion.main>
      </div>
      <Footer />
    </>
  )
}

export default EditBlog;
