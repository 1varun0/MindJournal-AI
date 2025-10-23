"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Award, CheckCircle2, Circle, Calendar, Target, Zap, Star, Trophy, Heart, Crown, Sparkles, Rocket, TrendingUp } from "lucide-react";
import type { Entry } from "@/API";

interface MilestonesProps {
  entries: Entry[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  progress?: number;
  target: number;
  icon: React.ReactNode;
  date?: string;
  category: "consistency" | "growth" | "insights" | "mastery";
  level: "beginner" | "intermediate" | "advanced" | "expert";
  nextLevel?: Milestone; // Next milestone in this category
}

export function Milestones({ entries }: MilestonesProps) {
  // Calculate all milestone levels
  const calculateAllMilestones = (): Milestone[] => {
    const totalEntries = entries.length;
    const entriesWithMood = entries.filter(entry => entry.moodScore !== null && entry.moodScore !== undefined);
    const entriesWithInsights = entries.filter(entry => entry.aiInsight && entry.aiInsight.trim() !== "");
    const entriesWithActions = entries.filter(entry => entry.location && entry.location.includes('\\n'));

    const currentStreak = calculateCurrentStreak();
    const weeklyConsistency = calculateWeeklyConsistency();
    const moodImprovement = calculateMoodImprovement();
    const longestStreak = calculateLongestStreak();

    return [
      // CONSISTENCY MILESTONES
      {
        id: "first-entry",
        title: "First Step",
        description: "Write your first journal entry",
        achieved: totalEntries >= 1,
        progress: Math.min(totalEntries, 1),
        target: 1,
        icon: <Zap className="h-4 w-4" />,
        category: "consistency",
        level: "beginner"
      },
      {
        id: "three-day-streak",
        title: "Consistency Starter",
        description: "Journal for 3 consecutive days",
        achieved: currentStreak >= 3,
        progress: Math.min(currentStreak, 3),
        target: 3,
        icon: <Calendar className="h-4 w-4" />,
        category: "consistency",
        level: "beginner"
      },
      {
        id: "seven-day-streak",
        title: "Weekly Warrior",
        description: "Maintain a 7-day journaling streak",
        achieved: currentStreak >= 7,
        progress: Math.min(currentStreak, 7),
        target: 7,
        icon: <Target className="h-4 w-4" />,
        category: "consistency",
        level: "intermediate"
      },
      {
        id: "thirty-day-streak",
        title: "Monthly Master",
        description: "Journal consistently for 30 days",
        achieved: longestStreak >= 30,
        progress: Math.min(longestStreak, 30),
        target: 30,
        icon: <Trophy className="h-4 w-4" />,
        category: "consistency",
        level: "advanced"
      },
      {
        id: "hundred-day-streak",
        title: "Century Club",
        description: "Reach 100 days of journaling",
        achieved: longestStreak >= 100,
        progress: Math.min(longestStreak, 100),
        target: 100,
        icon: <Crown className="h-4 w-4" />,
        category: "consistency",
        level: "expert"
      },

      // GROWTH MILESTONES
      {
        id: "ten-entries",
        title: "Dedicated Writer",
        description: "Reach 10 total journal entries",
        achieved: totalEntries >= 10,
        progress: Math.min(totalEntries, 10),
        target: 10,
        icon: <Star className="h-4 w-4" />,
        category: "growth",
        level: "beginner"
      },
      {
        id: "fifty-entries",
        title: "Reflection Pro",
        description: "Write 50 journal entries",
        achieved: totalEntries >= 50,
        progress: Math.min(totalEntries, 50),
        target: 50,
        icon: <Sparkles className="h-4 w-4" />,
        category: "growth",
        level: "intermediate"
      },
      {
        id: "hundred-entries",
        title: "Journaling Veteran",
        description: "Complete 100 journal entries",
        achieved: totalEntries >= 100,
        progress: Math.min(totalEntries, 100),
        target: 100,
        icon: <Award className="h-4 w-4" />,
        category: "growth",
        level: "advanced"
      },
      {
        id: "mood-tracker",
        title: "Mood Awareness",
        description: "Track mood in 5+ entries",
        achieved: entriesWithMood.length >= 5,
        progress: Math.min(entriesWithMood.length, 5),
        target: 5,
        icon: <Heart className="h-4 w-4" />,
        category: "growth",
        level: "beginner"
      },

      // INSIGHTS MILESTONES
      {
        id: "ai-insights",
        title: "Insight Seeker",
        description: "Receive 5+ AI insights",
        achieved: entriesWithInsights.length >= 5,
        progress: Math.min(entriesWithInsights.length, 5),
        target: 5,
        icon: <Star className="h-4 w-4" />,
        category: "insights",
        level: "beginner"
      },
      {
        id: "insight-master",
        title: "Wisdom Collector",
        description: "Get 25+ AI insights",
        achieved: entriesWithInsights.length >= 25,
        progress: Math.min(entriesWithInsights.length, 25),
        target: 25,
        icon: <Sparkles className="h-4 w-4" />,
        category: "insights",
        level: "intermediate"
      },

      // MASTERY MILESTONES
      {
        id: "action-taker",
        title: "Action Oriented",
        description: "Complete 3+ recommended actions",
        achieved: entriesWithActions.length >= 3,
        progress: Math.min(entriesWithActions.length, 3),
        target: 3,
        icon: <CheckCircle2 className="h-4 w-4" />,
        category: "mastery",
        level: "beginner"
      },
      {
        id: "cbt-practitioner",
        title: "CBT Practitioner",
        description: "Try 10+ different CBT exercises",
        achieved: entriesWithActions.length >= 10,
        progress: Math.min(entriesWithActions.length, 10),
        target: 10,
        icon: <Rocket className="h-4 w-4" />,
        category: "mastery",
        level: "intermediate"
      },
      {
        id: "mood-improver",
        title: "Positive Progress",
        description: "Show consistent mood improvement",
        achieved: moodImprovement,
        progress: moodImprovement ? 1 : 0,
        target: 1,
        icon: <TrendingUp className="h-4 w-4" />,
        category: "mastery",
        level: "intermediate"
      },
      {
        id: "weekly-consistency",
        title: "Habit Builder",
        description: "Journal 5+ days in a week",
        achieved: weeklyConsistency >= 5,
        progress: Math.min(weeklyConsistency, 5),
        target: 5,
        icon: <Calendar className="h-4 w-4" />,
        category: "mastery",
        level: "beginner"
      }
    ];
  };

  // Calculate current streak
  const calculateCurrentStreak = (): number => {
    if (entries.length === 0) return 0;

    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].createdAt);
      entryDate.setHours(0, 0, 0, 0);

