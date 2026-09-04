'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/motion';
import styles from './CTA.module.css';

export default function CTA() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) {
      return undefined;
    }

    let ticking = false;
    let active = true;

    const update = () => {
      ticking = false;
      if (!active) {
        return;
      }
      const rect = node.getBoundingClientRect();
      const shift = Math.max(-24, Math.min(24, (window.innerHeight / 2 - rect.top) * 0.08));
      node.style.setProperty('--bg-shift', `${shift}px`);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.addEventListener('scroll', onScroll, { passive: true });
          update();
        } else {
          window.removeEventListener('scroll', onScroll);
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(node);
    return () => {
      active = false;
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className={styles.wrap} ref={ref}>
      <div className={styles.panel} data-reveal="scale">
        <p className="section-kicker">Ready</p>
        <h2>Start with one task.</h2>
        <p>Flux stays small on purpose — so you can learn Docker, Nginx, and Ubuntu without fighting the app.</p>
        <a className={styles.button} href="#dashboard">
          Open the dashboard
        </a>
      </div>
    </section>
  );
}
