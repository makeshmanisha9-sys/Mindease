import React, { useState } from 'react';
import {
  Activity,
  Zap,
  Moon,
  Plus,
  ArrowRight,
  BookmarkCheck,
  Star,
  Check,
  Sparkles
} from 'lucide-react';
import { MoodRating, MoodEntry, UserSettings } from '../../types';
import { EMOTIONS_LIST, HANDLING_RESPONSES, TRIGGER_OPTIONS, COPING_ACTIVITIES_DIRECTORY } from '../../utils/constants';
import { triggerCelebration } from '../../utils/helpers';
import { AICompanionService } from '../../services/aiCompanionService';

interface CheckInViewProps {
  settings: UserSettings;
  onSaveCheckIn: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
  onNavigateToTab: (tab: string) => void;
}

export const CheckInView: React.FC<CheckInViewProps> = ({
  settings,
  onSaveCheckIn,
  onNavigateToTab,
}) => {
  const [mood, setMood] = useState<MoodRating>('neutral');
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [sleepQuality, setSleepQuality] = useState<number>(3);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(['calm']);
  const [selectedHandling, setSelectedHandling] = useState<string[]>(['break']);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedCoping, setSelectedCoping] = useState<{ id: string; name: string; helpful: boolean; rating: number }[]>([]);
  const [note, setNote] = useState<string>('');
  const [customEmotionInput, setCustomEmotionInput] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);
  const [generatedReflection, setGeneratedReflection] = useState<string>('');

  const moodOptions: { id: MoodRating; label: string; score: number; emoji: string }[] = [
    { id: 'very_low', label: 'Very Low', score: 1, emoji: '😫' },
    { id: 'low', label: 'Low', score: 2, emoji: '😔' },
    { id: 'neutral', label: 'Neutral', score: 3, emoji: '😐' },
    { id: 'good', label: 'Good', score: 4, emoji: '🙂' },
    { id: 'very_good', label: 'Very Good', score: 5, emoji: '😄' },
  ];

  const toggleEmotion = (id: string) => {
    setSelectedEmotions(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleAddCustomEmotion = () => {
    const trimmed = customEmotionInput.trim();
    if (trimmed && !selectedEmotions.includes(trimmed)) {
      setSelectedEmotions(prev => [...prev, trimmed]);
      setCustomEmotionInput('');
    }
  };

  const toggleHandling = (id: string) => {
    setSelectedHandling(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const toggleTrigger = (id: string) => {
    setSelectedTriggers(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const toggleCopingStrategy = (activityId: string, name: string) => {
    setSelectedCoping(prev => {
      const exists = prev.find(c => c.id === activityId);
      if (exists) {
        return prev.filter(c => c.id !== activityId);
      } else {
        return [...prev, { id: activityId, name, helpful: true, rating: 4 }];
      }
    });
  };

  const updateCopingRating = (activityId: string, helpful: boolean, rating: number) => {
    setSelectedCoping(prev =>
      prev.map(c => (c.id === activityId ? { ...c, helpful, rating } : c))
    );
  };

  const handleSubmit = () => {
    const moodScore = moodOptions.find(m => m.id === mood)?.score || 3;
    const reflection = AICompanionService.generateJournalReflection(note, mood, selectedTriggers);
    setGeneratedReflection(reflection);

    onSaveCheckIn({
      date: new Date().toISOString(),
      mood,
      moodScore,
      energyLevel,
      stressLevel,
      sleepQuality,
      emotions: selectedEmotions,
      handlingResponses: selectedHandling,
      triggers: selectedTriggers,
      copingStrategiesTried: selectedCoping.map(c => ({
        strategyId: c.id,
        strategyName: c.name,
        wasHelpful: c.helpful,
        rating: c.rating,
      })),
      note: note.trim() || undefined,
      aiReflection: reflection,
    });

    triggerCelebration();
    setIsSaved(true);
  };

  if (isSaved) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-center animate-in fade-in zoom-in-95 space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-md">
          <BookmarkCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-serif text-[#1B2430] dark:text-white">Check-in Recorded</h2>
          <p className="text-sm text-slate-500">
            Thank you for taking a gentle moment to check in with yourself.
          </p>
        </div>

        {generatedReflection && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-l-4 border-l-[#7FA7C4] border border-[#E9E2D6] dark:border-slate-800 shadow-2xs text-left space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#436c86] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MindEase AI Reflection</span>
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              "{generatedReflection}"
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigateToTab('dashboard')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#7FA7C4] hover:bg-[#6c97b5] text-white font-bold text-sm shadow-xs"
          >
            View Mood Dashboard
          </button>
          <button
            onClick={() => onNavigateToTab('chat')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-[#E9E2D6] dark:border-slate-700"
          >
            Talk to AI Companion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#436c86] block">
          Daily Wellbeing
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1B2430] dark:text-white tracking-tight">
          How are you feeling right now?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Reflect on your mood, physical state, and coping habits without judgment.
        </p>
      </div>

      {/* 1. Primary Mood Selector */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          1. Overall Mood Rating
        </label>
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {moodOptions.map(option => {
            const isSelected = mood === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setMood(option.id)}
                className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-[#7FA7C4] bg-[#7FA7C4]/15 shadow-sm scale-105 font-bold'
                    : 'border-[#E9E2D6] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-1.5">{option.emoji}</span>
                <span className="text-[11px] sm:text-xs text-slate-800 dark:text-slate-200">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. State Sliders */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          2. Physical & Energy State
        </label>

        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <Activity className="w-4 h-4 text-[#C4635A]" />
              <span>Stress Level</span>
            </span>
            <span className="text-slate-900 dark:text-white font-bold">{stressLevel} / 5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={stressLevel}
            onChange={e => setStressLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#C4635A]"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
            <span>Calm</span>
            <span>Moderate</span>
            <span>High Tension</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Energy Level</span>
            </span>
            <span className="text-slate-900 dark:text-white font-bold">{energyLevel} / 5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={energyLevel}
            onChange={e => setEnergyLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
            <span>Exhausted</span>
            <span>Balanced</span>
            <span>High Energy</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <Moon className="w-4 h-4 text-[#7FA7C4]" />
              <span>Sleep Quality</span>
            </span>
            <span className="text-slate-900 dark:text-white font-bold">{sleepQuality} / 5</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={sleepQuality}
            onChange={e => setSleepQuality(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#7FA7C4]"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
            <span>Poor Rest</span>
            <span>Average</span>
            <span>Restorative</span>
          </div>
        </div>
      </div>

      {/* 3. Emotion Tags Selection */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          3. What emotions are you noticing?
        </label>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS_LIST.map(em => {
            const isSelected = selectedEmotions.includes(em.id);
            return (
              <button
                key={em.id}
                onClick={() => toggleEmotion(em.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#7FA7C4] text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{em.emoji}</span>
                <span>{em.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="text"
            value={customEmotionInput}
            onChange={e => setCustomEmotionInput(e.target.value)}
            placeholder="Add custom emotion (e.g. restless, nostalgic)..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7FA7C4]"
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomEmotion())}
          />
          <button
            type="button"
            onClick={handleAddCustomEmotion}
            className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold hover:bg-slate-300"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Behavioral Responses */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            4. What do you usually do when you feel this way?
          </label>
          <p className="text-xs text-slate-500 mt-0.5">
            Select what habits or coping actions you engaged in:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {HANDLING_RESPONSES.map(hr => {
            const isSelected = selectedHandling.includes(hr.id);
            return (
              <div
                key={hr.id}
                onClick={() => toggleHandling(hr.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#7FA7C4] bg-[#7FA7C4]/15 shadow-xs'
                    : 'border-[#E9E2D6] dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{hr.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#436c86] dark:text-[#7FA7C4]" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{hr.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Triggers */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            5. Did anything specific trigger or affect this mood? (Optional)
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRIGGER_OPTIONS.map(tr => {
            const isSelected = selectedTriggers.includes(tr.id);
            return (
              <button
                key={tr.id}
                onClick={() => toggleTrigger(tr.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tr.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Optional Note */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          6. Optional Private Reflection Note
        </label>
        <textarea
          rows={3}
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Anything you'd like to write down privately..."
          className="w-full p-4 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7FA7C4] leading-relaxed"
        />
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl bg-[#7FA7C4] hover:bg-[#6c97b5] text-white font-bold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <span>Complete Check-in</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
