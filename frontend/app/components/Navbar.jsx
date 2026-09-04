'use client';

import { useState } from 'react';
import styles from './Navbar.module.css';

const LINKS = [
  { href: '#dashboard', label: 'Tasks' },
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#evolution', label: 'Timeline' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>
        <a className={styles.logo} href="#top" aria-label="Flux home">
          <span className={styles.mark} aria-hidden="true" />
          Flux
        </a>

        <nav className={`${styles.nav} ${open ? styles.open : ''}`} aria-label="Primary">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.link} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#dashboard" className={styles.cta} onClick={() => setOpen(false)}>
            Start
          </a>
        </nav>

        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
