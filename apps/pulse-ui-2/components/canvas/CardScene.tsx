/**
 * CardScene.tsx — Small WebGL 3D illustration for small article cards
 * "use client" — loaded via next/dynamic ssr:false
 *
 * Lightweight Three.js scenes keyed by `variant` prop.
 * Designed for the small card thumbnails (160px height max).
 * Uses instanced meshes + minimal geometry for performance.
 */
"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

// ── Variant Scenes ────────────────────────────────────────────

/** Variant A — orange circuit board style */
function SceneA() {
    const bigRef = useRef<THREE.Mesh>(null);
    useFrame((_s, delta) => {
        if (bigRef.current) bigRef.current.rotation.y += delta * 0.25;
    });
    return (
        <>
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} color="#fff" />
            <pointLight position={[-3, 2, 2]} intensity={0.6} color="#fb923c" />

            {/* Main stacked boxes */}
            <mesh ref={bigRef} position={[0, 0, 0]} castShadow>
                <boxGeometry args={[1.1, 0.2, 1.1]} />
                <meshStandardMaterial color="#f97316" flatShading />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[0.8, 0.2, 0.8]} />
                <meshStandardMaterial color="#fb923c" flatShading />
            </mesh>
            <Float speed={1.5} floatIntensity={0.3}>
                <mesh position={[0.7, 0.5, -0.3]}>
                    <boxGeometry args={[0.35, 0.35, 0.35]} />
                    <meshStandardMaterial color="#3b82f6" flatShading />
                </mesh>
            </Float>
            <Float speed={2.0} floatIntensity={0.2}>
                <mesh position={[-0.6, 0.4, 0.4]}>
                    <sphereGeometry args={[0.22, 6, 6]} />
                    <meshStandardMaterial color="#8b5cf6" flatShading />
                </mesh>
            </Float>
            <mesh position={[0, -0.6, 0]}>
                <cylinderGeometry args={[0.9, 0.9, 0.15, 6]} />
                <meshStandardMaterial color="#1e3a5f" flatShading />
            </mesh>
        </>
    );
}

/** Variant B — blue layered cards / documents */
function SceneB() {
    const stackRef = useRef<THREE.Group>(null);
    useFrame((_s, delta) => {
        if (stackRef.current) stackRef.current.rotation.y -= delta * 0.2;
    });
    return (
        <>
            <ambientLight intensity={0.75} />
            <directionalLight position={[4, 6, 4]} intensity={1.3} color="#dbeafe" />
            <pointLight position={[3, 3, -2]} intensity={0.5} color="#60a5fa" />

            <group ref={stackRef}>
                {[0, 0.28, 0.56].map((y, i) => (
                    <mesh key={i} position={[i * 0.08 - 0.08, y * 0.5 - 0.35, i * 0.08 - 0.08]}>
                        <boxGeometry args={[1.2 - i * 0.15, 0.06, 0.9 - i * 0.1]} />
                        <meshStandardMaterial
                            color={["#1d4ed8", "#2563eb", "#3b82f6"][i]}
                            flatShading
                        />
                    </mesh>
                ))}
            </group>

            <Float speed={1.2} floatIntensity={0.35}>
                <mesh position={[0.8, 0.4, 0.3]}>
                    <boxGeometry args={[0.4, 0.4, 0.4]} />
                    <meshStandardMaterial color="#7c3aed" flatShading />
                </mesh>
            </Float>
            <Float speed={1.8} floatIntensity={0.2}>
                <mesh position={[-0.8, 0.3, -0.3]}>
                    <sphereGeometry args={[0.25, 6, 6]} />
                    <meshStandardMaterial color="#06b6d4" flatShading />
                </mesh>
            </Float>
        </>
    );
}

/** Variant C — pink/red floating cubes */
function SceneC() {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((_s, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.22;
    });
    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 8, 3]} intensity={1.2} color="#fff" />
            <pointLight position={[0, 3, 3]} intensity={0.7} color="#f43f5e" />

            <group ref={groupRef}>
                <mesh position={[-0.4, -0.3, 0]}>
                    <boxGeometry args={[0.8, 0.8, 0.8]} />
                    <meshStandardMaterial color="#e11d48" flatShading />
                </mesh>
                <mesh position={[0.5, 0.2, 0.3]}>
                    <boxGeometry args={[0.55, 0.55, 0.55]} />
                    <meshStandardMaterial color="#fb7185" flatShading />
                </mesh>
                <mesh position={[0, 0.7, -0.2]}>
                    <boxGeometry args={[0.4, 0.4, 0.4]} />
                    <meshStandardMaterial color="#f43f5e" flatShading />
                </mesh>
            </group>

            <Float speed={1.5} floatIntensity={0.3}>
                <mesh position={[-0.7, 0.6, 0.5]}>
                    <sphereGeometry args={[0.22, 6, 6]} />
                    <meshStandardMaterial color="#fbbf24" flatShading />
                </mesh>
            </Float>
        </>
    );
}

