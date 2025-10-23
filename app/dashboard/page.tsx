"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

import { AppHeader } from "../components/app-header";
import { MoodChart } from "../components/mood-chart";
import { InsightsCard } from "../components/insights-card";
import { Navigation } from "../components/navigation";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Calendar, Flame, BookOpen, Smile, TrendingUp, TrendingDown } from "lucide-react";
import { listEntries } from "../../src/graphql/queries";
import type { Entry } from "../../src/API";
import { WelcomeCard } from "./welcome";
import { StressChart } from "../components/stress-chart";
import { AnxietyChart } from "../components/anxiety-chart";

const client = generateClient();

// --- Utility Functions ---
const calculateAvgMood = (entries: Entry[]): string => {
  const valid = entries.filter(e => typeof e.moodScore === "number" && e.moodScore !== null);
  if (valid.length === 0) return "N/A";
  const total = valid.reduce((sum, e) => sum + (e.moodScore ?? 0), 0);
  return (total / valid.length).toFixed(1);
};

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

const getMoodTrend = (entries: Entry[]): { direction: "up" | "down" | "stable"; value: string } => {
  // Get valid mood entries sorted by date (newest first)
  const validEntries = entries
    .filter(e => e.moodScore !== null && e.moodScore !== undefined)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (validEntries.length < 2) return { direction: "stable", value: "0" };
  
  // Compare the two most recent entries
  const currentMood = validEntries[0].moodScore!;
  const previousMood = validEntries[1].moodScore!;
  
  const difference = currentMood - previousMood;
  
  if (Math.abs(difference) < 0.5) {
    return { direction: "stable", value: "0" };
  }
  
  const percentage = ((difference / previousMood) * 100).toFixed(1);
  
  return {
    direction: difference > 0 ? "up" : "down",
    value: Math.abs(Number(percentage)).toString()
  };
};

// --- Component ---
export default function DashboardPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "year" | "all">("month");
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndEntries = async () => {
      try {
        setIsLoading(true);

        // Check for valid Amplify session
        const session = await fetchAuthSession();
        console.log('Auth session:', session);
        
        if (!session.tokens?.idToken) {
          console.warn("No valid session → redirecting to login");
          router.push("/login");
          return;
        }

        // Get current user
        const currentUser = await getCurrentUser();
        console.log('Current user:', currentUser);

        // Fetch entries with better error handling
        console.log('Fetching entries...');
        const { data, errors } = await client.graphql({ 
          query: listEntries 
        });
        
        console.log('GraphQL response:', { data, errors });

        if (errors) {
          console.error('GraphQL errors:', errors);
          throw new Error(`GraphQL Error: ${errors[0].message}`);
        }

        if (!data?.listEntries?.items) {
          console.warn('No items in response:', data);
          setEntries([]);
          return;
        }

        const sorted = (data.listEntries.items as Entry[]).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        console.log('Sorted entries:', sorted);
        setEntries(sorted);

      } catch (error: any) {
        console.error("Detailed Dashboard fetch error:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
          fullError: error
        });

        // Handle auth errors
        const authErrors = [
          "NotAuthorizedException",
          "UserNotFoundException", 
          "InvalidSignatureException",
          "No current user"
        ];
        
        if (authErrors.some(authError => 
          error.name?.includes(authError) || error.message?.includes(authError)
        )) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserAndEntries();
  }, [router]);

  // --- Timeframe Filtering ---
  const now = new Date();
  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.createdAt);
    switch (timeframe) {
      case "day": {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return entryDate >= today && entryDate < tomorrow;
      }
      case "week":
        return entryDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "month":
        return entryDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case "year":
        return entryDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      case "all":
      default:
        return true;
    }
  });

  const totalEntries = filteredEntries.length;
  const dayStreak = calculateDayStreak(entries); // Use all entries for streak calculation
  const avgMood = calculateAvgMood(filteredEntries);
  const moodTrend = getMoodTrend(entries);

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // --- Dashboard Content ---
  return (
    <div className="min-h-dvh bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-800 pb-20">
      <AppHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-8 space-y-6">
        <WelcomeCard entries={entries} />

        {/* --- Analytics Section --- */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/30 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {{
                      day: "Today's Summary",
                      week: "Weekly Analysis",
                      month: "Monthly Analysis",
                      year: "Yearly Overview",
                      all: "All Time Stats",
                    }[timeframe]}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredEntries.length} entries in this period
                  </p>
                </div>
              </div>

              <select
                value={timeframe}
                onChange={e => setTimeframe(e.target.value as any)}
                className="bg-white/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-600/50 rounded-lg px-3 py-2 text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {/* --- Stats Grid --- */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Day Streak */}
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-orange-500/10 rounded-full">
                      <Flame className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                    {dayStreak}
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Day Streak
                  </p>
                  <div className="mt-2 h-1 w-12 bg-orange-500/20 rounded-full mx-auto"></div>
                </CardContent>
              </Card>

              {/* Total Entries */}
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-full">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {totalEntries}
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Entries
                  </p>
                  <div className="mt-2 h-1 w-12 bg-purple-500/20 rounded-full mx-auto"></div>
                </CardContent>
              </Card>

              {/* Average Mood */}
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className="p-2 bg-green-500/10 rounded-full">
                      <Smile className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {avgMood}
                    <span className="text-sm text-gray-500">/10</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Mood
                  </p>
                  <div className="mt-2 h-1 w-12 bg-green-500/20 rounded-full mx-auto"></div>
                </CardContent>
              </Card>

              {/* Mood Trend */}
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <div className={`p-2 ${
                      moodTrend.direction === 'up' ? 'bg-green-500/10' : 
                      moodTrend.direction === 'down' ? 'bg-red-500/10' : 'bg-gray-500/10'
                    } rounded-full`}>
                      {moodTrend.direction === 'up' ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : moodTrend.direction === 'down' ? (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      ) : (
                        <div className="h-5 w-5 bg-gray-400 rounded-full" />
                      )}
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${
                    moodTrend.direction === 'up' ? 'text-green-600 dark:text-green-400' : 
                    moodTrend.direction === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                  } mb-1`}>
                    {moodTrend.direction !== 'stable' ? `${moodTrend.value}%` : '—'}
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Mood Trend
                  </p>
                  <div className={`mt-2 h-1 w-12 ${
                    moodTrend.direction === 'up' ? 'bg-green-500/20' : 
                    moodTrend.direction === 'down' ? 'bg-red-500/20' : 'bg-gray-500/20'
                  } rounded-full mx-auto`}></div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MoodChart entries={filteredEntries} />
          <InsightsCard entries={filteredEntries} />
          <StressChart entries={filteredEntries} />
          <AnxietyChart entries={filteredEntries} />
        </div>

        {/* CTA Button */}
        <div className="flex justify-center pt-4">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Link href="/journal" className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Write a New Entry
            </Link>
          </Button>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
