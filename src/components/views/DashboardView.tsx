import React, { useState } from 'react';
import {
  Activity,
  Moon,
  Zap,
  Flame,
  Smile,
  ShieldCheck,
  XCircle,
  Wind,
  Info
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { MoodEntry, UserSettings } from '../../types';
import { AnalyticsEngine } from '../../services/analyticsEngine';
import { StorageService } from '../../services/storageService';
import { formatDate, getMoodDetails } from '../../utils/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

interface DashboardViewProps {
  entries: MoodEntry[];
  settings: UserSettings;
  onNavigateToTab: (tab: string) => void;
  onOpenCrisis: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  entries,
  settings,
  onNavigateToTab,
  onOpenCrisis,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const analytics = AnalyticsEngine.calculateAnalytics(entries);
  const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
  const displayEntries = timeRange === '7d' ? sortedEntries.slice(-7) : sortedEntries.slice(-30);

  const latestEntry = entries.length > 0 ? entries[0] : null;
  const latestMoodDetails = latestEntry ? getMoodDetails(latestEntry.mood) : null;

  const handleDismissInsight = (insightId: string) => {
    StorageService.addDismissedHypothesis(insightId);
    setFeedbackToast('Thank you for correcting this. MindEase won’t assume this pattern.');
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const moodChartData = {
    labels: displayEntries.map(e => formatDate(e.date)),
    datasets: [
      {
        label: 'Mood (1-5)',
        data: displayEntries.map(e => e.moodScore),
        borderColor: '#7FA7C4',
        backgroundColor: 'rgba(127, 167, 196, 0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#7FA7C4',
      },
    ],
  };

  const moodChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: (value: any) => {
            const labels = ['', 'Very Low', 'Low', 'Neutral', 'Good', 'Very Good'];
            return labels[value] || value;
          },
        },
        grid: { color: 'rgba(233, 226, 214, 0.6)' },
      },
      x: {
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `Mood Score: ${context.raw} / 5`,
        },
      },
    },
  };

  const stressSleepChartData = {
    labels: displayEntries.map(e => formatDate(e.date)),
    datasets: [
      {
        label: 'Stress Level',
        data: displayEntries.map(e => e.stressLevel),
        backgroundColor: 'rgba(196, 99, 90, 0.8)',
        borderRadius: 8,
      },
      {
        label: 'Sleep Quality',
        data: displayEntries.map(e => e.sleepQuality),
        backgroundColor: 'rgba(127, 167, 196, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  const stressSleepChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 1,
        max: 5,
        grid: { color: 'rgba(233, 226, 214, 0.6)' },
      },
      x: {
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { boxWidth: 12, font: { size: 12, family: 'Plus Jakarta Sans' } },
      },
    },
  };

  const emotionChartData = {
    labels: analytics.dominantEmotions.slice(0, 5).map(e => e.emotion),
    datasets: [
      {
        data: analytics.dominantEmotions.slice(0, 5).map(e => e.count),
        backgroundColor: ['#7FA7C4', '#8FAE95', '#B2A6D6', '#E9E2D6', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 space-y-8 animate-in fade-in">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1B2430] text-white text-xs sm:text-sm font-medium shadow-xl flex items-center space-x-2 border border-slate-700 animate-in slide-in-from-bottom-5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#436c86]">
            Welcome back, {settings.name}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1B2430] dark:text-white tracking-tight">
            Mood Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Personal observations, trigger patterns, and coping habit analytics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateToTab('checkin')}
            className="px-5 py-2.5 rounded-2xl bg-[#7FA7C4] hover:bg-[#6c97b5] text-white text-xs sm:text-sm font-bold shadow-xs transition-all"
          >
            + New Check-in
          </button>
          <button
            onClick={() => onNavigateToTab('chat')}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold border border-[#E9E2D6] dark:border-slate-700 shadow-2xs transition-all"
          >
            Open AI Chat
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Latest Mood</span>
            <Smile className="w-4 h-4 text-[#7FA7C4]" />
          </div>
          <div className="my-3">
            <div className="flex items-center space-x-2.5">
              <span className="text-3xl">{latestMoodDetails?.emoji || '🌱'}</span>
              <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {latestMoodDetails?.label || 'Not Checked'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Score: {analytics.recentAverageMood} / 5.0 (7-day avg)
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Average Stress</span>
            <Activity className="w-4 h-4 text-[#C4635A]" />
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black text-[#C4635A]">
              {analytics.averageStress} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {analytics.averageStress <= 2.5 ? 'Manageable / Low' : 'Moderate / Elevated'}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Sleep Quality</span>
            <Moon className="w-4 h-4 text-[#8FAE95]" />
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black text-[#8FAE95]">
              {analytics.averageSleep} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {analytics.averageSleep >= 3.5 ? 'Restorative rest' : 'Room for bedtime routine'}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Daily Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-500">
              {analytics.moodStreakDays} {analytics.moodStreakDays === 1 ? 'Day' : 'Days'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {analytics.totalEntries} check-ins recorded
            </p>
          </div>
        </div>
      </div>

      {/* Experimental Feature: Mood Forecast / Wellbeing Outlook */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#7FA7C4]/15 via-[#8FAE95]/15 to-[#B2A6D6]/15 border border-[#E9E2D6] shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7FA7C4] animate-ping"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#436c86]">
              Wellbeing Outlook (Experimental)
            </h3>
          </div>
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
            Experimental wellbeing insight — not a medical prediction
          </span>
        </div>

        <p className="text-base sm:text-lg font-serif text-slate-900 leading-snug">
          {analytics.experimentalForecast.outlook}
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          💡 <strong>Gentle Suggestion:</strong> {analytics.experimentalForecast.suggestion}
        </p>
        <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-2 border-t border-[#E9E2D6]">
          <Info className="w-3.5 h-3.5 text-[#7FA7C4]" />
          <span>Basis: {analytics.experimentalForecast.basis}</span>
        </div>
      </div>

      {/* Trend Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Mood Trajectory</h3>
              <p className="text-xs text-slate-400">Progression across recent check-ins</p>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setTimeRange('7d')}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold ${timeRange === '7d' ? 'bg-[#7FA7C4] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold ${timeRange === '30d' ? 'bg-[#7FA7C4] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
              >
                30 Days
              </button>
            </div>
          </div>
          <div className="h-64 w-full">
            <Line data={moodChartData} options={moodChartOptions} />
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Stress vs Sleep Quality</h3>
            <p className="text-xs text-slate-400">Comparing stress reports against restful sleep</p>
          </div>
          <div className="h-64 w-full">
            <Bar data={stressSleepChartData} options={stressSleepChartOptions} />
          </div>
        </div>
      </div>

      {/* Pattern Insights & Attributions */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#436c86] block">
            AI Pattern Reflections
          </span>
          <h2 className="text-2xl font-serif text-slate-900 dark:text-white mt-0.5">
            Observations from your reported experiences
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analytics.insights.map(insight => (
            <div
              key={insight.id}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-l-4 border-l-[#7FA7C4] border border-[#E9E2D6] dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{insight.title}</h4>
                  <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {insight.confidence} confidence
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {insight.observation}
                </p>
                <div className="p-4 rounded-2xl bg-[#F4F7F6] dark:bg-slate-800 border border-[#E9E2D6] dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200">
                  <span className="font-semibold text-[#436c86]">Hypothesis:</span> {insight.hypothesis}
                </div>
                <p className="text-[11px] text-slate-400">
                  📍 <strong>Attribution:</strong> {insight.basedOn}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E9E2D6] dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onNavigateToTab('toolkit')}
                  className="text-xs font-bold text-[#436c86] hover:underline flex items-center space-x-1.5"
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>Try suggested coping</span>
                </button>
                <button
                  onClick={() => handleDismissInsight(insight.id)}
                  className="text-xs text-slate-400 hover:text-[#C4635A] flex items-center space-x-1 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  <span>That's not the reason</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
