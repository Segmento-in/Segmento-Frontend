'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { NewsletterTheme, PreferenceKey } from './NewsletterConfig';

interface NewsletterCardProps {
  theme: NewsletterTheme;
  index: number;
  onSelect: (preference: PreferenceKey) => void;
}

export default function NewsletterCard({
  theme,
  index,
  onSelect
}: NewsletterCardProps) {
  const Icon = theme.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onClick={() => onSelect(theme.id)}
      className="cursor-pointer"
    >
      <div
        className={`
          relative h-full rounded-3xl p-6
          bg-gradient-to-br ${theme.cardGradient}
          text-white
          shadow-xl hover:shadow-2xl
          transition-all duration-300
          overflow-hidden
        `}
      >
        {/* Soft glass overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/20">
              <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-center">
            {theme.title}
          </h3>

          {/* Frequency */}
          <p className="text-sm text-white/80 text-center mt-1">
            {theme.frequency}
          </p>

          {/* Bottom Time Row */}
          <div className="mt-auto pt-4 flex items-center justify-center gap-2 text-sm text-white/90">
            <Clock className="w-4 h-4" />
            <span>{theme.deliveryTime}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
