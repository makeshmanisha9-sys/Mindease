import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Users,
  Compass,
  Shield,
  Heart,
  MessageSquare
} from 'lucide-react';
import { MoodEntry, UserSettings } from '../../types';
import { AnalyticsEngine } from '../../services/analyticsEngine';
import { HANDLING_RESPONSES } from '../../utils/constants';

interface CopingAnalysisViewProps {
  entries: MoodEntry[];
  settings: UserSettings;
  onNavigateToTab: (tab: string) => void;
}

export const CopingAnalysisView: React.FC<CopingAnalysisViewProps> = ({
  entries,
  settings: _settings,
  onNavigateToTab,
}) => {
  const [activeTab, setActiveTab] = useState<'reflections' | 'patterns' | 'balance'>('reflections');

  const analytics = AnalyticsEngine.calculateAnalytics(entries);
  const totalHandlingCount = analytics.handlingBehaviors.reduce((a, b) => a + b.count, 0) || 1;

  const getBehaviorPercentage = (id: string) => {
    const found = analytics.handlingBehaviors.find(h => h.behavior === id);
    return found ? Math.round((found.count / totalHandlingCount) * 100) : 0;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Brain className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Behavioral Reflection
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1B2430] dark:text-white tracking-tight mt-1">
          “How do I handle my mood?” Analysis
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Understanding your natural coping responses without judgment or clinical labels.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#E9E2D6] dark:border-slate-800 pb-3">
        {[
          { id: 'reflections', label: 'Personal Reflections' },
          { id: 'patterns', label: 'Response Spectrum' },
          { id: 'balance', label: 'Balance Exploration' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-[#7FA7C4] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Reflections */}
      {activeTab === 'reflections' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-l-4 border-l-[#B2A6D6] border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 text-[#5e489f]">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Space vs. Connection Pattern
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              “When you feel overwhelmed, you often prefer to be alone to recharge. You have also reported that talking to a trusted person provided relief on several days. Would you like to explore a healthy balance between taking quiet space and reaching out?”
            </p>
            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => onNavigateToTab('chat')}
                className="px-5 py-2.5 rounded-2xl bg-[#7FA7C4] text-white text-xs font-bold hover:bg-[#6c97b5] flex items-center space-x-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Talk with AI companion about this</span>
              </button>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-l-4 border-l-[#8FAE95] border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 text-[#3e5f44]">
              <Compass className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Movement & Physical Pacing
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              “Taking a 10-minute walk or gentle break was selected across {getBehaviorPercentage('walk') + getBehaviorPercentage('break')}% of your positive mood shifts. Physical changes in scenery consistently support mental resets for you.”
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigateToTab('toolkit')}
                className="px-5 py-2.5 rounded-2xl bg-[#8FAE95] text-white text-xs font-bold hover:bg-[#7d9b83]"
              >
                View Movement Micro-habits
              </button>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-l-4 border-l-amber-500 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex items-center space-x-2 text-amber-600">
              <Shield className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Internalizing Thoughts
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              “On days with higher stress ratings, you reported tendencies to overthink or hold feelings inside. Expressive outlets like brief journaling or box breathing helped dissipate this loop.”
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Breakdown */}
      {activeTab === 'patterns' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Your Coping Behavior Spectrum</h3>
            <p className="text-xs text-slate-400">Relative frequency of behavioral responses in your logs</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HANDLING_RESPONSES.map(hr => {
              const pct = getBehaviorPercentage(hr.id);
              return (
                <div key={hr.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-[#E9E2D6] dark:border-slate-700 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span>{hr.label}</span>
                    <span className="text-[#436c86] dark:text-[#7FA7C4]">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#7FA7C4] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-slate-500">{hr.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Balance */}
      {activeTab === 'balance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#7FA7C4]" />
              <span>When you want to isolate</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Quiet time is essential to recover from sensory overload. If solitude turns into rumination, try sending one low-pressure text to a friend:
            </p>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs italic text-slate-700 dark:text-slate-200">
              “Hey! Need a quiet evening today to recharge, but wanted to say hi.”
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Heart className="w-5 h-5 text-[#C4635A]" />
              <span>When you tend to overthink</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Instead of replaying thoughts, try externalizing them into physical sensations or writing:
            </p>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs italic text-slate-700 dark:text-slate-200">
              Try the 5-4-3-2-1 Grounding tool or place thoughts into the Worry Jar.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
