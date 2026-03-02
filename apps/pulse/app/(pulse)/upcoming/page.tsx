import { Rocket, Sparkles, Clock, FileText, Building2, Wrench } from "lucide-react";

export default function UpcomingPage() {
    return (
        /* Main background to #020617 */
        <div className="min-h-screen bg-[#020617] flex flex-col pt-16">
            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">

                {/* Background Glows */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto space-y-12">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-30 animate-tilt"></div>
                        <div className="relative bg-[#020617] border border-slate-800 rounded-full p-6 inline-block shadow-2xl">
                            <Rocket className="w-16 h-16 text-blue-500" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold text-blue-700">
                            Something Big is Coming
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            We're working on exclusive content including deep-dive research papers, big tech architectural breakdowns, and open source tool updates.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 px-4">
                        
                        {/* Research Card - Colorful Icon */}
                        <div className="group flex flex-col text-left overflow-hidden rounded-xl bg-[#0f172a] border border-slate-800 transition-all hover:border-blue-500/50">
                            <div className="p-6 space-y-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-inner">
                                    {/* ICON UPDATED TO BLUE */}
                                    <FileText className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="font-bold text-xl text-white">Research Papers</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    In-depth technical analysis of the latest academic breakthroughs.
                                </p>
                            </div>
                            <div className="mt-auto bg-[#1e293b] p-4 flex items-center justify-between border-t border-slate-700/50">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-medium text-slate-300">Q2 2026 Release</span>
                                </div>
                                <Sparkles className="w-4 h-4 text-blue-400 opacity-50" />
                            </div>
                        </div>

                        {/* Big Tech Card - Colorful Icon */}
                        <div className="group flex flex-col text-left overflow-hidden rounded-xl bg-[#0f172a] border border-slate-800 transition-all hover:border-purple-500/50">
                            <div className="p-6 space-y-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-inner">
                                    {/* ICON UPDATED TO PURPLE */}
                                    <Building2 className="w-6 h-6 text-purple-500" />
                                </div>
                                <h3 className="font-bold text-xl text-white">Big Tech Dives</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Reverse engineering the architecture behind the world's largest systems.
                                </p>
                            </div>
                            <div className="mt-auto bg-[#1e293b] p-4 flex items-center justify-between border-t border-slate-700/50">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-medium text-slate-300">In Development</span>
                                </div>
                                <Sparkles className="w-4 h-4 text-purple-400 opacity-50" />
                            </div>
                        </div>

                        {/* Open Source Card - Colorful Icon */}
                        <div className="group flex flex-col text-left overflow-hidden rounded-xl bg-[#0f172a] border border-slate-800 transition-all hover:border-indigo-500/50">
                            <div className="p-6 space-y-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-inner">
                                    {/* ICON UPDATED TO INDIGO */}
                                    <Wrench className="w-6 h-6 text-indigo-500" />
                                </div>
                                <h3 className="font-bold text-xl text-white">Open Source</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Hands-on guides and updates for the next generation of tools.
                                </p>
                            </div>
                            <div className="mt-auto bg-[#1e293b] p-4 flex items-center justify-between border-t border-slate-700/50">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span className="text-xs font-medium text-slate-300">Coming Soon</span>
                                </div>
                                <Sparkles className="w-4 h-4 text-indigo-400 opacity-50" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Status Badge */}
                    <div className="pt-8">
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 font-semibold text-sm animate-bounce">
                            <Clock className="w-4 h-4" />
                            comming soon..
                        </div>
                    </div>
                </div>
            </main>

            
        </div>
    );
}