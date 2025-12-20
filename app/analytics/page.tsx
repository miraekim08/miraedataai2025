"use client";

import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, Calendar, TrendingUp, BookOpen } from "lucide-react";
import dayjs from "dayjs";

export default function AnalyticsPage() {
    const { schedules, currentTestPrep } = useStore();

    const totalMinutes = schedules.reduce((acc, s) => acc + s.actualMinutesSpent, 0);
    const totalTasksCompleted = schedules.reduce((acc, s) => acc + s.completedTasks, 0);
    const totalTasksScheduled = schedules.reduce((acc, s) => acc + s.totalTasks, 0);

    const completionRate = totalTasksScheduled > 0
        ? Math.round((totalTasksCompleted / totalTasksScheduled) * 100)
        : 0;

    const recentSchedules = [...schedules]
        .filter(s => s.actualMinutesSpent > 0 || s.completedTasks > 0)
        .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))
        .slice(0, 5);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">Track your study progress and performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</div>
                        <p className="text-xs text-muted-foreground mt-1">Across all sessions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTasksCompleted}</div>
                        <p className="text-xs text-muted-foreground mt-1">{totalTasksScheduled} total tasks scheduled</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completionRate}%</div>
                        <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
                            <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all"
                                style={{ width: `${completionRate}%` }}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Prep</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold truncate">{currentTestPrep?.testName || "None"}</div>
                        <p className="text-xs text-muted-foreground mt-1">Focusing on {currentTestPrep?.progressPercentage}%</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your last {recentSchedules.length} study days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentSchedules.length > 0 ? (
                            recentSchedules.map((schedule) => (
                                <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{dayjs(schedule.date).format('MMMM D, YYYY')}</p>
                                            <p className="text-xs text-muted-foreground">{schedule.completedTasks} tasks completed</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">{schedule.actualMinutesSpent}m</p>
                                        <p className="text-xs text-muted-foreground">Study time</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No recent activity found. Start studying to see your progress!</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
