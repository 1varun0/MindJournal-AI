"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import { PenLine, BookOpen, TrendingUp, Brain, Sparkles, Clock, BarChart3 } from "lucide-react";
import { AppHeader } from "../components/app-header";
import { JournalForm } from "../components/journal-form";
import { Navigation } from "../components/navigation";
import { RecentEntries } from "../components/recent-entries";
import { StatsOverview } from "../components/stats-overview";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { listEntries } from "../../src/graphql/queries";
import type { Entry } from "../../src/API";

const client = generateClient();

export default function AppPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        await getCurrentUser();
        console.log("Auth session: ", await getCurrentUser());
        const { data } = await client.graphql({ query: listEntries });
        console.log("GraphQL response: ", data);
        const sortedEntries = (data.listEntries.items as Entry[]).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        console.log("Sorted entries: ", sortedEntries);
        setEntries(sortedEntries);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error fetching entries:", error);
        if (error.name === 'NotAuthorizedException' || error.name === 'UserNotFoundException' || error.message?.includes('No current user')) {
          router.push("/login");
        }
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your wellness journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-800 pb-20">
      <AppHeader />

      {/* Hero Section */}
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-blue-200/50 dark:border-blue-800/30">
            <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered CBT Tracker</span>
          </div> */}
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Your Mental Wellness Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Track your thoughts, understand your patterns, and build healthier mental habits with our CBT-based approach.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-12">
          <StatsOverview entries={entries} />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Journal Form - Left Column */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <PenLine className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Daily Journal</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Reflect on your thoughts and feelings</p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-4 mb-8 border border-blue-200/50 dark:border-blue-700/30">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                        Mindful Reflection
                      </p>
                      <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
                        Regular journaling helps identify patterns and promotes mindfulness. Your entries are analyzed with AI to provide personalized insights.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Journal Form */}
                <JournalForm />
              </CardContent>
            </Card>
          </div>

          {/* Recent Entries - Right Column */}
          <div className="lg:col-span-1">
            <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 h-full">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recent Entries</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Your latest reflections</p>
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 text-center border border-blue-200/50 dark:border-blue-700/30">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{entries.length}</div>
                    <div className="text-xs text-blue-600/80 dark:text-blue-400/80">Total Entries</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3 text-center border border-purple-200/50 dark:border-purple-700/30">
                    <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
      {(() => {
        const recentEntries = entries.slice(0, 3).filter(entry => entry.moodScore !== null && entry.moodScore !== undefined);
        return recentEntries.length > 0 
          ? (recentEntries.reduce((acc, entry) => acc + (entry.moodScore || 0), 0) / recentEntries.length).toFixed(1)
          : "0.0";
      })()}
    </div>
                    <div className="text-xs text-purple-600/80 dark:text-purple-400/80">Recent Avg</div>
                  </div>
                </div>

                {/* Recent Entries List */}
                <div className="space-y-4">
                  <RecentEntries entries={entries.slice(0, 3)} />
                  
                  {entries.length > 3 && (
                    <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/30">
                      <Button 
                        variant="outline" 
                        className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        onClick={() => router.push('/history')}
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View All Entries
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor your emotional patterns and growth over time
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">AI Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get personalized insights and coping strategies
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Build Habits</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Develop consistent mindfulness practices
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
