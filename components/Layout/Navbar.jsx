import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaUser,
  FaEnvelope,
  FaPlus,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaRocket,
  FaFeather ,
  FaPenNib 
} from 'react-icons/fa';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { href: '/', label: 'Home', icon: <FaHome /> },
    { href: '/about', label: 'About', icon: <FaUser /> },
    { href: '/contact', label: 'Contact', icon: <FaEnvelope /> },
    { href: '/add-blog', label: 'Add Blog', icon: <FaPlus /> },
  ];

  return (
    <motion.nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className={styles.navContainer}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <motion.div
            className={styles.logoContainer}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Logo Image */}
            {/* <motion.img
              src="/logo.png" // Replace with your actual logo path
              alt="InkSphere Logo"
              className={styles.logoImage}
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            /> */}
            
            {/* Fallback Icon (in case image doesn't load) */}
            <motion.div
              className={styles.logoIcon}
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaPenNib   />
            </motion.div>
            
            <h2 className={styles.logoText}>InkSphere</h2>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.navMenuContainer}>
          <ul className={styles.navMenu}>
            {navItems.map((item, index) => (
              <motion.li
                key={item.href}
                className={styles.navItem}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <Link href={item.href} className={styles.navLink}>
                  <motion.span
                    className={styles.navIcon}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {item.icon}
                  </motion.span>
                  <span className={styles.navText}>{item.label}</span>
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* User Dashboard Button */}
          <motion.div
            className={styles.userButton}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/UserDashboard" className={styles.userLink}>
              <motion.span
                className={styles.userIcon}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <FaUserCircle />
              </motion.span>
              <span>Dashboard</span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Hamburger */}
        <motion.button
          className={styles.hamburger}
          onClick={toggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <motion.div className={styles.mobileMenuContent}>
              {[...navItems, { href: '/UserDashboard', label: 'UserDashboard', icon: <FaUserCircle /> }].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={styles.mobileNavLink}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <motion.span
                      className={styles.mobileIcon}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      {item.icon}
                    </motion.span>
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background gradient overlay */}
      <div className={styles.navOverlay}></div>
    </motion.nav>
  );
}