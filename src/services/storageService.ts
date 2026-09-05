import { MoodEntry, JournalEntry, ChatMessage, UserSettings, TrustedContact, PatternInsight } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'mindease_settings',
  MOOD_ENTRIES: 'mindease_mood_entries',
  JOURNAL_ENTRIES: 'mindease_journal_entries',
  CHAT_MESSAGES: 'mindease_chat_messages',
  TRUSTED_CONTACTS: 'mindease_trusted_contacts',
  PATTERN_INSIGHTS: 'mindease_pattern_insights',
  DISMISSED_HYPOTHESES: 'mindease_dismissed_hypotheses',
};

export const DEFAULT_SETTINGS: UserSettings = {
  name: 'Friend',
  theme: 'sage',
  darkMode: false,
  preferredMode: 'listen',
  aiAnalysisEnabled: true,
  aiCopingSuggestionsEnabled: true,
  ambientSoundVolume: 0.35,
  soundEnabled: true,
  hasCompletedOnboarding: false,
  apiProvider: 'local',
};

// Seed initial realistic data for an engaging first experience
const generateSeedMoodEntries = (): MoodEntry[] => {
  const entries: MoodEntry[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const mockDays = [
    { daysAgo: 13, mood: 'good' as const, score: 4, energy: 4, stress: 2, sleep: 4, emotions: ['calm', 'hopeful'], handling: ['walk', 'music'], triggers: ['academic'], coping: [{ strategyId: 'short_walk', strategyName: 'Gentle 10-Minute Walk', wasHelpful: true, rating: 5 }], note: 'Finished assignments early and enjoyed an evening walk.' },
    { daysAgo: 12, mood: 'neutral' as const, score: 3, energy: 3, stress: 3, sleep: 3, emotions: ['thoughtful'], handling: ['break', 'music'], triggers: ['work'], coping: [{ strategyId: 'box_breathing', strategyName: 'Box Breathing (4-4-4-4)', wasHelpful: true, rating: 4 }], note: 'Busy workday, took a pause mid-afternoon.' },
    { daysAgo: 11, mood: 'low' as const, score: 2, energy: 2, stress: 4, sleep: 2, emotions: ['anxious', 'exhausted'], handling: ['isolate', 'overthink'], triggers: ['sleep_deprived', 'academic'], coping: [], note: 'Slept poorly. Felt overwhelmed with upcoming project deadlines.' },
    { daysAgo: 10, mood: 'low' as const, score: 2, energy: 2, stress: 4, sleep: 3, emotions: ['overwhelmed', 'sad'], handling: ['isolate', 'keep feelings inside'], triggers: ['academic'], coping: [{ strategyId: 'relax_breathing', strategyName: '4-7-8 Relaxing Breath', wasHelpful: true, rating: 4 }], note: 'Talked to nobody today, carried the stress alone.' },
    { daysAgo: 9, mood: 'neutral' as const, score: 3, energy: 3, stress: 3, sleep: 4, emotions: ['calm', 'thoughtful'], handling: ['talk', 'break'], triggers: ['work'], coping: [{ strategyId: 'reach_out', strategyName: 'Connect with a Trusted Person', wasHelpful: true, rating: 5 }], note: 'Called Alex during lunch. It really relieved the pressure.' },
    { daysAgo: 8, mood: 'good' as const, score: 4, energy: 4, stress: 2, sleep: 4, emotions: ['happy', 'grateful'], handling: ['walk', 'talk'], triggers: [], coping: [{ strategyId: 'gratitude_note', strategyName: '3 Small Comforts Gratitude', wasHelpful: true, rating: 5 }], note: 'Great sunny weather, had a warm tea and rested well.' },
    { daysAgo: 7, mood: 'very_low' as const, score: 1, energy: 1, stress: 5, sleep: 2, emotions: ['sad', 'overwhelmed', 'lonely'], handling: ['isolate', 'overthink', 'bottle'], triggers: ['relationship', 'sleep_deprived'], coping: [{ strategyId: 'grounding_54321', strategyName: '5-4-3-2-1 Sensory Grounding', wasHelpful: true, rating: 4 }], note: 'Had a misunderstanding with someone close. Felt completely exhausted.' },
    { daysAgo: 6, mood: 'low' as const, score: 2, energy: 2, stress: 4, sleep: 3, emotions: ['anxious', 'irritated'], handling: ['journal', 'music'], triggers: ['academic', 'work'], coping: [{ strategyId: 'worry_jar', strategyName: 'Thought Defusion & Worry Jar', wasHelpful: true, rating: 4 }], note: 'Wrote down all the pending tasks. Mind felt a bit clearer.' },
    { daysAgo: 5, mood: 'neutral' as const, score: 3, energy: 3, stress: 3, sleep: 3, emotions: ['calm'], handling: ['break', 'music'], triggers: ['academic'], coping: [{ strategyId: 'box_breathing', strategyName: 'Box Breathing (4-4-4-4)', wasHelpful: true, rating: 4 }], note: 'Stepped away from screen for 20 mins.' },
    { daysAgo: 4, mood: 'good' as const, score: 4, energy: 4, stress: 2, sleep: 4, emotions: ['content', 'peaceful'], handling: ['walk', 'talk'], triggers: [], coping: [{ strategyId: 'short_walk', strategyName: 'Gentle 10-Minute Walk', wasHelpful: true, rating: 5 }], note: 'Went for a stroll in the park. Felt peaceful.' },
    { daysAgo: 3, mood: 'good' as const, score: 4, energy: 4, stress: 2, sleep: 5, emotions: ['grateful', 'hopeful'], handling: ['talk', 'journal'], triggers: [], coping: [{ strategyId: 'gratitude_note', strategyName: '3 Small Comforts Gratitude', wasHelpful: true, rating: 5 }], note: 'Well-rested. Ready for the week.' },
    { daysAgo: 2, mood: 'low' as const, score: 2, energy: 2, stress: 4, sleep: 2, emotions: ['overwhelmed', 'tired'], handling: ['isolate', 'distract'], triggers: ['academic', 'sleep_deprived'], coping: [{ strategyId: 'relax_breathing', strategyName: '4-7-8 Relaxing Breath', wasHelpful: true, rating: 4 }], note: 'Long study session with little sleep.' },
    { daysAgo: 1, mood: 'neutral' as const, score: 3, energy: 3, stress: 3, sleep: 4, emotions: ['thoughtful', 'calm'], handling: ['talk', 'break'], triggers: ['work'], coping: [{ strategyId: 'reach_out', strategyName: 'Connect with a Trusted Person', wasHelpful: true, rating: 5 }], note: 'Took a proper evening break.' },
    { daysAgo: 0, mood: 'good' as const, score: 4, energy: 4, stress: 2, sleep: 4, emotions: ['content', 'hopeful'], handling: ['walk', 'journal'], triggers: [], coping: [{ strategyId: 'box_breathing', strategyName: 'Box Breathing (4-4-4-4)', wasHelpful: true, rating: 5 }], note: 'Checked in today feeling balanced.' },
  ];

  mockDays.forEach((item, index) => {
    const timestamp = now - item.daysAgo * dayMs;
    const dateObj = new Date(timestamp);
    entries.push({
      id: `seed-mood-${index}`,
      date: dateObj.toISOString(),
      timestamp,
      mood: item.mood,
      moodScore: item.score,
      energyLevel: item.energy,
      stressLevel: item.stress,
      sleepQuality: item.sleep,
      emotions: item.emotions,
      handlingResponses: item.handling,
      triggers: item.triggers,
      copingStrategiesTried: item.coping,
      note: item.note,
      aiReflection: item.mood === 'low' || item.mood === 'very_low'
        ? `You noticed higher stress connected to ${item.triggers.join(', ') || 'demanding moments'}. Taking space helped decompress.`
        : `You felt more balanced after ${item.handling.join(' and ')}.`
    });
  });

  return entries;
};

const generateSeedJournalEntries = (): JournalEntry[] => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  return [
    {
      id: 'seed-journal-1',
      date: new Date(now - 7 * dayMs).toISOString(),
      timestamp: now - 7 * dayMs,
      title: 'A difficult misunderstanding',
      content: 'I felt low today because I had a difficult conversation with someone close. I noticed I tend to shut down and avoid speaking when I feel misunderstood. Writing this out helps me realize I need some time to process before responding.',
      mood: 'very_low',
      emotions: ['sad', 'overwhelmed', 'lonely'],
      triggers: ['relationship'],
      aiReflection: 'You connected today’s low mood with a difficult conversation and noticed your tendency to shut down. Would you like to explore what part of that conversation affected you most?',
      aiHypothesisExplored: true,
    },
    {
      id: 'seed-journal-2',
      date: new Date(now - 4 * dayMs).toISOString(),
      timestamp: now - 4 * dayMs,
      title: 'Walking in the afternoon light',
      content: 'Decided to leave my laptop and take a 15-minute walk outside without headphones. Noticed the breeze and trees. It made a surprisingly big difference to my headspace after a long week.',
      mood: 'good',
      emotions: ['calm', 'peaceful'],
      triggers: [],
      aiReflection: 'Stepping away from screens for a short walk seems to be a reliable grounding habit for you.',
      aiHypothesisExplored: false,
    },
    {
      id: 'seed-journal-3',
      date: new Date(now - 1 * dayMs).toISOString(),
      timestamp: now - 1 * dayMs,
      title: 'Learning to pace myself',
      content: 'Recognizing that I don’t have to finish everything in one evening. Setting a boundary for 9 PM to wind down and prepare for sleep.',
      mood: 'neutral',
      emotions: ['thoughtful', 'content'],
      triggers: ['work'],
      aiReflection: 'Setting a clear evening wind-down boundary appears to support your sleep quality and lower stress the following day.',
      aiHypothesisExplored: false,
    }
  ];
};

