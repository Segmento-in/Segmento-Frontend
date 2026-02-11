'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Headphones, Loader2, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

    const [textSummary, setTextSummary] = useState<string | null>(initialAudioUrl && initialTextSummary ? initialTextSummary : null);

    // If initialAudioUrl is present, set textSummary if provided
    useEffect(() => {
        if (initialAudioUrl && initialTextSummary) {
            setTextSummary(initialTextSummary);
        }
    }, [initialAudioUrl, initialTextSummary]);

    // Check status on mount if data is missing (Automatic Retrieval)
    useEffect(() => {
        if (!initialAudioUrl && !initialTextSummary) {
            const checkStatus = async () => {
                try {
                    const encodedUrl = encodeURIComponent(articleUrl);
                    const encodedCategory = category ? encodeURIComponent(category) : '';
                    const res = await fetch(`${process.env.NEXT_PUBLIC_PULSE_API_URL}/api/audio/status?article_url=${encodedUrl}&category=${encodedCategory}`);
                    const data = await res.json();

                    if (data.success) {
                        if (data.audio_url) setAudioUrl(data.audio_url);
                        if (data.text_summary) setTextSummary(data.text_summary);
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_PULSE_API_URL}/api/audio/generate`, {
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
        <div className={cn("flex flex-col items-center gap-2 py-6", className)}>
            {/* Main Button Container */}
            <div className="relative">
                {/* Rotating Message Bubble - Now Top Right */}
                <div className="absolute -top-14 -right-12 hidden md:block z-20"> {/* Hidden on mobile, top-right position */}
                    <div
                        className={cn(
                            "px-4 py-2 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm transition-all duration-400",
                            isFading ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"
                        )}
                    >
                        <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            {CATCHY_MESSAGES[messageIndex]}
                        </p>
                    </div>
                    {/* Triangular tail pointing down-left to the button */}
                    <div className="absolute left-4 -bottom-1.5 w-3 h-3 bg-gradient-to-br from-pink-50 to-purple-50 border-b border-r border-purple-200 rotate-45 transform" />
                </div>

                {/* Ambient Glow Layer */}
                <div className="absolute inset-0 rounded-2xl blur-xl animate-glow-pulse pointer-events-none"
                    style={{ background: 'var(--gradient-audio)' }} />

                {/* Pulse Ring */}
                {showPulseRing && (
                    <div className="absolute inset-0 rounded-2xl animate-pulse-ring pointer-events-none"
                        style={{ background: 'var(--gradient-audio)' }} />
                )}

                {/* Floating Notes */}
                {floatingNotes.map(note => (
                    <div
                        key={note.id}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-4xl animate-float-note"
                        style={{
                            '--float-x': `${note.x}px`,
                            '--float-y': `${note.y}px`,
                            '--float-rotate': `${note.rotate}deg`,
                            zIndex: 10
                        } as React.CSSProperties}
                    >
                        {note.emoji}
                    </div>
                ))}

                {/* Main Button */}
                <button
                    onClick={handleClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={cn(
                        "relative px-7 py-3.5 rounded-2xl font-semibold text-gray-800 border border-purple-200/50",
                        "transition-all duration-300 ease-out",
                        "hover:scale-105 hover:-translate-y-0.5",
                        "active:scale-100 active:translate-y-0",
                        "focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2",
                        "animate-button-breathe flex items-center gap-3"
                    )}
                    style={{ background: 'var(--gradient-audio)' }}
                    aria-label="Play Audio Summary"
                >
                    {/* Icon */}
                    <div className={cn(isLoading ? "animate-spin" : "animate-gentle-bob")}>
                        {isLoading ? (
                            <Loader2 className="w-5 h-5" />
                        ) : (
                            <Headphones className="w-5 h-5" />
                        )}
                    </div>

                    {/* Text */}
                    <span>{isLoading ? "Generating..." : "Audio Summary"}</span>

                    {/* Equalizer Bars */}
                    {!isLoading && (
                        <div className="flex items-center gap-0.5 h-4">
                            {[0, 1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className="w-[3px] rounded-full bg-purple-500 animate-eq-bar"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </div>
                    )}
                </button>
            </div>

            {/* Bottom Sub-label */}
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-gray-500 mt-1">
                <Volume2 className="w-3.5 h-3.5 animate-gentle-bob" />
                <span>Tap to listen • 5 min summary</span>
            </div>

            {/* Text Summary Box */}
            {textSummary && (
                <div className="w-full max-w-md mt-4 p-5 rounded-xl bg-purple-50/60 border border-purple-100/50 backdrop-blur-sm text-sm text-gray-700 leading-relaxed max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 shadow-sm">
                    <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2 text-xs uppercase tracking-wider">
                        <span className="text-base">📝</span>
                        Quick Summary
                    </h4>
                    <p className="whitespace-pre-wrap">{textSummary}</p>
                </div>
            )}
        </div>
    );
}
