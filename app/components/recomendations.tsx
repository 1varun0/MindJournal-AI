"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Sparkles, Circle, CheckCircle2, Filter, Trash2 } from "lucide-react";
import type { Entry } from "@/API";

interface RecommendedActionsProps {
  entries: Entry[];
}

interface RecommendedAction {
  title: string;
  description: string;
  category: string;
  priority: "high" | "medium" | "low";
  frequency: number;
  lastRecommended?: Date;
}

export function RecommendedActions({ entries }: RecommendedActionsProps) {
  const [recommendedActions, setRecommendedActions] = useState<RecommendedAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [showCompleted, setShowCompleted] = useState(false);

  // Load completed actions from localStorage
  useEffect(() => {
    const storedCompleted = localStorage.getItem('completedActions');
    if (storedCompleted) {
      setCompletedActions(new Set(JSON.parse(storedCompleted)));
    }
  }, []);

  const analyzeRecommendedActions = () => {
  const actionFrequency: Record<string, { count: number; lastDate: Date; categories: Set<string>; descriptions: Set<string> }> = {};
  
  entries.forEach(entry => {
    if (entry.location && entry.location.trim()) {
      try {
        let actionName = "Recommended Practice";
        let category = "Wellness";
        let description = entry.location.trim();

        // Parse the location field using the same logic as History page
        if (entry.location.includes('\\n')) {
          const parts = entry.location.split('\\n').map(p => p.trim()).filter(p => p);
          if (parts.length >= 3) {
            actionName = parts[0];
            category = parts[1];
            description = parts.slice(2).join(' ');
          } else if (parts.length === 2) {
            actionName = parts[0];
            description = parts[1];
          } else if (parts.length === 1) {
            description = parts[0];
            // Try to extract a better name from the description
            const firstSentence = description.split(/[.:]/)[0];
            if (firstSentence && firstSentence.length < 50) {
              actionName = firstSentence.trim();
            }
          }
        } else if (entry.location.includes('\n')) {
          const parts = entry.location.split('\n').map(p => p.trim()).filter(p => p);
          if (parts.length >= 3) {
            actionName = parts[0];
            category = parts[1];
            description = parts.slice(2).join(' ');
          } else if (parts.length === 2) {
            actionName = parts[0];
            description = parts[1];
          } else if (parts.length === 1) {
            description = parts[0];
            const firstSentence = description.split(/[.:]/)[0];
            if (firstSentence && firstSentence.length < 50) {
              actionName = firstSentence.trim();
            }
          }
        } else {
          // Single string - try to extract meaningful name
          const firstSentence = entry.location.split(/[.:]/)[0];
          if (firstSentence && firstSentence.length < 50) {
            actionName = firstSentence.trim();
            description = entry.location.substring(firstSentence.length + 1).trim();
          }
        }

        // Auto-detect category from content
        const lowerLocation = entry.location.toLowerCase();
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

        const entryDate = new Date(entry.createdAt);

        if (!actionFrequency[actionName]) {
          actionFrequency[actionName] = {
            count: 0,
            lastDate: entryDate,
            categories: new Set(),
            descriptions: new Set()
          };
        }

        actionFrequency[actionName].count++;
        actionFrequency[actionName].categories.add(category);
        actionFrequency[actionName].descriptions.add(description);
        if (entryDate > actionFrequency[actionName].lastDate) {
          actionFrequency[actionName].lastDate = entryDate;
        }

      } catch (error) {
        console.log('Error parsing action from entry:', entry.location, error);
      }
    }
  });

  const actions: RecommendedAction[] = Object.entries(actionFrequency)
    .map(([title, data]) => {
      const categories = Array.from(data.categories);
      const descriptions = Array.from(data.descriptions);
      const category = categories.length > 0 ? categories[0] : "Wellness";
      
      // Use the most recent description
      const description = descriptions.length > 0 ? descriptions[descriptions.length - 1] : "Personalized practice based on your journal patterns";
      
      let priority: "high" | "medium" | "low" = "low";
      const isRecent = data.lastDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      if (data.count >= 3 && isRecent) {
        priority = "high";
      } else if (data.count >= 2 || isRecent) {
        priority = "medium";
      }

      return {
        title,
        description,
        category,
        priority,
        frequency: data.count,
        lastRecommended: data.lastDate
      };
    })
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.frequency - a.frequency;
    });

  return actions;
};

  const generateFallbackActions = (): RecommendedAction[] => {
    // Your existing fallback logic here
    return [
      {
        title: "Mindfulness Meditation",
        description: "Practice 5-10 minutes of mindfulness meditation to enhance present-moment awareness",
        category: "Mindfulness",
        priority: "medium",
        frequency: 1
      },
      {
        title: "Gratitude Practice",
        description: "Write down three things you're grateful for each evening to improve mood",
        category: "Positive Mindset",
        priority: "medium",
        frequency: 1
      },
      {
        title: "Breathing Exercise",
        description: "Practice 5 minutes of deep breathing to reduce anxiety and calm your nervous system",
        category: "Anxiety Management",
        priority: "medium",
        frequency: 1
      }
    ];
  };

  useEffect(() => {
    setIsLoading(true);
    const actions = analyzeRecommendedActions();
    
    if (actions.length === 0) {
      const fallbackActions = generateFallbackActions();
      setRecommendedActions(fallbackActions);
    } else {
      setRecommendedActions(actions);
    }
    
    setIsLoading(false);
  }, [entries]);

  const handleCompleteAction = (actionTitle: string) => {
    const newCompleted = new Set(completedActions).add(actionTitle);
    setCompletedActions(newCompleted);
    localStorage.setItem('completedActions', JSON.stringify([...newCompleted]));
  };

  const handleRemoveAction = (actionTitle: string) => {
    const newCompleted = new Set(completedActions);
    newCompleted.delete(actionTitle);
    setCompletedActions(newCompleted);
    localStorage.setItem('completedActions', JSON.stringify([...newCompleted]));
  };

  const clearCompletedActions = () => {
    setCompletedActions(new Set());
    localStorage.removeItem('completedActions');
  };

  const filteredActions = recommendedActions.filter(action => 
    showCompleted ? completedActions.has(action.title) : !completedActions.has(action.title)
  );

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "secondary";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Priority";
      case "medium": return "Recommended";
      case "low": return "Suggested";
      default: return "Recommended";
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Recommended Actions</CardTitle>
              <p className="text-sm text-muted-foreground">Analyzing your patterns...</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg border animate-pulse">
              <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0 mt-1"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl flex flex-col h-[500px]"> {/* Fixed height */}
      <CardHeader className="pb-4 flex-shrink-0"> {/* Prevent header from shrinking */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Recommended Actions</CardTitle>
              <p className="text-sm text-muted-foreground">
                {filteredActions.length} active • {completedActions.size} completed
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showCompleted ? "Active" : "Completed"}
            </Button>
            
            {showCompleted && completedActions.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCompletedActions}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden pb-6"> {/* Allow content to grow and hide overflow */}
        {/* Scrollable container with hidden scrollbar */}
        <div className="h-full overflow-y-auto scrollbar-hide"> {/* Custom scrollbar hiding */}
          <div className="space-y-4 pr-2"> {/* Add small padding for scrollbar space */}
            {filteredActions.map((action, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg border hover:shadow-md transition-shadow">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  completedActions.has(action.title) 
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20" 
                    : "border-blue-500"
                }`}>
                  {completedActions.has(action.title) ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <Circle className="h-3 w-3 text-blue-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0"> {/* Prevent text overflow */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className={`font-semibold truncate ${
                      completedActions.has(action.title) 
                        ? "text-gray-500 dark:text-gray-400 line-through" 
                        : "text-gray-900 dark:text-gray-100"
                    }`}>
                      {action.title}
                    </h3>
                    <Badge variant={getPriorityVariant(action.priority)} className="text-xs flex-shrink-0">
                      {getPriorityLabel(action.priority)}
                    </Badge>
                    {action.frequency > 1 && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 flex-shrink-0">
                        {action.frequency}x
                      </Badge>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-2 line-clamp-2 ${
                    completedActions.has(action.title) 
                      ? "text-gray-400 dark:text-gray-500" 
                      : "text-gray-600 dark:text-gray-400"
                  }`}>
                    {action.description}
                  </p>
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {action.category}
                    </Badge>
                    
                    <div className="flex items-center gap-2">
                      {!completedActions.has(action.title) ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs"
                          >
                            Start
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 text-xs"
                            onClick={() => handleCompleteAction(action.title)}
                          >
                            Done
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-500 hover:text-gray-700 text-xs"
                          onClick={() => handleRemoveAction(action.title)}
                        >
                          Show Again
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty states */}
            {filteredActions.length === 0 && !showCompleted && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>All actions completed! 🎉</p>
                <p className="text-sm mt-1">New recommendations will appear as you journal</p>
              </div>
            )}
            
            {filteredActions.length === 0 && showCompleted && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Trash2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No completed actions to show</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}