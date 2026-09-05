import { MoodRating } from '../types';
import confetti from 'canvas-confetti';

export function getMoodDetails(mood: MoodRating) {
  switch (mood) {
    case 'very_good':
      return {
        label: 'Very Good',
        score: 5,
        emoji: '😄',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        border: 'border-emerald-200 dark:border-emerald-800',
        gradient: 'from-emerald-400 to-teal-500',
      };
    case 'good':
      return {
        label: 'Good',
        score: 4,
        emoji: '🙂',
        color: 'text-teal-600 dark:text-teal-400',
        bg: 'bg-teal-50 dark:bg-teal-950/40',
        border: 'border-teal-200 dark:border-teal-800',
        gradient: 'from-teal-400 to-cyan-500',
      };
    case 'neutral':
      return {
        label: 'Neutral',
        score: 3,
        emoji: '😐',
        color: 'text-sky-600 dark:text-sky-400',
        bg: 'bg-sky-50 dark:bg-sky-950/40',
        border: 'border-sky-200 dark:border-sky-800',
        gradient: 'from-sky-400 to-indigo-500',
      };
    case 'low':
      return {
        label: 'Low',
        score: 2,
        emoji: '😔',
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        border: 'border-amber-200 dark:border-amber-800',
        gradient: 'from-amber-400 to-orange-500',
      };
    case 'very_low':
      return {
        label: 'Very Low',
        score: 1,
        emoji: '😫',
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        border: 'border-rose-200 dark:border-rose-800',
        gradient: 'from-rose-400 to-pink-500',
      };
    default:
      return {
        label: 'Unknown',
        score: 3,
        emoji: '🌱',
        color: 'text-slate-600 dark:text-slate-400',
        bg: 'bg-slate-50 dark:bg-slate-900',
        border: 'border-slate-200 dark:border-slate-800',
        gradient: 'from-slate-400 to-slate-600',
      };
  }
}

export function formatDate(dateString: string | number) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(dateString: string | number) {
  const d = new Date(dateString);
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function triggerCelebration() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#38bdf8', '#5e8c5e', '#a498d9', '#fcd34d'],
  });
}
