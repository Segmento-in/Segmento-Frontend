'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { PreferenceKey, NewsletterTheme } from './NewsletterConfig';

interface NewsletterCardProps {
  theme: NewsletterTheme;
  onSelect: (preference: PreferenceKey) => void;
  index: number;
}

export default function NewsletterCard({
  theme,
  onSelect,
  index
}: NewsletterCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const transitionProps = shouldReduceMotion 
    ? { duration: 0 } 
    : { type: 'spring' as const, damping: 25, stiffness: 300 };

  return (
    <motion.div
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.92, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ ...transitionProps, delay: shouldReduceMotion ? 0 : index * 0.1 }}
      whileHover={shouldReduceMotion ? {} : { y: -8, scale: 1.02 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
      onClick={() => onSelect(theme.id)}
      className="cursor-pointer group relative rounded-[28px] p-[2px] overflow-hidden"
    >
      {/* Animated Border Gradient on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-white/40 via-white/10 to-transparent" />
      
      <div
        className={`
          relative h-full rounded-[26px] p-6
          bg-linear-to-br ${theme.cardGradient}
          shadow-[0_20px_40px_rgba(0,0,0,0.15)] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)]
          transition-shadow duration-500
          overflow-hidden
        `}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-[26px] border border-white/20 transition-colors duration-300 group-hover:border-white/40" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Emoji Icon */}
          <div className="text-5xl mb-5 drop-shadow-2xl">
            <motion.div
               animate={shouldReduceMotion ? {} : { y: [0, -5, 0] }}
               transition={shouldReduceMotion ? {} : { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
            >
              {theme.emoji}
            </motion.div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
            {theme.title}
          </h3>

          {/* Frequency */}
          <p className="text-sm font-medium text-white/90 mb-auto leading-relaxed">
            {theme.frequency}
          </p>

          {/* Time */}
          <div className="mt-8 pt-4 border-t border-white/30">
            <div className="flex items-center gap-2 text-white font-medium">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {theme.deliveryTime}
              </span>
            </div>
          </div>
        </div>
        
        {/* Subtle radial glow inside the card on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none" />
      </div>
    </motion.div>
  );
}
