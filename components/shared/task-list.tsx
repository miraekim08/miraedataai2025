"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Pause, CheckCircle2, Timer, Coffee } from "lucide-react";
import type { Task, DailySchedule, StudySession } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CompleteTaskDialog } from "./complete-task-dialog";
import { TaskItem } from "./task-item";
import { cn } from "@/lib/utils";

interface TaskListProps {
    schedule?: DailySchedule;
}

const POMODORO_FOCUS_MINUTES = 25;
const POMODORO_BREAK_MINUTES = 5;

export function TaskList({ schedule }: TaskListProps) {
    const {
        updateTask,
        currentSession,
        startSession,
        pauseSession,
        resumeSession,
        endSession,
        materials
    } = useStore();
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isPomodoro, setIsPomodoro] = useState(false);
    const [pomodoroState, setPomodoroState] = useState<'focus' | 'break'>('focus');
    const [pomodoroTimeRemaining, setPomodoroTimeRemaining] = useState(POMODORO_FOCUS_MINUTES * 60);
    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
    const [pendingTask, setPendingTask] = useState<Task | null>(null);

    // Sync activeTaskId with currentSession if it exists (for persistence)
    useEffect(() => {
        if (currentSession && currentSession.status !== 'completed') {
            setActiveTaskId(currentSession.taskId);
        } else {
            setActiveTaskId(null);
        }
    }, [currentSession]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (currentSession?.status === 'active') {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);

                if (isPomodoro) {
                    setPomodoroTimeRemaining(prev => {
                        if (prev <= 1) {
                            // Cycle ended
                            const nextState = pomodoroState === 'focus' ? 'break' : 'focus';
                            setPomodoroState(nextState);
                            // Visual/Audio notification could go here
                            return (nextState === 'focus' ? POMODORO_FOCUS_MINUTES : POMODORO_BREAK_MINUTES) * 60;
                        }
                        return prev - 1;
                    });
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [currentSession?.status, isPomodoro, pomodoroState]);

    const handleStartTask = (task: Task) => {
        setActiveTaskId(task.id);
        setElapsedTime(0);
        setPomodoroTimeRemaining(POMODORO_FOCUS_MINUTES * 60);
        setPomodoroState('focus');

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

    const handleCompleteTaskClick = (task: Task) => {
        setPendingTask(task);
        setIsFeedbackDialogOpen(true);
    };

    const handleConfirmComplete = (feedback: {
        actualMinutes: number;
        feelingAboutProgress: string;
        feelingAboutMaterial: 'easy' | 'normal' | 'hard';
    }) => {
        if (!pendingTask) return;

        const { completeTaskWithFeedback } = useStore.getState();

        endSession();
        setActiveTaskId(null);

        if (schedule) {
            completeTaskWithFeedback(schedule.id, pendingTask.id, feedback);
        }
        setPendingTask(null);
    };

    const handleCompleteTask = (task: Task) => {
        // Legacy handler, now redirected to dialog
        handleCompleteTaskClick(task);
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
        <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-blue-600" />
                    <Label htmlFor="pomodoro-mode" className="text-sm font-medium">Pomodoro Mode</Label>
                </div>
                <Switch
                    id="pomodoro-mode"
                    checked={isPomodoro}
                    onCheckedChange={setIsPomodoro}
                />
            </div>

            <div className="space-y-3">
                {schedule.tasks.map((task, index) => {
                    const material = task.materialReferences?.[0]?.materialId
                        ? materials.find(m => m.id === task.materialReferences[0].materialId)
                        : undefined;

                    return (
                        <TaskItem
                            key={task.id}
                            task={task}
                            index={index}
                            material={material}
                            isActive={activeTaskId === task.id}
                            onStart={handleStartTask}
                            onComplete={handleCompleteTask}
                        />
                    );
                })}
            </div>

            {pendingTask && (
                <CompleteTaskDialog
                    isOpen={isFeedbackDialogOpen}
                    onOpenChange={setIsFeedbackDialogOpen}
                    onComplete={handleConfirmComplete}
                    taskTitle={pendingTask.description}
                    estimatedMinutes={pendingTask.estimatedMinutes}
                    elapsedMinutes={Math.floor(elapsedTime / 60)}
                />
            )}
        </div>
    );
}