const generateSeedContacts = (): TrustedContact[] => {
  return [
    {
      id: 'contact-1',
      name: 'Sarah (Close Friend)',
      relationship: 'Friend',
      phone: '+1 (555) 234-5678',
      email: 'sarah@example.com',
      notes: 'Always great for an honest, gentle chat or tea.',
    },
    {
      id: 'contact-2',
      name: 'Dr. Emily Hayes',
      relationship: 'Counselor / Therapist',
      phone: '+1 (555) 987-6543',
      email: 'dr.hayes@wellbeingclinic.org',
      notes: 'Fortnightly sessions on Thursdays.',
    }
  ];
};

const generateSeedChatMessages = (): ChatMessage[] => {
  const now = Date.now();
  return [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Hello, I'm MindEase AI. I'm here to listen, help you reflect on how you're feeling, and explore gentle coping strategies whenever you'd like.\n\nHow are you feeling right now? Would you like me to listen, help you understand your feelings, or suggest something that might help?",
      timestamp: now - 1000 * 60 * 60,
      mode: 'listen',
      suggestedPrompts: [
        "I'm feeling a bit overwhelmed today",
        "Can we just talk quietly?",
        "I need help understanding my feelings",
        "Could you suggest a quick breathing exercise?"
      ]
    }
  ];
};

