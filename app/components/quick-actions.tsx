"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Zap, Play, Clock, Sparkles, Pause, Square, CheckCircle, Filter, Trash2 } from "lucide-react";
import type { Entry } from "@/API";

interface QuickActionsProps {
  entries: Entry[];
}

interface QuickAction {
  name: string;
  category: string;
  description: string;
  icon: string;
  time: string;
  duration: number; // in seconds
  frequency: number;
  lastCompleted?: number;
}

interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  totalTime: number;
  currentAction: QuickAction | null;
}

export function QuickActions({ entries }: QuickActionsProps) {
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    timeLeft: 0,
    totalTime: 0,
    currentAction: null
  });

  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [showCompleted, setShowCompleted] = useState(false);

  // Load completed actions from localStorage
  useEffect(() => {
    const storedCompleted = localStorage.getItem('quickActionsCompleted');
    if (storedCompleted) {
      setCompletedActions(new Set(JSON.parse(storedCompleted)));
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timer.isRunning && timer.timeLeft > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev.timeLeft <= 1) {
            // Auto-complete when timer finishes
            handleCompleteAction(prev.currentAction?.name || '');
            return { ...prev, isRunning: false, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer.isRunning, timer.timeLeft]);

  // Parse recommended actions from entries
  const getQuickActions = (): QuickAction[] => {
  const actionFrequency: Record<string, { count: number; category: string; description: string; lastDate: Date }> = {};
  
  // Get actions from recent entries (all entries, not just those with \\n)
  const recentEntries = entries
    .filter(entry => entry.location && entry.location.trim())
    .slice(0, 20);

  recentEntries.forEach(entry => {
    try {
      let actionName = "Recommended Practice";
      let category = "Wellness";
      let description = entry.location!.trim();

      // Parse the location field using the same robust logic
      if (entry.location!.includes('\\n')) {
        const parts = entry.location!.split('\\n').map(p => p.trim()).filter(p => p);
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
      } else if (entry.location!.includes('\n')) {
        const parts = entry.location!.split('\n').map(p => p.trim()).filter(p => p);
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
        const firstSentence = entry.location!.split(/[.:]/)[0];
        if (firstSentence && firstSentence.length < 50) {
          actionName = firstSentence.trim();
          description = entry.location!.substring(firstSentence.length + 1).trim();
        }
      }

      // Auto-detect category from content
      const lowerLocation = entry.location!.toLowerCase();
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
          category,
          description,
          lastDate: entryDate
        };
      }

      actionFrequency[actionName].count++;
      // Update to use the most recent description and category
      if (entryDate > actionFrequency[actionName].lastDate) {
        actionFrequency[actionName].description = description;
        actionFrequency[actionName].category = category;
        actionFrequency[actionName].lastDate = entryDate;
      }

    } catch (error) {
      console.log('Error parsing action from entry:', entry.location, error);
    }
  });

  // Convert to QuickAction array
  const actions: QuickAction[] = Object.entries(actionFrequency)
    .map(([name, data]) => {
      const { icon, time, duration } = getActionDetails(data.category, data.description);
      
      return {
        name,
        category: data.category,
        description: data.description,
        icon,
        time,
        duration,
        frequency: data.count
      };
    })
    .sort((a, b) => b.frequency - a.frequency); // Sort by frequency

  if (actions.length === 0) {
    return getFallbackActions();
  }

  return actions;
};

  // Get icon, time, and duration based on category and description
  const getActionDetails = (category: string, description: string): { icon: string; time: string; duration: number } => {
    const lowerCategory = category.toLowerCase();
    const lowerDesc = description.toLowerCase();

    // Estimate time and duration
    let time = "5 min";
    let duration = 300; // 5 minutes in seconds
    
    if (lowerDesc.includes('minute') || lowerDesc.includes('min')) {
      const timeMatch = lowerDesc.match(/(\d+)\s*min/);
      if (timeMatch) {
        const minutes = parseInt(timeMatch[1]);
        time = `${minutes} min`;
        duration = minutes * 60;
      }
    } else if (lowerDesc.includes('breath') || lowerDesc.includes('breathe')) {
      time = "3 min";
      duration = 180;
    } else if (lowerDesc.includes('write') || lowerDesc.includes('journal')) {
      time = "7 min";
      duration = 420;
    } else if (lowerDesc.includes('walk') || lowerDesc.includes('move')) {
      time = "10 min";
      duration = 600;
    } else if (lowerDesc.includes('quick') || lowerDesc.includes('1 min')) {
      time = "1 min";
      duration = 60;
    }

    // Map category to emoji
    let icon = "💫";
    if (lowerCategory.includes('breath') || lowerCategory.includes('relax')) {
      icon = "💨";
    } else if (lowerCategory.includes('gratitude') || lowerCategory.includes('positive')) {
      icon = "🙏";
    } else if (lowerCategory.includes('thought') || lowerCategory.includes('cognitive')) {
      icon = "🧠";
    } else if (lowerCategory.includes('activity') || lowerCategory.includes('behavior')) {
      icon = "🚶";
    } else if (lowerCategory.includes('mindful') || lowerCategory.includes('meditation')) {
      icon = "👁️";
    } else if (lowerCategory.includes('muscle') || lowerCategory.includes('relaxation')) {
      icon = "💆";
    }

    return { icon, time, duration };
  };

  // Fallback actions
  const getFallbackActions = (): QuickAction[] => [
    {
      name: "Deep Breathing",
      category: "Stress Relief",
      description: "Take 5 minutes for deep breathing to center yourself",
      icon: "💨",
      time: "5 min",
      duration: 300,
      frequency: 1
    },
    {
      name: "Gratitude Practice",
      category: "Positive Mindset",
      description: "Write down three things you're grateful for",
      icon: "🙏",
      time: "3 min",
      duration: 180,
      frequency: 1
    },
    {
      name: "Thought Record",
      category: "Cognitive Restructuring",
      description: "Challenge negative thoughts by writing evidence for and against them",
      icon: "🧠",
      time: "7 min",
      duration: 420,
      frequency: 1
    },
    {
      name: "Body Scan",
      category: "Mindfulness",
      description: "Systematically relax each muscle group in your body",
      icon: "👁️",
      time: "5 min",
      duration: 300,
      frequency: 1
    },
    {
      name: "Quick Walk",
      category: "Energy Boost",
      description: "Take a 5-minute walk to refresh your mind",
      icon: "🚶",
      time: "5 min",
      duration: 300,
      frequency: 1
    },
    {
      name: "Progressive Relaxation",
      category: "Stress Relief",
      description: "Tense and relax muscles from head to toe",
      icon: "💆",
      time: "8 min",
      duration: 480,
      frequency: 1
    }
  ];

  const quickActions = getQuickActions();

  // Filter actions based on current view
  const filteredActions = quickActions.filter(action => 
    showCompleted ? completedActions.has(action.name) : !completedActions.has(action.name)
  );

  const startTimer = (action: QuickAction) => {
    setTimer({
      isRunning: true,
      timeLeft: action.duration,
      totalTime: action.duration,
      currentAction: action
    });
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resumeTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: true }));
  };

  const stopTimer = () => {
    setTimer({
      isRunning: false,
      timeLeft: 0,
      totalTime: 0,
      currentAction: null
    });
  };

  const handleCompleteAction = (actionName: string) => {
    const newCompleted = new Set(completedActions).add(actionName);
    setCompletedActions(newCompleted);
    localStorage.setItem('quickActionsCompleted', JSON.stringify([...newCompleted]));
    
    // Stop timer if this was the current action
    if (timer.currentAction?.name === actionName) {
      setTimer({
        isRunning: false,
        timeLeft: 0,
        totalTime: 0,
        currentAction: null
      });
    }
    
    console.log("Exercise completed:", actionName);
  };

  const handleRemoveAction = (actionName: string) => {
    const newCompleted = new Set(completedActions);
    newCompleted.delete(actionName);
    setCompletedActions(newCompleted);
    localStorage.setItem('quickActionsCompleted', JSON.stringify([...newCompleted]));
  };

  const clearCompletedActions = () => {
    setCompletedActions(new Set());
    localStorage.removeItem('quickActionsCompleted');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    if (timer.totalTime === 0) return 0;
    return ((timer.totalTime - timer.timeLeft) / timer.totalTime) * 100;
  };

  return (
    <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl flex flex-col h-[450px]">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
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

      {/* Timer Display */}
      {timer.currentAction && !completedActions.has(timer.currentAction.name) && (
        <div className="px-6 pb-4 flex-shrink-0">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/30">
            <div className="text-center mb-3">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {formatTime(timer.timeLeft)}
              </div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {timer.currentAction.name}
              </p>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                {timer.currentAction.description}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-blue-200 dark:bg-blue-700 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center gap-2">
              {timer.isRunning ? (
                <Button onClick={pauseTimer} size="sm" variant="outline" className="border-blue-300">
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
              ) : timer.timeLeft > 0 ? (
                <Button onClick={resumeTimer} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </Button>
              ) : null}
              
              {timer.timeLeft > 0 ? (
                <Button onClick={stopTimer} size="sm" variant="outline" className="border-rose-300 text-rose-600 hover:bg-rose-50">
                  <Square className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              ) : (
                <Button 
                  onClick={() => handleCompleteAction(timer.currentAction!.name)} 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <CardContent className={`flex-1 overflow-hidden pb-6 ${timer.currentAction ? 'pt-0' : ''}`}>
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="space-y-3 pr-2">
            {filteredActions.map((action, index) => (
              <div 
                key={index} 
                className={`w-full transition-all duration-200 border rounded-lg p-3 group ${
                  completedActions.has(action.name)
                    ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 opacity-75"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-600 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-2xl transition-transform ${
                    completedActions.has(action.name) ? "" : "group-hover:scale-110"
                  }`}>
                    {action.icon}
                  </span>
                  
                  <div className="text-left flex-1 min-w-0">
                    <p className={`font-medium text-sm ${
                      completedActions.has(action.name)
                        ? "text-gray-500 dark:text-gray-400 line-through"
                        : "text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300"
                    }`}>
                      {action.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Clock className={`h-3 w-3 ${
                        completedActions.has(action.name) 
                          ? "text-gray-400" 
                          : "text-muted-foreground group-hover:text-blue-500"
                      }`} />
                      <p className={`text-xs ${
                        completedActions.has(action.name)
                          ? "text-gray-400"
                          : "text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`}>
                        {action.time}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        completedActions.has(action.name)
                          ? "bg-gray-200 dark:bg-gray-600 text-gray-500"
                          : "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50"
                      }`}>
                        {action.category}
                      </span>
                      {action.frequency > 1 && (
                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded">
                          {action.frequency}x
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {!completedActions.has(action.name) ? (
                      <>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => startTimer(action)}
                          disabled={timer.currentAction !== null}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                          onClick={() => handleCompleteAction(action.name)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => handleRemoveAction(action.name)}
                      >
                        Show Again
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty states */}
            {filteredActions.length === 0 && !showCompleted && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>All actions completed! 🎉</p>
                <p className="text-sm mt-1">New actions will appear as you journal</p>
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