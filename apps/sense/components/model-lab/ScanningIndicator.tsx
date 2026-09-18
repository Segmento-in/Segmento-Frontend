import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface ScanningIndicatorProps {
    progressFraction: number;
    formattedTimeRemaining: string;
    isFirstExtension: boolean;
    label?: React.ReactNode;
    sublabel?: React.ReactNode;
    extensionNote?: string;
}

export default function ScanningIndicator({
    progressFraction,
    formattedTimeRemaining,
    isFirstExtension,
    label = 'Processing…',
    sublabel,
    extensionNote = 'Taking a bit longer than usual...'
}: ScanningIndicatorProps) {
    const shouldReduceMotion = useReducedMotion();

    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    // Bound progress between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, progressFraction));
    const strokeDashoffset = circumference - clampedProgress * circumference;

    const ringColor = isFirstExtension ? 'text-amber-400' : 'text-emerald-400';
    const bgColor = isFirstExtension ? 'text-amber-400/20' : 'text-emerald-400/20';

    return (
        <div className="flex flex-col items-center justify-center gap-1.5" data-testid="scanning-indicator">
            <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
                        <circle
                            className={`transition-colors duration-500 ${bgColor}`}
                            strokeWidth="4"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="24"
                            cy="24"
                        />
                        <motion.circle
                            className={`transition-colors duration-500 ${ringColor}`}
                            strokeWidth="4"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="24"
                            cy="24"
                            initial={{ strokeDashoffset: circumference, opacity: 1, rotate: 0 }}
                            animate={{ 
                                strokeDashoffset: isFirstExtension ? circumference * 0.75 : strokeDashoffset,
                                opacity: shouldReduceMotion ? 1 : (isFirstExtension ? [0.4, 1, 0.4] : 1),
                                rotate: isFirstExtension && !shouldReduceMotion ? 360 : 0
                            }}
                            transition={{
                                strokeDashoffset: shouldReduceMotion ? { duration: 0 } : { duration: 1, ease: 'linear' },
                                opacity: shouldReduceMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                                rotate: { duration: 2, repeat: Infinity, ease: 'linear' }
                            }}
                            style={{ strokeDasharray: circumference, transformOrigin: 'center' }}
                            data-testid="scanning-ring"
                            data-state={isFirstExtension ? 'indeterminate' : 'determinate'}
                        />
                    </svg>
                    <span className="font-mono text-xs font-bold z-10 text-white" data-testid="countdown-text">{formattedTimeRemaining}</span>
                </div>
                <div className="flex flex-col">
                    {label && <span className="font-bold text-sm text-white" data-testid="scanning-label">{label}</span>}
                    {sublabel && <span className="text-slate-400 text-xs mt-0.5" data-testid="scanning-sublabel">{sublabel}</span>}
                </div>
            </div>
            
            <AnimatePresence>
                {isFirstExtension && extensionNote && (
                    <motion.div
                        data-testid="scanning-extension-note"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className={isFirstExtension ? 'text-amber-200 text-xs font-normal text-center mt-2' : 'text-emerald-100 text-xs font-normal text-center mt-2'}
                    >
                        {extensionNote}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
