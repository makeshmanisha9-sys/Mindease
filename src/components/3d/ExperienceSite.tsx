import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  ArrowRight,
  Sparkles,
  Shield,
  LifeBuoy,
  Phone,
  MessageSquare,
  Volume2,
  VolumeX,
  Wind,
  Check,
  XCircle,
  Eye,
  ExternalLink,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { MoodOrbCanvas } from './MoodOrbCanvas';
import { AudioService } from '../../services/audioService';

interface ExperienceSiteProps {
  onLaunchApp: (initialTab?: string) => void;
  onOpenCrisis: () => void;
}

export const ExperienceSite: React.FC<ExperienceSiteProps> = ({
  onLaunchApp,
  onOpenCrisis,
}) => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [soundActive, setSoundActive] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'listen' | 'understand' | 'suggest'>('listen');
  const [sampleMood, setSampleMood] = useState<number>(3);
  const [dismissedHypothesis, setDismissedHypothesis] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');

  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking for 3D state transforms
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, window.scrollY / (totalHeight || 1)));
      setScrollProgress(progress);

      const sections = ['hero', 'problem', 'companion', 'checkin', 'dashboard', 'toolkit', 'privacy', 'crisis', 'cta'];
      const scrollPos = window.scrollY + window.innerHeight * 0.35;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Breathing loop for toolkit section
  useEffect(() => {
    const phases: ('Inhale' | 'Hold' | 'Exhale' | 'Rest')[] = ['Inhale', 'Hold', 'Exhale', 'Rest'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length;
      setBreathingPhase(phases[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleSoundscape = () => {
    if (soundActive) {
      AudioService.stopAmbient();
      setSoundActive(false);
    } else {
      AudioService.playAmbient('ocean');
      setSoundActive(true);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#F4F7F6] text-[#1B2430] font-sans selection:bg-[#7FA7C4]/25 selection:text-[#1B2430]">
      {/* 3D Living Mood Orb Canvas (Pinned in Background) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <MoodOrbCanvas
          scrollProgress={scrollProgress}
          activeSection={activeSection}
          isCrisisActive={activeSection === 'crisis'}
        />
      </div>

      {/* Narrative Scroll Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* SECTION 1: HERO */}
        <section id="hero" className="min-h-screen flex flex-col justify-center py-24 lg:py-36">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-[#E9E2D6] text-xs font-semibold text-[#436c86] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#7FA7C4] animate-pulse"></span>
              <span>An emotional wellbeing companion</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#1B2430] leading-[1.08] tracking-tight">
              Understand your mood. <br />
              <span className="text-[#436c86]">Build better coping habits.</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed font-normal max-w-xl">
              A calm, supportive space to express how you feel, understand your emotional patterns, and discover gentle actions that truly help.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => onLaunchApp('checkin')}
                className="px-7 py-4 rounded-2xl bg-[#7FA7C4] hover:bg-[#6c97b5] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center space-x-2.5"
              >
                <span>Start checking in</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('companion')}
                className="px-6 py-4 rounded-2xl bg-white/80 hover:bg-white text-slate-700 font-semibold text-xs sm:text-sm border border-[#E9E2D6] transition-all shadow-2xs"
              >
                Explore how it works
              </button>
            </div>

            <div className="pt-4 border-t border-[#E9E2D6]/80 text-xs text-slate-500 max-w-md">
              • MindEase is an AI companion — not a therapist or medical diagnostic tool.
            </div>
          </div>

          <div className="pt-16 text-slate-400 flex items-center space-x-2 text-xs">
            <ChevronDown className="w-4 h-4 animate-bounce text-[#7FA7C4]" />
            <span>Scroll down to experience the journey</span>
          </div>
        </section>

        {/* SECTION 2: THE PROBLEM */}
        <section id="problem" className="min-h-[85vh] flex flex-col justify-center py-32 lg:py-44 border-t border-[#E9E2D6]">
          <div className="max-w-2xl space-y-6">
            <span className="text-xs font-bold text-[#8FAE95] uppercase tracking-widest block">
              The Problem
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif text-[#1B2430] leading-[1.18] tracking-tight">
              Most mood trackers ask for a number. But emotions are rarely that simple.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              When stress builds up, it’s hard to know what triggered it, how you usually react, or whether the coping habits you try actually make a difference.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              MindEase bridges that gap by combining conversational support, daily check-ins, pattern analysis, and personalized coping guidance.
            </p>
          </div>
        </section>

        {/* SECTION 3: AI EMOTIONAL COMPANION */}
        <section id="companion" className="min-h-screen flex flex-col justify-center py-32 lg:py-44 border-t border-[#E9E2D6]">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#7FA7C4] uppercase tracking-widest block">
                Conversational Companion
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-[#1B2430] leading-[1.18] tracking-tight">
                An AI companion that listens before giving advice.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Choose how you want to engage in each moment. The companion adapts its tone to support your emotional space without lecturing or making assumptions.
              </p>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { id: 'listen', label: 'Listen to me' },
                { id: 'understand', label: 'Help me understand' },
                { id: 'suggest', label: 'Suggest something' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setChatMode(m.id as any)}
                  className={`text-xs px-4 py-2 rounded-xl font-semibold transition-all ${
                    chatMode === m.id
                      ? 'bg-[#7FA7C4] text-white shadow-xs'
                      : 'bg-white/80 text-slate-600 border border-[#E9E2D6] hover:bg-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Sample Chat Bubble Showcase */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/95 border border-[#E9E2D6] shadow-sm space-y-4">
              <div className="flex justify-end">
                <div className="p-4 rounded-2xl rounded-br-xs bg-[#7FA7C4] text-white text-xs sm:text-sm max-w-[85%] leading-relaxed shadow-2xs font-medium">
                  “I feel overwhelmed with everything today. I don't know why.”
                </div>
              </div>

              <div className="flex justify-start">
                <div className="p-5 rounded-2xl rounded-bl-xs bg-[#F4F7F6] border border-[#E9E2D6] text-slate-800 text-xs sm:text-sm max-w-[92%] leading-relaxed space-y-3">
                  {chatMode === 'listen' && (
                    <p>
                      “I'm sorry today feels heavy. You don't have to carry everything at once. Would you like to tell me what happened, or would you prefer a quiet space to write?”
                    </p>
                  )}
                  {chatMode === 'understand' && (
                    <p>
                      “When things pile up, it can feel like a heavy fog. Do you notice the overwhelm feeling more physical, like tightness, or is your mind racing with thoughts?”
                    </p>
                  )}
                  {chatMode === 'suggest' && (
                    <p>
                      “Here are two gentle options: a 2-minute Box Breathing pause to steady your breathing, or writing one thought in the Worry Jar. Would you like to try one?”
                    </p>
                  )}

                  <div className="flex items-center space-x-2 pt-2 border-t border-[#E9E2D6] text-[11px] text-[#436c86] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>MindEase companion is present and listening</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => onLaunchApp('chat')}
                className="px-6 py-3.5 rounded-2xl bg-[#1B2430] hover:bg-[#2d3a4d] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center space-x-2"
              >
                <span>Try Companion Chat in Web App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 4: DAILY CHECK-IN */}
        <section id="checkin" className="min-h-screen flex flex-col justify-center py-32 lg:py-44 border-t border-[#E9E2D6]">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#8FAE95] uppercase tracking-widest block">
                Daily Check-in
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-[#1B2430] leading-[1.18] tracking-tight">
                Notice how you feel and how you respond.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Instead of simply asking "How are you feeling?", MindEase asks: <br />
                <span className="font-semibold text-slate-800">“What do you usually do when you feel this way?”</span>
              </p>
            </div>

            {/* Interactive Scale */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/95 border border-[#E9E2D6] shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Interactive Mood Scale
                </span>
                <span className="text-xs font-semibold text-[#7FA7C4]">Tap to test</span>
              </div>

              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[
                  { score: 1, label: 'Very Low', emoji: '😫' },
                  { score: 2, label: 'Low', emoji: '😔' },
                  { score: 3, label: 'Neutral', emoji: '😐' },
                  { score: 4, label: 'Good', emoji: '🙂' },
                  { score: 5, label: 'Very Good', emoji: '😄' },
                ].map(item => (
                  <button
                    key={item.score}
                    onClick={() => setSampleMood(item.score)}
                    className={`p-3 sm:p-4 rounded-2xl border text-center transition-all ${
                      sampleMood === item.score
                        ? 'border-[#7FA7C4] bg-[#7FA7C4]/15 shadow-sm scale-105 font-bold'
                        : 'border-[#E9E2D6] bg-slate-50/60 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl block">{item.emoji}</span>
                    <span className="text-[10px] sm:text-xs text-slate-700 mt-1.5 block font-medium">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E9E2D6] space-y-2">
                <span className="text-xs font-semibold text-slate-500 block">Behavioral response tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Take a break', 'Listen to music', 'Exercise / walk', 'Talk to someone', 'Take quiet space', 'Journal'].map((t, idx) => (
                    <span key={idx} className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => onLaunchApp('checkin')}
                className="px-6 py-3.5 rounded-2xl bg-[#8FAE95] hover:bg-[#7d9b83] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center space-x-2"
              >
                <span>Record Today's Check-in in App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 5: MOOD INTELLIGENCE DASHBOARD */}
        <section id="dashboard" className="min-h-screen flex flex-col justify-center py-32 lg:py-44 border-t border-[#E9E2D6]">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#B2A6D6] uppercase tracking-widest block">
                Pattern Intelligence
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-[#1B2430] leading-[1.18] tracking-tight">
                Observations, not medical diagnoses.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                As you scroll, the living 3D orb fragments into a constellation of mood data points. Every insight explains where it came from and gives you full power to correct any misunderstanding.
              </p>
            </div>

            {/* Pattern Card Showcase */}
            {!dismissedHypothesis ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-white/95 border-l-4 border-l-[#B2A6D6] border border-[#E9E2D6] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Sleep Quality & Stress Correlation</span>
                  <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-[#B2A6D6]/25 text-[#5e489f]">
                    Pattern Hypothesis
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  “On several recent days with lower sleep ratings (&lt;= 2/5), you also reported elevated stress. Restful sleep appears to be a protective factor for your daily stress tolerance.”
                </p>
                <div className="text-[11px] text-slate-400">
                  📍 <strong>Attribution:</strong> Based on correlations in your own self-reported check-ins.
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Is this observation accurate?</span>
                  <button
                    onClick={() => setDismissedHypothesis(true)}
                    className="text-xs text-slate-400 hover:text-[#C4635A] flex items-center space-x-1.5 transition-colors font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>That's not the reason</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-700 italic space-y-1">
                <p className="font-bold not-italic text-emerald-700">✓ Feedback remembered</p>
                <p>“Thank you for correcting me. MindEase won't assume that pattern in future reflections.”</p>
              </div>
            )}

            <div>
              <button
                onClick={() => onLaunchApp('dashboard')}
                className="px-6 py-3.5 rounded-2xl bg-[#1B2430] hover:bg-[#2d3a4d] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center space-x-2"
              >
                <span>View Full Mood Dashboard in App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 6: COPING TOOLKIT */}
        <section id="toolkit" className="min-h-screen flex flex-col justify-center py-32 lg:py-44 border-t border-[#E9E2D6]">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#7FA7C4] uppercase tracking-widest block">
                Coping Toolkit
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-[#1B2430] leading-[1.18] tracking-tight">
                Micro-actions to regulate your nervous system.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                When overwhelmed, the 3D orb breathes with you in real time. Practice science-backed self-regulation exercises whenever you need to center yourself.
              </p>
            </div>

            {/* Live Breathing Rhythm Card */}
            <div className="p-8 rounded-3xl bg-white/95 border border-[#E9E2D6] shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-bold text-[#7FA7C4]">Box Breathing Pace</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{breathingPhase}</div>
                <p className="text-xs text-slate-500">4s Inhale • 4s Hold • 4s Exhale • 4s Rest</p>
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7FA7C4]/20 flex items-center justify-center text-[#436c86]">
                <Wind className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
              </div>
            </div>

            <div>
              <button
                onClick={() => onLaunchApp('toolkit')}
                className="px-6 py-3.5 rounded-2xl bg-[#7FA7C4] hover:bg-[#6c97b5] text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center space-x-2"
              >
                <span>Open Full Coping Toolkit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 7: PRIVACY & SAFETY */}
        <section id="privacy" className="min-h-[85vh] flex flex-col justify-center py-32 lg:py-44 border-t border-[#E9E2D6]">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#8FAE95] uppercase tracking-widest block">
                Privacy & Boundaries
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-[#1B2430] leading-[1.18] tracking-tight">
                Your conversations stay private. Your independence is protected.
              </h2>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white/95 border border-[#E9E2D6] shadow-sm space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>• <strong>Local-First Storage:</strong> Your mood check-ins, journal entries, and conversations stay securely in your browser.</p>
              <p>• <strong>Zero Data Selling:</strong> We never monetize, share, or sell sensitive emotional data.</p>
              <p>• <strong>Anti-Dependency:</strong> MindEase supports your real-world relationships and will never encourage emotional isolation.</p>
            </div>

            <div>
              <button
                onClick={() => onLaunchApp('settings')}
                className="px-6 py-3.5 rounded-2xl bg-white border border-[#E9E2D6] text-slate-800 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-all"
              >
                Review Data Controls & Settings
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 8: CRISIS SUPPORT (RESPECTFUL STILLNESS) */}
        <section id="crisis" className="min-h-[85vh] flex flex-col justify-center py-32 lg:py-44 border-t border-[#E9E2D6]">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#C4635A] uppercase tracking-widest block">
                Safety & Crisis Care
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-[#1B2430] leading-[1.18] tracking-tight">
                When you need human help, we step aside.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                AI should never manage a crisis alone. If you are in severe emotional distress or feel unsafe, confidential human support is available 24/7.
              </p>
            </div>

            {/* Crisis Callout Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#C4635A]/40 shadow-sm space-y-5">
              <div className="flex items-center space-x-2.5 text-[#C4635A]">
                <LifeBuoy className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">24/7 Crisis Helplines</h3>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-900 block">988 Suicide & Crisis Lifeline</span>
                    <span className="text-slate-500 text-xs">US & Canada • Free 24/7 call or text</span>
                  </div>
                  <a
                    href="tel:988"
                    className="px-4 py-2 rounded-xl bg-[#C4635A] text-white font-bold text-xs hover:bg-[#ad4e45]"
                  >
                    Call 988
                  </a>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-900 block">Crisis Text Line</span>
                    <span className="text-slate-500 text-xs">Text HOME to 741741</span>
                  </div>
                  <a
                    href="sms:741741&body=HOME"
                    className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900"
                  >
                    Text HOME
                  </a>
                </div>
              </div>

              <button
                onClick={onOpenCrisis}
                className="w-full py-3 rounded-xl bg-[#C4635A]/10 text-[#C4635A] text-xs font-bold hover:bg-[#C4635A]/20 transition-all text-center"
              >
                View International Hotlines & Trusted Contacts
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 9: FOOTER / GET STARTED */}
        <section id="cta" className="min-h-[70vh] flex flex-col justify-center py-28 lg:py-36 border-t border-[#E9E2D6]">
          <div className="max-w-2xl space-y-8">
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1B2430] leading-tight tracking-tight">
              Begin noticing your emotional patterns today.
            </h2>
            <p className="text-base text-slate-600 leading-relaxed max-w-lg">
              No account required. All data is saved privately on your device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => onLaunchApp('checkin')}
                className="px-8 py-4 rounded-2xl bg-[#7FA7C4] hover:bg-[#6c97b5] text-white font-bold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Start checking in</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onLaunchApp('dashboard')}
                className="px-8 py-4 rounded-2xl bg-[#1B2430] hover:bg-[#2d3a4d] text-white font-bold text-base shadow-sm transition-all"
              >
                Open Full Web App
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-[#E9E2D6] text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[#1B2430]">MindEase AI</span> — “Understand your mood. Build better coping habits.”
          </div>
          <div className="text-[11px]">
            Supportive AI companion • Not a therapist or doctor • Local-first privacy
          </div>
        </footer>
      </div>
    </div>
  );
};