      if (entryDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (i === 0 && entryDate.getTime() === currentDate.getTime() - 24 * 60 * 60 * 1000) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  // Calculate longest streak
  const calculateLongestStreak = (): number => {
    if (entries.length === 0) return 0;

    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedEntries.length; i++) {
      const currentDate = new Date(sortedEntries[i].createdAt);
      const prevDate = new Date(sortedEntries[i - 1].createdAt);
      
      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return longestStreak;
  };

  // Calculate weekly consistency
  const calculateWeeklyConsistency = (): number => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyEntries = entries.filter(entry => 
      new Date(entry.createdAt) >= oneWeekAgo
    );
    
    return new Set(
      weeklyEntries.map(entry => new Date(entry.createdAt).toDateString())
    ).size;
  };

  // Calculate mood improvement
  const calculateMoodImprovement = (): boolean => {
    if (entries.length < 6) return false;

    const recentEntries = entries
      .filter(entry => entry.moodScore !== null && entry.moodScore !== undefined)
      .slice(0, 3);

    const olderEntries = entries
      .filter(entry => entry.moodScore !== null && entry.moodScore !== undefined)
      .slice(-3);

    if (recentEntries.length < 3 || olderEntries.length < 3) return false;

    const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.moodScore!, 0) / recentEntries.length;
    const olderAvg = olderEntries.reduce((sum, entry) => sum + entry.moodScore!, 0) / olderEntries.length;

    return recentAvg > olderAvg + 0.5;
  };

  const allMilestones = calculateAllMilestones();
  const achievedMilestones = allMilestones.filter(m => m.achieved);
  const unachievedMilestones = allMilestones.filter(m => !m.achieved);
  
  // Show 2-3 achieved and 3-4 next milestones
  const displayMilestones = [
    ...achievedMilestones.slice(-3), // Show recent achievements
    ...unachievedMilestones.slice(0, 4) // Show next targets
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "intermediate": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      case "advanced": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
      case "expert": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Achievement Journey</CardTitle>
              <p className="text-sm text-muted-foreground">
                {achievedMilestones.length}/{allMilestones.length} milestones unlocked
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            Level {Math.floor(achievedMilestones.length / 5) + 1}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-lg p-3 border border-amber-200/50">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-medium">Your Progress</span>
            <span className="text-amber-700 dark:text-amber-300">
              {Math.round((achievedMilestones.length / allMilestones.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-2 dark:bg-amber-700">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(achievedMilestones.length / allMilestones.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Milestones List */}
        {displayMilestones.map((milestone) => (
          <div key={milestone.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className={`p-2 rounded-full ${
              milestone.achieved 
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-gray-100 text-gray-400 dark:bg-gray-700/50 dark:text-gray-500"
            }`}>
              {milestone.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-sm font-medium ${
                  milestone.achieved 
                    ? "text-gray-900 dark:text-gray-100" 
                    : "text-gray-600 dark:text-gray-400"
                }`}>
                  {milestone.title}
                </p>
                <Badge variant="outline" className={`text-xs ${getLevelColor(milestone.level)}`}>
                  {milestone.level}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {milestone.description}
              </p>
              
              {/* Progress bar for unachieved milestones */}
              {!milestone.achieved && milestone.progress !== undefined && (
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700">
                  <div 
                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${(milestone.progress / milestone.target) * 100}%` }}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {milestone.achieved ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  {milestone.date && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                      ✓
                    </Badge>
                  )}
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                    <Circle className="h-3 w-3 text-gray-300" />
                  </div>
                  {milestone.progress !== undefined && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {milestone.progress}/{milestone.target}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {/* Encouragement Message */}
        {achievedMilestones.length > 0 && (
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              {achievedMilestones.length >= 10 
                ? "Amazing progress! You're becoming a journaling master! 🎉"
                : achievedMilestones.length >= 5
                ? "Great work! Keep building your wellness habits! 💪"
                : "You're on your way! Every entry counts! 🌟"
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}