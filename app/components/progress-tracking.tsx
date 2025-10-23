"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, Calendar, Target, Award, Filter, TrendingDown, TrendingUp as TrendUp } from "lucide-react";
import type { Entry } from "@/API";

interface ProgressTrackingProps {
  entries: Entry[];
}

type Timeframe = "day" | "week" | "month" | "year" | "all";

export function ProgressTracking({ entries }: ProgressTrackingProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("week");

  // Filter entries based on timeframe
  const getTimeframeEntries = (period: Timeframe, isPrevious: boolean = false) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case "day":
        if (isPrevious) {
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);
        } else {
          startDate = new Date(now);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now);
          endDate.setHours(23, 59, 59, 999);
        }
        break;
      case "week":
        if (isPrevious) {
          startDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
          endDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          endDate = new Date(now);
        }
        break;
      case "month":
        if (isPrevious) {
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        } else {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now);
        }
        break;
      case "year":
        if (isPrevious) {
          startDate = new Date(now.getFullYear() - 1, 0, 1);
          endDate = new Date(now.getFullYear() - 1, 11, 31);
        } else {
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now);
        }
        break;
      case "all":
      default:
        return entries;
    }

    return entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  // Calculate trend compared to previous period
  const getTrend = (currentCount: number, previousCount: number) => {
    if (previousCount === 0 && currentCount === 0) {
      return { value: "0", display: "0", isPositive: true, hasData: false };
    }
    if (previousCount === 0) {
      return { value: "+∞", display: "New!", isPositive: true, hasData: true };
    }
    
    const difference = currentCount - previousCount;
    const isPositive = difference >= 0;
    const display = `${isPositive ? '+' : ''}${difference}`;
    
    return {
      value: display,
      display: display,
      isPositive,
      hasData: true
    };
  };

  // Calculate consistency based on timeframe
  const getConsistency = () => {
    const currentEntries = getTimeframeEntries(timeframe, false);
    const previousEntries = getTimeframeEntries(timeframe, true);
    
    let totalDays: number;
    switch (timeframe) {
      case "day":
        totalDays = 1;
        break;
      case "week":
        totalDays = 7;
        break;
      case "month":
        totalDays = 30;
        break;
      case "year":
        totalDays = 365;
        break;
      case "all":
        totalDays = Math.max(1, Math.ceil((new Date().getTime() - new Date(currentEntries[currentEntries.length - 1]?.createdAt || new Date()).getTime()) / (1000 * 60 * 60 * 24)));
        break;
      default:
        totalDays = 7;
    }

    const currentUniqueDays = new Set(
      currentEntries.map(entry => new Date(entry.createdAt).toDateString())
    );
    
    const previousUniqueDays = new Set(
      previousEntries.map(entry => new Date(entry.createdAt).toDateString())
    );

    const currentDays = currentUniqueDays.size;
    const previousDays = previousUniqueDays.size;
    const percentage = Math.round((currentDays / totalDays) * 100);
    const trend = getTrend(currentDays, previousDays);

    return {
      days: currentDays,
      total: totalDays,
      percentage: Math.min(percentage, 100),
      trend
    };
  };

  // Calculate entries count with trend
  const getEntriesCount = () => {
    const currentEntries = getTimeframeEntries(timeframe, false);
    const previousEntries = getTimeframeEntries(timeframe, true);
    
    const currentCount = currentEntries.length;
    const previousCount = previousEntries.length;
    const trend = getTrend(currentCount, previousCount);

    return {
      count: currentCount,
      trend
    };
  };

  // Calculate average mood score with trend
  const getMoodAverage = () => {
    const currentEntries = getTimeframeEntries(timeframe, false).filter(entry => 
      entry.moodScore !== null && entry.moodScore !== undefined
    );
    
    const previousEntries = getTimeframeEntries(timeframe, true).filter(entry => 
      entry.moodScore !== null && entry.moodScore !== undefined
    );

    const currentAvg = currentEntries.length > 0 
      ? currentEntries.reduce((sum, entry) => sum + entry.moodScore!, 0) / currentEntries.length
      : 0;
    
    const previousAvg = previousEntries.length > 0 
      ? previousEntries.reduce((sum, entry) => sum + entry.moodScore!, 0) / previousEntries.length
      : 0;

    const difference = currentAvg - previousAvg;
    const isPositive = difference >= 0;
    const display = `${isPositive ? '+' : ''}${Math.abs(difference).toFixed(1)}`;

    return {
      average: currentAvg > 0 ? currentAvg.toFixed(1) : "0.0",
      trend: {
        value: display,
        display: display,
        isPositive,
        hasData: currentAvg > 0 || previousAvg > 0
      }
    };
  };

  // Calculate insights generated with trend
  const getInsightsCount = () => {
    const currentEntries = getTimeframeEntries(timeframe, false).filter(entry => 
      entry.aiInsight && entry.aiInsight.trim() !== ""
    );
    
    const previousEntries = getTimeframeEntries(timeframe, true).filter(entry => 
      entry.aiInsight && entry.aiInsight.trim() !== ""
    );

    const currentCount = currentEntries.length;
    const previousCount = previousEntries.length;
    const trend = getTrend(currentCount, previousCount);

    return {
      count: currentCount,
      trend
    };
  };

  // Calculate goals completed with trend
  const getGoalsCompleted = () => {
    const currentEntries = getTimeframeEntries(timeframe, false).filter(entry => 
      entry.location && entry.location.includes('\\n')
    );
    
    const previousEntries = getTimeframeEntries(timeframe, true).filter(entry => 
      entry.location && entry.location.includes('\\n')
    );

    const currentCount = currentEntries.length;
    const previousCount = previousEntries.length;
    const trend = getTrend(currentCount, previousCount);

    return {
      count: currentCount,
      trend
    };
  };

  // Get timeframe label for display
  const getTimeframeLabel = () => {
    switch (timeframe) {
      case "day": return "Today";
      case "week": return "This Week";
      case "month": return "This Month";
      case "year": return "This Year";
      case "all": return "All Time";
      default: return "This Week";
    }
  };

  // Get comparison label
  const getComparisonLabel = () => {
    switch (timeframe) {
      case "day": return "yesterday";
      case "week": return "last week";
      case "month": return "last month";
      case "year": return "last year";
      case "all": return "previously";
      default: return "last week";
    }
  };

  const consistency = getConsistency();
  const entriesData = getEntriesCount();
  const moodData = getMoodAverage();
  const insightsData = getInsightsCount();
  const goalsData = getGoalsCompleted();

  // Get progress bar color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-emerald-400";
    if (percentage >= 40) return "bg-amber-500";
    if (percentage >= 20) return "bg-orange-500";
    return "bg-rose-500";
  };

  // Get consistency message
  const getConsistencyMessage = () => {
    if (consistency.percentage >= 80) return "Excellent consistency! 🌟";
    if (consistency.percentage >= 60) return "Great job! Keep it up! 💪";
    if (consistency.percentage >= 40) return "Good progress! 📈";
    if (consistency.percentage >= 20) return "Building momentum! 🚀";
    return "Start your journey! 🌱";
  };

  return (
    <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Progress Tracking</CardTitle>
              <p className="text-sm text-muted-foreground">Your wellness journey milestones</p>
            </div>
          </div>
          
          {/* Timeframe Dropdown */}
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as Timeframe)}
              className="appearance-none bg-white/80 dark:bg-gray-800/80 border border-gray-300/50 dark:border-gray-600/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm pr-8"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
              <option value="all">All Time</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Consistency Tracking */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Consistency</span>
            <div className="flex items-center gap-2">
              <span>{consistency.days}/{consistency.total} days</span>
              <Badge 
                variant={consistency.percentage >= 60 ? "default" : "secondary"}
                className="text-xs"
              >
                {consistency.percentage}%
              </Badge>
              {consistency.trend.hasData && consistency.trend.value !== "0" && (
                <div className={`flex items-center gap-1 text-xs ${
                  consistency.trend.isPositive ? "text-green-500" : "text-rose-500"
                }`}>
                  {consistency.trend.isPositive ? <TrendUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {consistency.trend.display}
                </div>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(consistency.percentage)}`}
              style={{ width: `${consistency.percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {getConsistencyMessage()}
          </p>
        </div>
        
        {/* Progress Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Entries Count */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-3 text-center border border-blue-200/50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{entriesData.count}</p>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Total Entries</p>
            {entriesData.trend.hasData && entriesData.trend.value !== "0" && (
              <div className={`flex items-center justify-center gap-1 text-xs mt-1 ${
                entriesData.trend.isPositive ? "text-green-500" : "text-rose-500"
              }`}>
                {entriesData.trend.isPositive ? <TrendUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {entriesData.trend.display} from {getComparisonLabel()}
              </div>
            )}
          </div>

          {/* Average Mood Score */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 text-center border border-purple-200/50">
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {moodData.average}
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">Avg Mood</p>
            {moodData.trend.hasData && moodData.trend.value !== "+0.0" && moodData.trend.value !== "-0.0" && (
              <div className={`flex items-center justify-center gap-1 text-xs mt-1 ${
                moodData.trend.isPositive ? "text-green-500" : "text-rose-500"
              }`}>
                {moodData.trend.isPositive ? <TrendUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {moodData.trend.display} from {getComparisonLabel()}
              </div>
            )}
          </div>

          {/* Insights Generated */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-3 text-center border border-amber-200/50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{insightsData.count}</p>
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">AI Insights</p>
            {insightsData.trend.hasData && insightsData.trend.value !== "0" && (
              <div className={`flex items-center justify-center gap-1 text-xs mt-1 ${
                insightsData.trend.isPositive ? "text-green-500" : "text-rose-500"
              }`}>
                {insightsData.trend.isPositive ? <TrendUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {insightsData.trend.display} from {getComparisonLabel()}
              </div>
            )}
          </div>

          {/* Goals Completed */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg p-3 text-center border border-emerald-200/50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{goalsData.count}</p>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Actions Taken</p>
            {goalsData.trend.hasData && goalsData.trend.value !== "0" && (
              <div className={`flex items-center justify-center gap-1 text-xs mt-1 ${
                goalsData.trend.isPositive ? "text-green-500" : "text-rose-500"
              }`}>
                {goalsData.trend.isPositive ? <TrendUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {goalsData.trend.display} from {getComparisonLabel()}
              </div>
            )}
          </div>
        </div>

        {/* Timeframe Summary */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/20 dark:to-gray-600/20 rounded-lg p-3 border border-gray-200/50">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            {getTimeframeLabel()} Summary
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {entriesData.count > 0 
              ? `You've journaled ${entriesData.count} time${entriesData.count > 1 ? 's' : ''} with ${consistency.percentage}% consistency and an average mood of ${moodData.average}/10.`
              : `No entries in ${getTimeframeLabel().toLowerCase()}. Start journaling to track your progress!`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}