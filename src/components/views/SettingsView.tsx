import React, { useState } from 'react';
import {
  Shield,
  Download,
  Upload,
  Key,
  Palette,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { UserSettings } from '../../types';
import { StorageService } from '../../services/storageService';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onResetAllData: () => void;
  onClearChat: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
  onClearChat,
}) => {
  const [userName, _setUserName] = useState(settings.name);
  const [apiKey, setApiKey] = useState(settings.customApiKey || '');
  const [apiProvider, setApiProvider] = useState<'local' | 'gemini' | 'openai'>(settings.apiProvider || 'local');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [dismissedList, setDismissedList] = useState<string[]>(StorageService.getDismissedHypotheses());

  const handleSaveProfile = () => {
    onUpdateSettings({
      name: userName.trim() || 'Friend',
      customApiKey: apiKey.trim() || undefined,
      apiProvider,
    });
    alert('Settings saved successfully.');
  };

  const handleExportData = () => {
    const dataStr = StorageService.exportFullBackup();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindease-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const success = StorageService.importFullBackup(content);
      if (success) {
        setImportStatus('Data successfully imported! Reloading...');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setImportStatus('Failed to import data. Invalid JSON format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearDismissed = () => {
    localStorage.removeItem('mindease_dismissed_hypotheses');
    setDismissedList([]);
    alert('AI hypothesis memory has been reset.');
  };

  const themes: { id: UserSettings['theme']; label: string; color: string }[] = [
    { id: 'sage', label: 'Sage Serenity', color: 'bg-[#8FAE95]' },
    { id: 'ocean', label: 'Ocean Breeze', color: 'bg-[#7FA7C4]' },
    { id: 'lavender', label: 'Lavender Calm', color: 'bg-[#B2A6D6]' },
    { id: 'warm', label: 'Warm Sand', color: 'bg-[#cca973]' },
    { id: 'midnight', label: 'Midnight Blue', color: 'bg-slate-800' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-10 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Preferences & Control
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1B2430] dark:text-white tracking-tight">
          Privacy & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Full user control over your data, AI features, privacy, and interface themes.
        </p>
      </div>

      {/* 1. Privacy Policy */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border-l-4 border-l-[#7FA7C4] border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center space-x-2.5 text-[#436c86] dark:text-[#7FA7C4]">
          <Shield className="w-5 h-5" />
          <h3 className="text-base font-bold">Privacy & Transparency Guarantee</h3>
        </div>
        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed font-normal">
          <p>• <strong>Local-First Storage:</strong> Your conversations, mood logs, and journal reflections are stored securely in your browser's local storage.</p>
          <p>• <strong>Zero Data Monetization:</strong> MindEase AI never sells, shares, or monetizes sensitive emotional data.</p>
          <p>• <strong>Non-Diagnostic:</strong> MindEase AI is an emotional companion, not a clinical diagnostic system or therapy replacement.</p>
        </div>
      </div>

      {/* 2. Theme Preferences */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Palette className="w-4 h-4 text-[#7FA7C4]" />
          <span>Calm Visual Theme</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => onUpdateSettings({ theme: t.id })}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center space-y-2 transition-all ${
                settings.theme === t.id
                  ? 'border-[#7FA7C4] bg-[#7FA7C4]/15 shadow-xs font-bold'
                  : 'border-[#E9E2D6] dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`w-5 h-5 rounded-full ${t.color}`} />
              <span className="text-xs text-slate-900 dark:text-white">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. AI Behavioral Controls */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#7FA7C4]" />
          <span>AI Companion & Insights Settings</span>
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Mood Pattern Analysis</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Allow AI to detect trigger correlations and sleep/stress patterns from check-ins.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.aiAnalysisEnabled}
              onChange={e => onUpdateSettings({ aiAnalysisEnabled: e.target.checked })}
              className="h-4 w-4 rounded text-[#7FA7C4] focus:ring-[#7FA7C4]"
            />
          </label>

          <label className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Coping Suggestions</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Allow AI to recommend breathing, grounding, and journal tools when you ask for advice.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.aiCopingSuggestionsEnabled}
              onChange={e => onUpdateSettings({ aiCopingSuggestionsEnabled: e.target.checked })}
              className="h-4 w-4 rounded text-[#7FA7C4] focus:ring-[#7FA7C4]"
            />
          </label>
        </div>

        {dismissedList.length > 0 && (
          <div className="pt-3 border-t border-[#E9E2D6] dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              You corrected {dismissedList.length} AI hypothesis pattern(s).
            </span>
            <button
              onClick={handleClearDismissed}
              className="text-xs font-bold text-[#436c86] hover:underline"
            >
              Reset Memory
            </button>
          </div>
        )}
      </div>

      {/* 4. BYOK LLM */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Key className="w-4 h-4 text-[#7FA7C4]" />
          <span>AI Language Model Provider (Optional)</span>
        </h3>
        <p className="text-xs text-slate-500">
          MindEase comes with an empathetic local engine by default. You can optionally connect your own Google Gemini API key.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Provider</label>
            <select
              value={apiProvider}
              onChange={e => setApiProvider(e.target.value as any)}
              className="w-full p-3 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            >
              <option value="local">MindEase Local Engine (Offline / Safe)</option>
              <option value="gemini">Google Gemini 1.5 Flash (Custom API Key)</option>
            </select>
          </div>

          {apiProvider === 'gemini' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Gemini API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-3 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSaveProfile}
          className="px-5 py-2.5 rounded-2xl bg-[#7FA7C4] text-white text-xs font-bold hover:bg-[#6c97b5]"
        >
          Save AI Preferences
        </button>
      </div>

      {/* 5. Export / Import */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Download className="w-4 h-4 text-[#7FA7C4]" />
          <span>Export & Backup Data</span>
        </h3>
        <p className="text-xs text-slate-500">
          Download an offline JSON backup of all your check-ins, reflections, and trusted contacts.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-[#E9E2D6] hover:bg-slate-50"
          >
            <Download className="w-4 h-4" />
            <span>Export Data (JSON)</span>
          </button>

          <label className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-[#E9E2D6] hover:bg-slate-50 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import Backup</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>
        </div>

        {importStatus && (
          <p className="text-xs font-semibold text-[#436c86] mt-2">{importStatus}</p>
        )}
      </div>

      {/* 6. Danger Zone */}
      <div className="p-8 rounded-3xl border border-[#C4635A]/40 space-y-4 bg-rose-50/20 dark:bg-rose-950/20">
        <h3 className="text-base font-bold text-[#C4635A] flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Danger Zone • Data Deletion</span>
        </h3>
        <p className="text-xs text-slate-500">
          Permanently erase specific conversation logs or completely wipe all data on this device.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={() => {
              if (confirm('Clear all chat messages?')) onClearChat();
            }}
            className="px-4 py-2.5 rounded-2xl border border-[#C4635A]/40 text-[#C4635A] text-xs font-bold hover:bg-rose-50"
          >
            Clear Chat History
          </button>

          {!confirmWipe ? (
            <button
              onClick={() => setConfirmWipe(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#C4635A] text-white text-xs font-bold hover:bg-[#ad4e45]"
            >
              Wipe All Data (Factory Reset)
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={onResetAllData}
                className="px-5 py-2.5 rounded-2xl bg-rose-700 text-white text-xs font-bold hover:bg-rose-800"
              >
                Confirm Delete Everything
              </button>
              <button
                onClick={() => setConfirmWipe(false)}
                className="px-4 py-2.5 rounded-2xl text-xs text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
