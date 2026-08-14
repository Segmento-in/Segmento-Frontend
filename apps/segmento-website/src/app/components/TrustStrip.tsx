"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Lock, Server, FileCheck } from "lucide-react";

export const TrustStrip = () => {
  const stripRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stripRef.current,
            start: "top 90%",
          },
        }
      );
    }, stripRef);

    return () => ctx.revert();
  }, []);

  const badges = [
    { icon: <Shield className="w-6 h-6 text-primary" />, label: "GDPR Compliant", tint: "bg-secondary-sky/40 text-on-secondary-sky" },
    { icon: <Lock className="w-6 h-6 text-primary" />, label: "HIPAA Ready", tint: "bg-secondary-sage/40 text-on-secondary-sage" },
    { icon: <FileCheck className="w-6 h-6 text-primary" />, label: "DPDP Ready", tint: "bg-secondary-peach/40 text-on-secondary-peach" },
    { icon: <Server className="w-6 h-6 text-primary" />, label: "Zero-Trust Architecture", tint: "bg-secondary-teal/40 text-on-secondary-teal" },
  ];

  return (
    <section ref={stripRef} className="w-full py-20 px-6 border-y border-outline-variant/30 bg-surface-container-lowest/50 backdrop-blur-md relative z-20">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <p className="font-mono text-technical-data text-on-surface-variant mb-12 text-center uppercase tracking-widest opacity-80">
          Trusted by enterprises for secure processing
        </p>
        
        <div className="flex flex-wrap justify-center gap-12 md:gap-24 w-full">
          {badges.map((badge, index) => (
            <div 
              key={index}
              ref={(el) => { itemsRef.current[index] = el; }}
              className="flex flex-col items-center gap-4 transition-all duration-300 group"
            >
              <div className={`p-5 rounded-2xl ${badge.tint} transition-transform duration-300 group-hover:-translate-y-1`}>
                {badge.icon}
              </div>
              <span className="font-sans text-body-md font-medium text-on-surface group-hover:text-primary transition-colors duration-300">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
