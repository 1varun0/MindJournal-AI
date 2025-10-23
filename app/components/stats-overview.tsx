'use client';
import { Card } from "../components/ui/card";
import type { Entry } from "@/API";

interface StatsOverviewProps {
  entries: Entry[];
}

// Helper function to calculate day streak
const calculateDayStreak = (entries: Entry[]): number => {
  if (entries.length === 0) return 0;
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if there's an entry today
  const hasEntryToday = sortedEntries.some(entry => {
    const entryDate = new Date(entry.createdAt);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
  
  if (!hasEntryToday) return 0;
  
  streak = 1;
  let currentDate = new Date(today);
  
  while (true) {
    currentDate.setDate(currentDate.getDate() - 1);
    const hasEntry = sortedEntries.some(entry => {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === currentDate.getTime();
    });
    
    if (hasEntry) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Calculate insights count (entries with AI insights)
const calculateInsightsCount = (entries: Entry[]): number => {
  return entries.filter(entry => 
    entry.aiInsight && entry.aiInsight.trim() !== ""
  ).length;
};

export function StatsOverview({ entries = [] }: StatsOverviewProps) {
  const totalEntries = entries.length;
  const dayStreak = calculateDayStreak(entries);
  
  // Calculate average mood as a number
  const validMoodEntries = entries.filter(entry => 
    entry.moodScore !== null && entry.moodScore !== undefined
  );
  const avgMoodValue = validMoodEntries.length > 0 
    ? (validMoodEntries.reduce((sum, entry) => sum + (entry.moodScore || 0), 0) / validMoodEntries.length)
    : 0;

  // Convert to descriptive text
  const getMoodText = (value: number): string => {
    if (value === 0) return "N/A";
    if (value >= 8) return "Great";
    if (value >= 6) return "Good";
    if (value >= 4) return "Okay";
    if (value >= 2) return "Low";
    return "Very Low";
  };

  const avgMood = getMoodText(avgMoodValue);
  const insightsCount = calculateInsightsCount(entries);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalEntries}</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">Total Entries</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20 dark:border-emerald-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{dayStreak}</p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">Day Streak</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/20 dark:to-amber-800/20 dark:border-amber-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{avgMood}</p>
            <p className="text-sm text-amber-700 dark:text-amber-300">Avg Mood</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{insightsCount}</p>
            <p className="text-sm text-purple-700 dark:text-purple-300">AI Insights</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
