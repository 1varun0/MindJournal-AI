"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, Brain, Sparkles, Heart } from "lucide-react";
import type { Entry } from "@/API";

interface EmotionalPatternsCardProps {
  entries: Entry[];
}

export function EmotionalPatternsCard({ entries }: EmotionalPatternsCardProps) {
  // Filter out entries without mood scores
  const validEntries = entries.filter(entry => 
    entry.moodScore !== null && 
    entry.moodScore !== undefined
  );

  // Calculate weekly average (last 7 entries)
  const weeklyEntries = validEntries.slice(0, 7);
  const weeklyAverage = weeklyEntries.length > 0 
    ? (weeklyEntries.reduce((sum, entry) => sum + entry.moodScore!, 0) / weeklyEntries.length).toFixed(1)
    : "0.0";

  // Calculate trend (compare last 3 entries vs previous 3)
  let trend: "up" | "down" | "stable" = "stable";
  let trendPercentage = "0";
  
  if (validEntries.length >= 6) {
    const recentAvg = validEntries.slice(0, 3).reduce((sum, entry) => sum + entry.moodScore!, 0) / 3;
    const previousAvg = validEntries.slice(3, 6).reduce((sum, entry) => sum + entry.moodScore!, 0) / 3;
    const difference = recentAvg - previousAvg;
    
    if (Math.abs(difference) > 0.3) {
      trend = difference > 0 ? "up" : "down";
      trendPercentage = Math.abs((difference / previousAvg) * 100).toFixed(1);
    }
  }

  // Find most common mood category
  const getMoodCategory = (score: number) => {
    if (score >= 8) return "Positive";
    if (score >= 6) return "Good";
    if (score >= 4) return "Neutral";
    if (score >= 2) return "Low";
    return "Very Low";
  };

  const moodCategories = validEntries.map(entry => getMoodCategory(entry.moodScore!));
  const mostCommonMood = moodCategories.length > 0 
    ? moodCategories.reduce((a, b) => 
        moodCategories.filter(v => v === a).length >= moodCategories.filter(v => v === b).length ? a : b
      )
    : "Neutral";

  // Enhanced emotion analysis
  const getCommonEmotions = (entries: Entry[]): { emotion: string; frequency: number }[] => {
    const emotionCount: Record<string, number> = {};
    
    entries.forEach(entry => {
      if (entry.detectedEmotions && Array.isArray(entry.detectedEmotions)) {
        entry.detectedEmotions.forEach((emotion: string | null) => {
          if (emotion && emotion.trim().toLowerCase() !== "neutral") {
            const cleanEmotion = emotion.trim().toLowerCase();
            emotionCount[cleanEmotion] = (emotionCount[cleanEmotion] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(emotionCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([emotion, frequency]) => ({ emotion, frequency }));
  };

  const commonEmotions = getCommonEmotions(validEntries);

  // Energy level analysis
  const getEnergyPattern = (entries: Entry[]): string => {
    const energyCount = {
      high: 0,
      medium: 0,
      low: 0
    };

    entries.forEach(entry => {
      const level = entry.energyLevel?.toLowerCase();
      if (level === 'high') energyCount.high++;
      else if (level === 'medium') energyCount.medium++;
      else if (level === 'low') energyCount.low++;
    });

    const total = entries.length;
    if (energyCount.high / total > 0.6) return "Mostly High";
    if (energyCount.low / total > 0.6) return "Mostly Low";
    if (energyCount.medium / total > 0.6) return "Mostly Medium";
    
    return "Mixed Energy Levels";
  };

  const energyPattern = validEntries.length > 0 ? getEnergyPattern(validEntries) : "No data";

  return (
    <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Emotional Patterns</CardTitle>
            <p className="text-sm text-muted-foreground">
              {validEntries.length > 0 
                ? `Based on ${validEntries.length} entries` 
                : "Start tracking to see patterns"
              }
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Combined Mood & Stress Average */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200/50">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-3">Weekly Averages</p>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Mood */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Mood</p>
              </div>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {weeklyAverage}/10
              </p>
              {trend !== "stable" && (
                <div className={`inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full text-xs ${
                  trend === "up" 
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30" 
                    : "bg-rose-100 text-rose-600 dark:bg-rose-900/30"
                }`}>
                  {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {trendPercentage}%
                </div>
              )}
            </div>

            {/* Stress */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                <p className="text-xs font-medium text-rose-600 dark:text-rose-400">Stress</p>
              </div>
              <p className="text-xl font-bold text-rose-900 dark:text-rose-100">
                {(() => {
                  const weeklyEntriesWithStress = weeklyEntries.filter(entry => 
                    entry.stressScore !== null && entry.stressScore !== undefined
                  );
                  return weeklyEntriesWithStress.length > 0 
                    ? (weeklyEntriesWithStress.reduce((sum, entry) => sum + entry.stressScore!, 0) / weeklyEntriesWithStress.length).toFixed(1)
                    : "N/A";
                })()}/10
              </p>
              {(() => {
                const weeklyEntriesWithStress = weeklyEntries.filter(entry => 
                  entry.stressScore !== null && entry.stressScore !== undefined
                );
                
                if (weeklyEntriesWithStress.length >= 6) {
                  const recentStress = weeklyEntriesWithStress.slice(0, 3).reduce((sum, entry) => sum + entry.stressScore!, 0) / 3;
                  const previousStress = weeklyEntriesWithStress.slice(3, 6).reduce((sum, entry) => sum + entry.stressScore!, 0) / 3;
                  const stressDifference = recentStress - previousStress;
                  
                  if (Math.abs(stressDifference) > 0.3) {
                    const stressTrend = stressDifference > 0 ? "up" : "down";
                    const stressPercentage = Math.abs((stressDifference / previousStress) * 100).toFixed(1);
                    
                    return (
                      <div className={`inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-full text-xs ${
                        stressTrend === "up" 
                          ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30" 
                          : "bg-green-100 text-green-600 dark:bg-green-900/30"
                      }`}>
                        {stressTrend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {stressPercentage}%
                      </div>
                    );
                  }
                }
                return null;
              })()}
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
            Based on {weeklyEntries.length} entries this week
          </div>
        </div>
        

        {/* Common Emotions */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl p-4 border border-amber-200/50">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-amber-600" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Frequent Emotions</p>
          </div>
          <div className="space-y-2">
            {commonEmotions.length > 0 ? (
              commonEmotions.map(({ emotion, frequency }) => (
                <div key={emotion} className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className="capitalize bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200"
                  >
                    {emotion}
                  </Badge>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    {frequency} time{frequency > 1 ? 's' : ''}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-amber-600/70 dark:text-amber-300/70 text-center py-2">
                No emotion data yet
              </p>
            )}
          </div>
        </div>

        {/* Energy Level Pattern */}
        {validEntries.length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-4 border border-green-200/50">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-green-600" />
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Energy Pattern</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700 dark:text-green-300">{energyPattern}</span>
              <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    energyPattern.includes("High") 
                      ? "bg-green-500 w-3/4" 
                      : energyPattern.includes("Low")
                      ? "bg-amber-500 w-1/4"
                      : "bg-blue-500 w-1/2"
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Mood Consistency */}
        {validEntries.length >= 5 && (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-xl p-4 border border-indigo-200/50">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-indigo-600" />
              <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Mood Consistency</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-indigo-600 dark:text-indigo-400">
                <span>Fluctuating</span>
                <span>Stable</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.max(30, 100 - (validEntries.length * 2))}%` 
                  }}
                />
              </div>
              <p className="text-xs text-indigo-600/70 dark:text-indigo-300/70 text-center">
                {validEntries.length >= 10 ? "Good consistency" : "Building patterns"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
