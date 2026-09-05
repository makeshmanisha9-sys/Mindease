import React, { useState } from 'react';
import { Heart, Sparkles, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { ConversationMode, UserSettings } from '../../types';
import { CONVERSATION_MODES } from '../../utils/constants';

interface WelcomeModalProps {
  isOpen: boolean;
  onComplete: (settings: Partial<UserSettings>) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedMode, setSelectedMode] = useState<ConversationMode>('listen');
  const [acceptedConsent, setAcceptedConsent] = useState(false);

  if (!isOpen) return null;

  const handleFinish = () => {
    onComplete({
      name: name.trim() || 'Friend',
      preferredMode: selectedMode,
      hasCompletedOnboarding: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
        {step === 1 && (
          <div className="space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-500 to-sage-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <Heart className="w-7 h-7 fill-white/30" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">Welcome to</span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">MindEase AI</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
                “Understand your mood. Build better coping habits.”
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              MindEase is your calm, supportive emotional companion. It listens without judgment, reflects on your feelings, and helps you notice patterns in what helps you feel better.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                What should MindEase call you?
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name or preferred nickname"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 shadow-sm transition-all"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">How do you usually prefer support?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">You can easily switch conversation modes at any time.</p>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
              {CONVERSATION_MODES.map(mode => (
                <div
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedMode === mode.id
                      ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{mode.label}</span>
                    {selectedMode === mode.id && <Check className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{mode.description}</p>
                </div>
              ))}
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 flex items-center justify-center space-x-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sage-600 dark:text-sage-400">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Our Privacy & Honesty Pledge</h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <p>• <strong>Not a Medical Tool:</strong> MindEase AI is an AI companion for emotional reflection. It does not provide medical diagnoses or replace human therapy.</p>
              <p>• <strong>Anti-Dependency:</strong> MindEase supports your independence and will always encourage real-world human relationships.</p>
              <p>• <strong>Privacy First:</strong> Your mood logs and conversations are kept locally in your browser. We never sell your personal data.</p>
            </div>

            <label className="flex items-start space-x-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={acceptedConsent}
                onChange={e => setAcceptedConsent(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-4 w-4"
              />
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                I understand that MindEase AI is an AI wellbeing tool and agree to the privacy terms.
              </span>
            </label>

            <button
              onClick={handleFinish}
              disabled={!acceptedConsent}
              className={`w-full py-3 rounded-xl font-bold text-sm shadow-sm transition-all ${
                acceptedConsent
                  ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              Get Started with MindEase
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
