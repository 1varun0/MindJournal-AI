"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Award, 
  Calendar,
  Clock,
  BarChart3,
  Heart,
  Sparkles,
  Zap,
  CheckCircle2,
  Circle,
  Star
} from "lucide-react";
import { AppHeader } from "../components/app-header";
import { Navigation } from "../components/navigation";
import { listEntries } from "../../src/graphql/queries";
import type { Entry } from "../../src/API";
import { EmotionalPatternsCard } from "./emotionpatter";
import { QuickActions } from "../components/quick-actions";
import { ProgressTracking } from "../components/progress-tracking";
import { Milestones } from "../components/milestones";
import { MetricsOverview } from "../components/MetricsOverview";
import { RecommendedActions } from "../components/recomendations";

const client = generateClient();

export default function InsightsPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    
    const fetchEntries = async () => {
      try {
        await getCurrentUser();
        const { data } = await client.graphql({ query: listEntries });
        const sortedEntries = (data.listEntries.items as Entry[]).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setEntries(sortedEntries);
      } catch (error) {
        router.push("/login");
      } finally {
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
          <p className="text-muted-foreground">Loading your insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-800 pb-20">
  <AppHeader />
  
  <main className="mx-auto w-full max-w-6xl px-4 py-8">
    {/* Fixed Header */}
    <div className="text-center mb-12">
  <div className="flex items-center justify-center gap-3 mb-4">
    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
      <Sparkles className="h-4 w-4 text-white" />
    </div>
    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      AI Insights
    </h1>
  </div>
  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
    Personalized insights and recommendations based on your journal entries
  </p>
</div>

    {/* Original Grid Structure - Just Better Styled */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Main Insights */}
      <div className="lg:col-span-2 space-y-8">
        {/* Emotional Patterns */}
        <EmotionalPatternsCard entries={entries} />

        {/* AI-Powered Recommendations */}
        <RecommendedActions entries={entries} />

        {/* Progress Tracking */}
        <ProgressTracking entries={entries} />
      </div>

      {/* Right Column - Sidebar Insights */}
      <div className="space-y-8">
        <QuickActions entries={entries} />
        
        {/* Achievement Milestones */}
        <Milestones entries={entries} />

        {/* Weekly Focus */}
        {/* <WeeklyFocus entries={entries} /> */}
        <MetricsOverview entries={entries} />
      </div>
    </div>
    {/* Bottom Section - Additional Insights */}
    <div className="mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Insight Cards */}
        <div className="bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl p-6 border border-blue-100/50 dark:border-blue-800/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Weekly Trends</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track your mood and energy patterns over time to identify what works best for you.
          </p>
        </div>

        <div className="bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/20 rounded-2xl p-6 border border-purple-100/50 dark:border-purple-800/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <span className="text-lg">💡</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Smart Suggestions</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI-powered recommendations tailored to your current emotional state and patterns.
          </p>
        </div>

        <div className="bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-900/20 rounded-2xl p-6 border border-green-100/50 dark:border-green-800/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Progress Tracking</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monitor your consistency and celebrate milestones in your wellness journey.
          </p>
        </div>
      </div>
    </div>
  </main>

  <Navigation />
</div>
  );
}
