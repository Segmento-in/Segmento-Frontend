import { Rocket, Sparkles, Clock, FileText, Building2, Wrench } from "lucide-react";

export default function UpcomingPage() {
    return (
        /* UI FIX: Main background changed to Paper White (#F9F7F2) */
        <div className="min-h-screen bg-[#F9F7F2] flex flex-col pt-16">
            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">

                {/* UI FIX: Subtle Texture/Glows matching the warm theme */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#A66152]/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#A66152]/5 rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto space-y-12">
                    <div className="relative">
                        {/* UI FIX: Gradient changed to Terracotta to Black */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#A66152] to-[#1A1A1A] rounded-full blur opacity-20 animate-tilt"></div>
                        <div className="relative bg-white border border-[#E5E2DA] rounded-full p-8 inline-block shadow-xl">
                            <Rocket className="w-16 h-16 text-[#A66152]" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* UI FIX: Serif typography for an editorial feel */}
                        <h1 className="text-4xl md:text-7xl font-serif italic text-[#1A1A1A] tracking-tight">
                            Something Big is Coming
                        </h1>
                        <p className="text-lg md:text-xl text-[#666] max-w-2xl mx-auto leading-relaxed font-light">
                            We're working on exclusive content including deep-dive research papers, big tech architectural breakdowns, and open source tool updates.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 px-4">
                        
                        {/* Research Card - Editorial Style */}
                        <div className="group flex flex-col text-left overflow-hidden rounded-sm bg-white border border-[#E5E2DA] transition-all hover:border-[#A66152] hover:shadow-lg">
                            <div className="p-8 space-y-4">
                                <div className="w-12 h-12 rounded-lg bg-[#A66152]/10 flex items-center justify-center border border-[#A66152]/20">
                                    <FileText className="w-6 h-6 text-[#A66152]" />
                                </div>
                                <h3 className="font-serif italic text-2xl text-[#1A1A1A]">Research Papers</h3>
                                <p className="text-sm text-[#666] leading-relaxed">
                                    In-depth technical analysis of the latest academic breakthroughs and innovations.
                                </p>
                            </div>
                            {/* Card Footer matches your Footer style */}
                            <div className="mt-auto bg-[#A66152] p-5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-white/80" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">Q2 2026 Release</span>
                                </div>
                                <Sparkles className="w-4 h-4 text-white opacity-50" />
                            </div>
                        </div>

                        {/* Big Tech Card */}
                        <div className="group flex flex-col text-left overflow-hidden rounded-sm bg-white border border-[#E5E2DA] transition-all hover:border-[#A66152] hover:shadow-lg">
                            <div className="p-8 space-y-4">
                                <div className="w-12 h-12 rounded-lg bg-[#A66152]/10 flex items-center justify-center border border-[#A66152]/20">
                                    <Building2 className="w-6 h-6 text-[#A66152]" />
                                </div>
                                <h3 className="font-serif italic text-2xl text-[#1A1A1A]">Big Tech Dives</h3>
                                <p className="text-sm text-[#666] leading-relaxed">
                                    Reverse engineering the architecture behind the world's most scalable systems.
                                </p>
                            </div>
                            <div className="mt-auto bg-[#A66152] p-5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-white/80" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">In Development</span>
                                </div>
                                <Sparkles className="w-4 h-4 text-white opacity-50" />
                            </div>
                        </div>

                        {/* Open Source Card */}
                        <div className="group flex flex-col text-left overflow-hidden rounded-sm bg-white border border-[#E5E2DA] transition-all hover:border-[#A66152] hover:shadow-lg">
                            <div className="p-8 space-y-4">
                                <div className="w-12 h-12 rounded-lg bg-[#A66152]/10 flex items-center justify-center border border-[#A66152]/20">
                                    <Wrench className="w-6 h-6 text-[#A66152]" />
                                </div>
                                <h3 className="font-serif italic text-2xl text-[#1A1A1A]">Open Source</h3>
                                <p className="text-sm text-[#666] leading-relaxed">
                                    Hands-on guides and documentation for the next generation of engineering tools.
                                </p>
                            </div>
                            <div className="mt-auto bg-[#A66152] p-5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-white/80" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">Coming Soon</span>
                                </div>
                                <Sparkles className="w-4 h-4 text-white opacity-50" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Status Badge */}
                    <div className="pt-8">
                        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#A66152] text-white font-bold text-[10px] uppercase tracking-[0.3em] shadow-lg animate-bounce">
                            <Clock className="w-4 h-4" />
                            Coming soon..
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}