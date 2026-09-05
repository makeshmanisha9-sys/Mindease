import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Calendar,
  X,
  MessageSquare
} from 'lucide-react';
import { JournalEntry, MoodRating, UserSettings } from '../../types';
import { EMOTIONS_LIST } from '../../utils/constants';
import { formatDate, getMoodDetails } from '../../utils/helpers';
import { AICompanionService } from '../../services/aiCompanionService';

interface JournalViewProps {
  entries: JournalEntry[];
  settings: UserSettings;
  onAddEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
  onUpdateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  onDeleteEntry: (id: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  entries,
  settings: _settings,
  onAddEntry,
  onUpdateEntry: _onUpdateEntry,
  onDeleteEntry,
  onNavigateToTab,
}) => {
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood] = useState<MoodRating>('neutral');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedTriggers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const promptStarters = [
    "I felt low today because I had a difficult conversation...",
    "One small thing that brought me relief today was...",
    "What feels most overwhelming right now is...",
    "Something I am learning to let go of is..."
  ];

  const handleCreate = () => {
    if (!content.trim()) return;

    const aiReflection = AICompanionService.generateJournalReflection(
      content,
      selectedMood,
      selectedTriggers
    );

    onAddEntry({
      date: new Date().toISOString(),
      title: title.trim() || 'Journal Entry',
      content: content.trim(),
      mood: selectedMood,
      emotions: selectedEmotions,
      triggers: selectedTriggers,
      aiReflection,
      aiHypothesisExplored: false,
    });

    setTitle('');
    setContent('');
    setSelectedEmotions([]);
    setIsWriting(false);
  };

  const filteredEntries = entries.filter(e => {
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.content.toLowerCase().includes(q) ||
      e.emotions.some(em => em.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-10 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#436c86] block">
            Private Reflections
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1B2430] dark:text-white tracking-tight">
            Mood Journal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            A safe, private space to write freely. Reflections are saved locally on your device.
          </p>
        </div>

        {!isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-[#7FA7C4] text-white text-xs sm:text-sm font-bold hover:bg-[#6c97b5] shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Reflection</span>
          </button>
        )}
      </div>

      {/* Entry Composer */}
      {isWriting && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-[#7FA7C4]/50 shadow-sm space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Write a Reflection</h3>
            <button
              onClick={() => setIsWriting(false)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-400">Prompt Starters:</span>
            <div className="flex flex-wrap gap-1.5">
              {promptStarters.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setContent(prompt + ' ')}
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#7FA7C4]/15 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  "{prompt.slice(0, 34)}..."
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full px-4 py-3 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7FA7C4]"
          />

          <textarea
            rows={5}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write freely... How are you feeling, and what happened today?"
            className="w-full p-4 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7FA7C4] leading-relaxed"
          />

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500">Emotion Tags:</span>
            <div className="flex flex-wrap gap-1.5">
              {EMOTIONS_LIST.slice(0, 10).map(em => (
                <button
                  key={em.id}
                  type="button"
                  onClick={() =>
                    setSelectedEmotions(prev =>
                      prev.includes(em.id) ? prev.filter(e => e !== em.id) : [...prev, em.id]
                    )
                  }
                  className={`text-xs px-3 py-1.5 rounded-xl transition-all ${
                    selectedEmotions.includes(em.id)
                      ? 'bg-[#7FA7C4] text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {em.emoji} {em.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsWriting(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!content.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#7FA7C4] text-white text-xs font-bold hover:bg-[#6c97b5] disabled:opacity-50"
            >
              Save Reflection
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search journal reflections by word or emotion..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#E9E2D6] dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7FA7C4]"
        />
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No reflections found</p>
            <p className="text-xs text-slate-400">Write your first journal reflection or adjust your search term.</p>
          </div>
        ) : (
          filteredEntries.map(entry => {
            const moodInfo = entry.mood ? getMoodDetails(entry.mood) : null;
            return (
              <div key={entry.id} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{entry.title}</h3>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(entry.date)}</span>
                      {moodInfo && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${moodInfo.bg} ${moodInfo.color}`}>
                          {moodInfo.emoji} {moodInfo.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="text-slate-400 hover:text-[#C4635A] p-2 rounded-xl transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                  {entry.content}
                </p>

                {entry.emotions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {entry.emotions.map((em, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        #{em}
                      </span>
                    ))}
                  </div>
                )}

                {entry.aiReflection && (
                  <div className="p-5 rounded-2xl bg-[#7FA7C4]/10 border border-[#7FA7C4]/25 space-y-2">
                    <span className="text-xs font-bold text-[#436c86] dark:text-[#7FA7C4] block">
                      MindEase Reflection Prompt
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 italic leading-relaxed">
                      "{entry.aiReflection}"
                    </p>
                    <button
                      onClick={() => onNavigateToTab('chat')}
                      className="text-xs font-bold text-[#436c86] hover:underline flex items-center space-x-1 pt-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Explore in AI Chat</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
