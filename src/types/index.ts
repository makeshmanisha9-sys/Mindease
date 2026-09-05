export type MoodRating = 'very_low' | 'low' | 'neutral' | 'good' | 'very_good';

export interface EmotionTag {
  id: string;
  label: string;
  category: 'negative' | 'neutral' | 'positive' | 'energy';
  emoji: string;
}

export type ConversationMode =
  | 'listen'
  | 'understand'
  | 'handle'
  | 'suggest'
  | 'routine'
  | 'prepare_talk';

export interface CopingAction {
  id: string;
  name: string;
  category: 'grounding' | 'breathing' | 'movement' | 'social' | 'creative' | 'rest';
  description: string;
  durationMinutes: number;
}

export interface HandlingResponse {
  id: string;
  label: string;
  category: 'social' | 'solitude' | 'expression' | 'distraction' | 'internalization' | 'action' | 'rest';
  description: string;
}

export interface TriggerOption {
  id: string;
  label: string;
  category: 'academic' | 'work' | 'relationship' | 'health' | 'social' | 'financial' | 'life_change';
}

export interface MoodEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DDTHH:mm:ss.sssZ
  timestamp: number;
  mood: MoodRating;
  moodScore: number; // 1 (very low) to 5 (very good)
  energyLevel: number; // 1 to 5
  stressLevel: number; // 1 to 5
  sleepQuality: number; // 1 to 5
  emotions: string[];
  handlingResponses: string[];
  triggers: string[];
  copingStrategiesTried?: {
    strategyId: string;
    strategyName: string;
    wasHelpful: boolean;
    rating?: number; // 1-5
  }[];
  note?: string;
  aiReflection?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  timestamp: number;
  title: string;
  content: string;
  mood?: MoodRating;
  emotions: string[];
  triggers: string[];
  aiReflection?: string;
  aiHypothesisExplored?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: number;
  mode?: ConversationMode;
  suggestedPrompts?: string[];
  savedToMood?: boolean;
  isCrisisResponse?: boolean;
  contextAction?: {
    type: 'suggest_coping' | 'open_breathing' | 'open_grounding' | 'open_support' | 'save_checkin';
    label: string;
    payload?: any;
  };
}

export interface PatternInsight {
  id: string;
  title: string;
  observation: string;
  hypothesis: string;
  basedOn: string;
  triggerCategory?: string;
  confidence: 'high' | 'medium' | 'exploratory';
  userDismissed?: boolean;
  userConfirmed?: boolean;
  suggestedAction?: string;
  suggestedActionType?: 'breathing' | 'routine' | 'journal' | 'support';
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface UserSettings {
  name: string;
  theme: 'sage' | 'ocean' | 'lavender' | 'warm' | 'midnight';
  darkMode: boolean;
  preferredMode: ConversationMode;
  aiAnalysisEnabled: boolean;
  aiCopingSuggestionsEnabled: boolean;
  dailyReminderTime?: string;
  ambientSoundVolume: number;
  soundEnabled: boolean;
  hasCompletedOnboarding: boolean;
  customApiKey?: string;
  apiProvider?: 'gemini' | 'openai' | 'local';
}

export interface DoctorSummary {
  generatedAt: string;
  dateRange: {
    start: string;
    end: string;
  };
  totalCheckIns: number;
  averageMood: string;
  averageStress: number;
  averageSleep: number;
  commonEmotions: { emotion: string; count: number }[];
  frequentTriggers: { trigger: string; count: number }[];
  frequentHandlingBehaviors: { behavior: string; count: number }[];
  copingAttempts: { strategy: string; count: number; helpfulRate: number }[];
  summaryNarrative: string;
  personalNotes?: string;
}
