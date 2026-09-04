import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>
          <strong>Flux</strong>
          <span>Task manager for learning deployment.</span>
        </p>
        <nav aria-label="Footer">
          <a href="#dashboard">Tasks</a>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
        </nav>
      </div>
    </footer>
  );
}
