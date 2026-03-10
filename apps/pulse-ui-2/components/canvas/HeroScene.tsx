/**
 * HeroScene.tsx — Three.js WebGL 3D Illustration
 * "use client" required; loaded via next/dynamic ssr:false from page.tsx
 *
 * Renders a floating isometric-style 3D scene:
 *  • Large dark cube (slowly rotating)
 *  • Smaller teal cube (counter-rotating, floating)
 *  • Low-poly purple sphere (floating)
 *  • Flat orange diamond (rotating)
 *  • Grid floor plane
 *
 * Matches the Prismic blog hero illustration aesthetic:
 * flat-shaded polygonal shapes, isometric camera angle,
 * pastel sky background.
 */
"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Grid, Environment } from "@react-three/drei";
import * as THREE from "three";

// ── Individual animated shape components ──────────────────────

function LargeCube() {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((_state, delta) => {
        if (!ref.current) return;
        ref.current.rotation.y += delta * 0.18;
        ref.current.rotation.x += delta * 0.05;
    });
    return (
        <mesh ref={ref} position={[0.4, 0.1, 0]} castShadow>
            <boxGeometry args={[1.6, 1.6, 1.6]} />
            <meshStandardMaterial color="#111827" flatShading roughness={0.8} metalness={0.1} />
        </mesh>
    );
}

function TealCube() {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((_state, delta) => {
        if (!ref.current) return;
        ref.current.rotation.y -= delta * 0.22;
    });
    return (
        <Float speed={1.2} floatIntensity={0.3} rotationIntensity={0.15}>
            <mesh ref={ref} position={[-1.4, -0.9, 0.4]} castShadow>
                <boxGeometry args={[0.85, 0.85, 0.85]} />
                <meshStandardMaterial color="#2EC4B6" flatShading roughness={0.6} />
            </mesh>
        </Float>
    );
}

function PurpleSphere() {
    return (
        <Float speed={1.8} floatIntensity={0.4} rotationIntensity={0.2}>
            <mesh position={[1.1, 1.3, -0.3]} castShadow>
                {/* Low-poly sphere: 6 segments gives pentagon/hexagon facets */}
                <sphereGeometry args={[0.52, 6, 6]} />
                <meshStandardMaterial color="#7C3AED" flatShading roughness={0.5} />
            </mesh>
        </Float>
    );
}

function OrangeRing() {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((_state, delta) => {
        if (!ref.current) return;
        ref.current.rotation.x += delta * 0.3;
        ref.current.rotation.z += delta * 0.12;
    });
    return (
        <Float speed={0.9} floatIntensity={0.2}>
            <mesh ref={ref} position={[-0.8, 1.0, 0.6]} castShadow>
                <torusGeometry args={[0.38, 0.14, 6, 12]} />
                <meshStandardMaterial color="#F97316" flatShading roughness={0.7} />
            </mesh>
        </Float>
    );
}

function SmallAccentBox() {
    return (
        <Float speed={2.0} floatIntensity={0.25} rotationIntensity={0.3}>
            <mesh position={[1.6, -0.8, 0.3]} castShadow>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="#06B6D4" flatShading roughness={0.6} />
            </mesh>
        </Float>
    );
}

function WireframeCube() {
    return (
        <mesh position={[-0.3, 0.5, -1.2]}>
            <boxGeometry args={[0.9, 0.9, 0.9]} />
            <meshBasicMaterial color="#93C5FD" wireframe />
        </mesh>
    );
}

// ── Ground grid ───────────────────────────────────────────────

function SceneGrid() {
    return (
        <Grid
            position={[0, -1.2, 0]}
            args={[10, 10]}
            cellSize={0.6}
            cellThickness={0.5}
            cellColor="#93C5FD"
            sectionSize={1.8}
            sectionThickness={1}
            sectionColor="#60A5FA"
            fadeDistance={6}
            fadeStrength={1}
            infiniteGrid={false}
        />
    );
}

// ── Main export ───────────────────────────────────────────────

interface HeroSceneProps {
    style?: React.CSSProperties;
}

export default function HeroScene({ style }: HeroSceneProps) {
    return (
        <div style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(160deg, #dbeafe 0%, #ede9fe 50%, #e0f2fe 100%)",
            ...style,
        }}>
            <Canvas
                shadows
                camera={{ position: [4.5, 3.5, 4.5], fov: 42 }}
                gl={{ antialias: true, alpha: false }}
                style={{ background: "transparent" }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.7} color="#ffffff" />
                <directionalLight
                    position={[8, 12, 6]}
                    intensity={1.4}
                    color="#ffffff"
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <directionalLight
                    position={[-6, 4, -4]}
                    intensity={0.4}
                    color="#a5f3fc"
                />
                <pointLight position={[-3, 3, 3]} intensity={0.5} color="#c084fc" />

                {/* Environment for ambient reflections */}
                <Suspense fallback={null}>
                    <Environment preset="city" />
                </Suspense>

                {/* 3D Objects */}
                <LargeCube />
                <TealCube />
                <PurpleSphere />
                <OrangeRing />
                <SmallAccentBox />
                <WireframeCube />
                <SceneGrid />
            </Canvas>
        </div>
    );
}
