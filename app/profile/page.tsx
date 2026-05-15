"use client";

import { AppHeader } from "../components/app-header"
import { Navigation } from "../components/navigation"
import { ProfileCard } from "../components/profile-card"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Settings, Bell, Shield, HelpCircle, LogOut, Brain, Target, TrendingUp, Download, Trash2, Calendar } from "lucide-react"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut, fetchUserAttributes } from 'aws-amplify/auth';
import type { AuthUser, FetchUserAttributesOutput } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { listEntries, listUserProfiles } from '../../src/graphql/queries';
import { updateUserProfile } from '../../src/graphql/mutations';
import type { Entry } from '../../src/API';

const client = generateClient();

// Helper functions
const calculateDayStreak = (entries: Entry[]): number => {
    if (entries.length === 0) return 0;

    const uniqueDays = new Set(
        entries.map(entry => new Date(entry.createdAt).toDateString())
    );

    let streak = 0;
    let currentDate = new Date();

    while (uniqueDays.has(currentDate.toDateString())) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
};

const getMostFrequentEmotion = (entries: Entry[]): string => {
    const emotionCount: Record<string, number> = {};
    entries.forEach(entry => {
        if (entry.detectedEmotions) {
            entry.detectedEmotions.forEach(emotion => {
                if (emotion) {
                    emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
                }
            });
        }
    });
    
    const mostFrequent = Object.entries(emotionCount)
        .sort(([,a], [,b]) => b - a)[0];
    
    return mostFrequent ? mostFrequent[0] : 'Reflective';
};

const getWeeklyAverage = (entries: Entry[]): number => {
    const last7Days = entries.filter(entry => {
        const entryDate = new Date(entry.createdAt);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return entryDate >= sevenDaysAgo;
    });
    
    return last7Days.length;
};

const getMostActiveDay = (entries: Entry[]): string => {
    const dayCount: Record<string, number> = {};
    entries.forEach(entry => {
        const day = new Date(entry.createdAt).toLocaleDateString('en', { weekday: 'long' });
        dayCount[day] = (dayCount[day] || 0) + 1;
    });
    
    const mostActive = Object.entries(dayCount)
        .sort(([,a], [,b]) => b - a)[0];
    
    return mostActive ? mostActive[0] + 's' : 'Weekends';
};

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
};

