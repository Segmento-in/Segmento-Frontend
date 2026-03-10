'use client';

import { useState, useRef, useEffect } from 'react';
import { Headphones, Loader2, Pause, Play } from 'lucide-react';
import { cn } from '@/shared/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioPlayerProps {
    articleId: string; // The doc ID (for caching/state)
    articleUrl: string; // The actual article URL (required for backend)
    initialAudioUrl?: string; // If already generated
    title: string;
    image: string;
    category: string;
    className?: string;
}

export default function AudioPlayer({ articleId, articleUrl, initialAudioUrl, title, image, category, className }: AudioPlayerProps) {
    const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [fileUrl, setFileUrl] = useState<string>(''); // For view url param

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();

            // Handle playback ended
            audioRef.current.onended = () => {
                setIsPlaying(false);
            };

            // Handle errors
            audioRef.current.onerror = () => {
                console.error("Audio playback error");
                setIsPlaying(false);
                setIsLoading(false);
            };
        }

        return () => {
            // Cleanup
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePlay = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if inside a Link
        e.stopPropagation();

        if (isLoading) return;

        // If playing, pause
        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        // If audio user/url exists but stopped, play
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

        // Need to generate audio
        setIsLoading(true);
        try {
            const API_BASE = process.env.NEXT_PUBLIC_PULSE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${API_BASE}/api/audio/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    article_url: articleUrl,  // FIXED: Use actual URL instead of ID
                    title: title,
                    image_url: image,
                    category: category
                })
            });

            const data = await response.json();

            if (data.success && data.audio_url) {
                setAudioUrl(data.audio_url);
                if (audioRef.current) {
                    audioRef.current.src = data.audio_url;
                    await audioRef.current.play();
                    setIsPlaying(true);
                }
            } else {
                // Handle both FastAPI error format (detail) and custom format (message)
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
        <button
            onClick={togglePlay}
            className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500",
                isPlaying && "bg-purple-100 text-purple-600 ring-2 ring-purple-500 ring-opacity-50",
                className
            )}
            title={isPlaying ? "Pause Summary" : "Play Audio Summary"}
            aria-label={isPlaying ? "Pause Audio Summary" : "Play Audio Summary"}
        >
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    </motion.div>
                ) : isPlaying ? (
                    <motion.div
                        key="pause"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <Pause className="w-4 h-4 fill-current" />
                        {/* Pulse Ring */}
                        <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-20 animate-ping inset-0"></span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="play"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        {/* Default Icon */}
                        {audioUrl ? <Play className="w-4 h-4 ml-0.5" /> : <Headphones className="w-4 h-4" />}
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}
