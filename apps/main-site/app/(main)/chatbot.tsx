'use client';

import { useState, useRef, useEffect } from "react";

type Message = {
    from: "user" | "bot";
    text: string;
};

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [showIntro, setShowIntro] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [botTyping, setBotTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto scroll to latest message
    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, botTyping]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMsg: Message = { from: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setBotTyping(true);

        setTimeout(() => {
            const text = input.toLowerCase().trim();

            const botResponses: Record<string, string> = {
                hello: "👋 Hello! I'm Segmento Bot 🤖 — your smart assistant for data security & intelligence!",
                hi: "👋 Hi there! I'm Segmento Bot — your AI assistant for Segmento.",
                hey: "👋 Hey! I'm Segmento Bot — I can help you with Segmento Sense, Pulse, Pricing, Demo & more.",
                products:
                    "📦 Products:\n• Segmento Sense – AI-powered data classification\n• Segmento Pulse – Compliance & risk insights",
                "segmento sense":
                    "🚀 Segmento Sense provides AI-powered data classification & PII detection at scale.",
                "segmento pulse":
                    "📊 Segmento Pulse delivers compliance, governance & risk intelligence.",
                solutions:
                    "💡 Solutions:\n• Finance\n• Healthcare\n• eCommerce\n• Banking\n• Education",
                pricing:
                    "💰 Pricing is flexible based on enterprise needs. Visit our pricing page.",
                contact:
                    "📞 Contact us at contact@segmento.com",
                demo:
                    "🎯 You can request a live demo from our website.",
                default:
                    "🤔 I didn’t understand that. Ask me about Products, Pricing, Demo, or Segmento solutions."
            };

            let response = botResponses.default;
            for (const key in botResponses) {
                if (text.includes(key)) {
                    response = botResponses[key];
                    break;
                }
            }

            setMessages((prev) => [...prev, { from: "bot", text: response }]);
            setBotTyping(false);
        }, 900);
    };

    return (
        <>
            {/* INTRO DIALOGUE */}
            {showIntro && !open && (
                <div className="fixed bottom-28 right-6 z-40 animate-popup">
                    <div className="relative bg-[#1B2B6F] text-white rounded-2xl shadow-2xl px-4 py-3 w-64 border border-white/10">
                        
                        {/* CLOSE ICON */}
                        <button
                            onClick={() => setShowIntro(false)}
                            className="absolute top-2 right-2 text-white text-sm opacity-80 hover:opacity-100"
                        >
                            ✕
                        </button>

                        <div className="absolute -top-5 left-4 w-10 h-10 rounded-full bg-[#020617] text-2xl flex items-center justify-center shadow-lg animate-bot border-2 border-white/10">
                            🤖
                        </div>

                        <p className="mt-4 text-sm font-semibold">
                            I am <span className="font-bold text-cyan-400">Segmento Bot</span>
                        </p>
                        <p className="text-xs opacity-90 mt-1">Ask me anything ✨</p>

                        <div className="absolute bottom-1.5 right-6 w-4 h-4 bg-[#1B2B6F] rotate-45 border-r border-b border-white/10"></div>
                    </div>
                </div>
            )}

            {/* FLOATING CHAT BUTTON */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600 to-indigo-600 text-white shadow-xl hover:scale-110 transition flex items-center justify-center border-2 border-white/10"
                >
                    <span className="text-4xl">🤖</span>
                </button>
            )}

            {/* CHAT WINDOW */}
            {open && (
                <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 h-[550px] bg-[#020617] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700 animate-slide-up">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 bg-slate-900 border-b border-slate-700 text-white">
                        <div className="flex items-center gap-2 font-bold text-lg">🤖 Segmento Bot</div>
                        <button onClick={() => setOpen(false)} className="text-xl hover:opacity-80">
                            ✕
                        </button>
                    </div>

                    {/* Messages Container with Explicit CSS Scrollbar Styles */}
                    <div 
                        ref={scrollRef} 
                        className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#020617]"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#334155 #020617', // thumb color, track color
                        }}
                    >
                        {/* Inline styles for Webkit (Chrome, Safari, newer Edge)
                            This overrides the Tailwind classes for stricter control.
                        */}
                        <style jsx>{`
                            div::-webkit-scrollbar {
                                width: 8px;
                            }
                            div::-webkit-scrollbar-track {
                                background: #020617; /* Theme Color */
                            }
                            div::-webkit-scrollbar-thumb {
                                background-color: #334155; /* Slate-700 */
                                border-radius: 10px;
                            }
                        `}</style>
                        
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`px-4 py-3 rounded-2xl max-w-[80%] whitespace-pre-line shadow ${
                                        msg.from === "user"
                                            ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-sm"
                                            : "bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {botTyping && (
                            <div className="flex items-center gap-2 text-slate-400 bg-slate-900 w-fit p-3 rounded-2xl border border-slate-700">
                                <span className="animate-pulse">🤖 typing...</span>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-slate-900 border-t border-slate-700 flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask me about Segmento..."
                            className="flex-1 px-4 py-2 bg-[#020617] text-white border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button
                            onClick={sendMessage}
                            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white hover:opacity-90 flex items-center gap-2"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}