import { DM_Sans, Syne } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
});

export const metadata = {
  title: 'Flux — Organize your work. Move faster.',
  description: 'A focused task manager with a premium visual experience, built to practice Docker, Nginx, and Ubuntu deployment.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <a className="skip-link" href="#dashboard">
          Skip to tasks
        </a>
        {children}
      </body>
    </html>
  );
}
