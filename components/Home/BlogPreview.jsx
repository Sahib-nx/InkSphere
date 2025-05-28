import { motion } from 'framer-motion';
import BlogCard from '../UI/BlogCard';
import styles from './BlogPreview.module.css';

export default function BlogPreview({ blogs, loading }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    if (loading) {
        return (
            <section className={styles.blogPreview}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Loading Latest Posts...</h2>
                    <div className={styles.loadingGrid}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={styles.loadingCard} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.blogPreview}>
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={styles.sectionTitle}>Latest Blog Posts</h2>
                    <p className={styles.sectionSubtitle}>
                        Stay updated with our latest articles and insights
                    </p>
                </motion.div>

                <motion.div
                    className={styles.blogGrid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {Array.isArray(blogs) && blogs.slice(0, 6).map((blog, index) => (
                      <BlogCard key={blog._id} blog={blog} index={index} />
                    ))}
                </motion.div>

                <motion.div
                    className={styles.viewAllContainer}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.viewAllButton}
                    >
                        View All Posts
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