export default function ProfilePage() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [attributes, setAttributes] = useState<FetchUserAttributesOutput | null>(null);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [goals, setGoals] = useState<string[]>(["Reduce anxiety", "Better sleep", "Mindfulness"]);
    const [newGoal, setNewGoal] = useState('');
    const [profileId, setProfileId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
                const userAttributes = await fetchUserAttributes();
                setAttributes(userAttributes);
                const entriesData = await client.graphql({ query: listEntries });
                setEntries(entriesData.data.listEntries.items as Entry[]);

                const profileData = await client.graphql({ query: listUserProfiles });
                const profiles = profileData.data?.listUserProfiles?.items || [];
                if (profiles.length > 0) {
                    const profile = profiles[0];
                    setProfileId(profile.id);
                    if (profile.preferences) {
                        try {
                            const savedGoals = JSON.parse(profile.preferences);
                            if (Array.isArray(savedGoals) && savedGoals.length > 0) {
                                setGoals(savedGoals);
                            }
                        } catch (e) {
                            console.error("Failed to parse preferences", e);
                        }
                    }
                }
            } catch (error) {
                router.push('/login');
            }
        };
        fetchUserData();
    }, [router]);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleAddGoal = async () => {
        if (newGoal.trim() && !goals.includes(newGoal.trim())) {
            const updatedGoals = [...goals, newGoal.trim()];
            setGoals(updatedGoals);
            setNewGoal('');
            
            if (profileId) {
                try {
                    await client.graphql({
                        query: updateUserProfile,
                        variables: {
                            input: {
                                id: profileId,
                                preferences: JSON.stringify(updatedGoals)
                            }
                        }
                    });
                } catch (error) {
                    console.error("Error saving goal:", error);
                }
            }
        }
    };

    const handleRemoveGoal = async (goalToRemove: string) => {
        const updatedGoals = goals.filter(goal => goal !== goalToRemove);
        setGoals(updatedGoals);
        
        if (profileId) {
            try {
                await client.graphql({
                    query: updateUserProfile,
                    variables: {
                        input: {
                            id: profileId,
                            preferences: JSON.stringify(updatedGoals)
                        }
                    }
                });
            } catch (error) {
                console.error("Error removing goal:", error);
            }
        }
    };

    const handleExportData = () => {
        // Simple export functionality - could be enhanced with actual file download
        const exportData = {
            userInfo: {
                name: fullName,
                email: email,
                joinDate: joinDate
            },
            statistics: {
                totalEntries,
                currentStreak,
                avgEntryLength,
                weeklyAverage
            },
            entries: entries.map(entry => ({
                content: entry.content,
                createdAt: entry.createdAt,
                moodScore: entry.moodScore,
                anxietyScore: entry.anxietyScore,
                detectedEmotions: entry.detectedEmotions
            }))
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `journal-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // Implement account deletion logic here
            console.log('Account deletion requested');
        }
    };

    if (!attributes) {
        return (
            <div className="min-h-dvh bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading your profile...</p>
                </div>
            </div>
        );
    }

    // User data
    const firstName = attributes.given_name || '';
    const lastName = attributes.family_name || '';
    const fullName = `${attributes.given_name || ''} ${attributes.family_name || ''}`.trim();
    const email = attributes.email || '';
    const joinDate = formatDate(attributes.created_at);
    const totalEntries = entries.length;
    const currentStreak = calculateDayStreak(entries);
    const totalJournalingTime = entries.reduce((total, entry) => total + (entry.content?.length || 0), 0);
    const avgEntryLength = totalEntries > 0 ? Math.round(totalJournalingTime / totalEntries) : 0;
    const favoriteEmotion = getMostFrequentEmotion(entries);
    const weeklyAverage = getWeeklyAverage(entries);
    const mostActiveDay = getMostActiveDay(entries);

    return (
        <div className="min-h-dvh bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 pb-20">
            <AppHeader />
            <main className="mx-auto w-full max-w-4xl px-4 py-8 space-y-6">
                
                {/* Enhanced Profile Card */}
                <ProfileCard 
                    name={fullName}
                    email={email}
                    joinDate={joinDate}
                    totalEntries={totalEntries}
                    currentStreak={currentStreak}
                    goals={goals}
                    avgEntryLength={avgEntryLength}
                    favoriteEmotion={favoriteEmotion}
                />

                {/* Statistics Overview */}
                <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Your Statistics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalEntries}</div>
                                <div className="text-sm text-muted-foreground">Total Entries</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{currentStreak}</div>
                                <div className="text-sm text-muted-foreground">Day Streak</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/30">
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{avgEntryLength}</div>
                                <div className="text-sm text-muted-foreground">Avg. Words</div>
                            </div>
                            <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30">
                                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{weeklyAverage}</div>
                                <div className="text-sm text-muted-foreground">This Week</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Insights */}
                <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Brain className="h-5 w-5 text-purple-600" />
                            Personal Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100/50 dark:border-blue-800/30">
                            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Most Common Emotion</h4>
                            <p className="text-sm text-muted-foreground">
                                You frequently experience <strong className="text-blue-600 dark:text-blue-400">{favoriteEmotion}</strong> according to your journal entries
                            </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-100/50 dark:border-green-800/30">
                            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Writing Pattern</h4>
                            <p className="text-sm text-muted-foreground">
                                You write most consistently on <strong className="text-green-600 dark:text-green-400">{mostActiveDay}</strong>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Goal Setting */}
                <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Target className="h-5 w-5 text-red-600" />
                            Your Goals
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Add a new goal..."
                                value={newGoal}
                                onChange={(e) => setNewGoal(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-sm"
                            />
                            <Button onClick={handleAddGoal} size="sm">
                                Add
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {goals.map((goal, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                                    <span className="text-sm text-gray-900 dark:text-gray-100">{goal}</span>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleRemoveGoal(goal)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                
                {/* Data Management */}
                <Card className="border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Shield className="h-5 w-5 text-blue-600" />
                            Data & Privacy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                                <Download className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-sm">Export Your Data</p>
                                    <p className="text-xs text-muted-foreground">Download all your journal entries</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleExportData}>
                                Export
                            </Button>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                                <LogOut className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium text-sm">Sign Out</span>
                            </div>
                            <Button 
                                onClick={handleSignOut} 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                Sign Out
                            </Button>
                        </div>    

                        <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                                <Trash2 className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium text-sm">Delete Account</p>
                                    <p className="text-xs text-muted-foreground">Permanently remove your data</p>
                                </div>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={handleDeleteAccount}
                            >
                                Delete
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </main>
            <Navigation />
        </div>
    );
}