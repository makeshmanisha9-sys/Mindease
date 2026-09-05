import { EmotionTag, HandlingResponse, TriggerOption, ConversationMode } from '../types';

export const EMOTIONS_LIST: EmotionTag[] = [
  // Low / Negative
  { id: 'sad', label: 'Sad', category: 'negative', emoji: '😢' },
  { id: 'anxious', label: 'Anxious', category: 'negative', emoji: '😰' },
  { id: 'overwhelmed', label: 'Overwhelmed', category: 'negative', emoji: '🤯' },
  { id: 'irritated', label: 'Irritated', category: 'negative', emoji: '😤' },
  { id: 'lonely', label: 'Lonely', category: 'negative', emoji: '🥺' },
  { id: 'exhausted', label: 'Exhausted', category: 'negative', emoji: '🥱' },
  { id: 'hopeless', label: 'Discouraged', category: 'negative', emoji: '😔' },
  { id: 'guilty', label: 'Guilty', category: 'negative', emoji: '😣' },
  { id: 'nervous', label: 'Nervous', category: 'negative', emoji: '😬' },
  
  // Neutral
  { id: 'calm', label: 'Calm', category: 'neutral', emoji: '😌' },
  { id: 'thoughtful', label: 'Thoughtful', category: 'neutral', emoji: '🤔' },
  { id: 'content', label: 'Content', category: 'neutral', emoji: '🙂' },
  { id: 'distracted', label: 'Distracted', category: 'neutral', emoji: '😶' },
  { id: 'numb', label: 'Uncertain', category: 'neutral', emoji: '😐' },

  // Positive
  { id: 'happy', label: 'Happy', category: 'positive', emoji: '😊' },
  { id: 'grateful', label: 'Grateful', category: 'positive', emoji: '🙏' },
  { id: 'hopeful', label: 'Hopeful', category: 'positive', emoji: '✨' },
  { id: 'excited', label: 'Excited', category: 'positive', emoji: '🤩' },
  { id: 'peaceful', label: 'Peaceful', category: 'positive', emoji: '🌿' },
  { id: 'proud', label: 'Proud', category: 'positive', emoji: '🌟' },
  { id: 'inspired', label: 'Inspired', category: 'positive', emoji: '💡' },
];

export const HANDLING_RESPONSES: HandlingResponse[] = [
  { id: 'talk', label: 'Talk to someone', category: 'social', description: 'Reaching out to a friend, family member, or partner' },
  { id: 'break', label: 'Take a break', category: 'solitude', description: 'Stepping back to breathe and pause' },
  { id: 'music', label: 'Listen to music', category: 'distraction', description: 'Using soothing or favorite tunes to shift headspace' },
  { id: 'sleep', label: 'Sleep or rest', category: 'rest', description: 'Taking a nap or going to bed early' },
  { id: 'walk', label: 'Exercise or walk', category: 'action', description: 'Moving your body outside or stretching' },
  { id: 'journal', label: 'Journal', category: 'expression', description: 'Writing down what is happening and feelings' },
  { id: 'distract', label: 'Distract yourself', category: 'distraction', description: 'Watching a show, playing a game, or browsing' },
  { id: 'isolate', label: 'Avoid people / Be alone', category: 'solitude', description: 'Taking personal space to decompress' },
  { id: 'overthink', label: 'Overthink & ruminate', category: 'internalization', description: 'Replaying events or worrying in thoughts' },
  { id: 'bottle', label: 'Keep feelings inside', category: 'internalization', description: 'Trying to push emotions away or hold them in' },
  { id: 'ask_help', label: 'Ask for support', category: 'social', description: 'Asking a professional, mentor, or loved one for guidance' },
];

export const TRIGGER_OPTIONS: TriggerOption[] = [
  { id: 'academic', label: 'Academic / Studies pressure', category: 'academic' },
  { id: 'work', label: 'Work & career stress', category: 'work' },
  { id: 'relationship', label: 'Relationship difficulties', category: 'relationship' },
  { id: 'sleep_deprived', label: 'Lack of sleep / Fatigue', category: 'health' },
  { id: 'social', label: 'Social situations & expectations', category: 'social' },
  { id: 'family', label: 'Family problems or dynamics', category: 'relationship' },
  { id: 'financial', label: 'Financial stress', category: 'financial' },
  { id: 'loneliness', label: 'Feeling lonely or isolated', category: 'social' },
  { id: 'life_change', label: 'Major life changes / Uncertainty', category: 'life_change' },
  { id: 'health', label: 'Physical health / pain', category: 'health' },
  { id: 'overstimulation', label: 'Sensory or digital overload', category: 'health' },
];

