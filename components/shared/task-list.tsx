"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Play, Pause, CheckCircle2, Circle, Clock } from "lucide-react";
import type { Task, DailySchedule, StudySession } from "@/types";

interface TaskListProps {
    schedule?: DailySchedule;
}

export function TaskList({ schedule }: TaskListProps) {
    const { updateTask, currentSession, startSession, pauseSession, resumeSession, endSession } = useStore();
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    // Timer effect
    useEffect(() => {
        if (currentSession?.status === 'active') {
            const interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [currentSession?.status]);

    const handleStartTask = (task: Task) => {
        setActiveTaskId(task.id);
        setElapsedTime(0);
        const newSession: StudySession = {
            id: `session-${Date.now()}`,
            taskId: task.id,
            startedAt: new Date(),
            durationMinutes: 0,
            pausedDurations: [],
            status: 'active',
        };
        startSession(newSession);

        if (schedule) {
            updateTask(schedule.id, task.id, { status: 'in_progress' });
        }
    };

    const handlePauseTask = () => {
        pauseSession();
    };

    const handleResumeTask = () => {
        resumeSession();
    };

    const handleCompleteTask = (task: Task) => {
        endSession();
        setActiveTaskId(null);

        if (schedule) {
            updateTask(schedule.id, task.id, {
                status: 'completed',
                actualMinutes: Math.floor(elapsedTime / 60),
                completedAt: new Date(),
            });
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!schedule || schedule.tasks.length === 0) {
        return (
            <div className="text-center py-12">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <p className="text-lg font-medium">No tasks scheduled for today</p>
                <p className="text-sm text-muted-foreground mt-1">Enjoy your free time or plan ahead!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {schedule.tasks.map((task) => (
                <div
                    key={task.id}
                    className={`border rounded-lg p-4 transition-all ${task.status === 'completed' ? 'bg-green-50 border-green-200' :
                            activeTaskId === task.id ? 'bg-blue-50 border-blue-200 shadow-sm' :
                                'hover:border-slate-300 hover:shadow-sm'
                        }`}
                >
                    <div className="flex items-start gap-3">
                        {task.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : task.status === 'in_progress' ? (
                            <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0 animate-pulse" />
                        ) : (
                            <Circle className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                {task.description}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {task.estimatedMinutes} min
                                </span>
                                <span className="capitalize px-2 py-0.5 bg-slate-100 rounded">
                                    {task.taskType}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Timer Controls */}
                    {activeTaskId === task.id && currentSession && (
                        <div className="mt-3 pt-3 border-t space-y-3">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 tabular-nums">
                                    {formatTime(elapsedTime)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Elapsed time</p>
                            </div>
                            <div className="flex gap-2">
                                {currentSession.status === 'active' ? (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handlePauseTask}
                                        className="flex-1"
                                    >
                                        <Pause className="h-3 w-3 mr-1" />
                                        Pause
                                    </Button>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleResumeTask}
                                        className="flex-1"
                                    >
                                        <Play className="h-3 w-3 mr-1" />
                                        Resume
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    onClick={() => handleCompleteTask(task)}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Complete
                                </Button>
                            </div>
                        </div>
                    )}

                    {!activeTaskId && task.status === 'pending' && (
                        <div className="mt-3 pt-3 border-t">
                            <Button
                                size="sm"
                                onClick={() => handleStartTask(task)}
                                className="w-full"
                            >
                                <Play className="h-3 w-3 mr-1" />
                                Start Task
                            </Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
