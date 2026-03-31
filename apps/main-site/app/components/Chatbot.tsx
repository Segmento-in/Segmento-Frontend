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
                hello: "👋 Hello! I'm Segmento Bot 🤖 — your smart assistant!",
                hi: "👋 Hi there! I'm Segmento Bot.",
                hey: "👋 Hey! Ask me about Segmento Pulse, Sense, Pricing or Demo.",
                products:
                    "📦 Products:\n• Segmento Sense – AI data classification\n• Segmento Pulse – Real-time insights",
                default:
                    "🤔 I didn’t understand that. Ask about Products, Pricing, Demo or Solutions."
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
                    <div className="
                        relative
                        bg-[#0F172A]
                        text-white
                        rounded-2xl
                        shadow-2xl
                        px-4 py-3
                        w-64
                        border border-white/10
                    ">
                        {/* Close */}
                        <button
                            onClick={() => setShowIntro(false)}
                            className="absolute top-2 right-2 text-white/60 text-sm hover:text-white"
                        >
                            ✕
                        </button>

                        {/* Bot Icon */}
                        <div className="
                            absolute -top-5 left-4
                            w-10 h-10
                            rounded-full
                            bg-black
                            text-2xl
                            flex items-center justify-center
                            shadow-lg
                            border-2 border-[#1E293B]
                        ">
                            🤖
                        </div>

                        <p className="mt-4 text-sm font-semibold text-slate-100">
                            I am <span className="font-bold">Segmento Bot</span>
                        </p>
                        {/* THEME BLUE APPLIED HERE */}
                        <p className="text-xs text-[#2563EB] font-bold mt-1">
                            Ask me anything ✨
                        </p>

                        {/* Arrow */}
                        <div className="
                            absolute bottom-1.5 right-6
                            w-4 h-4
                            bg-[#0F172A]
                            rotate-45
                        " />
                    </div>
                </div>
            )}

            {/* FLOATING BUTTON */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="
                        fixed bottom-6 right-6 z-50
                        w-16 h-16 rounded-full
                        bg-black
                        text-white shadow-xl
                        hover:scale-110 transition
                        flex items-center justify-center
                        border border-white/10
                    "
                >
                    <span className="text-4xl">🤖</span>
                </button>
            )}

            {/* CHAT WINDOW */}
            {open && (
                <div className="
                    fixed bottom-6 right-6 z-50
                    w-80 md:w-96 h-[550px]
                    bg-white
                    rounded-2xl shadow-2xl
                    flex flex-col overflow-hidden
                    border border-slate-200
                    animate-slide-up
                ">
                    {/* Header: Deep Navy */}
                    <div className="
                        flex justify-between items-center p-4
                        bg-[#0F172A]
                        text-white
                    ">
                        <div className="font-bold text-lg flex items-center gap-2 text-slate-100">
                            🤖 Segmento Bot
                        </div>
                        <button onClick={() => setOpen(false)} className="text-xl hover:text-slate-300">
                            ✕
                        </button>
                    </div>

                    {/* Messages Container */}
                    <div
                        ref={scrollRef}
                        className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50"
                    >
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`px-4 py-3 rounded-2xl max-w-[80%] whitespace-pre-line shadow-sm text-sm font-medium ${
                                        msg.from === "user"
                                            ? "bg-[#2563EB] text-white rounded-br-sm" // THEME BLUE FOR USER
                                            : "bg-black text-white rounded-bl-sm"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {botTyping && (
                            <div className="text-slate-400 bg-black text-white w-fit px-4 py-2 rounded-2xl text-xs shadow-sm">
                                🤖 typing...
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask me about Segmento..."
                            className="
                                flex-1 px-4 py-2
                                bg-slate-100 text-[#0F172A]
                                border border-slate-200
                                rounded-2xl
                                text-sm
                                focus:outline-none
                                focus:ring-2 focus:ring-[#2563EB]
                            "
                        />
                        <button
                            onClick={sendMessage}
                            className="
                                px-4 py-2 rounded-2xl
                                text-white font-bold text-sm
                                bg-black
                                hover:bg-[#1E293B] transition-colors
                            "
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}