'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { ID } from "appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // 1. Create native Appwrite account
            await account.create(ID.unique(), email, password, name);

            // 2. Automatically log in the user
            await account.createEmailPasswordSession(email, password);

            // 3. Auto-subscribe to newsletter (Brevo) via internal API
            await fetch("/api/subscription/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            router.push("/");
        } catch (err: any) {
            setError(err.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null; // Prevent hydration mismatch on initial render

    return (
        <div className="min-h-[100dvh] w-full grid grid-cols-1 lg:grid-cols-2 bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans">
            
            {/* LEFT PANEL: BRAND ATMOSPHERE (The Editorial Split) */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 xl:p-24 border-r border-zinc-200 dark:border-white/10 overflow-hidden bg-zinc-100/50 dark:bg-zinc-950/50">
                
                {/* Ambient Ethereal Glows */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-in fade-in duration-1000" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-in fade-in duration-1000 delay-300" />
                    {/* Subtle CSS Noise */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
                </div>

                <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-zinc-200/50 dark:bg-white/5 border border-zinc-300/50 dark:border-white/10 backdrop-blur-md">
                        <ShieldCheck className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-700 dark:text-zinc-300">
                            Join The Network
                        </span>
                    </div>
                    
                    <h1 className="text-5xl xl:text-7xl font-bold tracking-tighter leading-[1.05] mb-6" style={{ fontFamily: 'var(--font-brand, inherit)' }}>
                        Unlock<br />
                        <span className="text-zinc-400 dark:text-zinc-500">The Pulse</span>
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
                        Create an account to access exclusive technology insights, a personalized dashboard, and advanced engagement metrics.
                    </p>
                </div>

                <div className="relative z-10 text-sm text-zinc-500 dark:text-zinc-500 font-medium tracking-wide animate-in fade-in duration-1000 delay-500">
                    &copy; {new Date().getFullYear()} Segmento Inc.
                </div>
            </div>

            {/* RIGHT PANEL: INTERACTION (The Action Surface) */}
            <div className="relative flex items-center justify-center p-6 sm:p-12 lg:p-24 w-full h-full">
                
                {/* Mobile Header Fallback */}
                <div className="absolute top-8 left-8 lg:hidden z-20">
                    <h2 className="text-2xl font-bold tracking-tighter" style={{ fontFamily: 'var(--font-brand, inherit)' }}>
                        Segmento<span className="text-zinc-400 dark:text-zinc-500">Pulse</span>
                    </h2>
                </div>

                <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] delay-150">
                    
                    {/* The Double-Bezel Architecture */}
                    <div className="p-1.5 rounded-[2.5rem] bg-zinc-200/50 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 shadow-2xl backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:ring-black/10 dark:hover:ring-white/20">
                        <div className="bg-white dark:bg-zinc-900 rounded-[calc(2.5rem-0.375rem)] p-8 sm:p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                            
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2" style={{ fontFamily: 'var(--font-brand, inherit)' }}>
                                    Create Account
                                </h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Set up your profile to get started.
                                </p>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-6">
                                <div className="space-y-2 group">
                                    <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-500 dark:text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 transition-colors group-focus-within:text-zinc-900 dark:group-focus-within:text-white" strokeWidth={1.5} />
                                        <Input
                                            type="text"
                                            placeholder="John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="pl-11 h-14 bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all duration-300 rounded-2xl"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-500 dark:text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 transition-colors group-focus-within:text-zinc-900 dark:group-focus-within:text-white" strokeWidth={1.5} />
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-11 h-14 bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all duration-300 rounded-2xl"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="block text-[10px] font-bold tracking-[0.15em] uppercase text-zinc-500 dark:text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 transition-colors group-focus-within:text-zinc-900 dark:group-focus-within:text-white" strokeWidth={1.5} />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-11 h-14 bg-zinc-50 dark:bg-black/50 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all duration-300 rounded-2xl"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-sm font-medium animate-in fade-in zoom-in-95 duration-300">
                                        {error}
                                    </div>
                                )}

                                <div className="pt-2">
                                    {/* Nested CTA Architecture (Button-in-Button) */}
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="group relative w-full flex items-center justify-between h-14 pl-6 pr-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed hover:bg-zinc-800 dark:hover:bg-zinc-100"
                                    >
                                        <span className="relative z-10 text-sm tracking-wide">
                                            {loading ? "Creating Account..." : "Create Account"}
                                        </span>
                                        
                                        {/* Trailing Icon Nested Circle */}
                                        <div className="relative z-10 w-10 h-10 rounded-full bg-white/10 dark:bg-black/10 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-white/20 dark:group-hover:bg-black/20 group-hover:scale-105">
                                            <ArrowRight className="w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-[1px]" strokeWidth={2} />
                                        </div>
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Already have an account?{" "}
                                    <Link 
                                        href="/login" 
                                        className="text-zinc-900 dark:text-white font-semibold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-zinc-900 dark:after:bg-white after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.32,0.72,0,1)]"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
