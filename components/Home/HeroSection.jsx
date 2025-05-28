import { useState, useEffect } from 'react';
import styles from './HeroSection.module.css';
import Link from 'next/link';

export default function HeroSection() {
  const [currentArticle, setCurrentArticle] = useState(0);
  
  const articles = [
    { title: "React 18 Features", category: "Frontend", color: "blue" },
    { title: "Node.js Best Practices", category: "Backend", color: "green" },
    { title: "CSS Grid Mastery", category: "Design", color: "purple" },
    { title: "TypeScript Guide", category: "Programming", color: "red" },
    { title: "Next.js 14 Updates", category: "Framework", color: "yellow" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentArticle((prev) => (prev + 1) % articles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.hero}>
      {/* Background Pattern */}
      <div className={styles.backgroundPattern}></div>

      <div className={styles.heroContainer}>
        <div className={styles.heroGrid}>
          
          {/* Left Content */}
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <div className={styles.titleWrapper}>
                <h1 className={styles.heroTitle}>
                  Welcome to{' '}
                  <span className={styles.titleGradient}>
                    InkSphere
                  </span>
                </h1>
              </div>
              
              <div className={styles.subtitleWrapper}>
                <p className={styles.heroSubtitle}>
                  Discover the latest in technology, programming, and digital innovation. 
                  Join our community of developers and tech enthusiasts.
                </p>
              </div>
            </div>

            <div className={styles.heroButtons}>
              <button className={styles.ctaButton}>
                <span className={styles.buttonContent}>
                  Explore Blogs
                  <svg className={styles.buttonArrow} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              
              <button className={styles.secondaryButton}>
              <Link href={"/add-blog"}> Start Writing</Link>
              </button>
            </div>
          </div>

          {/* Right Animation */}
          <div className={styles.animationContainer}>
            {/* Main Blog Container */}
            <div className={styles.blogCardsContainer}>
              
              {/* Floating Blog Cards */}
              <div className={styles.cardsWrapper}>
                {articles.map((article, index) => {
                  const isActive = index === currentArticle;
                  const isPrev = index === (currentArticle - 1 + articles.length) % articles.length;
                  const isNext = index === (currentArticle + 1) % articles.length;
                  
                  let cardClass = styles.blogCard;
                  if (isActive) cardClass += ` ${styles.activeCard}`;
                  else if (isPrev) cardClass += ` ${styles.prevCard}`;
                  else if (isNext) cardClass += ` ${styles.nextCard}`;
                  else cardClass += ` ${styles.hiddenCard}`;
                  
                  return (
                    <div key={index} className={cardClass}>
                      <div className={styles.cardContent}>
                        <div className={styles.cardHeader}>
                          <div className={`${styles.cardIcon} ${styles[article.color]}`}>
                            <svg className={styles.iconSvg} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          
                          <div className={styles.cardBody}>
                            <div className={styles.cardCategory}>
                              {article.category}
                            </div>
                            <h3 className={styles.cardTitle}>
                              {article.title}
                            </h3>
                            
                            {/* Mock content lines */}
                            <div className={styles.mockContent}>
                              <div className={styles.contentLine}></div>
                              <div className={`${styles.contentLine} ${styles.contentLine80}`}></div>
                              <div className={`${styles.contentLine} ${styles.contentLine60}`}></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className={styles.cardFooter}>
                          <div className={styles.authorInfo}>
                            <div className={styles.authorAvatar}></div>
                            <span className={styles.authorName}>John Doe</span>
                          </div>
                          <div className={styles.readTime}>5 min read</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Floating Elements */}
              <div className={`${styles.floatingElement} ${styles.float1}`}></div>
              <div className={`${styles.floatingElement} ${styles.float2}`}></div>
              <div className={`${styles.floatingElement} ${styles.float3}`}></div>
            </div>

            {/* Code Elements Background */}
            <div className={styles.codeElements}>
              <div className={`${styles.codeSnippet} ${styles.code1}`}>
                &lt;div className="blog"&gt;
              </div>
              <div className={`${styles.codeSnippet} ${styles.code2}`}>
                const [posts, setPosts] = 
              </div>
              <div className={`${styles.codeSnippet} ${styles.code3}`}>
                export default Blog;
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}