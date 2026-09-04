'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/motion';
import styles from './Evolution.module.css';

const STEPS = [
  { n: '01', title: 'Idea', copy: 'Name the outcome.' },
  { n: '02', title: 'Plan', copy: 'Break it into one next step.' },
  { n: '03', title: 'Execute', copy: 'Do the work in a quiet list.' },
  { n: '04', title: 'Done', copy: 'Close the loop and move on.' },
];

export default function Evolution() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    if (prefersReducedMotion()) {
      node.style.setProperty('--rail-progress', '1');
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
      const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - rect.top) / (rect.height * 0.8)));
      node.style.setProperty('--rail-progress', String(progress));
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
      { rootMargin: '15% 0px' },
    );

    observer.observe(node);

    return () => {
      active = false;
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className={`section ${styles.wrap}`} id="evolution" ref={ref}>
      <p className="section-kicker" data-reveal>
        Timeline B
      </p>
      <h2 className="section-title" data-reveal>
        From idea to done
      </h2>
      <p className="section-copy" data-reveal>
        A second timeline: horizontal on desktop, vertical on small screens.
      </p>
      <ol className={styles.rail}>
        {STEPS.map((step, index) => (
          <li className={styles.step} data-reveal="up" data-stagger style={{ '--i': index }} key={step.n}>
            <span className={styles.n}>{step.n}</span>
            <h3>{step.title}</h3>
            <p>{step.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
