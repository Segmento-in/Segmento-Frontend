import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import ProductShowcase from "./components/ProductShowcase";
import Stats from "./components/Stats";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <ProductShowcase />

      <CTASection />
      <Footer />
    </main>
  );
}
