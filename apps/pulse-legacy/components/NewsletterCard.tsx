'use client';

import { motion } from 'framer-motion';
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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(theme.id)}
      className="cursor-pointer group"
    >
      <div
        className={`
          relative h-full rounded-[28px] p-6
          bg-linear-to-br ${theme.cardGradient}
          shadow-[0_30px_60px_rgba(0,0,0,0.25)]
          transition-all duration-300
          overflow-hidden
        `}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-[28px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Emoji Icon */}
          <div className="text-5xl mb-4 drop-shadow-xl">
            {theme.emoji}
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-white mb-1">
            {theme.title}
          </h3>

          {/* Frequency */}
          <p className="text-sm text-white/80 mb-auto">
            {theme.frequency}
          </p>

          {/* Time */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 text-white/90">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {theme.deliveryTime}
              </span>
            </div>
          </div>
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 rounded-[28px]" />
      </div>
    </motion.div>
  );
}
