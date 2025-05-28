import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs?slug=${slug}`);
        if (!res.ok) throw new Error('Failed to fetch blog data');
        const data = await res.json();
        if (data.length === 0) {
          setError('Blog not found');
          setLoading(false);
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  if (loading) return (
    <div className="loading-container">
      <motion.div 
        className="loading-spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p>Loading blog...</p>
      <style jsx global>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 1rem;
          color: var(--text-color);
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e3e3e3;
          border-top: 3px solid var(--primary-color);
          border-radius: 50%;
        }
      `}</style>
    </div>
  );

  if (error) return (
    <motion.div 
      className="error-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="error-content">
        <h2>Oops! Something went wrong</h2>
        <p>Error: {error}</p>
        <button onClick={() => router.back()} className="back-button">
          Go Back
        </button>
      </div>
      <style jsx global>{`
        .error-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          padding: 2rem;
        }
        .error-content {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(94, 96, 206, 0.1);
          border: 1px solid rgba(94, 96, 206, 0.1);
        }
        .error-content h2 {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }
        .error-content p {
          color: var(--text-light);
          margin-bottom: 1.5rem;
        }
        .back-button {
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s ease;
        }
        .back-button:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </motion.div>
  );

  if (!blog) return null;

  return (
    <>
      <Navbar />
      <motion.main 
        className="blog-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="blog-title" variants={itemVariants}>
          {blog.title}
        </motion.h1>
        
        <motion.p className="blog-author" variants={itemVariants}>
          By: {blog.author}
        </motion.p>
        
        {blog.image && (
          <motion.div className="image-container" variants={imageVariants}>
            <img
              src={blog.image}
              alt={blog.title}
              className="blog-image"
            />
          </motion.div>
        )}
        
        <motion.p className="blog-excerpt" variants={itemVariants}>
          {blog.excerpt}
        </motion.p>
        
        <motion.div className="blog-content" variants={itemVariants}>
          {blog.content}
        </motion.div>
        
        {blog.tags && blog.tags.length > 0 && (
          <motion.div className="tags-container" variants={itemVariants}>
            <strong className="tags-label">Tags: </strong>
            <div className="tags-list">
              {blog.tags.map((tag, index) => (
                <motion.span 
                  key={index}
                  className="tag"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.main>
      <Footer />

      <style jsx global>{`
        :root {
          --primary-color: #5e60ce;
          --primary-light: #7400b8;
          --secondary-color: #48bfe3;
          --text-color: #333;
          --text-light: #666;
        }

        .blog-container {
          max-width: 700px;
          margin: 2rem auto;
          padding: 2rem 1rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(94, 96, 206, 0.08);
          position: relative;
          overflow: hidden;
        }

        .blog-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color), var(--primary-light));
          border-radius: 16px 16px 0 0;
        }

        .blog-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .blog-author {
          font-weight: 600;
          color: var(--text-light);
          margin-bottom: 2rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, rgba(94, 96, 206, 0.05), rgba(72, 191, 227, 0.05));
          border-radius: 8px;
          border-left: 3px solid var(--secondary-color);
        }

        .image-container {
          margin-bottom: 2rem;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(94, 96, 206, 0.15);
        }

        .blog-image {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .image-container:hover .blog-image {
          transform: scale(1.02);
        }

        .blog-excerpt {
          font-style: italic;
          color: var(--text-light);
          margin-bottom: 2rem;
          font-size: 1.1rem;
          line-height: 1.6;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(94, 96, 206, 0.03), rgba(72, 191, 227, 0.03));
          border-radius: 10px;
          border: 1px solid rgba(94, 96, 206, 0.1);
          position: relative;
        }

        .blog-excerpt::before {
          content: '"';
          font-size: 3rem;
          color: var(--primary-color);
          position: absolute;
          top: -10px;
          left: 10px;
          opacity: 0.3;
        }

        .blog-content {
          white-space: pre-wrap;
          margin-bottom: 2rem;
          line-height: 1.8;
          color: var(--text-color);
          font-size: 1.05rem;
          font-weight: 500;
        }

        .tags-container {
          margin-top: 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(94, 96, 206, 0.05), rgba(72, 191, 227, 0.05));
          border-radius: 12px;
          border: 1px solid rgba(94, 96, 206, 0.1);
        }

        .tags-label {
          color: var(--primary-color);
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          display: block;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .tag {
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(94, 96, 206, 0.2);
        }

        .tag:hover {
          box-shadow: 0 4px 16px rgba(94, 96, 206, 0.3);
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .blog-container {
            margin: 1rem;
            padding: 1.5rem 1rem;
            border-radius: 12px;
          }

          .blog-title {
            font-size: 2rem;
            line-height: 1.3;
          }

          .blog-excerpt {
            padding: 1rem;
            font-size: 1rem;
          }

          .blog-content {
            font-size: 1rem;
            line-height: 1.7;
            font-weight: 500;
          }

          .tags-container {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .blog-container {
            margin: 0.5rem;
            padding: 1rem;
          }

          .blog-title {
            font-size: 1.75rem;
          }

          .blog-excerpt {
            padding: 0.75rem;
            font-size: 0.95rem;
          }

          .tags-list {
            gap: 0.4rem;
          }

          .tag {
            padding: 0.3rem 0.6rem;
            font-size: 0.8rem;
          }
        }

        /* Focus styles for accessibility */
        .tag:focus {
          outline: 2px solid var(--secondary-color);
          outline-offset: 2px;
        }

        .back-button:focus {
          outline: 2px solid var(--secondary-color);
          outline-offset: 2px;
        }

        /* Enhanced text readability */
        .blog-content {
          text-align: justify;
        }

        .blog-content::first-letter {
          font-size: 3rem;
          font-weight: 700;
          float: left;
          line-height: 1;
          margin: 0.1rem 0.5rem 0 0;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Additional hover effects */
        .blog-container:hover {
          box-shadow: 0 15px 50px rgba(94, 96, 206, 0.12);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
      `}</style>
    </>
  );
}