export const CONVERSATION_MODES: { id: ConversationMode; label: string; icon: string; description: string }[] = [
  {
    id: 'listen',
    label: 'Listen to me',
    icon: 'Ear',
    description: 'A calm, attentive presence without unsolicited advice.',
  },
  {
    id: 'understand',
    label: 'Help me understand my feelings',
    icon: 'Sparkles',
    description: 'Explore what you are experiencing and why.',
  },
  {
    id: 'handle',
    label: 'Help me handle my mood',
    icon: 'Shield',
    description: 'Reflect on how you react and find healthy space.',
  },
  {
    id: 'suggest',
    label: 'Suggest something that might help',
    icon: 'HeartHandshake',
    description: 'Gentle, actionable coping micro-steps.',
  },
  {
    id: 'routine',
    label: 'Help me build a routine',
    icon: 'Sun',
    description: 'Small, manageable wellbeing habits.',
  },
  {
    id: 'prepare_talk',
    label: 'Prepare to talk to someone',
    icon: 'MessageCircle',
    description: 'Script and organize thoughts for a loved one or counselor.',
  },
];

export const CRISIS_HOTLINES = [
  {
    region: 'United States & Canada',
    name: '988 Suicide & Crisis Lifeline',
    number: '988',
    callLink: 'tel:988',
    description: 'Free, confidential support available 24/7 by call or text.',
  },
  {
    region: 'United States & Canada',
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    callLink: 'sms:741741&body=HOME',
    description: 'Free, 24/7 crisis support via SMS.',
  },
  {
    region: 'United Kingdom',
    name: 'NHS Mental Health / Samaritans',
    number: '111 (NHS) or 116 123 (Samaritans)',
    callLink: 'tel:116123',
    description: 'Immediate advice from NHS 111 or confidential talk on 116 123.',
  },
  {
    region: 'India',
    name: 'Tele-MANAS & KIRAN Helpline',
    number: '14416 / 1800-599-0019',
    callLink: 'tel:14416',
    description: '24/7 toll-free mental health helpline by Ministry of Health.',
  },
  {
    region: 'Australia',
    name: 'Lifeline Australia',
    number: '13 11 14',
    callLink: 'tel:131114',
    description: '24/7 crisis support and suicide prevention services.',
  },
  {
    region: 'International',
    name: 'Befrienders Worldwide / IASP',
    number: 'Find local helpline online',
    callLink: 'https://www.befrienders.org/',
    isExternal: true,
    description: 'Global directory of emotional support hotlines worldwide.',
  },
];

export const COPING_ACTIVITIES_DIRECTORY = [
  {
    id: 'box_breathing',
    name: 'Box Breathing (4-4-4-4)',
    category: 'breathing',
    durationMinutes: 3,
    description: 'Inhale 4s, Hold 4s, Exhale 4s, Hold 4s. Used to calm the nervous system quickly.',
  },
  {
    id: 'relax_breathing',
    name: '4-7-8 Relaxing Breath',
    category: 'breathing',
    durationMinutes: 4,
    description: 'Inhale 4s, Hold 7s, Exhale 8s. Helps reduce anxiety and settle down for sleep.',
  },
  {
    id: 'grounding_54321',
    name: '5-4-3-2-1 Sensory Grounding',
    category: 'grounding',
    durationMinutes: 5,
    description: '5 see, 4 feel, 3 hear, 2 smell, 1 taste. Anchors your mind into the present moment.',
  },
  {
    id: 'worry_jar',
    name: 'Thought Defusion & Worry Jar',
    category: 'creative',
    durationMinutes: 5,
    description: 'Write down what troubles you, place it in the jar, and practice letting it rest.',
  },
  {
    id: 'short_walk',
    name: 'Gentle 10-Minute Walk',
    category: 'movement',
    durationMinutes: 10,
    description: 'Step outside or around the room with no agenda, feeling the rhythm of steps.',
  },
  {
    id: 'reach_out',
    name: 'Connect with a Trusted Person',
    category: 'social',
    durationMinutes: 10,
    description: 'Send a quick text or voice note to a friend: “Thinking of you, having a quiet day.”',
  },
  {
    id: 'gratitude_note',
    name: '3 Small Comforts Gratitude',
    category: 'creative',
    durationMinutes: 3,
    description: 'Name 3 simple physical comforts around you right now (warm cup, soft blanket, quiet room).',
  }
];
