import { MoodEntry, PatternInsight } from '../types';
import { StorageService } from './storageService';

export interface AnalyticsSummary {
  recentAverageMood: number; // 1-5
  overallAverageMood: number;
  averageStress: number;
  averageSleep: number;
  averageEnergy: number;
  moodStreakDays: number;
  totalEntries: number;
  dominantEmotions: { emotion: string; count: number; percentage: number }[];
  topTriggers: { trigger: string; count: number; percentage: number }[];
  handlingBehaviors: { behavior: string; count: number; category: string }[];
  copingEfficacy: { name: string; helpfulCount: number; totalCount: number; successRate: number }[];
  insights: PatternInsight[];
  experimentalForecast: {
    outlook: string;
    suggestion: string;
    confidence: 'moderate' | 'exploratory';
    basis: string;
  };
}

export const AnalyticsEngine = {
  /**
   * Calculates comprehensive analytics across all recorded mood entries.
   */
  calculateAnalytics(entries: MoodEntry[]): AnalyticsSummary {
    if (!entries || entries.length === 0) {
      return this.getEmptyAnalytics();
    }

    const dismissed = StorageService.getDismissedHypotheses();
    const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp);
    const total = sorted.length;

    // Averages
    const overallAvgMood = sorted.reduce((sum, e) => sum + e.moodScore, 0) / total;
    const recent7 = sorted.slice(0, 7);
    const recentAvgMood = recent7.reduce((sum, e) => sum + e.moodScore, 0) / recent7.length;
    const avgStress = sorted.reduce((sum, e) => sum + e.stressLevel, 0) / total;
    const avgSleep = sorted.reduce((sum, e) => sum + e.sleepQuality, 0) / total;
    const avgEnergy = sorted.reduce((sum, e) => sum + e.energyLevel, 0) / total;

    // Mood Streak
    const streak = this.calculateStreak(sorted);

    // Emotion counts
    const emotionMap: Record<string, number> = {};
    sorted.flatMap(e => e.emotions).forEach(em => {
      emotionMap[em] = (emotionMap[em] || 0) + 1;
    });
    const totalEmotionTags = Object.values(emotionMap).reduce((a, b) => a + b, 0) || 1;
    const dominantEmotions = Object.entries(emotionMap)
      .sort((a, b) => b[1] - a[1])
      .map(([emotion, count]) => ({
        emotion,
        count,
        percentage: Math.round((count / totalEmotionTags) * 100),
      }));

    // Trigger counts
    const triggerMap: Record<string, number> = {};
    sorted.flatMap(e => e.triggers).forEach(tr => {
      triggerMap[tr] = (triggerMap[tr] || 0) + 1;
    });
    const totalTriggers = Object.values(triggerMap).reduce((a, b) => a + b, 0) || 1;
    const topTriggers = Object.entries(triggerMap)
      .sort((a, b) => b[1] - a[1])
      .map(([trigger, count]) => ({
        trigger,
        count,
        percentage: Math.round((count / totalTriggers) * 100),
      }));

    // Handling response counts
    const handlingMap: Record<string, number> = {};
    sorted.flatMap(e => e.handlingResponses).forEach(hr => {
      handlingMap[hr] = (handlingMap[hr] || 0) + 1;
    });
    const handlingBehaviors = Object.entries(handlingMap)
      .sort((a, b) => b[1] - a[1])
      .map(([behavior, count]) => ({
        behavior,
        count,
        category: this.getHandlingCategory(behavior),
      }));

    // Coping strategy efficacy
    const copingMap: Record<string, { helpful: number; total: number }> = {};
    sorted.flatMap(e => e.copingStrategiesTried || []).forEach(strat => {
      if (!copingMap[strat.strategyName]) copingMap[strat.strategyName] = { helpful: 0, total: 0 };
      copingMap[strat.strategyName].total += 1;
      if (strat.wasHelpful) copingMap[strat.strategyName].helpful += 1;
    });
    const copingEfficacy = Object.entries(copingMap)
      .map(([name, stat]) => ({
        name,
        helpfulCount: stat.helpful,
        totalCount: stat.total,
        successRate: Math.round((stat.helpful / stat.total) * 100),
      }))
      .sort((a, b) => b.successRate - a.successRate);

    // Generate transparent pattern insights
    const insights = this.generatePatternInsights(sorted, dismissed);

    // Generate experimental forecast
    const experimentalForecast = this.generateExperimentalForecast(sorted);

    return {
      recentAverageMood: Math.round(recentAvgMood * 10) / 10,
      overallAverageMood: Math.round(overallAvgMood * 10) / 10,
      averageStress: Math.round(avgStress * 10) / 10,
      averageSleep: Math.round(avgSleep * 10) / 10,
      averageEnergy: Math.round(avgEnergy * 10) / 10,
      moodStreakDays: streak,
      totalEntries: total,
      dominantEmotions,
      topTriggers,
      handlingBehaviors,
      copingEfficacy,
      insights,
      experimentalForecast,
    };
  },

  /**
   * Generates transparent, hypothesis-based pattern insights from user reporting.
   */
  generatePatternInsights(entries: MoodEntry[], dismissed: string[]): PatternInsight[] {
    const insights: PatternInsight[] = [];

    // 1. Sleep vs Stress Correlation Insight
    const poorSleepEntries = entries.filter(e => e.sleepQuality <= 2);
    const poorSleepHighStress = poorSleepEntries.filter(e => e.stressLevel >= 4);
    if (!dismissed.includes('sleep_stress') && poorSleepEntries.length >= 2 && poorSleepHighStress.length >= 1) {
      insights.push({
        id: 'sleep_stress',
        title: 'Sleep Quality & Stress Observation',
        observation: `On ${poorSleepHighStress.length} out of ${poorSleepEntries.length} days with lower sleep quality (<= 2/5), you also reported elevated stress levels.`,
        hypothesis: 'Restful sleep appears to be a protective factor for your daily stress tolerance.',
        basedOn: 'Your recent check-in correlations between sleep quality and stress ratings.',
        confidence: 'high',
        suggestedAction: 'Explore an evening wind-down routine or 4-7-8 relaxing breath before sleep.',
        suggestedActionType: 'breathing',
      });
    }

    // 2. Academic / Work Pressure Trigger
    const academicEntries = entries.filter(e => e.triggers.includes('academic'));
    if (!dismissed.includes('academic_pressure') && academicEntries.length >= 2) {
      insights.push({
        id: 'academic_pressure',
        title: 'Academic Focus & Pacing',
        observation: `You noted academic pressure across ${academicEntries.length} recent check-ins.`,
        hypothesis: 'Deadlines and study demands frequently coincide with feelings of being overwhelmed.',
        basedOn: 'Your self-reported trigger tags across recent check-ins.',
        confidence: 'medium',
        suggestedAction: 'Try breaking tasks into 20-minute chunks with a 5-minute Box Breathing pause.',
        suggestedActionType: 'routine',
      });
    }

    // 3. Behavioral Response: Taking Breaks & Walking
    const walkOrBreakEntries = entries.filter(e => e.handlingResponses.includes('walk') || e.handlingResponses.includes('break'));
    if (!dismissed.includes('break_relief') && walkOrBreakEntries.length >= 3) {
      insights.push({
        id: 'break_relief',
        title: 'Movement & Pausing as Coping Strengths',
        observation: `You chose "Take a break" or "Exercise / walk" on ${walkOrBreakEntries.length} check-ins.`,
        hypothesis: 'Stepping away for physical movement or a pause consistently correlates with higher mood recovery.',
        basedOn: 'Reported coping choices and mood progression.',
        confidence: 'high',
        suggestedAction: 'Schedule an intentional 10-minute fresh air pause during busy days.',
        suggestedActionType: 'routine',
      });
    }

    // 4. Solitude vs Connection Balance
    const isolateEntries = entries.filter(e => e.handlingResponses.includes('isolate') || e.handlingResponses.includes('bottle'));
    if (!dismissed.includes('solitude_balance') && isolateEntries.length >= 2) {
      insights.push({
        id: 'solitude_balance',
        title: 'Space & Connection Reflection',
        observation: `When feeling overwhelmed, you frequently prefer alone time or keeping feelings inside (${isolateEntries.length} entries).`,
        hypothesis: 'While taking space helps decompress, talking to a trusted friend also provided relief when tried.',
        basedOn: 'Your handling responses comparison.',
        confidence: 'medium',
        suggestedAction: 'Explore balancing quiet recharge time with a gentle check-in text to a friend.',
        suggestedActionType: 'support',
      });
    }

    return insights;
  },

  /**
   * Generates experimental wellbeing outlook with transparent disclaimers.
   */
  generateExperimentalForecast(entries: MoodEntry[]): {
    outlook: string;
    suggestion: string;
    confidence: 'moderate' | 'exploratory';
    basis: string;
  } {
    if (entries.length < 3) {
      return {
        outlook: 'Building baseline insights from your check-ins...',
        suggestion: 'Complete a few more daily check-ins to unlock personalized patterns.',
        confidence: 'exploratory',
        basis: 'Requires at least 3 check-ins.',
      };
    }

    const last3 = entries.slice(0, 3);
    const avgRecentStress = last3.reduce((s, e) => s + e.stressLevel, 0) / 3;
    const avgRecentSleep = last3.reduce((s, e) => s + e.sleepQuality, 0) / 3;

    if (avgRecentStress >= 3.5 || avgRecentSleep <= 2.5) {
      return {
        outlook: 'Based on your recent check-ins, you may want to pay gentle attention to stress and rest tomorrow.',
        suggestion: 'Consider protecting 15 minutes of quiet time or practicing a relaxing breathing exercise tonight.',
        confidence: 'moderate',
        basis: 'Observed lower sleep and elevated stress in your last 3 check-ins.',
      };
    }

    return {
      outlook: 'Your recent check-ins indicate a balanced energy rhythm.',
      suggestion: 'Maintain the grounding habits that helped you this week (such as taking short walks or connecting with friends).',
      confidence: 'moderate',
      basis: 'Observed steady mood and consistent rest in recent entries.',
    };
  },

  calculateStreak(sortedEntries: MoodEntry[]): number {
    if (sortedEntries.length === 0) return 0;
    let streak = 1;
    const dayMs = 24 * 60 * 60 * 1000;
    
    // Check consecutive calendar days
    for (let i = 0; i < sortedEntries.length - 1; i++) {
      const current = new Date(sortedEntries[i].date).setHours(0, 0, 0, 0);
      const prev = new Date(sortedEntries[i + 1].date).setHours(0, 0, 0, 0);
      const diffDays = Math.round((current - prev) / dayMs);

      if (diffDays === 1) {
        streak++;
      } else if (diffDays === 0) {
        // same day entry, continue
      } else {
        break;
      }
    }
    return streak;
  },

  getHandlingCategory(behavior: string): string {
    const map: Record<string, string> = {
      talk: 'Connection',
      break: 'Rest & Space',
      music: 'Sensory',
      sleep: 'Rest',
      walk: 'Movement',
      journal: 'Expression',
      distract: 'Diversion',
      isolate: 'Solitude',
      overthink: 'Internalizing',
      bottle: 'Internalizing',
      ask_help: 'Support',
    };
    return map[behavior] || 'Other';
  },

  getEmptyAnalytics(): AnalyticsSummary {
    return {
      recentAverageMood: 0,
      overallAverageMood: 0,
      averageStress: 0,
      averageSleep: 0,
      averageEnergy: 0,
      moodStreakDays: 0,
      totalEntries: 0,
      dominantEmotions: [],
      topTriggers: [],
      handlingBehaviors: [],
      copingEfficacy: [],
      insights: [],
      experimentalForecast: {
        outlook: 'No check-ins yet.',
        suggestion: 'Take your first daily check-in to see your personal wellbeing patterns.',
        confidence: 'exploratory',
        basis: 'No data',
      }
    };
  }
};
