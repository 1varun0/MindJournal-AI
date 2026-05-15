"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import { Trash2, Search, Filter, Calendar, Brain, Sparkles, MessageCircle, Heart, User, Zap, CornerDownRight, BarChart3, Lightbulb } from "lucide-react";
import { AppHeader } from "../components/app-header";
import { Navigation } from "../components/navigation";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { listEntries } from "../../src/graphql/queries";
import { deleteEntry } from "../../src/graphql/mutations";
import type { Entry } from "../../src/API";

const client = generateClient();

export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [moodFilter, setMoodFilter] = useState("all");
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
      } catch (error: any) {
        console.error("Error fetching history entries:", error);
        if (error.name === 'NotAuthorizedException' || error.name === 'UserNotFoundException' || error.message?.includes('No current user')) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries();
  }, [router]);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = moodFilter === "all" || (entry.moodScore && String(entry.moodScore) === moodFilter);
    return matchesSearch && matchesMood;
  });
  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry? This action cannot be undone.")) {
      return;
    }
    
    try {
      await client.graphql({
        query: deleteEntry,
        variables: { input: { id: id } },
      });
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry. Please try again.");
    }
  };

  const getMoodConfig = (moodValue: number | null | undefined) => {
    if (moodValue == null) return {
      gradient: "from-gray-400 to-gray-600",
      bgGradient: "from-gray-50 to-gray-100",
      emoji: "😶",
      color: "gray",
      text: "text-gray-700"
    };
    if (moodValue >= 7) return {
      gradient: "from-emerald-400 to-green-500",
      bgGradient: "from-emerald-50/80 to-green-100/80",
      emoji: "😊",
      color: "emerald",
      text: "text-emerald-700"
    };
    if (moodValue >= 4) return {
      gradient: "from-amber-400 to-orange-500",
      bgGradient: "from-amber-50/80 to-orange-100/80",
      emoji: "🙂",
      color: "amber",
      text: "text-amber-700"
    };
    return {
      gradient: "from-rose-400 to-pink-500",
      bgGradient: "from-rose-50/80 to-pink-100/80",
      emoji: "😔",
      color: "rose",
      text: "text-rose-700"
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };

  // Parse recommended action from location field
  const parseRecommendedAction = (location: string | null | undefined) => {
  if (!location || !location.trim()) return null;

  let name = "Recommended Practice";
  let category = "Wellness";
  let description = location.trim();

  // Try different parsing strategies
  if (location.includes('\\n')) {
    const parts = location.split('\\n').map(p => p.trim()).filter(p => p);
    if (parts.length >= 3) {
      name = parts[0];
      category = parts[1];
      description = parts.slice(2).join(' ');
    } else if (parts.length === 2) {
      name = parts[0];
      description = parts[1];
    } else if (parts.length === 1) {
      description = parts[0];
    }
  } else if (location.includes('\n')) {
    const parts = location.split('\n').map(p => p.trim()).filter(p => p);
    if (parts.length >= 3) {
      name = parts[0];
      category = parts[1];
      description = parts.slice(2).join(' ');
    } else if (parts.length === 2) {
      name = parts[0];
      description = parts[1];
    } else if (parts.length === 1) {
      description = parts[0];
    }
  } else {
    // Single string - try to extract meaningful name
    const firstSentence = location.split(/[.:]/)[0];
    if (firstSentence && firstSentence.length < 50) {
      name = firstSentence.trim();
      description = location.substring(firstSentence.length + 1).trim();
    }
    
    // Auto-detect category
    const lowerLocation = location.toLowerCase();
    if (lowerLocation.includes('anxiety') || lowerLocation.includes('worry') || lowerLocation.includes('nervous')) 
      category = "Anxiety Management";
    else if (lowerLocation.includes('mood') || lowerLocation.includes('depress') || lowerLocation.includes('sad')) 
      category = "Mood Improvement";
    else if (lowerLocation.includes('stress') || lowerLocation.includes('overwhelm') || lowerLocation.includes('pressure')) 
      category = "Stress Relief";
    else if (lowerLocation.includes('breath') || lowerLocation.includes('relax') || lowerLocation.includes('calm')) 
      category = "Relaxation";
    else if (lowerLocation.includes('mindful') || lowerLocation.includes('grounding') || lowerLocation.includes('present')) 
      category = "Mindfulness";
    else if (lowerLocation.includes('gratitude') || lowerLocation.includes('positive') || lowerLocation.includes('thank')) 
      category = "Positive Mindset";
  }

  return {
    name: name,
    category: category,
    description: description
  };
};

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your journal history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-800 pb-20">
      <AppHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Journal History
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Review your past entries and track your emotional journey over time.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>{entries.length} total entries</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>{entries.filter(e => e.aiInsight).length} with AI insights</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <Card className="p-6 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/30 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-gray-800/50 border-blue-200/50 dark:border-blue-700/50"
              />
            </div>
            <Select value={moodFilter} onValueChange={setMoodFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/50 dark:bg-gray-800/50 border-blue-200/50 dark:border-blue-700/50">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Moods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Moods</SelectItem>
                {[...Array(10)].map((_, i) => (
                  <SelectItem key={i+1} value={String(i+1)}>
                    <div className="flex items-center gap-2">
                      <span>{getMoodConfig(i+1).emoji}</span>
                      <span>Mood {i+1}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(searchTerm || moodFilter !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setMoodFilter("all");
                }}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Clear
              </Button>
            )}
          </div>
        </Card>

        {/* Entries List */}
        <div className="space-y-6">
          {filteredEntries.map((entry) => {
            const moodConfig = getMoodConfig(entry.moodScore);
            const hasAIInsight = entry.aiInsight && entry.aiInsight.trim() !== "";
            const hasEmotions = entry.detectedEmotions && Array.isArray(entry.detectedEmotions) && entry.detectedEmotions.filter(e => e && e.trim()).length > 0;
            const recommendedAction = parseRecommendedAction(entry.location);
            
            return (
              <Card 
                key={entry.id} 
                className="overflow-hidden border-0 bg-white dark:bg-gray-800 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 group relative"
              >
                {/* Gradient Accent Border */}
                <div className={`h-1.5 bg-gradient-to-r ${moodConfig.gradient}`}></div>
                
                {/* Floating Mood Indicator */}
                <div className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br ${moodConfig.gradient} rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 z-10`}>
                  <span className="text-2xl">{moodConfig.emoji}</span>
                </div>

                <div className="p-6 pt-8">
                  {/* Header with Date and Scores */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-full px-4 py-2 border border-blue-200/50 dark:border-blue-700/30">
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          {formatDate(entry.createdAt)}
                        </span>
                      </div>
                      
                      {/* Scores Section */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Mood Score */}
                        <div className={`px-3 py-2 rounded-full bg-gradient-to-r ${moodConfig.bgGradient} border border-gray-200/50 shadow-sm`}>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Mood: <span className="text-lg">{entry.moodScore ?? 'N/A'}/10</span>
                          </span>
                        </div>
                        
                        {/* Anxiety Score */}
                        {entry.anxietyScore !== null && entry.anxietyScore !== undefined && (
                          <div className="px-3 py-2 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200/50 shadow-sm">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                              Anxiety: <span className="text-lg">{entry.anxietyScore}/10</span>
                            </span>
                          </div>
                        )}
                        
                        {/* Stress Score */}
                        {entry.stressScore !== null && entry.stressScore !== undefined && (
                          <div className="px-3 py-2 rounded-full bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200/50 shadow-sm">
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                              Stress: <span className="text-lg">{entry.stressScore}/10</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(entry.id)}
                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Entry - Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            Your Reflection
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">What you shared</p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-5 border border-blue-200/50 dark:border-blue-700/30">
                        <div className="flex items-start gap-3">
                          <MessageCircle className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                          <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-base whitespace-pre-wrap">
                            {entry.content}
                          </p>
                        </div>
                      </div>

                      

                      {/* Recommended Action Section */}
                      {recommendedAction && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-5 border border-green-200/50 dark:border-green-700/30">
                          <div className="flex items-center gap-3 mb-3">
                            <Lightbulb className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                Recommended Action
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Personalized CBT exercise</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
                                {recommendedAction.name}
                              </p>
                              <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs">
                                {recommendedAction.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {recommendedAction.description}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AI Insights - Right Column */}
                    {(hasAIInsight || hasEmotions) && (
                      <div className="lg:col-span-1 space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                            <Zap className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              AI Analysis
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Insights & Patterns</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* AI Insight */}
                          {hasAIInsight && (
                            <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/15 dark:to-pink-900/15 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/30">
                              <div className="flex items-start gap-3">
                                <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                <p className="text-purple-900 dark:text-purple-100 leading-relaxed text-sm">
                                  {entry.aiInsight}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Detected Emotions - Better Colors */}
                          {hasEmotions && (
                            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/30">
                              <div className="flex items-center gap-2 mb-3">
                                <Heart className="h-4 w-4 text-purple-500" />
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                  Emotions Detected
                                </span>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {entry.detectedEmotions!
                                  .filter((emotion): emotion is string => emotion !== null && emotion !== undefined && emotion.trim() !== "")
                                  .slice(0, 6)
                                  .map((emotion, index) => {
                                    // Color mapping based on emotion type
                                    const getEmotionColor = (emotion: string) => {
                                      const lowerEmotion = emotion.toLowerCase();
                                      if (lowerEmotion.includes('happy') || lowerEmotion.includes('joy') || lowerEmotion.includes('excited')) 
                                        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200";
                                      if (lowerEmotion.includes('sad') || lowerEmotion.includes('down') || lowerEmotion.includes('low')) 
                                        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200";
                                      if (lowerEmotion.includes('angry') || lowerEmotion.includes('frustrated') || lowerEmotion.includes('mad')) 
                                        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200";
                                      if (lowerEmotion.includes('anxious') || lowerEmotion.includes('worried') || lowerEmotion.includes('nervous')) 
                                        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200";
                                      if (lowerEmotion.includes('calm') || lowerEmotion.includes('peaceful') || lowerEmotion.includes('relaxed')) 
                                        return "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border-teal-200";
                                      // Default color for other emotions
                                      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200";
                                    };

                                    return (
                                      <Badge 
                                        key={index}
                                        variant="secondary"
                                        className={`text-xs capitalize ${getEmotionColor(emotion)}`}
                                      >
                                        {emotion.trim()}
                                      </Badge>
                                    );
                                  })
                                }
                              </div>
                            </div>
                          )}
                          

                          {/* Additional Metrics */}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            {entry.energyLevel && (
                              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                                <p className="font-medium text-gray-500 dark:text-gray-400">Energy</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{entry.energyLevel.toLowerCase()}</p>
                              </div>
                            )}
                            {entry.moodCategory && (
                              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
                                <p className="font-medium text-gray-500 dark:text-gray-400">Mood Type</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{entry.moodCategory}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredEntries.length === 0 && (
          <Card className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/30">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {entries.length === 0 ? "No entries yet" : "No entries found"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || moodFilter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Start your journaling journey by creating your first entry."
                }
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Write First Entry
                </Button>
                {(searchTerm || moodFilter !== "all") && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setMoodFilter("all");
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}
      </main>
      <Navigation />
    </div>
  );
}
