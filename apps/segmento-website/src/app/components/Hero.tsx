"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

const ParticleField = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const prefersReducedMotion = useReducedMotion();
  const count = 1000;
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Start randomly scattered
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;

      // Target position: clustered structure (a tight sphere/core)
      const targetPhi = Math.acos((Math.random() * 2) - 1);
      const targetTheta = Math.random() * Math.PI * 2;
      const targetR = 1.5 + Math.random() * 2;
      
      const targetX = targetR * Math.sin(targetPhi) * Math.cos(targetTheta);
      const targetY = targetR * Math.sin(targetPhi) * Math.sin(targetTheta);
      const targetZ = targetR * Math.cos(targetPhi);
      
      // Assign Coral color only if they are part of the 'found' core subset (15%)
      const isCoral = Math.random() > 0.85;

      temp.push({
        start: new THREE.Vector3(x, y, z),
        target: new THREE.Vector3(targetX, targetY, targetZ),
        current: new THREE.Vector3(x, y, z),
        speed: 0.01 + Math.random() * 0.03,
        isCoral
      });
    }
    return temp;
  }, [count]);

  const colorIndigo = useMemo(() => new THREE.Color("#384cd3"), []);
  const colorCoral = useMemo(() => new THREE.Color("#E8734A"), []);
  
  const colorArray = useMemo(() => new Float32Array(count * 3), [count]);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const tempColor = new THREE.Color();
    
    particles.forEach((particle, i) => {
      if (prefersReducedMotion) {
        particle.current.copy(particle.target);
      } else {
        particle.current.lerp(particle.target, particle.speed);
        // Add subtle breathing/noise when clustered
        particle.current.y += Math.sin(time * 0.5 + i) * 0.002;
        particle.current.x += Math.cos(time * 0.5 + i) * 0.002;
      }
      
      dummy.position.copy(particle.current);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      // Map distance (scattered=large, clustered=0) to color interpolation
      if (particle.isCoral) {
        const dist = particle.current.distanceTo(particle.target);
        // Distances > 10 get Indigo, distances nearing 0 blend to Coral
        const mix = Math.max(0, Math.min(1, 1 - (dist / 10)));
        tempColor.copy(colorIndigo).lerp(colorCoral, mix);
      } else {
        tempColor.copy(colorIndigo);
      }
      
      tempColor.toArray(colorArray, i * 3);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.geometry.attributes.instanceColor) {
      meshRef.current.geometry.attributes.instanceColor.needsUpdate = true;
    }
    
    // Rotate the entire cluster slowly
    if (!prefersReducedMotion) {
      meshRef.current.rotation.y = time * 0.05;
      meshRef.current.rotation.x = time * 0.02;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.08, 8, 8]}>
        <instancedBufferAttribute attach="attributes-instanceColor" args={[colorArray, 3]} />
      </sphereGeometry>
      <meshStandardMaterial vertexColors={true} transparent opacity={0.8} roughness={0.2} metalness={0.1} />
    </instancedMesh>
  );
};

export const Hero = () => {
  return (
    <section className="relative w-full min-h-screen pt-32 pb-16 px-6 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto w-full h-full grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center">
        
        {/* Left Column: Text (Stack order 2 on mobile/tablet, 1 on desktop) */}
        <div className="flex flex-col items-start z-10 order-2 lg:order-1 text-left">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-outline-variant/60 bg-surface/60 backdrop-blur-md shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-coral animate-pulse"></span>
            <span className="font-mono text-label-caps text-on-surface-variant uppercase tracking-widest">
              100% Client-Side Processing
            </span>
          </div>
          
          {/* Headline */}
          <h1 className="font-display font-bold text-[clamp(2.5rem,6vw,5.5rem)] text-on-surface mb-6 tracking-tight leading-[1.05]">
            Find the data.<br />Protect the business.
          </h1>
          
          {/* Subheadline */}
          <p className="w-full max-w-[40ch] font-sans text-body-lg text-on-surface-variant mb-10 leading-relaxed">
            The intelligence platform that detects, classifies, and redacts sensitive data with zero-trust architecture. Keep your data inside your boundaries.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-sans font-medium text-lg shadow-[0_8px_30px_rgba(56,76,211,0.25)] hover:bg-primary-container transition-all duration-300 ease-out">
              Explore Products
            </button>
            <button className="bg-transparent text-on-surface border border-outline-variant px-8 py-4 rounded-full font-sans font-medium text-lg hover:border-on-surface hover:bg-surface-dim transition-colors duration-300 ease-out">
              Read Documentation
            </button>
          </div>
        </div>

        {/* Right Column: 3D Canvas (Stack order 1 on mobile/tablet, 2 on desktop) */}
        <div className="relative w-full min-h-[320px] lg:min-h-[600px] h-full flex items-center justify-center order-1 lg:order-2 z-0">
          <div className="absolute inset-0 w-full h-full opacity-90 transition-opacity duration-1000">
            <Canvas camera={{ position: [0, 0, 14] }}>
              <Environment preset="city" />
              <ambientLight intensity={1.5} />
              <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
                <ParticleField />
              </Float>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
};
