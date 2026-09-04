'use client';

import styles from './Showcase.module.css';

const CARDS = [
  { title: 'Write the README', meta: 'Docs', tone: 'violet' },
  { title: 'Check Nginx routes', meta: 'Infra', tone: 'cyan' },
  { title: 'Migrate PostgreSQL', meta: 'Backend', tone: 'mint' },
  { title: 'Ship to Ubuntu', meta: 'Deploy', tone: 'pink' },
];

export default function Showcase() {
  return (
    <section className={`section ${styles.wrap}`}>
      <p className="section-kicker" data-reveal>
        Showcase
      </p>
      <h2 className="section-title" data-reveal>
        Task cards with presence
      </h2>
      <p className="section-copy" data-reveal>
        Staggered entrance, hover lift, and a glow that stays quiet until you ask for it.
      </p>
      <div className={styles.grid}>
        {CARDS.map((card, index) => (
          <article
            className={`${styles.card} ${styles[card.tone]}`}
            data-reveal
            data-stagger
            style={{ '--i': index }}
            key={card.title}
          >
            <span>{card.meta}</span>
            <h3>{card.title}</h3>
            <div className={styles.row}>
              <b />
              <small>Ready</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
