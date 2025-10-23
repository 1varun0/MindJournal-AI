"use client";

import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Lightbulb, TrendingUp, AlertCircle, Sparkles, Calendar, Brain, Heart, ChevronDown } from "lucide-react";
import type { Entry } from "@/API";
import { useState } from "react";

interface Insight {
  type: "positive" | "neutral" | "attention";
  title: string;
  description: string;
  icon: React.ReactNode;
  source?: "ai" | "system";
}

interface InsightsCardProps {
  entries: Entry[];
}

const generateInsights = (entries: Entry[]): Insight[] => {
  const dynamicInsights: Insight[] = [];

  // Insight 1: Show latest AI insight from Bedrock (aiInsight field)
  const entriesWithAI = entries.filter(entry => 
    entry.aiInsight && entry.aiInsight.trim() !== ""
  );

  if (entriesWithAI.length > 0) {
    const latestEntry = [...entriesWithAI].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    dynamicInsights.push({
      type: "neutral",
      title: "AI Reflection",
      description: latestEntry.aiInsight!,
      icon: <Brain className="h-4 w-4" />,
      source: "ai"
    });
  }

  // Insight 2: Mood patterns from AI analysis
  const entriesWithMood = entries.filter(entry => 
    entry.moodScore !== null && entry.moodScore !== undefined
  );

  if (entriesWithMood.length >= 3) {
    const sortedEntries = [...entriesWithMood].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const recentMoods = sortedEntries.slice(0, 3).map(e => e.moodScore!);
    const recentAvg = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;

    if (recentAvg >= 8) {
      dynamicInsights.push({
        type: "positive",
        title: "Consistently Positive",
        description: "Your recent entries show strong positive moods. Reflect on what's contributing to this wellbeing.",
        icon: <TrendingUp className="h-4 w-4" />,
        source: "system"
      });
    } else if (recentAvg <= 4) {
      dynamicInsights.push({
        type: "attention",
        title: "Support Pattern",
        description: "You've been experiencing lower moods recently. Remember that fluctuations are normal and support is available.",
        icon: <Heart className="h-4 w-4" />,
        source: "system"
      });
    }

    // Trend analysis
    if (entriesWithMood.length >= 6) {
      const recentMoods = sortedEntries.slice(0, 3).map(e => e.moodScore!);
      const previousMoods = sortedEntries.slice(3, 6).map(e => e.moodScore!);
      
      const recentAvg = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
      const previousAvg = previousMoods.reduce((a, b) => a + b, 0) / previousMoods.length;

      if (recentAvg > previousAvg + 1) {
        dynamicInsights.push({
          type: "positive",
          title: "Mood Uplift",
          description: "Your mood has shown significant improvement recently. Notice what positive changes you've made.",
          icon: <TrendingUp className="h-4 w-4" />,
          source: "system"
        });
      } else if (recentAvg < previousAvg - 1) {
        dynamicInsights.push({
          type: "attention",
          title: "Mood Shift",
          description: "Your mood has decreased recently. Consider what factors might be influencing this change.",
          icon: <AlertCircle className="h-4 w-4" />,
          source: "system"
        });
      }
    }
  }

  // Insight 3: Anxiety patterns from AI analysis
  const entriesWithAnxiety = entries.filter(entry => 
    entry.anxietyScore !== null && entry.anxietyScore !== undefined
  );

  if (entriesWithAnxiety.length > 0) {
    const latestEntry = [...entriesWithAnxiety].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    if (latestEntry.anxietyScore! >= 8) {
      dynamicInsights.push({
        type: "attention",
        title: "High Anxiety Alert",
        description: "Your latest entry shows elevated anxiety. Practice mindfulness or deep breathing to help manage it.",
        icon: <AlertCircle className="h-4 w-4" />,
        source: "system"
      });
    } else if (latestEntry.anxietyScore! <= 3) {
      dynamicInsights.push({
        type: "positive",
        title: "Calm State",
        description: "You're reporting low anxiety levels. This is a great opportunity to build resilience.",
        icon: <Sparkles className="h-4 w-4" />,
        source: "system"
      });
    }
  }

  // Insight 4: Emotion patterns from AI analysis
  const entriesWithEmotions = entries.filter(entry => 
    entry.detectedEmotions && 
    Array.isArray(entry.detectedEmotions) && 
    entry.detectedEmotions.length > 0
  );

  if (entriesWithEmotions.length >= 3) {
    const emotionCounts: Record<string, number> = {};
    
    entriesWithEmotions.forEach(entry => {
      entry.detectedEmotions!.forEach((emotion: string | null) => {
        if (emotion && emotion.trim()) {
          const cleanEmotion = emotion.trim().toLowerCase();
          emotionCounts[cleanEmotion] = (emotionCounts[cleanEmotion] || 0) + 1;
        }
      });
    });

    const mostFrequent = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);

    if (mostFrequent.length > 0 && mostFrequent[0][1] >= entriesWithEmotions.length * 0.5) {
      dynamicInsights.push({
        type: "neutral",
        title: "Emotional Pattern",
        description: `"${mostFrequent[0][0]}" appears frequently. Understanding this emotion can provide valuable self-awareness.`,
        icon: <Lightbulb className="h-4 w-4" />,
        source: "system"
      });
    }
  }

  // Insight 5: Check-in reminder
  if (entries.length > 0) {
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    const lastEntry = sortedEntries[0];
    const lastEntryDate = new Date(lastEntry.createdAt);
    const today = new Date();
    const timeDiff = today.getTime() - lastEntryDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (daysDiff > 2) {
      dynamicInsights.push({
        type: "attention",
        title: "Check-in Reminder",
        description: `It's been ${daysDiff} days since your last entry. Regular journaling helps track progress.`,
        icon: <Calendar className="h-4 w-4" />,
        source: "system"
      });
    }
  }

  // Insight 6: Welcome for new users
  if (entries.length === 0) {
    dynamicInsights.push({
      type: "neutral",
      title: "Welcome!",
      description: "Create your first journal entry to receive personalized AI insights and reflections.",
      icon: <Sparkles className="h-4 w-4" />,
      source: "system"
    });
  }

  // Insight 7: Processing notice
  if (entries.length > 0 && entriesWithAI.length === 0) {
    dynamicInsights.push({
      type: "neutral",
      title: "Processing Insights",
      description: "Your entries are being analyzed. AI-powered insights will appear here shortly.",
      icon: <Sparkles className="h-4 w-4" />,
      source: "system"
    });
  }

  // Return all insights (no longer limiting to 3)
  return dynamicInsights.sort((a, b) => {
    // AI insights first, then system insights
    if (a.source === "ai" && b.source !== "ai") return -1;
    if (a.source !== "ai" && b.source === "ai") return 1;
    return 0;
  });
};

