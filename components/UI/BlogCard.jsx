import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';
import styles from './BlogCard.module.css';

export default function BlogCard({ blog, index }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      className={styles.blogCard}
      variants={cardVariants}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)" 
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className={styles.imageContainer}>
        <Image
          src={blog.image}
          alt={blog.title}
          width={400}
          height={250}
          className={styles.blogImage}
          unoptimized
        />
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardMeta}>
          <span className={styles.metaItem}>
            <FaCalendarAlt /> {blog.date}
          </span>
          <span className={styles.metaItem}>
            <FaUser /> {blog.author}
          </span>
        </div>

        <h3 className={styles.cardTitle}>{blog.title}</h3>
        <p className={styles.cardExcerpt}>{blog.excerpt}</p>

        <div className={styles.cardTags}>
          {blog.tags.map((tag, tagIndex) => (
            <span key={tagIndex} className={styles.tag}>
              <FaTag /> {tag}
            </span>
          ))}
        </div>

        <Link href={`/blog/${blog.slug}`} className={styles.readMoreButton}>
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Read More →
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}