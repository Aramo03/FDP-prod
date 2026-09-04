'use client';

import { useEffect, useRef } from 'react';
import { isCompactViewport, prefersReducedMotion } from '../lib/motion';
import styles from './HowItWorks.module.css';

const STEPS = [
  { n: '01', title: 'Create', copy: 'Capture the next real action with a title and an optional note.' },
  { n: '02', title: 'Organize', copy: 'Keep only what matters. The list stays short on purpose.' },
  { n: '03', title: 'Complete', copy: 'Check it off. The strike-through is the quiet reward.' },
  { n: '04', title: 'Analyze', copy: 'Watch the board clear. Progress is visible without extra charts.' },
];

export default function HowItWorks() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    if (prefersReducedMotion()) {
      node.style.setProperty('--line-progress', '1');
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
      const viewport = window.innerHeight;
      const scrolled = viewport * 0.72 - rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / (rect.height * 0.85)));
      node.style.setProperty('--line-progress', String(progress));
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
      { rootMargin: '20% 0px' },
    );

    observer.observe(node);
    if (!isCompactViewport()) {
      update();
    }

    return () => {
      active = false;
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className={`section ${styles.wrap}`} id="how" ref={ref}>
      <p className="section-kicker" data-reveal>
        Timeline A
      </p>
      <h2 className="section-title" data-reveal>
        How it works
      </h2>
      <p className="section-copy" data-reveal>
        Four steps. One vertical line that grows as you scroll.
      </p>
      <ol className={styles.list}>
        {STEPS.map((step) => (
          <li className={styles.item} data-reveal="left" key={step.n}>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.index}>{step.n}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
