import {
  Coffee,
  Briefcase,
  Moon,
  Calendar,
  FileText,
  LucideIcon,
} from "lucide-react"

export type PreferenceKey =
  | "Morning"
  | "Afternoon"
  | "Evening"
  | "Weekly"
  | "Monthly"

export interface NewsletterTheme {
  id: PreferenceKey
  title: string
  frequency: string
  deliveryTime: string
  scope: string
  icon: LucideIcon
  emoji: string

  /* UI styling */
  cardGradient: string
  buttonGradient: string   // ✅ REQUIRED by NewsletterModal
  textColor: string

  /* Messaging */
  successMessage: string
}

export const NEWSLETTER_THEMES: Record<PreferenceKey, NewsletterTheme> = {
  Morning: {
    id: "Morning",
    title: "Morning Brief",
    frequency: "Daily, Mon–Fri",
    deliveryTime: "7:00 AM IST",
    scope: "Top stories from the last 12 hours",
    icon: Coffee,
    emoji: "☕",
    cardGradient: "from-orange-400 via-orange-500 to-orange-600",
    buttonGradient: "from-orange-500 to-amber-500",
    textColor: "text-white",
    successMessage:
      "☕ You’re all set! Your Morning Brief arrives every weekday at 7:00 AM IST.",
  },

  Afternoon: {
    id: "Afternoon",
    title: "Midday Update",
    frequency: "Daily, Mon–Fri",
    deliveryTime: "2:00 PM IST",
    scope: "Breaking updates from the last 6 hours",
    icon: Briefcase,
    emoji: "💼",
    cardGradient: "from-sky-400 via-blue-500 to-blue-600",
    buttonGradient: "from-sky-500 to-blue-600",
    textColor: "text-white",
    successMessage:
      "💼 Midday Updates will reach you at 2:00 PM IST on weekdays.",
  },

  Evening: {
    id: "Evening",
    title: "Evening Digest",
    frequency: "Daily, Mon–Fri",
    deliveryTime: "7:00 PM IST",
    scope: "Complete daily roundup of key stories",
    icon: Moon,
    emoji: "🌙",
    cardGradient: "from-purple-600 via-indigo-700 to-purple-800",
    buttonGradient: "from-purple-600 to-indigo-700",
    textColor: "text-white",
    successMessage:
      "🌙 Evening Digest will be delivered every weekday at 7:00 PM IST.",
  },

  Weekly: {
    id: "Weekly",
    title: "Weekend Digest",
    frequency: "Weekly",
    deliveryTime: "Sunday, 7:00 AM IST",
    scope: "Best stories from the past 7 days",
    icon: Calendar,
    emoji: "📅",
    cardGradient: "from-teal-500 via-emerald-600 to-teal-700",
    buttonGradient: "from-teal-500 to-emerald-600",
    textColor: "text-white",
    successMessage:
      "📅 You’ll receive the Weekend Digest every Sunday morning.",
  },

  Monthly: {
    id: "Monthly",
    title: "Monthly Intelligence",
    frequency: "Monthly",
    deliveryTime: "1st of every month, 9:00 AM IST",
    scope: "Top insights and trends from the past 30 days",
    icon: FileText,
    emoji: "📊",
    cardGradient: "from-rose-500 via-pink-600 to-rose-700",
    buttonGradient: "from-rose-500 to-pink-600",
    textColor: "text-white",
    successMessage:
      "📊 Monthly Intelligence arrives on the 1st at 9:00 AM IST.",
  },
}

export const ALL_PREFERENCES: PreferenceKey[] = [
  "Morning",
  "Afternoon",
  "Evening",
  "Weekly",
  "Monthly",
]

export const getTheme = (key: PreferenceKey): NewsletterTheme =>
  NEWSLETTER_THEMES[key]
