"use client"
import type { Entry } from "@/API";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState } from "react"

interface StressChartProps {
  entries: Entry[];
}

export function StressChart({ entries }: StressChartProps) {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "year" | "all">("week");

  // Filter and transform data based on timeframe
  const getChartData = () => {
    const now = new Date();
    let filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      
      switch (timeframe) {
        case "day":
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return entryDate >= today && entryDate < tomorrow;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return entryDate >= weekAgo;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return entryDate >= monthAgo;
        case "year":
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          return entryDate >= yearAgo;
        case "all":
        default:
          return true;
      }
    });

    // Sort entries by date
    filteredEntries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // For daily view, show individual entries
    if (timeframe === "day") {
      return filteredEntries.map(entry => ({
        date: new Date(entry.createdAt).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        stress: entry.stressScore || 0,
        count: 1
      }));
    }

    // For other timeframes, group by date
    const groupedData: { [key: string]: { stress: number[], count: number } } = {};
    
    filteredEntries.forEach(entry => {
      const date = new Date(entry.createdAt);
      let key: string;
      
      switch (timeframe) {
        case "week":
          key = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
          break;
        case "month":
          key = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
          break;
        case "year":
          key = date.toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          });
          break;
        case "all":
        default:
          key = date.toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          });
          break;
      }
      
      if (!groupedData[key]) {
        groupedData[key] = { stress: [], count: 0 };
      }
      
      if (entry.stressScore) groupedData[key].stress.push(entry.stressScore);
      groupedData[key].count++;
    });

    // Convert to chart data format and calculate averages
    const chartData = Object.entries(groupedData).map(([date, data]) => ({
      date,
      stress: data.stress.length > 0 ? 
        Number((data.stress.reduce((a, b) => a + b, 0) / data.stress.length).toFixed(1)) : 0,
      count: data.count
    }));

    // Sort by date and limit to reasonable number of points
    return chartData
      .sort((a, b) => {
        try {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        } catch {
          return a.date.localeCompare(b.date);
        }
      })
      .slice(-10); // Show last 10 data points max
  };

  const chartData = getChartData();

  // Custom tooltip to show actual values
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <strong>{entry.value?.toFixed(1) || 0}/10</strong>
            </p>
          ))}
          <p className="text-xs text-muted-foreground mt-1">
            Entries: {payload[0]?.payload?.count || 0}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate overall averages
  const avgStress = chartData.length > 0 
    ? (chartData.reduce((sum, day) => sum + (day.stress || 0), 0) / chartData.length).toFixed(1)
    : "0.0";

  const totalEntries = chartData.reduce((sum, day) => sum + (day.count || 0), 0);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Stress Trends
          </CardTitle>
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="text-sm bg-background border border-border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  opacity={0.3} 
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  className="text-xs fill-muted-foreground"
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                  tickMargin={10}
                  interval={0}
                />
                <YAxis 
                  domain={[0, 10]} 
                  className="text-xs fill-muted-foreground"
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                  tickMargin={10}
                  ticks={[0, 2, 4, 6, 8, 10]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '5 5' }} />
                {/* Stress Area */}
                <Area
                  type="monotone"
                  dataKey="stress"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorStress)"
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                  name="Stress"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No data available for the selected timeframe
            </div>
          )}
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Avg Stress</p>
            <p className="text-lg font-semibold text-foreground">{avgStress}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Entries</p>
            <p className="text-lg font-semibold text-foreground">{totalEntries}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}