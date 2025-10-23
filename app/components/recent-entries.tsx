"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ChevronDown, ChevronUp, MessageCircle, Calendar } from "lucide-react";
import type { Entry } from "@/API";

interface RecentEntriesProps {
  entries: Entry[];
}

export function RecentEntries({ entries = [] }: RecentEntriesProps) {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "year" | "all">("week");

  const getMoodColor = (moodValue: number | null | undefined) => {
    if (moodValue == null) return "bg-gray-100 text-gray-700 border-gray-200";
    if (moodValue >= 7) return "bg-green-100 text-green-700 border-green-200";
    if (moodValue >= 4) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter entries based on timeframe
  const getFilteredEntries = () => {
    const now = new Date();
    const filtered = entries.filter(entry => {
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
    return filtered.slice(0, 3); // Always show max 3 entries
  };

  const filteredEntries = getFilteredEntries();

  return (
    <div className="space-y-4">
      {/* Header with timeframe selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Recent Entries</span>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as any)}
          className="text-xs bg-white border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No entries in this period</p>
          <p className="text-xs text-muted-foreground mt-1">
            {timeframe === "day" ? "Write your first entry today!" :
             timeframe === "week" ? "No entries this week yet" :
             timeframe === "month" ? "No entries this month yet" :
             timeframe === "year" ? "No entries this year yet" :
             "Create your first entry to get started"}
          </p>
        </div>
      ) : (
        filteredEntries.map((entry) => (
          <Card 
            key={entry.id} 
            className="p-4 border-l-4 border-l-blue-400 hover:shadow-md transition-all duration-200 bg-white/50 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">{formatDate(entry.createdAt)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`${getMoodColor(entry.moodScore)} text-xs font-medium`}>
                    Mood: {entry.moodScore ?? "N/A"}/10
                  </Badge>
                  {entry.anxietyScore && (
                    <Badge variant="outline" className="text-xs">
                      Anxiety: {entry.anxietyScore}/10
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
              >
                {expandedEntry === entry.id ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <p className={`text-sm text-gray-700 leading-relaxed ${
                expandedEntry !== entry.id ? 'line-clamp-2' : ''
              }`}>
                {entry.content}
              </p>
              
              {expandedEntry === entry.id && entry.aiInsight && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs font-medium text-blue-800 mb-1">AI Insight</p>
                  <p className="text-xs text-blue-700 leading-relaxed">{entry.aiInsight}</p>
                </div>
              )}
            </div>
          </Card>
        ))
      )}

      {entries.length > 0 && (
        <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50" asChild>
          <Link href="/history">
            View All Entries ({timeframe === "all" ? entries.length : filteredEntries.length})
          </Link>
        </Button>
      )}
    </div>
  );
}
