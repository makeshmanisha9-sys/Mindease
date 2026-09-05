import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  RefreshCw,
  Wind,
  Bot,
  User,
  Info,
  BookmarkPlus
} from 'lucide-react';
import { ChatMessage, ConversationMode, UserSettings, MoodRating } from '../../types';
import { CONVERSATION_MODES } from '../../utils/constants';
import { AICompanionService } from '../../services/aiCompanionService';

interface ChatViewProps {
  settings: UserSettings;
  messages: ChatMessage[];
  onAddMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  onClearChat: () => void;
  onNavigateToTab: (tab: string) => void;
  onOpenCrisis: () => void;
  onQuickSaveMood: (mood: MoodRating, note: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  settings,
  messages,
  onAddMessage,
  onClearChat,
  onNavigateToTab,
  onOpenCrisis,
  onQuickSaveMood: _onQuickSaveMood,
}) => {
  const [inputText, setInputText] = useState('');
  const [currentMode, setCurrentMode] = useState<ConversationMode>(settings.preferredMode || 'listen');
  const [isTyping, setIsTyping] = useState(false);
  const [showSaveMoodPrompt, setShowSaveMoodPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    setInputText('');

    onAddMessage({
      sender: 'user',
      text,
      mode: currentMode,
    });

    setIsTyping(true);

    setTimeout(async () => {
      try {
        const response = await AICompanionService.generateResponse(
          text,
          currentMode,
          messages,
          settings
        );

        onAddMessage({
          sender: 'assistant',
          text: response.text,
          mode: currentMode,
          suggestedPrompts: response.suggestedPrompts,
          isCrisisResponse: response.isCrisis,
          contextAction: response.contextAction,
        });

        if (response.isCrisis) {
          onOpenCrisis();
        }

        if (messages.length >= 3 && !showSaveMoodPrompt) {
          setShowSaveMoodPrompt(true);
        }
      } catch (err) {
        console.error('AI response error', err);
        onAddMessage({
          sender: 'assistant',
          text: "I'm here with you. Please feel free to continue whenever you're ready.",
          mode: currentMode,
        });
      } finally {
        setIsTyping(false);
      }
    }, 750);
  };

  const handleContextAction = (action?: ChatMessage['contextAction']) => {
    if (!action) return;
    if (action.type === 'open_breathing' || action.type === 'open_grounding' || action.type === 'suggest_coping') {
      onNavigateToTab('toolkit');
    } else if (action.type === 'open_support') {
      onOpenCrisis();
    } else if (action.type === 'save_checkin') {
      onNavigateToTab('checkin');
    }
  };

  const activeModeDetails = CONVERSATION_MODES.find(m => m.id === currentMode);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto px-4 sm:px-8 py-4 space-y-4">
      {/* Top Banner: Mode Switcher */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mode:</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#7FA7C4]/20 text-[#2d4d62] dark:text-[#a5c9e1]">
              {activeModeDetails?.label}
            </span>
          </div>
          <button
            onClick={onClearChat}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5">
          {CONVERSATION_MODES.map(mode => {
            const isSelected = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setCurrentMode(mode.id)}
                className={`p-2 rounded-xl text-center text-xs transition-all ${
                  isSelected
                    ? 'bg-[#7FA7C4] text-white font-bold shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="truncate w-full block text-[11px] font-medium">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 sm:px-3 pb-4">
        <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-[#E9E2D6] dark:border-slate-800 flex items-center justify-center space-x-2 text-xs text-slate-500 max-w-md mx-auto text-center">
          <Info className="w-3.5 h-3.5 shrink-0 text-[#7FA7C4]" />
          <span>MindEase AI companion listens without judging. Not a therapist.</span>
        </div>

        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div className="flex items-end space-x-2.5 max-w-[90%] sm:max-w-[80%]">
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#7FA7C4]/20 flex items-center justify-center text-[#436c86] shrink-0 mb-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#7FA7C4] text-white rounded-br-xs shadow-xs font-medium'
                      : msg.isCrisisResponse
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 border border-rose-200 dark:border-rose-900 rounded-bl-xs'
                      : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-[#E9E2D6] dark:border-slate-700/80 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {msg.contextAction && (
                    <div className="mt-3 pt-2.5 border-t border-[#E9E2D6] dark:border-slate-700">
                      <button
                        onClick={() => handleContextAction(msg.contextAction)}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#7FA7C4] text-white text-xs font-bold hover:bg-[#6c97b5] transition-colors"
                      >
                        <Wind className="w-3.5 h-3.5" />
                        <span>{msg.contextAction.label}</span>
                      </button>
                    </div>
                  )}
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 mb-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>

              {!isUser && msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-10 max-w-lg">
                  {msg.suggestedPrompts.map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSend(prompt)}
                      className="text-[11px] px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-[#7FA7C4]/15 text-slate-600 hover:text-[#2d4d62] dark:text-slate-300 border border-[#E9E2D6] dark:border-slate-700 transition-colors font-medium text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-2 pl-2">
            <div className="w-8 h-8 rounded-xl bg-[#7FA7C4]/20 flex items-center justify-center text-[#436c86] shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-[#E9E2D6] dark:border-slate-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7FA7C4] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#7FA7C4] animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#7FA7C4] animate-bounce [animation-delay:0.3s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Save to Mood Banner */}
      {showSaveMoodPrompt && (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-sm flex items-center justify-between shrink-0 animate-in slide-in-from-bottom-2">
          <div className="flex items-center space-x-2.5">
            <BookmarkPlus className="w-4 h-4 text-[#7FA7C4] shrink-0" />
            <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">
              Would you like to save this reflection into your daily mood log?
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onNavigateToTab('checkin');
                setShowSaveMoodPrompt(false);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#7FA7C4] text-white text-xs font-bold hover:bg-[#6c97b5]"
            >
              Save Check-in
            </button>
            <button
              onClick={() => setShowSaveMoodPrompt(false)}
              className="text-xs text-slate-400 hover:text-slate-600 px-2"
            >
              Keep in Chat
            </button>
          </div>
        </div>
      )}

      {/* Input Box */}
      <div className="p-3 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={`Message MindEase... (Active mode: ${activeModeDetails?.label})`}
            className="flex-1 px-4 py-3 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7FA7C4]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className={`p-3 rounded-2xl font-bold text-white shadow-xs transition-all ${
              inputText.trim() && !isTyping
                ? 'bg-[#7FA7C4] hover:bg-[#6c97b5]'
                : 'bg-slate-200 dark:bg-slate-700 cursor-not-allowed text-slate-400'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
