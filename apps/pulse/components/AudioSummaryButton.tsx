'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Headphones, Loader2, Volume2, Play, Pause } from 'lucide-react';
import { cn } from '@/shared/utils';
import { getApiBase } from '@/lib/apiBase';


interface AudioSummaryButtonProps {
    articleId: string;
    articleUrl: string;
    initialAudioUrl?: string;
    initialTextSummary?: string;
    title: string;
    image: string;
    category: string;
    className?: string;
}

interface FloatingNote {
    id: number;
    emoji: string;
    x: number;
    y: number;
    rotate: number;
}

const CATCHY_MESSAGES = [
    "🎧 Too lazy to read? We got you!",
    "👂 Your ears will thank you",
    "🎶 Turn words into vibes",
    "⚡ 5 min summary, 0 effort",
    "🔥 Listen while you scroll",
    "✨ Audio magic incoming",
    "🚀 From article to audio in seconds",
    "💫 Multitask like a boss"
];

const MUSIC_EMOJIS = ["🎵", "🎶", "🎼", "♪", "♫", "🎧"];

export default function AudioSummaryButton({
    articleId,
    articleUrl,
    initialAudioUrl,
    initialTextSummary,
    title,
    image,
    category,
    className
}: AudioSummaryButtonProps) {
    const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const [floatingNotes, setFloatingNotes] = useState<FloatingNote[]>([]);
    const [showPulseRing, setShowPulseRing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const noteIdCounter = useRef(0);
    const spawnInterval = useRef<NodeJS.Timeout | null>(null);

    // If it's a research paper (category starts with 'research-'), disable and show "Coming Soon"
    const isResearch = category?.toLowerCase().startsWith('research') || false;

    // Initialize audio element
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.onended = () => setIsPlaying(false);
            audioRef.current.onerror = () => {
                console.error("Audio playback error");
                setIsPlaying(false);
                setIsLoading(false);
            };
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Rotate messages every 3.5 seconds
    useEffect(() => {
        const messageTimer = setInterval(() => {
            setIsFading(true);
            setTimeout(() => {
                setMessageIndex((prev) => (prev + 1) % CATCHY_MESSAGES.length);
                setIsFading(false);
            }, 400); // Fade duration
        }, 3500);

        return () => clearInterval(messageTimer);
    }, []);

    // Spawn floating notes continuously
    const spawnNote = useCallback(() => {
        const note: FloatingNote = {
            id: noteIdCounter.current++,
            emoji: MUSIC_EMOJIS[Math.floor(Math.random() * MUSIC_EMOJIS.length)],
            x: Math.random() * 100 - 50, // -50 to 50
            y: Math.random() * 80 + 40, // 40 to 120
            rotate: Math.random() * 360
        };

        setFloatingNotes(prev => [...prev, note]);

        // Auto-cleanup after 2 seconds
        setTimeout(() => {
            setFloatingNotes(prev => prev.filter(n => n.id !== note.id));
        }, 2000);
    }, []);

    // Continuous note spawning based on state
    useEffect(() => {
        let interval = 700; // Default
        if (isLoading) interval = 150;
        else if (isHovered) interval = 300;

        if (spawnInterval.current) clearInterval(spawnInterval.current);

        spawnInterval.current = setInterval(spawnNote, interval);

        return () => {
            if (spawnInterval.current) clearInterval(spawnInterval.current);
        };
    }, [isLoading, isHovered, spawnNote]);

    // Cleanup old notes (safety check)
    useEffect(() => {
        const cleanup = setInterval(() => {
            setFloatingNotes(prev => prev.slice(-14)); // Keep max 14
        }, 1000);

        return () => clearInterval(cleanup);
    }, []);

    const burstNotes = () => {
        const angles = [0, 45, 90, 135, 180, 225, 270, 315];
        const distance = 80;

        angles.forEach(angle => {
            const rad = (angle * Math.PI) / 180;
            const note: FloatingNote = {
                id: noteIdCounter.current++,
                emoji: MUSIC_EMOJIS[Math.floor(Math.random() * MUSIC_EMOJIS.length)],
                x: Math.cos(rad) * distance,
                y: Math.sin(rad) * distance,
                rotate: angle
            };

            setFloatingNotes(prev => [...prev, note]);
            setTimeout(() => {
                setFloatingNotes(prev => prev.filter(n => n.id !== note.id));
            }, 2000);
        });
    };

    // BUG FIX: Initialize from initialTextSummary alone — do NOT require initialAudioUrl to be present too.
    const [textSummary, setTextSummary] = useState<string | null>(initialTextSummary || null);

    // If props update, sync the text summary state
    useEffect(() => {
        if (initialTextSummary) {
            setTextSummary(initialTextSummary);
        }
    }, [initialTextSummary]);

    // BUG FIX: Check status on mount if audio is missing.
    // Previously this only fired when BOTH initialAudioUrl AND initialTextSummary were absent,
    // which meant that if text_summary was present but audio_url was empty, we'd skip the fetch entirely.
    useEffect(() => {
        if (!initialAudioUrl) {
            const checkStatus = async () => {
                try {
                    const encodedUrl = encodeURIComponent(articleUrl);
                    const encodedCategory = category ? encodeURIComponent(category) : '';
                    const API_BASE = getApiBase();
                    const res = await fetch(`${API_BASE}/api/audio/status?article_url=${encodedUrl}&category=${encodedCategory}`);
                    const data = await res.json();

                    if (data.success) {
                        if (data.audio_url) setAudioUrl(data.audio_url);
                        // Only update text summary from backend if we don't have one already
                        if (data.text_summary && !initialTextSummary) setTextSummary(data.text_summary);
                    }
                } catch (err) {
                    console.error("Failed to check audio status", err);
                }
            };
            checkStatus();
        }
    }, [articleUrl, category, initialAudioUrl, initialTextSummary]);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isResearch) {
            return;
        }

        if (isLoading) return;

        // Show pulse ring
        setShowPulseRing(true);
        setTimeout(() => setShowPulseRing(false), 1000);

        // Burst notes
        burstNotes();

        // If playing, pause
        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        // If audio exists but stopped, play
        if (audioUrl && audioRef.current) {
            if (audioRef.current.src !== audioUrl) {
                audioRef.current.src = audioUrl;
            }
            try {
                await audioRef.current.play();
                setIsPlaying(true);
            } catch (err) {
                console.error("Play failed", err);
            }
            return;
        }

        // Generate audio
        setIsLoading(true);
        try {
            const API_BASE = getApiBase();
            const response = await fetch(`${API_BASE}/api/audio/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    article_url: articleUrl,
                    title: title,
                    image_url: image,
                    category: category
                })
            });

            const data = await response.json();

            if (data.success && data.audio_url) {
                setAudioUrl(data.audio_url);
                if (data.text_summary) setTextSummary(data.text_summary);

                if (audioRef.current) {
                    audioRef.current.src = data.audio_url;
                    await audioRef.current.play();
                    setIsPlaying(true);
                }
            } else {
                const errorMsg = data.message || data.detail || "Unknown error occurred";
                console.error("Audio generation failed", errorMsg);
            }
        } catch (error) {
            console.error("Audio fetch error", error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "24px 0" }}>
            {/* Main Button Container */}
            <div style={{ position: "relative", cursor: "pointer" }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                {/* Rotating Message Bubble - Now Top Right */}
                <div style={{ position: "absolute", top: "-56px", right: "-48px", zIndex: 20, display: "block" }}>
                    <div
                        className={cn(
                            "px-4 py-2 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm transition-all duration-400 dark:border-purple-700 dark:from-purple-900 dark:to-pink-900",
                            isFading ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
                        )}
                    >
                        <p className="text-sm font-medium text-gray-700 whitespace-nowrap dark:text-gray-300">
                            {CATCHY_MESSAGES[messageIndex]}
                        </p>
                    </div>
                    {/* Triangular tail pointing down-left to the button */}
                    <div className="absolute left-4 -bottom-1.5 w-3 h-3 bg-gradient-to-br from-pink-50 to-purple-50 border-b border-r border-purple-200 rotate-45 transform dark:from-pink-900 dark:to-purple-900 dark:border-purple-700" />
                </div>

                {/* Ambient Glow Layer */}
                <div style={{
                    position: "absolute", inset: 0, borderRadius: "16px", filter: "blur(24px)",
                    pointerEvents: "none", background: 'var(--gradient-audio)', opacity: 0.6
                }} />

                {/* Pulse Ring */}
                {showPulseRing && (
                    <div style={{ position: "absolute", inset: 0, borderRadius: "16px", pointerEvents: "none", background: 'var(--gradient-audio)' }} />
                )}

                {/* Floating Notes */}
                {floatingNotes.map(note => (
                    <div
                        key={note.id}
                        style={{
                            position: "absolute", transform: "translate(-50%, -50%)",
                            pointerEvents: "none", fontSize: "36px", zIndex: 10,
                            top: `calc(50% - ${note.y}px)`, left: `calc(50% + ${note.x}px)`, opacity: 0,
                            transition: "all 2s ease-out"
                        }}
                    >
                        {note.emoji}
                    </div>
                ))}

                {/* Main Button */}
                <button
                    onClick={handleClick}
                    disabled={isResearch}
                    className={cn(
                        "relative px-7 py-3.5 rounded-2xl font-semibold text-gray-800 border border-purple-200/50 dark:text-gray-200 dark:border-purple-700/50",
                        "transition-all duration-300 ease-out",
                        "hover:scale-105 hover:-translate-y-0.5",
                        "active:scale-100 active:translate-y-0",
                        
                        "focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2",
                        "animate-button-breathe flex items-center gap-3",
                        isResearch ? "opacity-50 cursor-not-allowed" : ""
                    )}
                    style={{ background: 'var(--gradient-audio)' }}
                    aria-label="Play Audio Summary"
                >
                    {/* Icon */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : isPlaying ? (
                            <Pause size={20} />
                        ) : audioUrl ? ( // If audio is ready but paused/stopped
                            <Play size={20} />
                        ) : (
                            <Headphones size={20} />
                        )}
                    </div>

                    {/* Text */}
                    <span>
                        {isLoading ? "Generating..." :
                            isPlaying ? "Pause" :
                                audioUrl ? "Resume" :
                                    "Audio Summary"}
                    </span>

                    {/* Equalizer Bars */}
                    {!isLoading && (
                        <div style={{ display: "flex", alignItems: "center", gap: "2px", height: "16px" }}>
                            {[0, 1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    style={{ width: "3px", height: isPlaying ? `${Math.random() * 10 + 6}px` : "10px", borderRadius: "99px", background: "#A855F7", transition: "height 100ms" }}
                                />
                            ))}
                        </div>
                    )}
                </button>

                {/* Tooltip for Research Papers */}
                {isResearch && isHovered && (
                    <div style={{
                        position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)",
                        background: "rgba(0,0,0,0.8)", color: "#ffffff", fontSize: "12px", padding: "4px 8px",
                        borderRadius: "4px", whiteSpace: "nowrap", pointerEvents: "none", zIndex: 50
                    }}>
                        Coming Soon
                    </div>
                )}
            </div>

            {/* Bottom Sub-label */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6B7280", marginTop: "4px" }}>
                <Volume2 size={14} />
                <span>Tap to listen 150 words summary</span>
            </div>

            {/* Text Summary Box */}
            {textSummary && (
                <div style={{ width: "100%", maxWidth: "448px", marginTop: "16px", padding: "20px", borderRadius: "12px", background: "rgba(250, 245, 255, 0.6)", border: "1px solid rgba(243, 232, 255, 0.5)", backdropFilter: "blur(4px)", color: "#374151", fontSize: "14px", lineHeight: 1.6, maxHeight: "240px", overflowY: "auto", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}>
                    <h4 style={{ fontWeight: 600, color: "#581C87", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        <span style={{ fontSize: "16px" }}>📝</span>
                        Quick Summary
                    </h4>
                    <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{textSummary}</p>
                </div>
            )}
        </div>
    );
}
