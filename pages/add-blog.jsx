import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import useAuthCheck from '@/utils/IsAuthorised';
import styles from '../styles/addBlog.module.css';

// Animation variants
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  },
  item: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  },
  button: {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } }
  },
  message: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 }
  }
};

// Loading component
const LoadingScreen = () => (
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
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.span
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay }}
            >•</motion.span>
          ))}
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

// Image preview component
const ImagePreview = ({ src, alt, onError, onLoad, error, className }) => {
  if (src && !error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={src}
          alt={alt}
          className={className}
          onError={onError}
          onLoad={onLoad}
        />
      </motion.div>
    );
  }

  if (src && error) {
    return (
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
    );
  }

  return (
    <div className={styles.imagePlaceholder}>
      {alt.includes('URL') ? '📷 Image preview will appear here when you add a URL' : '📁 File preview will appear here when you select a file'}
    </div>
  );
};

// Form field component
const FormField = ({ label, children, required = false }) => (
  <motion.div className={styles.formGroup} variants={ANIMATION_VARIANTS.item}>
    <label className={styles.formLabel}>
      {label}{required && '*'}:
    </label>
    {children}
  </motion.div>
);

export default function AddBlog() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    image: '',
  });

  const [state, setState] = useState({
    loading: false,
    successMessage: '',
    errorMessages: [],
    imageError: false,
    showInitialLoading: true
  });

  const [fileState, setFileState] = useState({
    selectedFile: null,
    filePreview: ''
  });

  const { authorized, authLoading } = useAuthCheck();

  useEffect(() => {
    const timer = setTimeout(() => {
      setState(prev => ({ ...prev, showInitialLoading: false }));
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const generateSlug = useCallback((text) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''), []
  );

  const handleTitleChange = useCallback((e) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  }, [generateSlug]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'image') {
      setState(prev => ({ ...prev, imageError: false }));
    }
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setFileState({ selectedFile: file, filePreview: '' });
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileState(prev => ({ ...prev, filePreview: e.target.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFileState({ selectedFile: null, filePreview: '' });
    }
  }, []);

  const validateForm = useCallback(() => {
    const errors = [];
    const required = [
      { field: 'title', message: 'Title is required.' },
      { field: 'slug', message: 'Slug is required.' },
      { field: 'excerpt', message: 'Excerpt is required.' },
      { field: 'content', message: 'Content is required.' }
    ];

    required.forEach(({ field, message }) => {
      if (!formData[field].trim()) errors.push(message);
    });

    return errors;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      tags: '',
      image: '',
    });
    setFileState({ selectedFile: null, filePreview: '' });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, successMessage: '', errorMessages: [] }));

    const errors = validateForm();
    if (errors.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setState(prev => ({ ...prev, errorMessages: errors }));
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

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
        setState(prev => ({ ...prev, successMessage: 'Blog added successfully!' }));
        resetForm();
      } else {
        const data = await res.json();
        const errorMessages = data.errors || (data.error ? [data.error] : ['Failed to add blog.']);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setState(prev => ({ ...prev, errorMessages }));
      }
    } catch (error) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setState(prev => ({ ...prev, errorMessages: ['An unexpected error occurred.'] }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  if (authLoading || !authorized || state.showInitialLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Navbar />
      <div className={styles.addBlogContainer}>
        <motion.main
          className={styles.formWrapper}
          variants={ANIMATION_VARIANTS.container}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className={styles.pageTitle} variants={ANIMATION_VARIANTS.item}>
            Add New Blog
          </motion.h1>

          <AnimatePresence>
            {state.successMessage && (
              <motion.p className={styles.successMessage} {...ANIMATION_VARIANTS.message}>
                {state.successMessage}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {state.errorMessages.length > 0 && (
              <motion.ul className={styles.errorList} {...ANIMATION_VARIANTS.message}>
                {state.errorMessages.map((err, idx) => (
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

          <motion.form onSubmit={handleSubmit} variants={ANIMATION_VARIANTS.item}>
            <div className={styles.formGrid}>
              <FormField label="Title" required>
                <motion.input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className={styles.formInput}
                  whileFocus={{ scale: 1.01 }}
                />
              </FormField>

              <FormField label="Slug" required>
                <motion.input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className={styles.formInput}
                  whileFocus={{ scale: 1.01 }}
                />
              </FormField>

              <FormField label="Excerpt" required>
                <motion.textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className={styles.formTextarea}
                  whileFocus={{ scale: 1.01 }}
                />
              </FormField>

              <FormField label="Content" required>
                <motion.textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className={styles.formTextarea}
                  whileFocus={{ scale: 1.01 }}
                />
              </FormField>

              <FormField label="Tags (comma separated)">
                <motion.input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className={styles.formInput}
                  whileFocus={{ scale: 1.01 }}
                />
              </FormField>

              <FormField label="Image URL">
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
                  className={`${styles.imagePreviewContainer} ${formData.image && !state.imageError ? styles.hasImage : ''}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3 } }}
                >
                  <ImagePreview
                    src={formData.image}
                    alt="Blog post preview URL"
                    onError={() => setState(prev => ({ ...prev, imageError: true }))}
                    onLoad={() => setState(prev => ({ ...prev, imageError: false }))}
                    error={state.imageError}
                    className={styles.imagePreview}
                  />
                </motion.div>
              </FormField>

              <FormField label="OR Choose From Locally">
                <motion.input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`${styles.formInput} ${styles.fileInput}`}
                  whileFocus={{ scale: 1.01 }}
                />

                <motion.div
                  className={`${styles.imagePreviewContainer} ${fileState.filePreview ? styles.hasImage : ''}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3 } }}
                >
                  {fileState.filePreview ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={fileState.filePreview}
                        alt="Selected file preview"
                        className={styles.imagePreview}
                      />
                      <p className={styles.fileInfo}>
                        Selected: {fileState.selectedFile?.name} ({(fileState.selectedFile?.size / 1024).toFixed(1)} KB)
                      </p>
                    </motion.div>
                  ) : (
                    <ImagePreview alt="file preview" />
                  )}
                </motion.div>
              </FormField>

              <motion.button
                type="submit"
                disabled={state.loading}
                className={styles.submitButton}
                variants={ANIMATION_VARIANTS.button}
                whileHover="hover"
                whileTap="tap"
              >
                {state.loading && <span className={styles.loadingSpinner}></span>}
                {state.loading ? 'Adding...' : 'Add Blog'}
              </motion.button>
            </div>
          </motion.form>
        </motion.main>
      </div>
      <Footer />
    </>
  );
}