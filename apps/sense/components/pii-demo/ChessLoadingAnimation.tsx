'use client';

import React from 'react';

interface ChessLoadingAnimationProps {
    message?: string;
}

export const ChessLoadingAnimation: React.FC<ChessLoadingAnimationProps> = ({
    message = "Analyzing your data..."
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative flex flex-col items-center">
                {/* Chess Knight Animation */}
                <div className="relative w-32 h-32 mb-8">
                    {/* Circular border rotating */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#B3945B] border-r-[#3E94560] animate-spin"></div>

                    {/* Center chess piece */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="chess-knight">
                            <svg
                                viewBox="0 0 45 45"
                                className="w-16 h-16 animate-pulse"
                                fill="#B3945B"
                            >
                                <g fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                                    <path
                                        d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18"
                                        fill="#B3945B"
                                        stroke="#3E2F5B"
                                    />
                                    <path
                                        d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10"
                                        fill="#B3945B"
                                        stroke="#3E2F5B"
                                    />
                                    <path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" fill="#1A1A1A" />
                                    <path d="M 15 15.5 A 0.5 1.5 0 1 1 14,15.5 A 0.5 1.5 0 1 1 15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" fill="#1A1A1A" />
                                </g>
                            </svg>
                        </div>
                    </div>

                    {/* Orbiting dots */}
                    <div className="absolute inset-0 animate-spin-slow">
                        <div className="absolute top-0 left-1/2 w-2 h-2 bg-[#3E94560] rounded-full -ml-1"></div>
                        <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-[#3F5E96] rounded-full -ml-1"></div>
                        <div className="absolute left-0 top-1/2 w-2 h-2 bg-[#B3945B] rounded-full -mt-1"></div>
                        <div className="absolute right-0 top-1/2 w-2 h-2 bg-[#3E2F5B] rounded-full -mt-1"></div>
                    </div>
                </div>

                {/* Loading text */}
                <div className="text-center">
                    <h3 className="text-2xl font-semibold text-white mb-2">{message}</h3>
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-[#B3945B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-[#3E94560] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-[#3F5E96] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <p className="text-sm text-gray-300 mt-4">Processing with AI models</p>
                </div>

                {/* Progress bar */}
                <div className="mt-6 w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#3E2F5B] via-[#B3945B] to-[#3E94560] animate-progress"></div>
                </div>
            </div>

            <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }

        .chess-knight {
          filter: drop-shadow(0 0 10px rgba(179, 148, 91, 0.5));
        }
      `}</style>
        </div>
    );
};
