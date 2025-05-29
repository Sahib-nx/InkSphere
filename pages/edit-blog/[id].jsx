import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import useAuthCheck from '@/utils/IsAuthorised';
import styles from '../../styles/EditBlog.module.css';

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFilePreview('');
    }
  };

  // Render error message if any error occurs during fetch or authorization
  if (error) {
    return (
      <>
        <Navbar />
        <div className={styles.errorContainer}>
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
      <Navbar />
      <div className={styles.addBlogContainer}>
        <motion.main
          className={styles.formWrapper}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className={styles.pageTitle} variants={itemVariants}>
            Edit Blog
          </motion.h1>

          <AnimatePresence>
            {successMessage && (
              <motion.p
                className={styles.successMessage}
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
                className={styles.errorList}
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
            <div className={styles.formGrid}>
              <motion.div className={styles.formGroup} variants={itemVariants}>
                <label className={styles.formLabel}>
                  Title*:
                </label>
                <motion.input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className={styles.formInput}
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              <motion.div className={styles.formGroup} variants={itemVariants}>
                <label className={styles.formLabel}>
                  Slug*:
                </label>
                <motion.input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className={styles.formInput}
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              <motion.div className={styles.formGroup} variants={itemVariants}>
                <label className={styles.formLabel}>
                  Excerpt*:
                </label>
                <motion.textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className={styles.formTextarea}
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              <motion.div className={styles.formGroup} variants={itemVariants}>
                <label className={styles.formLabel}>
                  Content*:
                </label>
                <motion.textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className={styles.formTextarea}
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              <motion.div className={styles.formGroup} variants={itemVariants}>
                <label className={styles.formLabel}>
                  Tags (comma separated):
                </label>
                <motion.input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className={styles.formInput}
                  whileFocus={{ scale: 1.01 }}
                />
              </motion.div>

              <motion.div className={styles.formGroup} variants={itemVariants}>
                <label className={styles.formLabel}>
                  Image URL:
                </label>
                <motion.input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className={styles.formInput}
                  whileFocus={{ scale: 1.01 }}
                  placeholder="Paste image URL here (e.g., from Google Images)"
                />

                <motion.div
                  className={`${styles.imagePreviewContainer} ${formData.image && !false ? styles.hasImage : ''}`}
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
                        className={styles.imagePreview}
                        onError={() => { }}
                        onLoad={() => { }}
                      />
                    </motion.div>
                  ) : formData.image && false ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={styles.imagePlaceholder}
                    >
                      <div>
                        <p>❌ Unable to load image</p>
                        <p className={styles.imageError}>Please check the URL or try a different image</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      📷 Image preview will appear here when you add a URL
                    </div>
                  )}
                </motion.div>
              </motion.div>

              <motion.div className={styles.formGroup} variants={itemVariants}>
                <label className={styles.formLabel}>
                  OR Choose From Locally:
                </label>
                <motion.input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`${styles.formInput} ${styles.fileInput}`}
                  whileFocus={{ scale: 1.01 }}
                />

                <motion.div
                  className={`${styles.imagePreviewContainer} ${filePreview ? styles.hasImage : ''}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: 'auto',
                    transition: { duration: 0.3 }
                  }}
                >
                  {filePreview ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={filePreview}
                        alt="Selected file preview"
                        className={styles.imagePreview}
                      />
                      <p className={styles.fileInfo}>
                        Selected: {selectedFile?.name} ({(selectedFile?.size / 1024).toFixed(1)} KB)
                      </p>
                    </motion.div>
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      📁 File preview will appear here when you select a file
                    </div>
                  )}
                </motion.div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {loading && <span className={styles.loadingSpinner}></span>}
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
