'use client';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Calendar, Target, TrendingUp, FileText, Heart } from "lucide-react"

interface ProfileCardProps {
    name?: string
    email?: string
    joinDate?: string
    currentStreak?: number
    totalEntries?: number
    goals?: string[]
    avgEntryLength?: number
    favoriteEmotion?: string
}

export function ProfileCard({
    name = "Alex Johnson",
    email = "alex@example.com",
    joinDate = "March 2024",
    currentStreak = 7,
    totalEntries = 42,
    goals = ["Reduce anxiety", "Better sleep", "Mindfulness"],
    avgEntryLength = 120,
    favoriteEmotion = "Reflective"
}: ProfileCardProps) {
    return (
        <Card className="w-full border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-blue-200 dark:border-blue-800">
                        <AvatarImage src="/professional-headshot.png" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-semibold">
                            {name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-foreground">{name}</h2>
                        <p className="text-sm text-muted-foreground">{email}</p>
                        {joinDate && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Joined {joinDate}</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-center border border-blue-100 dark:border-blue-800/30">
                        <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-lg font-semibold">{currentStreak}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                    <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3 text-center border border-green-100 dark:border-green-800/30">
                        <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400">
                            <Target className="h-4 w-4" />
                            <span className="text-lg font-semibold">{totalEntries}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Total Entries</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-3 text-center border border-purple-100 dark:border-purple-800/30">
                        <div className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400">
                            <FileText className="h-4 w-4" />
                            <span className="text-lg font-semibold">{avgEntryLength}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Avg Words</p>
                    </div>
                    <div className="rounded-lg bg-pink-50 dark:bg-pink-900/20 p-3 text-center border border-pink-100 dark:border-pink-800/30">
                        <div className="flex items-center justify-center gap-1 text-pink-600 dark:text-pink-400">
                            <Heart className="h-4 w-4" />
                            <span className="text-lg font-semibold capitalize">{favoriteEmotion}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Top Emotion</p>
                    </div>
                </div>

                <div>
                    <h3 className="mb-2 text-sm font-medium text-foreground">Current Goals</h3>
                    <div className="flex flex-wrap gap-2">
                        {goals.map((goal, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                {goal}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}