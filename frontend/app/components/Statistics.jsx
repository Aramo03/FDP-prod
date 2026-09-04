'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/motion';
import styles from './Statistics.module.css';

const STATS = [
  { label: 'Tasks completed', value: 142, suffix: '+' },
  { label: 'Productivity', value: 94, suffix: '%' },
  { label: 'Active projects', value: 12, suffix: '' },
];

function animateValue(from, to, duration, onFrame) {
  const start = performance.now();
  let frame = 0;

  function tick(now) {
    const progress = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - progress) ** 3;
    onFrame(Math.round(from + (to - from) * eased));
    if (progress < 1) {
      frame = requestAnimationFrame(tick);
    }
  }

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

export default function Statistics() {
  const ref = useRef(null);
  const valueRefs = useRef([]);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return undefined;
    }

    const cancels = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) {
          return;
        }
        started.current = true;
        node.classList.add(styles.visible);

        if (prefersReducedMotion()) {
          STATS.forEach((item, index) => {
            if (valueRefs.current[index]) {
              valueRefs.current[index].textContent = `${item.value}${item.suffix}`;
            }
          });
          observer.disconnect();
          return;
        }

        STATS.forEach((item, index) => {
          const stop = animateValue(0, item.value, 1100 + index * 120, (next) => {
            if (valueRefs.current[index]) {
              valueRefs.current[index].textContent = `${next}${item.suffix}`;
            }
          });
          cancels.push(stop);
        });
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancels.forEach((stop) => stop());
    };
  }, []);

  return (
    <section className={`section ${styles.wrap}`} ref={ref}>
      <p className="section-kicker">Signal</p>
      <h2 className="section-title">Quiet numbers. Loud progress.</h2>
      <div className={styles.grid}>
        {STATS.map((item, index) => (
          <article className={styles.card} key={item.label} style={{ '--i': index }}>
            <strong ref={(el) => { valueRefs.current[index] = el; }}>0{item.suffix}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
