import React from 'react';

export const HeartbeatLogo: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => {
    return (
        <svg
            viewBox="0 0 100 40"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Animated ECG heartbeat line */}
            <path
                d="M 0 20 L 15 20 L 18 10 L 22 30 L 26 15 L 30 20 L 45 20 L 48 10 L 52 30 L 56 15 L 60 20 L 75 20 L 78 10 L 82 30 L 86 15 L 90 20 L 100 20"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <animate
                    attributeName="stroke-dasharray"
                    from="0,200"
                    to="200,0"
                    dur="2s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="opacity"
                    values="0.6;1;0.6"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
    );
};

export const PulseLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-7 h-7',
        lg: 'w-10 h-10'
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            {/* Pulsing background */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg opacity-20 animate-pulse"></div>

            {/* Heartbeat icon */}
            <div className={`relative ${sizes[size]} text-blue-600`}>
                <HeartbeatLogo className="w-full h-full" />
            </div>
        </div>
    );
};
