import React, { useState } from 'react';
import {
  Heart,
  MessageCircleHeart,
  CalendarCheck,
  LayoutDashboard,
  Brain,
  BookOpen,
  Sparkles,
  LifeBuoy,
  Settings,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Flame,
  Menu,
  X,
  ShieldAlert,
  Globe
} from 'lucide-react';
import { UserSettings } from '../../types';
import { AudioService } from '../../services/audioService';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  streakCount: number;
  onOpenCrisis: () => void;
  onToggle3DExperience: () => void;
  is3DExperience: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onUpdateSettings,
  streakCount,
  onOpenCrisis,
  onToggle3DExperience,
  is3DExperience,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSoundMenuOpen, setIsSoundMenuOpen] = useState(false);
  const [currentSound, setCurrentSound] = useState(AudioService.getCurrentSound());
  const [soundVolume, setSoundVolume] = useState(settings.ambientSoundVolume);

  const navItems = [
    { id: 'chat', label: 'Companion', icon: MessageCircleHeart },
    { id: 'checkin', label: 'Check-in', icon: CalendarCheck },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'coping-analysis', label: 'Patterns', icon: Brain },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'toolkit', label: 'Toolkit', icon: Sparkles },
    { id: 'support', label: 'Support', icon: LifeBuoy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const toggleSound = (type: 'rain' | 'ocean' | 'stream' | 'forest') => {
    if (currentSound === type) {
      AudioService.stopAmbient();
      setCurrentSound('none');
    } else {
      AudioService.playAmbient(type);
      setCurrentSound(type);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSoundVolume(val);
    AudioService.setVolume(val);
    onUpdateSettings({ ambientSoundVolume: val });
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F4F7F6]/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-[#E9E2D6] dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none shrink-0"
            onClick={() => handleTabClick('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-[#7FA7C4] flex items-center justify-center text-white shadow-xs">
              <Heart className="w-5 h-5 fill-white/25" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-bold text-lg tracking-tight text-[#1B2430] dark:text-white leading-none">
                MindEase
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#8FAE95]/20 text-[#3e5f44] dark:bg-sage-900/60 dark:text-sage-300">
                AI
              </span>
            </div>
          </div>

          {/* CENTER: Main Navigation Links */}
          <nav className="hidden xl:flex items-center justify-center space-x-1 mx-4">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !is3DExperience;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#7FA7C4] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Actions & Toolbar Controls */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-2.5 shrink-0">
            {/* 3D Story / App Toggle */}
            <button
              onClick={onToggle3DExperience}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                is3DExperience
                  ? 'bg-[#1B2430] text-white border-[#1B2430] shadow-xs'
                  : 'bg-white/80 hover:bg-white text-slate-700 border-[#E9E2D6] dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
              }`}
              title="Toggle 3D Living Mood Orb Experience"
            >
              <Globe className="w-3.5 h-3.5 text-[#7FA7C4]" />
              <span className="hidden sm:inline">{is3DExperience ? 'In 3D Story' : '3D Story'}</span>
            </button>

            {/* Streak Counter */}
            <div
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/60 cursor-pointer"
              title="Daily Mood Check-in Streak"
              onClick={() => handleTabClick('checkin')}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{streakCount} {streakCount === 1 ? 'd' : 'd'}</span>
            </div>

            {/* Ambient Soundscapes Menu */}
            <div className="relative">
              <button
                onClick={() => setIsSoundMenuOpen(!isSoundMenuOpen)}
                className={`p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors ${
                  currentSound !== 'none' ? 'text-[#7FA7C4] bg-[#7FA7C4]/15' : ''
                }`}
                title="Ambient Nature Soundscapes"
              >
                {currentSound !== 'none' ? (
                  <Volume2 className="w-4 h-4 text-[#7FA7C4] animate-pulse" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              {/* Sound Flyout */}
              {isSoundMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 p-3.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Calming Soundscapes</span>
                    {currentSound !== 'none' && (
                      <button
                        onClick={() => {
                          AudioService.stopAmbient();
                          setCurrentSound('none');
                        }}
                        className="text-[11px] text-rose-500 hover:underline font-semibold"
                      >
                        Stop
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    {[
                      { id: 'rain', label: '🌧️ Soft Rain' },
                      { id: 'ocean', label: '🌊 Ocean' },
                      { id: 'stream', label: '💧 Stream' },
                      { id: 'forest', label: '🌿 Forest' },
                    ].map(snd => (
                      <button
                        key={snd.id}
                        onClick={() => toggleSound(snd.id as any)}
                        className={`text-xs px-2.5 py-2 rounded-xl text-left font-medium transition-all ${
                          currentSound === snd.id
                            ? 'bg-[#7FA7C4] text-white font-bold shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {snd.label}
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>Volume</span>
                      <span>{Math.round(soundVolume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={soundVolume}
                      onChange={handleVolumeChange}
                      className="w-full accent-[#7FA7C4] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title={settings.darkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
            >
              {settings.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Emergency Crisis SOS Button */}
            <button
              onClick={onOpenCrisis}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#C4635A] hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-[#C4635A]/30 text-xs font-bold transition-colors"
              title="Immediate Crisis Hotlines (988, Text HOME, etc.)"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#C4635A]" />
              <span className="hidden sm:inline">Crisis SOS</span>
            </button>

            {/* Mobile / Tablet Menu Button (screens < xl) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="xl:hidden px-4 pt-2 pb-4 space-y-1.5 bg-white dark:bg-slate-900 border-b border-[#E9E2D6] dark:border-slate-800 shadow-xl animate-in slide-in-from-top-2">
          <button
            onClick={() => {
              onToggle3DExperience();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#7FA7C4]/20 text-[#1B2430] mb-2"
          >
            <Globe className="w-4 h-4 text-[#7FA7C4]" />
            <span>{is3DExperience ? 'Switch to Full Web App' : 'Explore 3D Story'}</span>
          </button>
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !is3DExperience;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#7FA7C4] text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
