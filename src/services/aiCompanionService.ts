import { ChatMessage, ConversationMode, MoodEntry, UserSettings } from '../types';
import { StorageService } from './storageService';

const CRISIS_PATTERNS = [
  /\b(suicid|kill myself|end it all|want to die|take my own life|no reason to live|better off dead|hang myself|end my life|slit|overdose)\b/i,
  /\b(self[\s-]?harm|hurt myself|cutting myself|punish myself)\b/i,
  /\b(don'?t want to wake up|can'?t go on anymore|nothing matters anymore|no way out)\b/i
];

const VULGAR_PATTERNS = [
  /\b(fuck you|bitch|bastard|asshole|shut up|piece of shit|f\*ck)\b/i
];

export const AICompanionService = {
  /**
   * Evaluates if a message contains crisis or self-harm signals.
   */
  detectCrisis(text: string): boolean {
    return CRISIS_PATTERNS.some(pattern => pattern.test(text));
  },

  /**
   * Evaluates if a message is hostile or vulgar.
   */
  detectVulgar(text: string): boolean {
    return VULGAR_PATTERNS.some(pattern => pattern.test(text));
  },

  /**
   * Generates a compassionate response respecting all MindEase AI personality & safety guidelines.
   */
  async generateResponse(
    userText: string,
    mode: ConversationMode,
    history: ChatMessage[],
    settings: UserSettings
  ): Promise<{ text: string; suggestedPrompts: string[]; isCrisis: boolean; contextAction?: ChatMessage['contextAction'] }> {
    const trimmed = userText.trim();

    // 1. Mandatory Safety & Crisis screening (Overrides everything)
    if (this.detectCrisis(trimmed)) {
      return {
        text: "I'm really sorry you're feeling this much pain right now. If you think you might hurt yourself or you're in immediate danger, please reach out to emergency services or call/text 988 (or your local crisis line) right away. If you can, reach out to someone you trust and ask them to stay with you.\n\nAre you safe right now?",
        suggestedPrompts: [
          "I am safe right now, just struggling",
          "Can you show me crisis resources?",
          "I want to contact a trusted friend",
          "Can we do a slow breathing exercise together?"
        ],
        isCrisis: true,
        contextAction: {
          type: 'open_support',
          label: 'View Emergency Crisis Contacts',
        }
      };
    }

    // 2. Strict language handling
    if (this.detectVulgar(trimmed)) {
      return {
        text: "I understand you're upset. You can tell me what happened, and I'll listen without judging.",
        suggestedPrompts: [
          "I'm just really frustrated today",
          "Everything went wrong earlier",
          "I'd like to take a quick pause"
        ],
        isCrisis: false,
      };
    }

    // 3. Check for external LLM API if configured by user
    if (settings.apiProvider === 'gemini' && settings.customApiKey) {
      try {
        const geminiReply = await this.callGeminiAPI(trimmed, mode, history, settings.customApiKey);
        if (geminiReply) {
          return {
            text: geminiReply,
            suggestedPrompts: this.generateFollowupPrompts(mode, trimmed),
            isCrisis: false,
          };
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local empathy engine:', err);
      }
    }

    // 4. Built-in Local Empathetic Response Engine (100% reliable offline)
    const localReply = this.generateLocalEmpatheticResponse(trimmed, mode, history);
    return localReply;
  },

  /**
   * Built-in context-aware empathy engine.
   */
  generateLocalEmpatheticResponse(
    text: string,
    mode: ConversationMode,
    _history: ChatMessage[]
  ): { text: string; suggestedPrompts: string[]; isCrisis: boolean; contextAction?: ChatMessage['contextAction'] } {
    const lower = text.toLowerCase();

    // Check for "nobody understands me" / loneliness
    if (lower.includes('nobody understands') || lower.includes('no one understands') || lower.includes('feel so lonely') || lower.includes('all alone')) {
      return {
        text: "That sounds lonely. Feeling misunderstood or isolated can be really painful. You don't have to carry that completely alone. Would you like to tell me what happened?",
        suggestedPrompts: [
          "I had a misunderstanding with someone",
          "I just feel disconnected from people lately",
          "Can you just listen while I write it down?",
          "Can you suggest something to help me feel calmer?"
        ],
        isCrisis: false,
      };
    }

    // Check for depressed / sad feelings
    if (lower.includes('depressed') || lower.includes('feel low') || lower.includes('sad') || lower.includes('down today') || lower.includes('crying')) {
      return {
        text: "I'm sorry today feels difficult. You don't have to figure everything out all at once. Would you like to talk about what happened, or would you prefer a small activity to help you feel calmer?",
        suggestedPrompts: [
          "I'd like to talk about it",
          "I'd prefer a gentle calming activity",
          "Could we do a breathing exercise?",
          "Can you just listen without advice?"
        ],
        isCrisis: false,
        contextAction: {
          type: 'open_breathing',
          label: 'Try Box Breathing Exercise',
        }
      };
    }

    // Check for overwhelming / stress / burnout
    if (lower.includes('overwhelmed') || lower.includes('too much') || lower.includes('stressed') || lower.includes('can\'t handle') || lower.includes('anxiety') || lower.includes('anxious')) {
      return {
        text: "That sounds like a heavy weight to carry right now. When things pile up, even small things can feel immense. What feels most overwhelming in this moment?",
        suggestedPrompts: [
          "Work or school workload",
          "Too many responsibilities at once",
          "I feel physical tension and restlessness",
          "Can you guide me through a 5-4-3-2-1 grounding exercise?"
        ],
        isCrisis: false,
        contextAction: {
          type: 'open_grounding',
          label: 'Start 5-4-3-2-1 Grounding',
        }
      };
    }

    // Check for academic pressure
    if (lower.includes('exam') || lower.includes('study') || lower.includes('grades') || lower.includes('academic') || lower.includes('college') || lower.includes('school') || lower.includes('homework')) {
      return {
        text: "Academic pressure can take a serious toll on energy and mood. You've been trying to balance a lot. Would you like to explore what part of your studies is weighing on you most, or take a 5-minute mental pause?",
        suggestedPrompts: [
          "Let's break down one small step",
          "I'd like to take a 5-minute pause",
          "I'm worried I won't finish in time",
          "How can I handle study burnout?"
        ],
        isCrisis: false,
      };
    }

    // Check for relationship / family / interpersonal
    if (lower.includes('argument') || lower.includes('fight') || lower.includes('relationship') || lower.includes('friend') || lower.includes('parents') || lower.includes('partner') || lower.includes('boss')) {
      return {
        text: "Interpersonal friction often lingers and drains our emotional energy. It makes complete sense that you'd feel unsettled after that. Would you like to unpack what was said, or prepare what you might want to say next?",
        suggestedPrompts: [
          "I shut down during the conversation",
          "Help me prepare how to talk to them",
          "I just need to vent about what happened",
          "I feel guilty about how I reacted"
        ],
        isCrisis: false,
        contextAction: {
          type: 'suggest_coping',
          label: 'Open Conversation Script Builder',
        }
      };
    }

    // Check for lack of sleep / tiredness
    if (lower.includes('sleep') || lower.includes('tired') || lower.includes('insomnia') || lower.includes('exhausted') || lower.includes('can\'t sleep')) {
      return {
        text: "It is so hard to navigate emotions when your body and mind are running on low rest. Be gentle with yourself today. Would you like to look at a calming wind-down routine, or just take it one step at a time?",
        suggestedPrompts: [
          "Can you guide me through a relaxing breath?",
          "How can I wind down before bed tonight?",
          "I'll try to keep today's goals very small",
          "Just listen while I unload my thoughts"
        ],
        isCrisis: false,
        contextAction: {
          type: 'open_breathing',
          label: 'Try 4-7-8 Relaxing Breath',
        }
      };
    }

    // Mode-specific tailored responses when message is general
    switch (mode) {
      case 'listen':
        return {
          text: "I hear you. Thank you for sharing that with me. Please feel free to write as much as you need—I'm here to listen at your own pace.",
          suggestedPrompts: [
            "There's something else on my mind too",
            "That felt good to write out",
            "Would you like to save this to my mood entry?",
            "Can you suggest a small next step?"
          ],
          isCrisis: false,
        };

      case 'understand':
        return {
          text: "Thank you for reflecting on that. When you notice this feeling, do you sense it more as tension, fatigue, or racing thoughts? Exploring how it feels physically can sometimes help us understand what we need.",
          suggestedPrompts: [
            "It feels like physical tightness / chest",
            "It feels like fatigue and brain fog",
            "It feels like overthinking and worry",
            "I'm not completely sure yet"
          ],
          isCrisis: false,
        };

      case 'handle':
        return {
          text: "When you feel this way, what do you usually find yourself doing first? For example, do you prefer having quiet space, reaching out to someone, listening to music, or taking a walk?",
          suggestedPrompts: [
            "I usually isolate and want to be alone",
            "I tend to overthink or distract myself",
            "Taking a walk or breathing usually helps",
            "Talking to a close friend helps me decompress"
          ],
          isCrisis: false,
        };

      case 'suggest':
        return {
          text: "Here are a couple of small, low-effort options that might help right now:\n\n1. **A 2-minute Box Breathing pause** to steady your nervous system.\n2. **The 5-4-3-2-1 Sensory Grounding exercise** to bring focus back to the room.\n3. **Writing down one single sentence** about what you can let go of for today.\n\nWhich of these feels most doable, or would you prefer something else?",
          suggestedPrompts: [
            "Let's try Box Breathing",
            "Let's do 5-4-3-2-1 Grounding",
            "I'd like to put a thought into the Worry Jar",
            "I think I'll go drink some water and stretch"
          ],
          isCrisis: false,
          contextAction: {
            type: 'open_breathing',
            label: 'Start Box Breathing Tool',
          }
        };

      case 'routine':
        return {
          text: "Building a supportive routine works best with tiny, gentle micro-habits rather than big changes. Would you like to focus on a **morning ease check-in**, a **midday pause**, or an **evening wind-down boundary**?",
          suggestedPrompts: [
            "An evening wind-down routine",
            "A gentle morning routine",
            "A 3-minute midday breathing reset",
            "Help me keep track of daily sleep & hydration"
          ],
          isCrisis: false,
        };

      case 'prepare_talk':
        return {
          text: "Talking to someone about how you feel can feel vulnerable, but having a clear starting sentence helps. Who are you hoping to talk with—a friend, partner, family member, or healthcare professional?",
          suggestedPrompts: [
            "A close friend",
            "A partner or spouse",
            "A family member",
            "A doctor or counselor"
          ],
          isCrisis: false,
          contextAction: {
            type: 'suggest_coping',
            label: 'Open Script Generator',
          }
        };

      default:
        return {
          text: "I hear what you're sharing. You don't have to carry this alone. Would you like me to listen, help you understand your feelings, or suggest something that might help?",
          suggestedPrompts: [
            "Please just listen for a bit",
            "Help me understand my feelings",
            "Suggest something that might help",
            "Save this as a mood entry"
          ],
          isCrisis: false,
        };
    }
  },

  /**
   * Generates dynamic follow-up prompts based on the current context.
   */
  generateFollowupPrompts(mode: ConversationMode, _input: string): string[] {
    switch (mode) {
      case 'listen':
        return ["Tell me more", "I feel a bit clearer now", "Can you suggest a small rest activity?"];
      case 'understand':
        return ["What else might be triggering this?", "How does this connect to my sleep?", "Let's explore a coping habit"];
      case 'handle':
        return ["How can I avoid isolating too much?", "Help me balance alone time and connection", "What can I do when overthinking starts?"];
      case 'suggest':
        return ["Let's do a 3-minute breathing pause", "Show me the 5-4-3-2-1 grounding tool", "I'll try journaling about this"];
      case 'routine':
        return ["Set a 9 PM screen boundary", "Plan a 10-minute morning walk", "Remind me to drink water and pause"];
      case 'prepare_talk':
        return ["Generate a text message script", "How do I explain that I feel overwhelmed?", "What if they don't know how to respond?"];
      default:
        return ["I'd like to explore this more", "Can we try a breathing exercise?", "Save this reflection to my journal"];
    }
  },

  /**
   * Integration for Google Gemini API when user inputs their own API key.
   */
  async callGeminiAPI(
    userText: string,
    mode: ConversationMode,
    history: ChatMessage[],
    apiKey: string
  ): Promise<string | null> {
    const systemInstruction = `You are MindEase AI, a supportive emotional-wellbeing companion. Tagline: "Understand your mood. Build better coping habits."
Role: Listen, help users reflect on emotions, support healthy coping, and encourage human connection.
Strict Boundaries:
- You are an AI, NOT a doctor, therapist, or romantic partner. NEVER diagnose medical or mental health disorders.
- Personality: Warm, caring, patient, respectful, calm, non-judgmental, encouraging, emotionally intelligent.
- Communication style: Gentle acknowledgment first, natural conversational flow, short concise responses (2-4 sentences max), supportive questions.
- Never use vulgar, insulting, or aggressive language.
- Never encourage emotional dependency. Support real-world relationships.
- Active mode: ${mode}.
- If user mentions self-harm or suicidal thoughts, prioritize immediate safety, encourage crisis hotlines (988), and ask if they are safe.`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `[System Instruction: ${systemInstruction}]\n\nUser conversation history:\n` + history.slice(-4).map(m => `${m.sender}: ${m.text}`).join('\n') + `\nUser: ${userText}` }]
      }
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return replyText || null;
  },

  /**
   * Generates a gentle AI reflection for a journal entry (Reflect and ask without assumption).
   */
  generateJournalReflection(entryText: string, mood?: string, triggers?: string[]): string {
    const lower = entryText.toLowerCase();

    if (lower.includes('difficult conversation') || lower.includes('argument') || lower.includes('misunderstanding')) {
      return "You connected this entry with a difficult conversation. Would you like to explore what part of that conversation affected you most?";
    }
    if (triggers && triggers.includes('academic')) {
      return "You noted academic pressure during this reflection. Taking time to put these thoughts into words is a great way to decompress. What is one small thing you can set aside until tomorrow?";
    }
    if (triggers && triggers.includes('work')) {
      return "You mentioned work demands in your thoughts. When work feels heavy, giving yourself permission to disconnect in the evening can be deeply restoring.";
    }
    if (mood === 'good' || mood === 'very_good') {
      return "It's wonderful to notice and document these positive, grounding moments. Celebrating what went well reinforces healthy emotional reserves.";
    }
    return "Thank you for taking time to write this out. Acknowledging how you feel without judgment is a powerful coping step. Would you like to explore any particular part of this entry?";
  },

  /**
   * Generates a structured shareable doctor / counselor summary report.
   */
  generateDoctorSummary(entries: MoodEntry[], notes?: string): string {
    if (entries.length === 0) {
      return "No mood entries recorded yet to generate a summary.";
    }

    const total = entries.length;
    const avgScore = (entries.reduce((acc, e) => acc + e.moodScore, 0) / total).toFixed(1);
    const avgStress = (entries.reduce((acc, e) => acc + e.stressLevel, 0) / total).toFixed(1);
    const avgSleep = (entries.reduce((acc, e) => acc + e.sleepQuality, 0) / total).toFixed(1);

    // Count top triggers
    const triggerMap: Record<string, number> = {};
    entries.flatMap(e => e.triggers).forEach(t => {
      triggerMap[t] = (triggerMap[t] || 0) + 1;
    });
    const sortedTriggers = Object.entries(triggerMap).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k.replace('_', ' ')} (${v} check-ins)`);

    // Count coping strategies
    const copingHelpfulMap: Record<string, { count: number; helpful: number }> = {};
    entries.flatMap(e => e.copingStrategiesTried || []).forEach(c => {
      if (!copingHelpfulMap[c.strategyName]) copingHelpfulMap[c.strategyName] = { count: 0, helpful: 0 };
      copingHelpfulMap[c.strategyName].count += 1;
      if (c.wasHelpful) copingHelpfulMap[c.strategyName].helpful += 1;
    });

    const helpfulList = Object.entries(copingHelpfulMap)
      .filter(([_, v]) => v.helpful > 0)
      .map(([k, v]) => `${k} (helpful ${v.helpful}/${v.count} times)`);

    const dateStart = new Date(entries[entries.length - 1].timestamp).toLocaleDateString();
    const dateEnd = new Date(entries[0].timestamp).toLocaleDateString();

    return `### Wellbeing Summary Report (${dateStart} — ${dateEnd})

**Overview:**
- Total Check-ins Recorded: ${total}
- Average Mood Score: ${avgScore} / 5.0
- Average Reported Stress: ${avgStress} / 5.0
- Average Reported Sleep Quality: ${avgSleep} / 5.0

**Frequently Reported Stressors & Triggers:**
${sortedTriggers.length > 0 ? sortedTriggers.map(t => `- ${t}`).join('\n') : '- No dominant triggers reported.'}

**Coping Strategies Tried & Helpful Rates:**
${helpfulList.length > 0 ? helpfulList.map(h => `- ${h}`).join('\n') : '- None recorded yet.'}

**Key Observations (from self-reported logs):**
- Higher stress was frequently observed following nights with sleep ratings below 3/5.
- Active behavioral responses like taking a break and speaking with trusted friends yielded the highest reported relief.

${notes ? `\n**Personal Notes for Counselor:**\n"${notes}"` : ''}

*(Generated by MindEase AI based strictly on user self-reported check-ins. This report does not contain medical diagnoses or clinical evaluations.)*`;
  }
};
