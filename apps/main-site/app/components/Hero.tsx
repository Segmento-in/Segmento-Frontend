'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Shield, Globe, Lock, Cpu, ArrowRight } from "lucide-react";

// Ensure these images are in your /public folder
const sliderImages = [
   "/image.png",
  "/image1.png",
 // "/image2.png",
  "/image3.png",
  "/image4.png",
  "/image5.png",
  "/image6.png",
  "/image7.png",
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-sky-50">
      {/* Background Glow */}
      <div 
        className="absolute top-0 right-0 w-full h-full pointer-events-none -z-10" 
        style={{
          background: 'radial-gradient(circle at 85% 10%, #E8F0FE 0%, rgba(255, 255, 255, 0) 65%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <h1 className="text-5xl lg:text-[72px] font-extrabold text-[#0F172A] leading-[1.1] tracking-tight mb-8">
              AI-Driven <br /> 
              <span className="text-[#2563EB]">Data Solutions</span> <br /> 
            </h1>
            <p className="text-[18px] lg:text-[20px] text-slate-500 mb-10 max-w-lg leading-relaxed font-medium">
              Segmento delivers cutting-edge AI enabled Data products that solve real enterprise challenges. From real-time data intelligence to advanced data security solutions for global organisations.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const element = document.getElementById("ProductShowcase");
                  if (element) {
                    const offset = 100; 
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                  }
                }}
                className="px-8 py-4 bg-[#0F172A] text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 active:scale-95 group"
              >
                <span>Explore Our Products</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Right: Monitor Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex flex-col items-center w-full"
          >
            {/* Monitor Frame */}
            <div className="relative z-10 bg-white p-2 rounded-shadow-[0_50px_100px_-20px_rgba(37,99,235,0.15)] border border-slate-100 w-full max-w-5xl">
    
    {/* Inner Screen - aspect-16/10 for cinematic wide look */}
    <div className="w-full aspect-16/10 bg-white  overflow-hidden border border-slate-200 flex relative">
                
                {/* 1. Sidebar Nav */}
               

                {/* 2. Main Slider Content with SLIDING Animation */}
                <div className="flex-1 relative h-full bg-white overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={currentImage}
                      initial={{ x: "100%", opacity: 0 }} // Starts from the right
                      animate={{ x: 0, opacity: 1 }}       // Slides to center
                      exit={{ x: "-100%", opacity: 0 }}    // Slides out to the left
                      transition={{ 
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.4 } 
                      }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img
                        src={sliderImages[currentImage]}
                        alt="Product Showcase"
                        className="w-full h-full object-cover object-top"
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Glass overlay */}
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.03)]" />
                </div>
              </div>
            </div>

            {/* Monitor Stand */}
            <div className="w-32 h-14 bg-linear-to-b from-slate-300 to-slate-400 rounded-b-xl shadow-lg -mt-1" />
            <div className="w-64 h-4 bg-slate-900/10 blur-xl rounded-full mt-2" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}