export function InsightsCard({ entries = [] }: InsightsCardProps) {
  const insights = generateInsights(entries);
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeStyles = (type: string, source?: string) => {
    const baseStyles = "rounded-lg border p-4 transition-all duration-300 hover:shadow-md";
    
    if (source === "ai") {
      switch (type) {
        case "positive":
          return `${baseStyles} bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800`;
        case "attention":
          return `${baseStyles} bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-800`;
        default:
          return `${baseStyles} bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 dark:from-blue-950/20 dark:to-purple-950/20 dark:border-blue-800`;
      }
    } else {
      switch (type) {
        case "positive":
          return `${baseStyles} bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800`;
        case "attention":
          return `${baseStyles} bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800`;
        default:
          return `${baseStyles} bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800`;
      }
    }
  };

  const getIconStyles = (type: string, source?: string) => {
    if (source === "ai") {
      switch (type) {
        case "positive":
          return "bg-gradient-to-br from-green-500 to-emerald-500 text-white";
        case "attention":
          return "bg-gradient-to-br from-amber-500 to-orange-500 text-white";
        default:
          return "bg-gradient-to-br from-blue-500 to-purple-500 text-white";
      }
    } else {
      switch (type) {
        case "positive":
          return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
        case "attention":
          return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
        default:
          return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
      }
    }
  };

  // Show first 3 insights when collapsed, all when expanded
  const visibleInsights = isExpanded ? insights : insights.slice(0, 3);
  const hasMoreInsights = insights.length > 3;

  return (
    <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Insights
          <Badge variant="outline" className="text-xs ml-2">
            {insights.length} insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Create your first entry to receive AI-powered insights
            </p>
          </div>
        ) : (
          <>
            {/* Scrollable insights container */}
            <div 
              className={`
                space-y-4 
                ${isExpanded 
                  ? 'max-h-96 overflow-y-auto' 
                  : 'max-h-80 overflow-hidden'
                }
                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent 
                hover:scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500
                pr-2 -mr-2
              `}
            >
              {visibleInsights.map((insight, index) => (
                <div 
                  key={index} 
                  className={`flex gap-3 ${getTypeStyles(insight.type, insight.source)}`}
                >
                  <div className={`rounded-full p-2 flex-shrink-0 ${getIconStyles(insight.type, insight.source)}`}>
                    {insight.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <div className="flex gap-1">
                        <Badge 
                          variant={
                            insight.type === "positive" ? "default" 
                            : insight.type === "attention" ? "secondary" 
                            : "outline"
                          } 
                          className="text-xs capitalize"
                        >
                          {insight.type}
                        </Badge>
                        {insight.source === "ai" && (
                          <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            AI
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Show more/less toggle */}
            {hasMoreInsights && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                >
                  <span>{isExpanded ? 'Show less' : `Show ${insights.length - 3} more insights`}</span>
                  <ChevronDown 
                    className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} group-hover:scale-110`} 
                  />
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
