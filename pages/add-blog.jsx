import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import useAuthCheck from '@/utils/IsAuthorised';
import styles from '../styles/addBlog.module.css';

export default function AddBlog() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    image: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [showInitialLoading, setShowInitialLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const { authorized, authLoading } = useAuthCheck();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Don't render anything while checking auth, or if not authorized
  if (authLoading || !authorized || showInitialLoading) {
    
      return (
        <AnimatePresence>
          <motion.div
            className={styles.initialLoadingOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={styles.loadingContainer}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className={styles.loadingLogo}
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className={styles.logoInner}>
                  <div className={styles.logoCircle}></div>
                  <div className={styles.logoDot}></div>
                </div>
              </motion.div>

              <motion.h2
                className={styles.loadingTitle}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Loading Add Blog
              </motion.h2>

              <motion.div
                className={styles.loadingDots}
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
                className={styles.loadingProgressBar}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      );
  }

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

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Reset image error when image URL changes
    if (e.target.name === 'image') {
      setImageError(false);
    }
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
    setSuccessMessage('');
    setErrorMessages([]);

    const errors = validateForm();
    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    setLoading(true);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      image: formData.image.trim() || undefined,
    };

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSuccessMessage('Blog added successfully!');
        setFormData({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          tags: '',
          image: '',
        });
        setSelectedFile(null);
        setFilePreview('');
      } else {
        const data = await res.json();
        if (data.errors) {
          setErrorMessages(data.errors);
        } else if (data.error) {
          setErrorMessages([data.error]);
        } else {
          setErrorMessages(['Failed to add blog.']);
        }
       
      }
    } catch (error) {
      setErrorMessages(['An unexpected error occurred.']);
    } finally {
      setLoading(false);
    }
  };

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
            Add New Blog
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

                {/* Image Preview */}
                <motion.div
                  className={`${styles.imagePreviewContainer} ${formData.image && !imageError ? styles.hasImage : ''}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: 'auto',
                    transition: { duration: 0.3 }
                  }}
                >
                  {formData.image && !imageError ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={formData.image}
                        alt="Blog post preview"
                        className={styles.imagePreview}
                        onError={() => setImageError(true)}
                        onLoad={() => setImageError(false)}
                      />
                    </motion.div>
                  ) : formData.image && imageError ? (
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

                {/* File Preview */}
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
                {loading ? 'Adding...' : 'Add Blog'}
              </motion.button>
            </div>
          </motion.form>
        </motion.main>
      </div>
      <Footer />
    </>
  );
}