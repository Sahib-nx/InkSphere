import { motion } from 'framer-motion';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaArrowUp,
  FaCode,
  FaRocket,
  FaHeart
} from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: <FaFacebook />, href: '#', label: 'Facebook', color: '#1877f2' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter', color: '#1da1f2' },
    { icon: <FaLinkedin />, href: '#', label: 'LinkedIn', color: '#0077b5' },
    { icon: <FaGithub />, href: '#', label: 'GitHub', color: '#333' },
  ];

  const quickLinks = [
    'About Us',
    'Blog',
    'Projects',
    'Contact',
    'Privacy Policy',
    'Terms of Service'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Animated Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
      </div>

      <motion.div 
        className={styles.footerContent}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Brand Section */}
        <motion.div className={styles.brandSection} variants={itemVariants}>
          <div className={styles.logoContainer}>
            {/* Logo Image - Replace src with your actual logo */}
            <div className={styles.logoImageWrapper}>
              <img 
                src="/logo.png" 
                alt="InkSphere Logo" 
                className={styles.logoImage}
                onError={(e) => {
                  // Fallback to icon if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
              <FaCode className={styles.logoIconFallback} />
            </div>
            <h3 className={styles.brandTitle}>InkSphere</h3>
          </div>
          <p className={styles.brandDescription}>
            Empowering developers with cutting-edge insights, tutorials, and industry trends. 
            Join our community of passionate technologists shaping the future.
          </p>
          <div className={styles.brandStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>10K+</span>
              <span className={styles.statLabel}>Readers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>500+</span>
              <span className={styles.statLabel}>Articles</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>Contributors</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div className={styles.linksSection} variants={itemVariants}>
          <h4 className={styles.sectionTitle}>
            <FaRocket className={styles.titleIcon} />
            Quick Links
          </h4>
          <ul className={styles.linksList}>
            {quickLinks.map((link, index) => (
              <motion.li 
                key={index}
                className={styles.linkItem}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <a href="#" className={styles.footerLink}>
                  {link}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Social Section */}
        <motion.div className={styles.socialSection} variants={itemVariants}>
          <h4 className={styles.sectionTitle}>
            <FaHeart className={styles.titleIcon} />
            Connect With Us
          </h4>
          <p className={styles.socialDescription}>
            Follow us for daily tech updates and exclusive content
          </p>
          <div className={styles.socialLinks}>
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                className={styles.socialLink}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 10,
                  backgroundColor: social.color 
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Footer Bottom */}
      <motion.div 
        className={styles.footerBottom}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <div className={styles.bottomContent}>
          <p className={styles.copyright}>
            © 2024 InkSphere. Crafted with 
            <motion.span 
              className={styles.heartIcon}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ❤️
            </motion.span>
            by developer, for developers.
          </p>
          
          <motion.button
            className={styles.backToTop}
            onClick={scrollToTop}
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 0 20px rgba(94, 96, 206, 0.6)"
            }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <FaArrowUp />
          </motion.button>
        </div>
      </motion.div>
    </footer>
  );
}