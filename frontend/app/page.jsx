import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TaskDashboard from './components/TaskDashboard';
import Statistics from './components/Statistics';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Evolution from './components/Evolution';
import Showcase from './components/Showcase';
import CTA from './components/CTA';
import Footer from './components/Footer';
import RevealObserver from './components/RevealObserver';

export default function HomePage() {
  return (
    <>
      <RevealObserver />
      <Navbar />
      <main>
        <Hero />
        <TaskDashboard />
        <Statistics />
        <Features />
        <HowItWorks />
        <Evolution />
        <Showcase />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