/** Variant D — green/teal connections */
function SceneD() {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((_s, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * 0.2;
            ref.current.rotation.y += delta * 0.15;
        }
    });
    return (
        <>
            <ambientLight intensity={0.75} />
            <directionalLight position={[5, 5, 5]} intensity={1.1} />
            <pointLight position={[-3, 2, 2]} intensity={0.6} color="#10b981" />

            <mesh ref={ref} position={[0, 0.1, 0]}>
                <octahedronGeometry args={[0.9, 0]} />
                <meshStandardMaterial color="#059669" flatShading />
            </mesh>
            <Float speed={1.6} floatIntensity={0.4}>
                <mesh position={[0.9, 0.5, 0.3]}>
                    <boxGeometry args={[0.45, 0.45, 0.45]} />
                    <meshStandardMaterial color="#34d399" flatShading />
                </mesh>
            </Float>
            <Float speed={2.2} floatIntensity={0.25}>
                <mesh position={[-0.8, -0.3, 0.6]}>
                    <tetrahedronGeometry args={[0.35, 0]} />
                    <meshStandardMaterial color="#6ee7b7" flatShading />
                </mesh>
            </Float>
        </>
    );
}

/** Variant E — purple/violet gradient */
function SceneE() {
    const torusRef = useRef<THREE.Mesh>(null);
    useFrame((_s, delta) => {
        if (torusRef.current) {
            torusRef.current.rotation.x += delta * 0.3;
            torusRef.current.rotation.z += delta * 0.15;
        }
    });
    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight position={[4, 6, 4]} intensity={1.2} />
            <pointLight position={[0, 4, 2]} intensity={0.7} color="#a855f7" />

            <mesh ref={torusRef} position={[0, 0, 0]}>
                <torusGeometry args={[0.7, 0.28, 6, 14]} />
                <meshStandardMaterial color="#7c3aed" flatShading />
            </mesh>
            <Float speed={1.4} floatIntensity={0.35}>
                <mesh position={[0.9, 0.5, 0.2]}>
                    <boxGeometry args={[0.45, 0.45, 0.45]} />
                    <meshStandardMaterial color="#c084fc" flatShading />
                </mesh>
            </Float>
            <Float speed={2.0} floatIntensity={0.2}>
                <mesh position={[-0.7, -0.3, 0.5]}>
                    <sphereGeometry args={[0.28, 6, 6]} />
                    <meshStandardMaterial color="#f0abfc" flatShading />
                </mesh>
            </Float>
        </>
    );
}

/** Variant F — yellow/amber stars */
function SceneF() {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((_s, delta) => {
        if (ref.current) ref.current.rotation.y += delta * 0.28;
    });
    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 8, 3]} intensity={1.2} />
            <pointLight position={[2, 2, 3]} intensity={0.8} color="#fbbf24" />

            <mesh ref={ref} position={[0, 0, 0]}>
                <dodecahedronGeometry args={[0.85, 0]} />
                <meshStandardMaterial color="#d97706" flatShading />
            </mesh>
            <Float speed={1.6} floatIntensity={0.35}>
                <mesh position={[-0.9, 0.5, 0.3]}>
                    <boxGeometry args={[0.4, 0.4, 0.4]} />
                    <meshStandardMaterial color="#fbbf24" flatShading />
                </mesh>
            </Float>
            <mesh position={[0.8, -0.5, -0.5]}>
                <sphereGeometry args={[0.22, 6, 6]} />
                <meshStandardMaterial color="#f59e0b" flatShading />
            </mesh>
        </>
    );
}

// ── Variant map ───────────────────────────────────────────────

const SCENE_MAP: Record<string, React.FC> = {
    A: SceneA,
    B: SceneB,
    C: SceneC,
    D: SceneD,
    E: SceneE,
    F: SceneF,
};

const BG_MAP: Record<string, string> = {
    A: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
    B: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    C: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
    D: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
    E: "linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)",
    F: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
};

export type CardSceneVariant = "A" | "B" | "C" | "D" | "E" | "F";

interface CardSceneProps {
    variant: CardSceneVariant;
    style?: React.CSSProperties;
}

export default function CardScene({ variant, style }: CardSceneProps) {
    const SceneComponent = SCENE_MAP[variant] ?? SceneA;
    const bg = BG_MAP[variant] ?? BG_MAP.A;

    return (
        <div style={{ width: "100%", height: "100%", background: bg, ...style }}>
            <Canvas
                camera={{ position: [3, 2.5, 3.5], fov: 48 }}
                gl={{ antialias: true, alpha: false }}
                style={{ background: "transparent" }}
            >
                <Suspense fallback={null}>
                    <Environment preset="studio" />
                </Suspense>
                <SceneComponent />
            </Canvas>
        </div>
    );
}
