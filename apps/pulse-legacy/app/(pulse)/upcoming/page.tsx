import { Rocket, Sparkles, Clock } from "lucide-react";

export default function UpcomingPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col pt-16">
            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">

                {/* Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 animate-tilt"></div>
                        <div className="relative bg-white rounded-full p-6 inline-block shadow-xl">
                            <Rocket className="w-16 h-16 text-blue-600" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            Something Big is Coming
                        </h1>
                        <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
                            We're working on exclusive content including deep-dive research papers, big tech architectural breakdowns, and open source tool updates.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-xl">📄</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Research Papers</h3>
                            <p className="text-sm text-gray-500">In-depth technical analysis</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-xl">🏢</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Big Tech Deep Dives</h3>
                            <p className="text-sm text-gray-500">How the giants build</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="text-xl">🛠️</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Open Source</h3>
                            <p className="text-sm text-gray-500">Latest tools & updates</p>
                        </div>
                    </div>

                    <div className="pt-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm animate-bounce">
                            <Clock className="w-4 h-4" />
                            Coming Soon
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
