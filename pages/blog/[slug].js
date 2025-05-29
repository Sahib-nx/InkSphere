import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ChevronDown, Send, User, Calendar, X } from 'lucide-react';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import styles from '../../styles/BlogDetail.module.css';

// Separate AddCommentForm component for better organization
function AddCommentForm({ blogId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/comments/addComment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId, content }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add comment');
      }
      
      const newComment = await res.json();
      onCommentAdded(newComment);
      setContent('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={styles.addCommentForm}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className={styles.formHeader}>
        <h3>Share your thoughts</h3>
        <p>Join the conversation and let us know what you think!</p>
      </div>

      <div className={styles.textareaContainer}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment here..."
          rows={4}
          disabled={submitting}
          className={styles.commentTextarea}
          maxLength={500}
        />
        <div className={styles.textareaOverlay}></div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            className={styles.errorMessage}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className={styles.errorIcon}>⚠️</span>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.formFooter}>
        <div className={styles.characterCount}>
          {content.length}/500
        </div>
        <motion.button
          type="submit"
          disabled={submitting || !content.trim()}
          className={styles.submitButton}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {submitting ? (
            <>
              <div className={styles.spinner}></div>
              Publishing...
            </>
          ) : (
            <>
              <Send size={16} />
              Post Comment
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}

// Separate Comment component for better readability
function CommentItem({ comment, index, loggedInUser, onDelete, isDeleting }) {
  const canDelete = loggedInUser && comment.author && 
    String(loggedInUser._id).trim() === String(comment.author._id).trim();

  return (
    <motion.li
      className={styles.commentItem}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
      whileHover={{ y: -2, scale: 1.01 }}
    >
      <div className={styles.commentHeader}>
        <div className={styles.commentAvatar}>
          {(comment.author?.username || 'U')[0].toUpperCase()}
        </div>
        <div className={styles.commentMeta}>
          <h4>{comment.author?.username || 'Anonymous'}</h4>
          <span className={styles.commentDate}>
            {new Date(comment.createdAt || Date.now()).toLocaleDateString()}
          </span>
        </div>
        {canDelete && (
          <motion.button
            className={styles.deleteCommentButton}
            onClick={() => onDelete(comment._id)}
            disabled={isDeleting}
            title="Delete comment"
            aria-label="Delete comment"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={16} />
          </motion.button>
        )}
      </div>
      <p className={styles.commentContent}>{comment.content}</p>
      {isDeleting && (
        <div className={styles.deletingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}
    </motion.li>
  );
}

// Main BlogDetail component
export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  // Fetch blog data
  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs?slug=${slug}`);
        if (!res.ok) throw new Error('Failed to fetch blog data');
        
        const data = await res.json();
        if (data.length === 0) {
          setError('Blog not found');
          return;
        }
        
        setBlog(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/getUser');
        if (res.ok) {
          const data = await res.json();
          setLoggedInUser(data);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    
    fetchUser();
  }, []);

  // Delete comment handler
  const handleDeleteComment = async (commentId) => {
    setDeletingCommentId(commentId);
    setDeleteError('');
    
    try {
      const res = await fetch('/api/comments/deleteComment', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete comment');
      }
      
      setBlog(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment._id !== commentId),
      }));
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Add comment handler
  const handleCommentAdded = (newComment) => {
    setBlog(prev => ({
      ...prev,
      comments: [...(prev.comments || []), newComment]
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          className={styles.loadingSpinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div className={styles.loadingContent}>
          <h3>Loading your content...</h3>
          <p>Please wait while we fetch the latest blog post</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        className={styles.errorContainer}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={styles.errorContent}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className={styles.errorIcon}>😕</div>
          <h2>Oops! Something went wrong</h2>
          <p>Error: {error}</p>
          <motion.button
            onClick={() => router.back()}
            className={styles.backButton}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Go Back
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  if (!blog) return null;

  return (
    <>
      <Navbar />
      <motion.main
        className={styles.blogContainer}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <article className={styles.blogArticle}>
          {/* Blog Header */}
          <header className={styles.blogHeader}>
            <motion.h1 
              className={styles.blogTitle} 
              variants={itemVariants}
            >
              {blog.title}
            </motion.h1>

            <motion.div className={styles.blogMeta} variants={itemVariants}>
              <div className={styles.authorInfo}>
                <User size={18} />
                <span>By: {blog.author}</span>
              </div>
              <div className={styles.dateInfo}>
                <Calendar size={18} />
                <span>
                  {new Date(blog.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </motion.div>
          </header>

          {/* Blog Image */}
          {blog.image && (
            <motion.div 
              className={styles.imageContainer} 
              variants={itemVariants}
            >
              <img
                src={blog.image}
                alt={blog.title}
                className={styles.blogImage}
              />
              <div className={styles.imageOverlay}></div>
            </motion.div>
          )}

          {/* Blog Excerpt */}
          <motion.div className={styles.blogExcerpt} variants={itemVariants}>
            <div className={styles.quoteIcon}>"</div>
            <p>{blog.excerpt}</p>
          </motion.div>

          {/* Blog Content */}
          <motion.div className={styles.blogContent} variants={itemVariants}>
            {blog.content}
          </motion.div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <motion.div className={styles.tagsContainer} variants={itemVariants}>
              <h3 className={styles.tagsLabel}>Tags</h3>
              <div className={styles.tagsList}>
                {blog.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    className={styles.tag}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </article>

        {/* Comments Section */}
        <motion.section className={styles.commentsSection} variants={itemVariants}>
          <motion.div
            className={styles.commentsHeader}
            onClick={() => setShowComments(!showComments)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className={styles.commentsTitle}>
              <MessageCircle size={24} />
              <h2>Comments ({blog.comments?.length || 0})</h2>
            </div>
            <motion.div
              animate={{ rotate: showComments ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className={styles.chevronIcon}
            >
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={styles.commentsContent}
              >
                {/* Comments List */}
                {blog.comments && blog.comments.length > 0 ? (
                  <ul className={styles.commentsList}>
                    {blog.comments.map((comment, index) => (
                      <CommentItem
                        key={comment._id}
                        comment={comment}
                        index={index}
                        loggedInUser={loggedInUser}
                        onDelete={handleDeleteComment}
                        isDeleting={deletingCommentId === comment._id}
                      />
                    ))}
                  </ul>
                ) : (
                  <motion.div
                    className={styles.noComments}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <MessageCircle size={48} />
                    <h3>No comments yet</h3>
                    <p>Be the first to share your thoughts!</p>
                  </motion.div>
                )}

                {/* Add Comment Form */}
                <AddCommentForm 
                  blogId={blog._id} 
                  onCommentAdded={handleCommentAdded} 
                />

                {/* Delete Error */}
                {deleteError && (
                  <motion.div 
                    className={styles.errorMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: '1rem' }}
                  >
                    <span className={styles.errorIcon}>⚠️</span>
                    {deleteError}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </motion.main>
      <Footer />
    </>
  );
}