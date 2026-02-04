// Newsletter Theme Configuration – Segmento Pulse UI
// Matches the provided glassmorphism bento-card design

import {
  Coffee,
  Briefcase,
  Moon,
  Calendar,
  FileText
} from 'lucide-react';

export type PreferenceKey =
  | 'Morning'
  | 'Afternoon'
  | 'Evening'
  | 'Weekly'
  | 'Monthly';

export interface NewsletterTheme {
  id: PreferenceKey;
  title: string;
  frequency: string;
  deliveryTime: string;
  icon: typeof Coffee;
  emoji: string;
  cardGradient: string;
}

export const NEWSLETTER_THEMES: Record<PreferenceKey, NewsletterTheme> = {
  Morning: {
    id: 'Morning',
    title: 'Morning Brief',
    frequency: 'Daily, Mon–Fri',
    deliveryTime: '7:00 AM IST',
    icon: Coffee,
    emoji: '☕',
    cardGradient: 'from-orange-300 to-orange-400'
  },

  Afternoon: {
    id: 'Afternoon',
    title: 'Midday Update',
    frequency: 'Daily, Mon–Fri',
    deliveryTime: '2:00 PM IST',
    icon: Briefcase,
    emoji: '💼',
    cardGradient: 'from-sky-300 to-blue-400'
  },

  Evening: {
    id: 'Evening',
    title: 'Evening Digest',
    frequency: 'Daily, Mon–Fri',
    deliveryTime: '7:00 PM IST',
    icon: Moon,
    emoji: '🌙',
    cardGradient: 'from-indigo-500 to-purple-600'
  },

  Weekly: {
    id: 'Weekly',
    title: 'Weekend Digest',
    frequency: 'Weekly',
    deliveryTime: 'Sunday, 9:00 AM IST',
    icon: Calendar,
    emoji: '📅',
    cardGradient: 'from-teal-400 to-emerald-500'
  },

  Monthly: {
    id: 'Monthly',
    title: 'Monthly Intelligence',
    frequency: 'Monthly',
    deliveryTime: '1st of every month, 9:00 AM IST',
    icon: FileText,
    emoji: '📊',
    cardGradient: 'from-rose-500 to-red-500'
  }
};

export const ALL_PREFERENCES: PreferenceKey[] = [
  'Morning',
  'Afternoon',
  'Evening',
  'Weekly',
  'Monthly'
];
