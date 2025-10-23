"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, TrendingDown, Minus, Brain, Heart, Zap, Battery } from "lucide-react";
import type { Entry } from "@/API";

interface MetricsOverviewProps {
  entries: Entry[];
}

type TimePeriod = "daily" | "weekly" | "monthly" | "yearly" | "all";
type EnergyLevel = "Low" | "Medium" | "High";

interface Metric {
  name: string;
  value: number | string;
  change: number;
  icon: React.ReactNode;
  color: string;
  trend: "up" | "down" | "neutral";
  displayValue: string;
}

export function MetricsOverview({ entries }: MetricsOverviewProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("weekly");

  const timePeriods: { value: TimePeriod; label: string }[] = [
    { value: "daily", label: "Today" },
    { value: "weekly", label: "This Week" },
    { value: "monthly", label: "This Month" },
    { value: "yearly", label: "This Year" },
    { value: "all", label: "All Time" },
  ];

  // Date utilities
  const getStartOfPeriod = (date: Date, period: TimePeriod): Date => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    switch (period) {
      case "daily":
        return start;
      case "weekly":
        start.setDate(date.getDate() - date.getDay());
        return start;
      case "monthly":
        start.setDate(1);
        return start;
      case "yearly":
        start.setMonth(0, 1);
        return start;
      case "all":
        return new Date(0); // Beginning of time
      default:
        return start;
    }
  };

  const filterEntriesByPeriod = (period: TimePeriod): Entry[] => {
    if (period === "all") return entries;

    const now = new Date();
    const startOfPeriod = getStartOfPeriod(now, period);
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= startOfPeriod;
    });
  };

  const getPreviousPeriodEntries = (currentPeriod: TimePeriod): Entry[] => {
    if (currentPeriod === "all") return [];

    const now = new Date();
    let startOfCurrentPeriod = getStartOfPeriod(now, currentPeriod);
    let startOfPreviousPeriod = new Date(startOfCurrentPeriod);

    switch (currentPeriod) {
      case "daily":
        startOfPreviousPeriod.setDate(startOfCurrentPeriod.getDate() - 1);
        break;
      case "weekly":
        startOfPreviousPeriod.setDate(startOfCurrentPeriod.getDate() - 7);
        break;
      case "monthly":
        startOfPreviousPeriod.setMonth(startOfCurrentPeriod.getMonth() - 1);
        break;
      case "yearly":
        startOfPreviousPeriod.setFullYear(startOfCurrentPeriod.getFullYear() - 1);
        break;
    }

    const endOfPreviousPeriod = new Date(startOfCurrentPeriod);
    endOfPreviousPeriod.setMilliseconds(-1);

    return entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= startOfPreviousPeriod && entryDate < startOfCurrentPeriod;
    });
  };

  // Calculate percentage change (moved outside calculateMetrics)
  const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  // Calculate energy change
  const calculateEnergyChange = (current: EnergyLevel, previous: EnergyLevel): number => {
    const energyValues = { Low: 1, Medium: 2, High: 3 };
    const currentValue = energyValues[current];
    const previousValue = energyValues[previous];
    
    return calculatePercentageChange(currentValue, previousValue);
  };

  const calculateMetrics = (): Metric[] => {
    const currentEntries = filterEntriesByPeriod(timePeriod);
    const previousEntries = getPreviousPeriodEntries(timePeriod);

    if (currentEntries.length === 0) {
      return getEmptyMetrics();
    }

    // Calculate averages for numeric metrics
    const calculateAverage = (entries: Entry[], field: 'moodScore' | 'anxietyScore' | 'stressScore'): number => {
      const validEntries = entries.filter(entry => 
        entry[field] !== null && entry[field] !== undefined
      );
      return validEntries.length > 0 
        ? validEntries.reduce((sum, entry) => sum + (entry[field] as number), 0) / validEntries.length
        : 0;
    };

    // Current period values
    const currentMood = calculateAverage(currentEntries, 'moodScore');
    const currentAnxiety = calculateAverage(currentEntries, 'anxietyScore');
    const currentStress = calculateAverage(currentEntries, 'stressScore');
    const currentEnergy = getDominantEnergy(currentEntries);

    // Previous period values
    const previousMood = calculateAverage(previousEntries, 'moodScore');
    const previousAnxiety = calculateAverage(previousEntries, 'anxietyScore');
    const previousStress = calculateAverage(previousEntries, 'stressScore');
    const previousEnergy = getDominantEnergy(previousEntries);

    // Calculate changes
    const moodChange = calculatePercentageChange(currentMood, previousMood);
    const anxietyChange = calculatePercentageChange(currentAnxiety, previousAnxiety);
    const stressChange = calculatePercentageChange(currentStress, previousStress);
    const energyChange = calculateEnergyChange(currentEnergy, previousEnergy);

    return [
      createMetric("Mood", currentMood, moodChange, "up", <Brain className="h-4 w-4" />, "bg-blue-500"),
      createMetric("Anxiety", currentAnxiety, anxietyChange, "down", <Heart className="h-4 w-4" />, "bg-purple-500"),
      createMetric("Stress", currentStress, stressChange, "down", <Zap className="h-4 w-4" />, "bg-amber-500"),
      createEnergyMetric(currentEnergy, energyChange),
    ];
  };

  // Helper functions
  const getDominantEnergy = (entries: Entry[]): EnergyLevel => {
    const energyCounts = { Low: 0, Medium: 0, High: 0 };
    
    entries.forEach(entry => {
      if (entry.energyLevel) {
        const energy = String(entry.energyLevel).charAt(0).toUpperCase() + String(entry.energyLevel).slice(1).toLowerCase();
        if (energy === "Low" || energy === "Medium" || energy === "High") {
          energyCounts[energy as EnergyLevel]++;
        }
      }
    });

    const maxCount = Math.max(...Object.values(energyCounts));
    if (maxCount === 0) return "Medium";

    return (Object.entries(energyCounts).find(([, count]) => count === maxCount)?.[0] || "Medium") as EnergyLevel;
  };

  const getEnergyTrend = (change: number): "up" | "down" | "neutral" => {
    if (change > 5) return "up";
    if (change < -5) return "down";
    return "neutral";
  };

  const createMetric = (
    name: string,
    value: number,
    change: number,
    positiveTrend: "up" | "down",
    icon: React.ReactNode,
    color: string
  ): Metric => {
    const trend = change > 0 ? positiveTrend : change < 0 ? (positiveTrend === "up" ? "down" : "up") : "neutral";
    
    return {
      name,
      value,
      change: Math.abs(change),
      icon,
      color,
      trend,
      displayValue: value > 0 ? `${Math.round(value * 10) / 10}/10` : "-/10"
    };
  };

  const createEnergyMetric = (energy: EnergyLevel, change: number): Metric => {
    return {
      name: "Energy",
      value: energy,
      change: Math.abs(change),
      icon: <Battery className="h-4 w-4" />,
      color: getEnergyColor(energy),
      trend: getEnergyTrend(change),
      displayValue: energy
    };
  };

  const getEmptyMetrics = (): Metric[] => [
    {
      name: "Mood",
      value: 0,
      change: 0,
      icon: <Brain className="h-4 w-4" />,
      color: "bg-blue-500",
      trend: "neutral",
      displayValue: "-/10"
    },
    {
      name: "Anxiety",
      value: 0,
      change: 0,
      icon: <Heart className="h-4 w-4" />,
      color: "bg-purple-500",
      trend: "neutral",
      displayValue: "-/10"
    },
    {
      name: "Stress",
      value: 0,
      change: 0,
      icon: <Zap className="h-4 w-4" />,
      color: "bg-amber-500",
      trend: "neutral",
      displayValue: "-/10"
    },
    {
      name: "Energy",
      value: "Medium",
      change: 0,
      icon: <Battery className="h-4 w-4" />,
      color: "bg-gray-500",
      trend: "neutral",
      displayValue: "No data"
    }
  ];

  const getEnergyColor = (energy: EnergyLevel): string => {
    switch (energy) {
      case "High": return "bg-green-500";
      case "Medium": return "bg-amber-500";
      case "Low": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getEnergyBarWidth = (energy: EnergyLevel): string => {
    switch (energy) {
      case "High": return "w-full";
      case "Medium": return "w-2/3";
      case "Low": return "w-1/3";
      default: return "w-0";
    }
  };

  // Memoized calculations
  const metrics = useMemo(() => calculateMetrics(), [entries, timePeriod]);
  const totalEntries = useMemo(() => filterEntriesByPeriod(timePeriod).length, [entries, timePeriod]);

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3" />;
      case "down": return <TrendingDown className="h-3 w-3" />;
      default: return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "neutral", metricName: string) => {
    if (trend === "neutral") return "text-gray-500";
    
    const isPositive = (metricName === "Mood" || metricName === "Energy") ? 
      trend === "up" : trend === "down";
    
    return isPositive ? "text-green-600" : "text-red-600";
  };

  const shouldShowChange = (metric: Metric) => {
    return metric.change !== 0 && metric.trend !== "neutral";
  };

  // Helper to safely get energy level for the bar
  const getEnergyLevelForBar = (metric: Metric): EnergyLevel => {
    if (metric.name === "Energy" && typeof metric.value === "string") {
      const energy = metric.value as string;
      if (energy === "High" || energy === "Medium" || energy === "Low") {
        return energy as EnergyLevel;
      }
    }
    return "Medium"; // fallback
  };

  return (
    <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Wellness Metrics
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-blue-600 dark:text-blue-400">{totalEntries}</span> {totalEntries === 1 ? 'entry' : 'entries'} in{" "}
              <span className="font-medium text-purple-600 dark:text-purple-400">
                {timePeriods.find(p => p.value === timePeriod)?.label}
              </span>
            </p>
          </div>
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {/* Time Period Selector */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
          {timePeriods.map((period) => (
            <button
              key={period.value}
              onClick={() => setTimePeriod(period.value)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                timePeriod === period.value
                  ? "bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-gray-100"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {metrics.map((metric) => (
            <div
              key={metric.name}
              className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg border border-gray-200/50 dark:border-gray-600/30"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-3 rounded-full ${metric.color} text-white`}>
                  {metric.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {metric.name}
                    </h3>
                    {shouldShowChange(metric) && (
                      <div className={`flex items-center gap-1 ${getTrendColor(metric.trend, metric.name)}`}>
                        {getTrendIcon(metric.trend)}
                        <span className="text-xs font-medium">
                          {metric.change}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {metric.displayValue}
                    </span>
                    {metric.name !== "Energy" && typeof metric.value === "number" && metric.value > 0 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        out of 10
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {metric.name === "Energy" && metric.displayValue !== "No data" && (
                <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      getEnergyBarWidth(getEnergyLevelForBar(metric))
                    } ${
                      getEnergyColor(getEnergyLevelForBar(metric))
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span>Improving</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-red-600" />
              <span>Declining</span>
            </div>
            <div className="text-xs">
              vs. previous period
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { TrendingUp, TrendingDown, Minus, Brain, Heart, Zap, Battery } from "lucide-react";
// import type { Entry } from "@/API";

// interface MetricsOverviewProps {
//   entries: Entry[];
// }

// type TimePeriod = "daily" | "weekly" | "monthly" | "yearly" | "all";

// interface Metric {
//   name: string;
//   value: number | string;
//   change: number;
//   icon: React.ReactNode;
//   color: string;
//   trend: "up" | "down" | "neutral";
//   displayValue: string;
// }

// export function MetricsOverview({ entries }: MetricsOverviewProps) {
//   const [timePeriod, setTimePeriod] = useState<TimePeriod>("weekly");

//   const timePeriods: { value: TimePeriod; label: string }[] = [
//     { value: "daily", label: "Today" },
//     { value: "weekly", label: "This Week" },
//     { value: "monthly", label: "This Month" },
//     { value: "yearly", label: "This Year" },
//     { value: "all", label: "All Time" },
//   ];

//   const filterEntriesByPeriod = (period: TimePeriod): Entry[] => {
//     const now = new Date();
//     const filteredEntries = entries.filter(entry => {
//       const entryDate = new Date(entry.createdAt);
      
//       switch (period) {
//         case "daily":
//           return entryDate.toDateString() === now.toDateString();
//         case "weekly":
//           const startOfWeek = new Date(now);
//           startOfWeek.setDate(now.getDate() - now.getDay());
//           startOfWeek.setHours(0, 0, 0, 0);
//           return entryDate >= startOfWeek;
//         case "monthly":
//           return entryDate.getMonth() === now.getMonth() && 
//                  entryDate.getFullYear() === now.getFullYear();
//         case "yearly":
//           return entryDate.getFullYear() === now.getFullYear();
//         case "all":
//           return true;
//         default:
//           return true;
//       }
//     });

//     return filteredEntries;
//   };

//   const calculateMetrics = (): Metric[] => {
//     const filteredEntries = filterEntriesByPeriod(timePeriod);
    
//     if (filteredEntries.length === 0) {
//       return [
//         {
//           name: "Mood",
//           value: 0,
//           change: 0,
//           icon: <Brain className="h-4 w-4" />,
//           color: "bg-blue-500",
//           trend: "neutral",
//           displayValue: "-/10"
//         },
//         {
//           name: "Anxiety",
//           value: 0,
//           change: 0,
//           icon: <Heart className="h-4 w-4" />,
//           color: "bg-purple-500",
//           trend: "neutral",
//           displayValue: "-/10"
//         },
//         {
//           name: "Stress",
//           value: 0,
//           change: 0,
//           icon: <Zap className="h-4 w-4" />,
//           color: "bg-amber-500",
//           trend: "neutral",
//           displayValue: "-/10"
//         },
//         {
//           name: "Energy",
//           value: "Medium",
//           change: 0,
//           icon: <Battery className="h-4 w-4" />,
//           color: "bg-green-500",
//           trend: "neutral",
//           displayValue: "Medium"
//         }
//       ];
//     }

//     // Calculate current averages
//     const moodEntries = filteredEntries.filter(entry => entry.moodScore !== null);
//     const anxietyEntries = filteredEntries.filter(entry => entry.anxietyScore !== null);
//     const stressEntries = filteredEntries.filter(entry => entry.stressScore !== null);
//     const energyEntries = filteredEntries.filter(entry => entry.energyLevel !== null);

//     const currentMood = moodEntries.length > 0 
//       ? moodEntries.reduce((sum, entry) => sum + entry.moodScore!, 0) / moodEntries.length 
//       : 0;

//     const currentAnxiety = anxietyEntries.length > 0 
//       ? anxietyEntries.reduce((sum, entry) => sum + entry.anxietyScore!, 0) / anxietyEntries.length 
//       : 0;

//     const currentStress = stressEntries.length > 0 
//       ? stressEntries.reduce((sum, entry) => sum + entry.stressScore!, 0) / stressEntries.length 
//       : 0;

//     // Calculate energy level (most frequent)
//     const energyCounts: Record<string, number> = {};
//     energyEntries.forEach(entry => {
//       const energy = entry.energyLevel;
//       if (energy) {
//         energyCounts[energy] = (energyCounts[energy] || 0) + 1;
//       }
//     });
    
//     const currentEnergy = Object.keys(energyCounts).length > 0
//       ? Object.entries(energyCounts).sort(([,a], [,b]) => b - a)[0][0]
//       : "Medium";

//     // Calculate previous period for comparison
//     const getPreviousPeriodEntries = (): Entry[] => {
//       const now = new Date();
      
//       switch (timePeriod) {
//         case "daily":
//           const yesterday = new Date(now);
//           yesterday.setDate(now.getDate() - 1);
//           return entries.filter(entry => {
//             const entryDate = new Date(entry.createdAt);
//             return entryDate.toDateString() === yesterday.toDateString();
//           });
//         case "weekly":
//           const lastWeek = new Date(now);
//           lastWeek.setDate(now.getDate() - 7);
//           const startOfLastWeek = new Date(lastWeek);
//           startOfLastWeek.setDate(lastWeek.getDate() - lastWeek.getDay());
//           startOfLastWeek.setHours(0, 0, 0, 0);
//           const endOfLastWeek = new Date(startOfLastWeek);
//           endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
//           endOfLastWeek.setHours(23, 59, 59, 999);
//           return entries.filter(entry => {
//             const entryDate = new Date(entry.createdAt);
//             return entryDate >= startOfLastWeek && entryDate <= endOfLastWeek;
//           });
//         case "monthly":
//           const lastMonth = new Date(now);
//           lastMonth.setMonth(now.getMonth() - 1);
//           return entries.filter(entry => {
//             const entryDate = new Date(entry.createdAt);
//             return entryDate.getMonth() === lastMonth.getMonth() && 
//                    entryDate.getFullYear() === lastMonth.getFullYear();
//           });
//         case "yearly":
//           const lastYear = now.getFullYear() - 1;
//           return entries.filter(entry => {
//             const entryDate = new Date(entry.createdAt);
//             return entryDate.getFullYear() === lastYear;
//           });
//         default:
//           return [];
//       }
//     };

//     const previousEntries = getPreviousPeriodEntries();
    
//     const calculateChange = (current: number, previousEntries: Entry[], scoreField: keyof Entry): number => {
//       if (previousEntries.length === 0) return 0;
      
//       const previousScores = previousEntries
//         .filter(entry => entry[scoreField] !== null)
//         .map(entry => entry[scoreField] as number);
      
//       if (previousScores.length === 0) return 0;
      
//       const previousAvg = previousScores.reduce((sum, score) => sum + score, 0) / previousScores.length;
//       return ((current - previousAvg) / previousAvg) * 100;
//     };

//     const moodChange = calculateChange(currentMood, previousEntries, 'moodScore');
//     const anxietyChange = calculateChange(currentAnxiety, previousEntries, 'anxietyScore');
//     const stressChange = calculateChange(currentStress, previousEntries, 'stressScore');

//     // For energy level, calculate trend based on energy level changes
//     const calculateEnergyTrend = (): number => {
//       if (previousEntries.length === 0) return 0;
      
//       const previousEnergyEntries = previousEntries.filter(entry => entry.energyLevel !== null);
//       if (previousEnergyEntries.length === 0) return 0;
      
//       const currentEnergyValue = getEnergyValue(currentEnergy);
//       const previousEnergyCounts: Record<string, number> = {};
//       previousEnergyEntries.forEach(entry => {
//         const energy = entry.energyLevel;
//         if (energy) {
//           previousEnergyCounts[energy] = (previousEnergyCounts[energy] || 0) + 1;
//         }
//       });
      
//       const previousDominantEnergy = Object.keys(previousEnergyCounts).length > 0
//         ? Object.entries(previousEnergyCounts).sort(([,a], [,b]) => b - a)[0][0]
//         : "Medium";
      
//       const previousEnergyValue = getEnergyValue(previousDominantEnergy);
      
//       return ((currentEnergyValue - previousEnergyValue) / previousEnergyValue) * 100;
//     };

//     const energyChange = calculateEnergyTrend();

//     const getEnergyValue = (energy: string): number => {
//       switch (energy) {
//         case "High": return 3;
//         case "Medium": return 2;
//         case "Low": return 1;
//         default: return 2;
//       }
//     };

//     const getEnergyTrend = (change: number): "up" | "down" | "neutral" => {
//       if (change > 5) return "up";
//       if (change < -5) return "down";
//       return "neutral";
//     };

//     return [
//       {
//         name: "Mood",
//         value: Math.round(currentMood * 10) / 10,
//         change: moodChange,
//         icon: <Brain className="h-4 w-4" />,
//         color: "bg-blue-500",
//         trend: moodChange > 0 ? "up" : moodChange < 0 ? "down" : "neutral",
//         displayValue: `${Math.round(currentMood * 10) / 10}/10`
//       },
//       {
//         name: "Anxiety",
//         value: Math.round(currentAnxiety * 10) / 10,
//         change: anxietyChange,
//         icon: <Heart className="h-4 w-4" />,
//         color: "bg-purple-500",
//         trend: anxietyChange < 0 ? "up" : anxietyChange > 0 ? "down" : "neutral",
//         displayValue: `${Math.round(currentAnxiety * 10) / 10}/10`
//       },
//       {
//         name: "Stress",
//         value: Math.round(currentStress * 10) / 10,
//         change: stressChange,
//         icon: <Zap className="h-4 w-4" />,
//         color: "bg-amber-500",
//         trend: stressChange < 0 ? "up" : stressChange > 0 ? "down" : "neutral",
//         displayValue: `${Math.round(currentStress * 10) / 10}/10`
//       },
//       {
//         name: "Energy",
//         value: currentEnergy,
//         change: energyChange,
//         icon: <Battery className="h-4 w-4" />,
//         color: getEnergyColor(currentEnergy),
//         trend: getEnergyTrend(energyChange),
//         displayValue: currentEnergy
//       }
//     ];
//   };

//   const getEnergyColor = (energy: string): string => {
//     switch (energy) {
//       case "High": return "bg-green-500";
//       case "Medium": return "bg-amber-500";
//       case "Low": return "bg-red-500";
//       default: return "bg-gray-500";
//     }
//   };

//   const metrics = calculateMetrics();
//   const totalEntries = filterEntriesByPeriod(timePeriod).length;

//   const getTrendIcon = (trend: "up" | "down" | "neutral") => {
//     switch (trend) {
//       case "up":
//         return <TrendingUp className="h-3 w-3" />;
//       case "down":
//         return <TrendingDown className="h-3 w-3" />;
//       default:
//         return <Minus className="h-3 w-3" />;
//     }
//   };

//   const getTrendColor = (trend: "up" | "down" | "neutral", metricName: string) => {
//     if (trend === "neutral") return "text-gray-500";
    
//     // For mood and energy, up is good (green), down is bad (red)
//     if (metricName === "Mood" || metricName === "Energy") {
//       return trend === "up" ? "text-green-600" : "text-red-600";
//     }
    
//     // For anxiety and stress, down is good (green), up is bad (red)
//     return trend === "down" ? "text-green-600" : "text-red-600";
//   };

//   return (
//     <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
//       <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
//   <div className="flex items-center justify-between">
//     <div className="space-y-1">
//       <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
//         Wellness Metrics
//       </CardTitle>
//       <p className="text-sm text-gray-600 dark:text-gray-400">
//         <span className="font-medium text-blue-600 dark:text-blue-400">{totalEntries}</span> {totalEntries === 1 ? 'entry' : 'entries'} in{" "}
//         <span className="font-medium text-purple-600 dark:text-purple-400">
//           {timePeriods.find(p => p.value === timePeriod)?.label}
//         </span>
//       </p>
//     </div>
//     <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
//       <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//     </div>
//   </div>
// </CardHeader>
      
//       <CardContent>
//         {/* Time Period Selector */}
//           <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
//             {timePeriods.map((period) => (
//               <button
//                 key={period.value}
//                 onClick={() => setTimePeriod(period.value)}
//                 className={`px-3 py-1 text-xs rounded-md transition-colors ${
//                   timePeriod === period.value
//                     ? "bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-gray-100"
//                     : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
//                 }`}
//               >
//                 {period.label}
//               </button>
//             ))}
//           </div>

//         <div className="space-y-4">
//           {metrics.map((metric) => (
//             <div
//               key={metric.name}
//               className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg border border-gray-200/50 dark:border-gray-600/30"
//             >
//               <div className="flex items-center gap-4 flex-1">
//                 <div className={`p-3 rounded-full ${metric.color} text-white`}>
//                   {metric.icon}
//                 </div>
                
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-1">
//                     <h3 className="font-medium text-gray-900 dark:text-gray-100">
//                       {metric.name}
//                     </h3>
//                     <div className={`flex items-center gap-1 ${getTrendColor(metric.trend, metric.name)}`}>
//                       {getTrendIcon(metric.trend)}
//                       <span className="text-xs font-medium">
//                         {metric.change > 0 ? '+' : ''}{Math.abs(metric.change).toFixed(1)}%
//                       </span>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-baseline gap-2">
//                     <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                       {metric.displayValue}
//                     </span>
//                     {metric.name !== "Energy" && (
//                       <span className="text-sm text-gray-500 dark:text-gray-400">
//                         out of 10
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
              
//               {/* Energy level indicator bar */}
//               {metric.name === "Energy" && (
//                 <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
//                   <div 
//                     className={`h-2 rounded-full transition-all ${
//                       metric.value === "High" ? "bg-green-500 w-full" :
//                       metric.value === "Medium" ? "bg-amber-500 w-2/3" :
//                       "bg-red-500 w-1/3"
//                     }`}
//                   />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Legend */}
//         <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
//           <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
//             <div className="flex items-center gap-1">
//               <TrendingUp className="h-3 w-3 text-green-600" />
//               <span>Improving</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <TrendingDown className="h-3 w-3 text-red-600" />
//               <span>Declining</span>
//             </div>
//             <div className="text-xs">
//               vs. previous period
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }