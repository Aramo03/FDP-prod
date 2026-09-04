'use client';

import { useEffect, useRef } from 'react';
import { isCompactViewport, prefersReducedMotion } from '../lib/motion';
import styles from './Hero.module.css';

export default function Hero() {
  const rootRef = useRef(null);
  const bgRef = useRef(null);
  const gradientRef = useRef(null);
  const circlesRef = useRef(null);
  const cardsRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    if (prefersReducedMotion() || isCompactViewport()) {
      return undefined;
    }

    const layers = [
      { el: bgRef.current, speed: 0.12 },
      { el: gradientRef.current, speed: 0.22 },
      { el: circlesRef.current, speed: 0.34 },
      { el: cardsRef.current, speed: 0.48 },
      { el: contentRef.current, speed: 0.16 },
    ];

    let ticking = false;
    let active = true;

    const update = () => {
      ticking = false;
      if (!active) {
        return;
      }

      const y = window.scrollY;
      if (y > window.innerHeight * 1.6) {
        return;
      }

      layers.forEach(({ el, speed }) => {
        if (el) {
          el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
        }
      });

      if (contentRef.current) {
        const fade = Math.max(0, 1 - y / (window.innerHeight * 0.9));
        contentRef.current.style.opacity = String(fade);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      active = false;
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) {
      return undefined;
    }

    let ticking = false;
    const onMove = (event) => {
      if (ticking) {
        return;
      }
      ticking = true;
      requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        root.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        root.style.setProperty('--my', `${event.clientY - rect.top}px`);
        ticking = false;
      });
    };

    root.addEventListener('mousemove', onMove, { passive: true });
    return () => root.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className={styles.hero} id="top" ref={rootRef}>
      <div className={styles.bg} ref={bgRef} aria-hidden="true" />
      <div className={styles.gradient} ref={gradientRef} aria-hidden="true" />
      <div className={styles.circles} ref={circlesRef} aria-hidden="true">
        <span className={styles.circleA} />
        <span className={styles.circleB} />
        <span className={styles.circleC} />
      </div>

      <div className={styles.content} ref={contentRef}>
        <p className={styles.kicker}>Premium focus workspace</p>
        <h1 className={styles.heading}>
          <span>Organize your work.</span>
          <span className={styles.gradientText}>Move faster.</span>
        </h1>
        <p className={styles.subtitle}>A simple task manager built for focused work.</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#dashboard">
            Start Managing Tasks
          </a>
          <a className={styles.secondary} href="#features">
            Explore Features
          </a>
        </div>
      </div>

      <div className={styles.cards} ref={cardsRef} aria-hidden="true">
        <article className={`${styles.floatCard} ${styles.cardOne}`}>
          <span>Ship landing page</span>
          <small>Today · high focus</small>
        </article>
        <article className={`${styles.floatCard} ${styles.cardTwo}`}>
          <span>Review pull request</span>
          <small>Done · 12:40</small>
        </article>
        <article className={`${styles.floatCard} ${styles.cardThree}`}>
          <span>Write deploy notes</span>
          <small>Queued</small>
        </article>
      </div>
    </section>
  );
}
