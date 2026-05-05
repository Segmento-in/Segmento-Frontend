import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import ProductShowcase from "./components/ProductShowcase";
import Stats from "./components/Stats";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-primary">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <ProductShowcase />
      
      <CTASection />
      <Footer />
    </main>
  );
}
