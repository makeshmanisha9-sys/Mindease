import React, { useState, useEffect } from 'react';
import { UserSettings, MoodEntry, JournalEntry, ChatMessage, TrustedContact } from './types';
import { StorageService } from './services/storageService';
import { AnalyticsEngine } from './services/analyticsEngine';
import { Navbar } from './components/layout/Navbar';
import { CrisisModal } from './components/layout/CrisisModal';
import { WelcomeModal } from './components/layout/WelcomeModal';
import { ExperienceSite } from './components/3d/ExperienceSite';
import { ChatView } from './components/views/ChatView';
import { CheckInView } from './components/views/CheckInView';
import { DashboardView } from './components/views/DashboardView';
import { CopingAnalysisView } from './components/views/CopingAnalysisView';
import { JournalView } from './components/views/JournalView';
import { ToolkitView } from './components/views/ToolkitView';
import { SupportView } from './components/views/SupportView';
import { SettingsView } from './components/views/SettingsView';

export const App: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [is3DExperience, setIs3DExperience] = useState(true);

  // Load initial stored data
  useEffect(() => {
    setMoodEntries(StorageService.getMoodEntries());
    setJournalEntries(StorageService.getJournalEntries());
    setChatMessages(StorageService.getChatMessages());
    setTrustedContacts(StorageService.getTrustedContacts());
  }, []);

  // Update theme & dark mode in document body
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Set theme class
    root.className = root.className
      .replace(/theme-\w+/g, '')
      .trim() + ` theme-${settings.theme}`;
  }, [settings.darkMode, settings.theme]);

  const handleUpdateSettings = (updates: Partial<UserSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleSaveCheckIn = (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    StorageService.addMoodEntry(entry);
    setMoodEntries(StorageService.getMoodEntries());
  };

  const handleAddJournal = (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    StorageService.addJournalEntry(entry);
    setJournalEntries(StorageService.getJournalEntries());
  };

  const handleUpdateJournal = (id: string, updates: Partial<JournalEntry>) => {
    StorageService.updateJournalEntry(id, updates);
    setJournalEntries(StorageService.getJournalEntries());
  };

  const handleDeleteJournal = (id: string) => {
    StorageService.deleteJournalEntry(id);
    setJournalEntries(StorageService.getJournalEntries());
  };

  const handleAddChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    StorageService.addChatMessage(msg);
    setChatMessages(StorageService.getChatMessages());
  };

  const handleClearChat = () => {
    StorageService.clearChatMessages();
    setChatMessages(StorageService.getChatMessages());
  };

  const handleAddContact = (contact: Omit<TrustedContact, 'id'>) => {
    StorageService.addTrustedContact(contact);
    setTrustedContacts(StorageService.getTrustedContacts());
  };

  const handleDeleteContact = (id: string) => {
    StorageService.deleteTrustedContact(id);
    setTrustedContacts(StorageService.getTrustedContacts());
  };

  const handleResetAllData = () => {
    StorageService.wipeAllData();
    window.location.reload();
  };

  const handleLaunchAppTab = (tab: string = 'dashboard') => {
    setActiveTab(tab);
    setIs3DExperience(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const streak = AnalyticsEngine.calculateStreak(moodEntries);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F6] dark:bg-slate-950 text-[#1B2430] dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIs3DExperience(false);
        }}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        streakCount={streak}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
        onToggle3DExperience={() => setIs3DExperience(!is3DExperience)}
        is3DExperience={is3DExperience}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {is3DExperience ? (
          <ExperienceSite
            onLaunchApp={handleLaunchAppTab}
            onOpenCrisis={() => setIsCrisisModalOpen(true)}
          />
        ) : (
          <div className="pb-10 pt-4">
            {activeTab === 'chat' && (
              <ChatView
                settings={settings}
                messages={chatMessages}
                onAddMessage={handleAddChatMessage}
                onClearChat={handleClearChat}
                onNavigateToTab={setActiveTab}
                onOpenCrisis={() => setIsCrisisModalOpen(true)}
                onQuickSaveMood={(mood, note) => {
                  handleSaveCheckIn({
                    date: new Date().toISOString(),
                    mood,
                    moodScore: mood === 'very_good' ? 5 : mood === 'good' ? 4 : mood === 'neutral' ? 3 : mood === 'low' ? 2 : 1,
                    energyLevel: 3,
                    stressLevel: 3,
                    sleepQuality: 3,
                    emotions: [],
                    handlingResponses: [],
                    triggers: [],
                    note,
                  });
                }}
              />
            )}

            {activeTab === 'checkin' && (
              <CheckInView
                settings={settings}
                onSaveCheckIn={handleSaveCheckIn}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'dashboard' && (
              <DashboardView
                entries={moodEntries}
                settings={settings}
                onNavigateToTab={setActiveTab}
                onOpenCrisis={() => setIsCrisisModalOpen(true)}
              />
            )}

            {activeTab === 'coping-analysis' && (
              <CopingAnalysisView
                entries={moodEntries}
                settings={settings}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'journal' && (
              <JournalView
                entries={journalEntries}
                settings={settings}
                onAddEntry={handleAddJournal}
                onUpdateEntry={handleUpdateJournal}
                onDeleteEntry={handleDeleteJournal}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'toolkit' && <ToolkitView />}

            {activeTab === 'support' && (
              <SupportView
                entries={moodEntries}
                settings={settings}
                trustedContacts={trustedContacts}
                onAddContact={handleAddContact}
                onDeleteContact={handleDeleteContact}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onResetAllData={handleResetAllData}
                onClearChat={handleClearChat}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer Disclaimer (When not on 3D site) */}
      {!is3DExperience && (
        <footer className="py-4 px-4 text-center border-t border-[#E9E2D6] dark:border-slate-800 text-[11px] text-slate-500 max-w-5xl mx-auto w-full">
          MindEase AI is a supportive wellbeing companion. It is not a licensed therapist, doctor, or diagnostic system. If you are experiencing a mental health emergency, please call 988 or reach out to professional care.
        </footer>
      )}

      {/* Emergency Crisis Modal */}
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
        trustedContacts={trustedContacts}
        onOpenBreathing={() => {
          setIsCrisisModalOpen(false);
          setIs3DExperience(false);
          setActiveTab('toolkit');
        }}
      />

      {/* First-time Onboarding Modal */}
      <WelcomeModal
        isOpen={!settings.hasCompletedOnboarding}
        onComplete={handleUpdateSettings}
      />
    </div>
  );
};
