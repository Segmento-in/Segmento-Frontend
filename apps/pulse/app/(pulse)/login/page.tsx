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
        /* UI FIX: Background changed to Paper White (#F9F7F2) */
        <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-4 relative overflow-hidden">
            
            {/* UI FIX: Subtle Terracotta Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#A66152]/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1A1A1A]/5 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo / Branding Area */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white border border-[#E5E2DA] mb-6 shadow-sm">
                        <ShieldCheck className="w-10 h-10 text-[#A66152]" />
                    </div>
                    {/* UI FIX: font-serif italic for editorial look */}
                    <h1 className="text-4xl font-serif italic text-[#1A1A1A] tracking-tight">Segmento Pulse</h1>
                    <p className="text-[#666] mt-3 font-light tracking-wide uppercase text-[10px]">Secure Data Research Portal</p>
                </div>

                {/* UI FIX: Card changed to White Paper with sharp borders */}
                <div className="bg-white border border-[#E5E2DA] shadow-[20px_20px_0px_rgba(166,97,82,0.05)] rounded-sm p-10">
                    <form onSubmit={handleLogin} className="space-y-8">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-3 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-[#AAA] group-focus-within:text-[#A66152] transition-colors w-4 h-4" />
                                <Input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-8 bg-transparent border-t-0 border-x-0 border-b border-[#E5E2DA] focus:border-[#A66152] text-[#1A1A1A] placeholder:text-[#BBB] h-12 rounded-none transition-all shadow-none ring-0 focus-visible:ring-0"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-3 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-[#AAA] group-focus-within:text-[#A66152] transition-colors w-4 h-4" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-8 bg-transparent border-t-0 border-x-0 border-b border-[#E5E2DA] focus:border-[#A66152] text-[#1A1A1A] placeholder:text-[#BBB] h-12 rounded-none transition-all shadow-none ring-0 focus-visible:ring-0"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-[#A66152]/10 border-l-4 border-[#A66152] text-[#A66152] px-4 py-3 text-[11px] font-bold uppercase tracking-wider animate-in fade-in">
                                {error}
                            </div>
                        )}

                        {/* UI FIX: Solid Terracotta Button */}
                        <Button 
                            type="submit" 
                            className="w-full h-14 bg-[#A66152] hover:bg-[#8e5246] text-white font-bold uppercase tracking-[0.2em] text-[11px] rounded-none shadow-md transition-all active:scale-[0.98]" 
                            disabled={loading}
                        >
                            {loading ? "Verifying Access..." : "Sign In to Pulse"}
                        </Button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-[#F0EEE6] text-center">
                        <p className="text-[#999] text-[11px] font-medium tracking-wide">
                            New to the platform?{" "}
                            <Link href="/register" className="text-[#A66152] hover:underline font-bold transition-all">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
                
               
            </div>
        </div>
    );
}