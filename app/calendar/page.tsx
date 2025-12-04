"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import dayjs from "dayjs";
import { Calendar as CalendarIcon, CheckCircle2, Circle } from "lucide-react";

export default function CalendarPage() {
    const { schedules } = useStore();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Study Calendar</h1>
                <p className="text-muted-foreground mt-1">
                    View your study schedule and progress
                </p>
            </div>

            <div className="grid gap-4">
                {schedules.map((schedule) => (
                    <Card key={schedule.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CalendarIcon className="h-5 w-5" />
                                    {dayjs(schedule.date).format('MMMM D, YYYY')}
                                </CardTitle>
                                <span className={`px-3 py-1 rounded-full text-sm ${schedule.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        schedule.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                            schedule.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-slate-100 text-slate-600'
                                    }`}>
                                    {schedule.status}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">
                                        {schedule.completedTasks}/{schedule.totalTasks} tasks
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                        style={{
                                            width: `${schedule.totalTasks > 0 ? (schedule.completedTasks / schedule.totalTasks) * 100 : 0}%`
                                        }}
                                    />
                                </div>
                                {schedule.tasks.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {schedule.tasks.map((task) => (
                                            <div key={task.id} className="flex items-start gap-2 text-sm">
                                                {task.status === 'completed' ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                                                ) : (
                                                    <Circle className="h-4 w-4 text-slate-400 mt-0.5" />
                                                )}
                                                <span className={task.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                                                    {task.description}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {schedules.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <CalendarIcon className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                            <p className="text-muted-foreground">No schedule created yet</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
