'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { pulseAuth } from "@/lib/firebase";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Mail, Lock, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!pulseAuth) {
                throw new Error("Authentication service not available");
            }
            await signInWithEmailAndPassword(pulseAuth, email, password);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Failed to log in");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo / Branding Area */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 mb-4 shadow-lg shadow-purple-500/20">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Segmento Pulse</h1>
                    <p className="text-slate-400 mt-2">Sign in to your secure data portal</p>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-xl rounded-[28px] border border-white/10 shadow-2xl p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors w-5 h-5" />
                                <Input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-12 bg-white/[0.05] border-white/10 text-white placeholder:text-slate-600 h-12 rounded-xl focus:bg-white/[0.08] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors w-5 h-5" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 bg-white/[0.05] border-white/10 text-white placeholder:text-slate-600 h-12 rounded-xl focus:bg-white/[0.08] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full h-12 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-[0.98]" 
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Sign In to Pulse"}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-slate-400 text-sm">
                            New to the platform?{" "}
                            <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
                
                <p className="text-center mt-8 text-slate-600 text-xs tracking-widest uppercase">
                    &copy; 2026 Segmento Data Systems
                </p>
            </div>
        </div>
    );
}