export const StorageService = {
  // Settings
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Failed to parse settings from storage', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  // Mood Entries
  getMoodEntries(): MoodEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOOD_ENTRIES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to get mood entries', e);
    }
    const seed = generateSeedMoodEntries();
    this.saveMoodEntries(seed);
    return seed;
  },

  saveMoodEntries(entries: MoodEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save mood entries', e);
    }
  },

  addMoodEntry(entry: Omit<MoodEntry, 'id' | 'timestamp'>): MoodEntry {
    const entries = this.getMoodEntries();
    const newEntry: MoodEntry = {
      ...entry,
      id: 'mood-' + Date.now(),
      timestamp: Date.now(),
    };
    entries.unshift(newEntry);
    this.saveMoodEntries(entries);
    return newEntry;
  },

  deleteMoodEntry(id: string): void {
    const entries = this.getMoodEntries().filter(e => e.id !== id);
    this.saveMoodEntries(entries);
  },

  // Journal Entries
  getJournalEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to get journal entries', e);
    }
    const seed = generateSeedJournalEntries();
    this.saveJournalEntries(seed);
    return seed;
  },

  saveJournalEntries(entries: JournalEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save journal entries', e);
    }
  },

  addJournalEntry(entry: Omit<JournalEntry, 'id' | 'timestamp'>): JournalEntry {
    const entries = this.getJournalEntries();
    const newEntry: JournalEntry = {
      ...entry,
      id: 'journal-' + Date.now(),
      timestamp: Date.now(),
    };
    entries.unshift(newEntry);
    this.saveJournalEntries(entries);
    return newEntry;
  },

  updateJournalEntry(id: string, updates: Partial<JournalEntry>): void {
    const entries = this.getJournalEntries().map(e => (e.id === id ? { ...e, ...updates } : e));
    this.saveJournalEntries(entries);
  },

  deleteJournalEntry(id: string): void {
    const entries = this.getJournalEntries().filter(e => e.id !== id);
    this.saveJournalEntries(entries);
  },

  // Chat Messages
  getChatMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to get chat messages', e);
    }
    const seed = generateSeedChatMessages();
    this.saveChatMessages(seed);
    return seed;
  },

  saveChatMessages(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat messages', e);
    }
  },

  addChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    const messages = this.getChatMessages();
    const newMessage: ChatMessage = {
      ...message,
      id: 'chat-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
    };
    messages.push(newMessage);
    this.saveChatMessages(messages);
    return newMessage;
  },

  clearChatMessages(): void {
    const seed = generateSeedChatMessages();
    this.saveChatMessages(seed);
  },

  // Trusted Contacts
  getTrustedContacts(): TrustedContact[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRUSTED_CONTACTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to get contacts', e);
    }
    const seed = generateSeedContacts();
    this.saveTrustedContacts(seed);
    return seed;
  },

  saveTrustedContacts(contacts: TrustedContact[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TRUSTED_CONTACTS, JSON.stringify(contacts));
    } catch (e) {
      console.error('Failed to save contacts', e);
    }
  },

  addTrustedContact(contact: Omit<TrustedContact, 'id'>): TrustedContact {
    const contacts = this.getTrustedContacts();
    const newContact: TrustedContact = {
      ...contact,
      id: 'contact-' + Date.now(),
    };
    contacts.push(newContact);
    this.saveTrustedContacts(contacts);
    return newContact;
  },

  deleteTrustedContact(id: string): void {
    const contacts = this.getTrustedContacts().filter(c => c.id !== id);
    this.saveTrustedContacts(contacts);
  },

  // Dismissed / Corrected Hypotheses (AI memory of user corrections)
  getDismissedHypotheses(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DISMISSED_HYPOTHESES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addDismissedHypothesis(key: string): void {
    const list = this.getDismissedHypotheses();
    if (!list.includes(key)) {
      list.push(key);
      localStorage.setItem(STORAGE_KEYS.DISMISSED_HYPOTHESES, JSON.stringify(list));
    }
  },

  removeDismissedHypothesis(key: string): void {
    const list = this.getDismissedHypotheses().filter(k => k !== key);
    localStorage.setItem(STORAGE_KEYS.DISMISSED_HYPOTHESES, JSON.stringify(list));
  },

  // Complete Export & Import
  exportFullBackup(): string {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      moodEntries: this.getMoodEntries(),
      journalEntries: this.getJournalEntries(),
      chatMessages: this.getChatMessages(),
      trustedContacts: this.getTrustedContacts(),
      dismissedHypotheses: this.getDismissedHypotheses(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importFullBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));
      if (parsed.moodEntries) localStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(parsed.moodEntries));
      if (parsed.journalEntries) localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(parsed.journalEntries));
      if (parsed.chatMessages) localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(parsed.chatMessages));
      if (parsed.trustedContacts) localStorage.setItem(STORAGE_KEYS.TRUSTED_CONTACTS, JSON.stringify(parsed.trustedContacts));
      if (parsed.dismissedHypotheses) localStorage.setItem(STORAGE_KEYS.DISMISSED_HYPOTHESES, JSON.stringify(parsed.dismissedHypotheses));
      return true;
    } catch (e) {
      console.error('Failed to import backup', e);
      return false;
    }
  },

  wipeAllData(): void {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
};
