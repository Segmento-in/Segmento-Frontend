'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { pulseAuth } from "@/lib/firebase";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Mail, Lock, User, Sparkles } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!pulseAuth) {
                throw new Error("Authentication service not available");
            }
            await createUserWithEmailAndPassword(pulseAuth, email, password);

            // Auto-subscribe to Weekly Newsletter (Default)
            try {
                const API_BASE = process.env.NEXT_PUBLIC_PULSE_API_URL || 'http://localhost:8000';
                await fetch(`${API_BASE}/api/subscription/subscribe`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email,
                        name: name,
                        preference: "Weekly",
                        topics: ["news", "tech"]
                    })
                });
            } catch (subError) {
                console.error("Auto-subscription failed:", subError);
            }

            router.push("/");
        } catch (err: any) {
            setError(err.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-purple-600/10 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md relative z-10 py-12">
                {/* Branding Area */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 mb-4 shadow-lg shadow-cyan-500/20">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Join Pulse</h1>
                    <p className="text-slate-400 mt-2">Create your account to start exploring</p>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-xl rounded-[28px] border border-white/10 shadow-2xl p-8">
                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-12 bg-white/[0.05] border-white/10 text-white placeholder:text-slate-600 h-12 rounded-xl focus:bg-white/[0.08] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors w-5 h-5" />
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 bg-white/[0.05] border-white/10 text-white placeholder:text-slate-600 h-12 rounded-xl focus:bg-white/[0.08] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 bg-white/[0.05] border-white/10 text-white placeholder:text-slate-600 h-12 rounded-xl focus:bg-white/[0.08] transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 ml-1 italic">Security: Minimum 6 characters required</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full h-12 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-[0.98] mt-2" 
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-slate-400 text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center mt-8 text-slate-600 text-xs tracking-widest uppercase">
                    Secured by Pulse Auth Systems
                </p>
            </div>
        </div>
    );
}