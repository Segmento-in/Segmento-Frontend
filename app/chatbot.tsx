"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
    from: "user" | "bot";
    text: string;
};

export default function Chatbot() {
    const [open, setOpen] = useState(false);
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

            // Bot responses including greetings
            const botResponses: Record<string, string> = {
                hello: "👋 Hello! I'm Segmento Bot 🤖 — your smart assistant for data security & intelligence!",
                hi: "👋 Hi there! I'm Segmento Bot — your AI assistant for Segmento .",
                hey: "👋 Hey! I'm Segmento Bot — I can answer your questions about Segmento Sense, Segmento Pulse, Pricing, Demo, and more.",
                products:
                    "📦 Our Products:\n• Segmento Sense – AI-powered data classification & PII detection\n• Segmento Pulse – Compliance, risk insights, and data governance",
                "segmento sense":
                    "🚀 Segmento Sense is our flagship product. It offers AI-powered data classification, enterprise-grade security, and processes millions of records per second. Trusted by top organizations!",
                "segmento pulse":
                    "📊 Segmento Pulse provides compliance, risk insights, and enterprise data governance capabilities for large-scale organizations.",
                solutions:
                    "💡 Our Solutions:\n• eCommerce\n• Finance\n• Healthcare\n• Higher Education\n• Manufacturing\n• Telecommunication\n• Media\n• Banking",
                pricing:
                    "💰 Our pricing is flexible depending on your enterprise needs. Visit the Pricing page for detailed plans or contact our sales team 🚀",
                contact:
                    "📞 Contact us anytime at contact@segmento.com or via the contact form on our website. We'll be happy to assist you!",
                "why segmento":
                    "✅ Segmento is built for enterprises demanding security, intelligence, and scale. Privacy-first, AI-driven, GDPR & HIPAA compliant.",
                uptime:
                    "⏱ Segmento provides 99.99% uptime SLA, ensuring reliability for enterprise workloads.",
                ai:
                    "🤖 Segmento products use AI-native intelligence to understand your data context, not just patterns. Accuracy up to 95% with zero data breaches.",
                demo:
                    "🎯 You can view a live demo of Segmento Sense on our website to see AI-powered data classification in action.",
                default:
                    "🤔 I didn't understand that. You can ask me about Products, Solutions, Pricing, Segmento Sense, Segmento Pulse, Contact info, or request a Demo."
            };

            // Match user input with responses
            let response = botResponses.default;
            for (const key in botResponses) {
                if (text.includes(key)) {
                    response = botResponses[key];
                    break;
                }
            }

            const botMsg: Message = { from: "bot", text: response };
            setMessages((prev) => [...prev, botMsg]);
            setBotTyping(false);
        }, 900);
    };

    return (
        <>
            {/* BOT POPUP (ALWAYS VISIBLE) */}
            <div className="fixed bottom-28 right-6 z-40 animate-popup">
                <div className="relative bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-2xl shadow-2xl px-4 py-3 w-64">
                    <div className="absolute -top-5 left-4 w-10 h-10 rounded-full bg-white text-2xl flex items-center justify-center shadow-lg animate-bot">
                        🤖
                    </div>
                    <p className="mt-4 text-sm font-semibold">
                        I am <span className="font-bold">Segmento Bot</span>
                    </p>
                    <p className="text-xs opacity-90 mt-1">Ask me anything ✨</p>
                    <div className="absolute bottom-[-6px] right-6 w-4 h-4 bg-gradient-to-br from-purple-600 to-pink-500 rotate-45"></div>
                </div>
            </div>

            {/* FLOATING CHAT BUTTON */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-3xl shadow-xl hover:scale-110 transition"
                >
                    🤖
                </button>
            )}

            {/* CHAT WINDOW */}
            {open && (
                <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 h-[460px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-slide-up">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                        <div className="flex items-center gap-2 text-lg font-bold">🤖 Segmento Bot</div>
                        <button onClick={() => setOpen(false)} className="text-xl hover:opacity-80">
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`px-4 py-2 rounded-2xl max-w-[75%] whitespace-pre-line shadow ${msg.from === "user"
                                            ? "bg-gradient-to-br from-purple-600 to-pink-500 text-white"
                                            : "bg-white text-gray-800"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {botTyping && (
                            <div className="flex items-center gap-2 text-gray-500">
                                🤖 typing
                                <span className="animate-bounce">.</span>
                                <span className="animate-bounce delay-150">.</span>
                                <span className="animate-bounce delay-300">.</span>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Ask me about Segmento..."
                            className="flex-1 px-3 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            onClick={sendMessage}
                            className="px-4 py-2 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 text-white hover:opacity-90"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
