'use client';

import styles from './Features.module.css';

const ITEMS = [
  {
    title: 'Deep focus',
    copy: 'A calm dark workspace that keeps the next action obvious.',
    reveal: 'left',
    icon: '01',
  },
  {
    title: 'Instant capture',
    copy: 'Add a task in seconds. Title, note, done. Nothing extra.',
    reveal: 'up',
    icon: '02',
  },
  {
    title: 'Clear progress',
    copy: 'Complete, uncomplete, delete. The list always tells the truth.',
    reveal: 'right',
    icon: '03',
  },
];

export default function Features() {
  return (
    <section className={`section ${styles.wrap}`} id="features">
      <p className="section-kicker" data-reveal>
        Product
      </p>
      <h2 className="section-title" data-reveal>
        Built to stay out of the way.
      </h2>
      <p className="section-copy" data-reveal>
        Three simple motions. No dashboards to babysit.
      </p>
      <div className={styles.grid}>
        {ITEMS.map((item) => (
          <article className={styles.card} data-reveal={item.reveal} key={item.title}>
            <span className={styles.icon}>{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
