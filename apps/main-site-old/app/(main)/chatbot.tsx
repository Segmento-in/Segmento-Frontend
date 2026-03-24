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
                        bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400
                        text-white
                        rounded-2xl
                        shadow-2xl
                        px-4 py-3
                        w-64
                        border border-white/20
                    ">
                        {/* Close */}
                        <button
                            onClick={() => setShowIntro(false)}
                            className="absolute top-2 right-2 text-white text-sm opacity-80 hover:opacity-100"
                        >
                            ✕
                        </button>

                        {/* Bot Icon */}
                        <div className="
                            absolute -top-5 left-4
                            w-10 h-10
                            rounded-full
                            bg-gradient-to-br from-indigo-500 to-cyan-400
                            text-2xl
                            flex items-center justify-center
                            shadow-lg
                            border-2 border-white/30
                        ">
                            🤖
                        </div>

                        <p className="mt-4 text-sm font-semibold">
                            I am <span className="font-bold">Segmento Bot</span>
                        </p>
                        <p className="text-xs opacity-90 mt-1">
                            Ask me anything ✨
                        </p>

                        {/* Arrow */}
                        <div className="
                            absolute bottom-1.5 right-6
                            w-4 h-4
                            bg-cyan-400
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
                        bg-gradient-to-br from-indigo-500 to-cyan-500
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
                    bg-[#020617]
                    rounded-2xl shadow-2xl
                    flex flex-col overflow-hidden
                    border border-slate-800
                    animate-slide-up
                ">
                    {/* Header */}
                    <div className="
                        flex justify-between items-center p-4
                        bg-gradient-to-r from-indigo-500 to-cyan-500
                        text-white
                    ">
                        <div className="font-bold text-lg flex items-center gap-2">
                            🤖 Segmento Bot
                        </div>
                        <button onClick={() => setOpen(false)} className="text-xl">
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={scrollRef}
                        className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#020617]"
                    >
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`px-4 py-3 rounded-2xl max-w-[80%] whitespace-pre-line shadow ${
                                        msg.from === "user"
                                            ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-br-sm"
                                            : "bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {botTyping && (
                            <div className="text-slate-400 bg-slate-900 w-fit p-3 rounded-2xl border border-slate-700">
                                🤖 typing...
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask me about Segmento..."
                            className="
                                flex-1 px-4 py-2
                                bg-[#020617] text-white
                                border border-slate-700
                                rounded-2xl
                                focus:outline-none
                                focus:ring-2 focus:ring-cyan-400
                            "
                        />
                        <button
                            onClick={sendMessage}
                            className="
                                px-4 py-2 rounded-2xl
                                text-white
                                bg-gradient-to-r from-indigo-500 to-cyan-500
                                hover:opacity-90 transition
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