import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Eye,
  Archive,
  MessageCircle,
  Play,
  Square,
  Volume2,
  VolumeX,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { AudioService } from '../../services/audioService';

export const ToolkitView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'breathing' | 'grounding' | 'worry_jar' | 'script_builder'>('breathing');

  const [breathingMode, setBreathingMode] = useState<'box' | 'relax'>('box');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold After Exhale'>('Inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef<number | null>(null);

  const [groundingStep, setGroundingStep] = useState(1);
  const [groundingInputs, setGroundingInputs] = useState<Record<number, string[]>>({
    1: ['', '', '', '', ''],
    2: ['', '', '', ''],
    3: ['', '', ''],
    4: ['', ''],
    5: [''],
  });

  const [worryText, setWorryText] = useState('');
  const [worriesInJar, setWorriesInJar] = useState<string[]>([]);
  const [isDissolving, setIsDissolving] = useState(false);

  const [recipient, setRecipient] = useState<'friend' | 'partner' | 'family' | 'counselor' | 'manager'>('friend');
  const [topic, setTopic] = useState<'overwhelmed' | 'stress' | 'need_space' | 'listening'>('overwhelmed');
  const [copiedScript, setCopiedScript] = useState(false);

  useEffect(() => {
    if (!isBreathingActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase('Inhale');
      setPhaseSecondsLeft(4);
      return;
    }

    const boxPhases = [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold After Exhale', duration: 4 },
    ];

    const relaxPhases = [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Exhale', duration: 8 },
    ];

    const phases = breathingMode === 'box' ? boxPhases : relaxPhases;
    let currentPhaseIdx = 0;
    let secondsLeft = phases[0].duration;

    setPhase(phases[0].name as any);
    setPhaseSecondsLeft(secondsLeft);
    if (soundEnabled) AudioService.playChime(528);

    timerRef.current = window.setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        currentPhaseIdx = (currentPhaseIdx + 1) % phases.length;
        if (currentPhaseIdx === 0) {
          setCycleCount(c => c + 1);
        }
        const nextPhase = phases[currentPhaseIdx];
        secondsLeft = nextPhase.duration;
        setPhase(nextPhase.name as any);
        if (soundEnabled) AudioService.playChime(nextPhase.name === 'Inhale' ? 528 : 432);
      }
      setPhaseSecondsLeft(secondsLeft);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isBreathingActive, breathingMode, soundEnabled]);

  const handleAddWorry = () => {
    if (!worryText.trim()) return;
    setIsDissolving(true);
    setTimeout(() => {
      setWorriesInJar(prev => [worryText.trim(), ...prev]);
      setWorryText('');
      setIsDissolving(false);
    }, 1000);
  };

  const getScript = () => {
    if (recipient === 'friend') {
      if (topic === 'overwhelmed') {
        return "Hey! I've been feeling a bit overwhelmed with everything lately. Would you be free for a quick call or coffee sometime this week? No pressure at all, just wanted to connect.";
      }
      if (topic === 'need_space') {
        return "Hey! Having a quiet day to recharge my energy. I'll get back to you soon, appreciate you understanding!";
      }
      return "Hey, I had a tough day and could really use a friendly chat or distraction whenever you're around.";
    }

    if (recipient === 'counselor') {
      return "Hello, I would like to schedule a session to discuss recent patterns of stress and fatigue I've noticed over the past couple of weeks. Looking forward to your available times.";
    }

    if (recipient === 'manager') {
      return "Hi, I'd like to review my current workload priorities during our next 1-on-1 so we can align on key deliverables and manage pacing effectively.";
    }

    if (recipient === 'partner') {
      return "Hey love, I'm feeling a bit emotionally drained today. I'd love a quiet evening together or just some gentle downtime.";
    }

    return "Hi, just reaching out to say hello. Things have been a bit busy, but thinking of you!";
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getScript());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-10 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#436c86] block">
          Self-Regulation
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1B2430] dark:text-white tracking-tight">
          Interactive Coping Toolkit
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Science-backed micro-tools to soothe tension and center your nervous system.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'breathing', label: 'Guided Breathing', icon: Wind },
          { id: 'grounding', label: '5-4-3-2-1 Grounding', icon: Eye },
          { id: 'worry_jar', label: 'Thought Defusion', icon: Archive },
          { id: 'script_builder', label: 'Conversation Script', icon: MessageCircle },
        ].map(tool => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id as any)}
              className={`p-4 rounded-3xl flex flex-col items-center justify-center text-center transition-all ${
                isActive
                  ? 'bg-[#7FA7C4] text-white font-bold shadow-md shadow-[#7FA7C4]/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-[#E9E2D6] dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-5 h-5 mb-1.5" />
              <span className="text-xs font-semibold">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* TOOL 1: Breathing Visualizer */}
      {activeTool === 'breathing' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs flex flex-col items-center text-center space-y-8 animate-in fade-in">
          {/* Mode Switcher */}
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setIsBreathingActive(false);
                setBreathingMode('box');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${breathingMode === 'box' ? 'bg-[#7FA7C4] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
            >
              Box Breathing (4-4-4-4)
            </button>
            <button
              onClick={() => {
                setIsBreathingActive(false);
                setBreathingMode('relax');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${breathingMode === 'relax' ? 'bg-[#7FA7C4] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
            >
              4-7-8 Relaxing Breath
            </button>
          </div>

          {/* Animated Circle */}
          <div className="relative w-72 h-72 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#7FA7C4]/20 to-[#8FAE95]/20 dark:from-teal-900/30 dark:to-sky-900/30 transition-transform duration-1000 ${
                isBreathingActive && (phase === 'Inhale' || phase === 'Hold')
                  ? 'scale-125'
                  : 'scale-90'
              }`}
            />
            <div
              className={`w-48 h-48 rounded-full bg-gradient-to-tr from-[#7FA7C4] to-[#8FAE95] text-white flex flex-col items-center justify-center shadow-xl shadow-[#7FA7C4]/30 transition-all duration-1000 ${
                isBreathingActive && (phase === 'Inhale' || phase === 'Hold')
                  ? 'scale-110'
                  : 'scale-95'
              }`}
            >
              <span className="text-xl font-extrabold tracking-wide uppercase">{phase}</span>
              <span className="text-4xl font-black mt-1">{isBreathingActive ? phaseSecondsLeft : '•'}</span>
            </div>
          </div>

          <div className="space-y-2 max-w-md">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              {breathingMode === 'box'
                ? 'Box breathing steadies your nervous system during high stress by evening out inhale, hold, exhale, and rest.'
                : '4-7-8 breathing activates the vagus nerve and encourages deep physiological relaxation.'}
            </p>
            {isBreathingActive && (
              <p className="text-xs font-semibold text-[#436c86] dark:text-[#7FA7C4]">
                Completed Cycles: {cycleCount}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className={`px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-sm flex items-center space-x-2 transition-all ${
                isBreathingActive
                  ? 'bg-[#C4635A] hover:bg-[#ad4e45]'
                  : 'bg-[#7FA7C4] hover:bg-[#6c97b5]'
              }`}
            >
              {isBreathingActive ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isBreathingActive ? 'Pause Exercise' : 'Start Breathing'}</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3.5 rounded-2xl border text-xs font-semibold transition-colors ${
                soundEnabled
                  ? 'border-[#7FA7C4] bg-[#7FA7C4]/15 text-[#2d4d62]'
                  : 'border-[#E9E2D6] text-slate-400'
              }`}
              title="Mindfulness Bell Chime"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-[#7FA7C4]" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      {/* TOOL 2: Grounding */}
      {activeTool === 'grounding' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-6 animate-in fade-in">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#436c86] block">
              Sensory Anchor • Step {groundingStep} of 5
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {groundingStep === 1 && '👀 Name 5 things you can SEE around you'}
              {groundingStep === 2 && '✋ Name 4 things you can physically TOUCH or FEEL'}
              {groundingStep === 3 && '👂 Name 3 sounds you can HEAR right now'}
              {groundingStep === 4 && '👃 Name 2 things you can SMELL or like the scent of'}
              {groundingStep === 5 && '👅 Name 1 thing you can TASTE or are grateful for'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Anchors your awareness into the physical room and quiets racing thoughts.
            </p>
          </div>

          <div className="space-y-3">
            {groundingInputs[groundingStep].map((val, idx) => (
              <input
                key={idx}
                type="text"
                value={val}
                onChange={e => {
                  const newVals = [...groundingInputs[groundingStep]];
                  newVals[idx] = e.target.value;
                  setGroundingInputs(prev => ({ ...prev, [groundingStep]: newVals }));
                }}
                placeholder={`Item #${idx + 1}...`}
                className="w-full px-4 py-3 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7FA7C4]"
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E9E2D6] dark:border-slate-800">
            <button
              onClick={() => setGroundingStep(s => Math.max(1, s - 1))}
              disabled={groundingStep === 1}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 disabled:opacity-30"
            >
              Previous Step
            </button>
            {groundingStep < 5 ? (
              <button
                onClick={() => setGroundingStep(s => Math.min(5, s + 1))}
                className="px-6 py-2.5 rounded-xl bg-[#7FA7C4] text-white text-xs font-bold hover:bg-[#6c97b5]"
              >
                Next Step ({groundingStep + 1}/5)
              </button>
            ) : (
              <button
                onClick={() => {
                  setGroundingStep(1);
                  setGroundingInputs({ 1: ['', '', '', '', ''], 2: ['', '', '', ''], 3: ['', '', ''], 4: ['', ''], 5: [''] });
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                Completed! Reset Tool
              </button>
            )}
          </div>
        </div>
      )}

      {/* TOOL 3: Worry Jar */}
      {activeTool === 'worry_jar' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Thought Defusion & Worry Jar</h3>
            <p className="text-xs text-slate-500 mt-1">
              Write down a persistent worry, place it into the jar, and give your mind permission to let it rest.
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              rows={3}
              value={worryText}
              onChange={e => setWorryText(e.target.value)}
              placeholder="What worry or repetitive thought is taking up space in your head?"
              className="w-full p-4 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7FA7C4]"
            />
            <button
              onClick={handleAddWorry}
              disabled={!worryText.trim() || isDissolving}
              className="px-6 py-3 rounded-2xl bg-[#7FA7C4] text-white text-xs font-bold hover:bg-[#6c97b5] disabled:opacity-50 flex items-center space-x-2"
            >
              <Archive className="w-4 h-4" />
              <span>{isDissolving ? 'Placing in Jar...' : 'Place in Worry Jar'}</span>
            </button>
          </div>

          {worriesInJar.length > 0 && (
            <div className="pt-4 border-t border-[#E9E2D6] dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Worries resting in jar:</span>
              <div className="space-y-2">
                {worriesInJar.map((w, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 italic flex items-center justify-between"
                  >
                    <span>“{w}”</span>
                    <span className="text-[10px] text-[#436c86] font-semibold uppercase">Resting</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOOL 4: Script Builder */}
      {activeTool === 'script_builder' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Conversation Script Builder</h3>
            <p className="text-xs text-slate-500 mt-1">
              Generate gentle, clear conversation starters for reaching out to real-world support.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Who do you want to talk to?</label>
              <select
                value={recipient}
                onChange={e => setRecipient(e.target.value as any)}
                className="w-full p-3 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              >
                <option value="friend">Close Friend</option>
                <option value="partner">Partner / Spouse</option>
                <option value="family">Family Member</option>
                <option value="counselor">Doctor / Counselor</option>
                <option value="manager">Manager / Colleague</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">What is the core topic?</label>
              <select
                value={topic}
                onChange={e => setTopic(e.target.value as any)}
                className="w-full p-3 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              >
                <option value="overwhelmed">Feeling overwhelmed / need to chat</option>
                <option value="need_space">Taking quiet space / boundary</option>
                <option value="listening">Just need someone to listen</option>
              </select>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#7FA7C4]/15 border border-[#7FA7C4]/30 space-y-4">
            <span className="text-xs font-bold text-[#2d4d62] dark:text-[#a5c9e1]">Suggested Message / Script:</span>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
              "{getScript()}"
            </p>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-xl bg-[#7FA7C4] text-white text-xs font-bold hover:bg-[#6c97b5] flex items-center space-x-1.5"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Script'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
