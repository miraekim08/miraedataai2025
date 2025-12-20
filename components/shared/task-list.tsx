"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Play, Pause, CheckCircle2, Circle, Clock, Coffee, Timer, BookOpen, Star, Sparkles } from "lucide-react";
import type { Task, DailySchedule, StudySession } from "@/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CompleteTaskDialog } from "./complete-task-dialog";

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
                    const materialName = task.materialReferences?.[0]?.materialId
                        ? materials.find(m => m.id === task.materialReferences[0].materialId)?.fileName.replace(/\.[^/.]+$/, "")
                        : null;

                    return (
                        <div
                            key={task.id}
                            className={`border rounded-lg p-4 transition-all ${task.status === 'completed' ? 'bg-green-50 border-green-200' :
                                activeTaskId === task.id ? 'bg-blue-50 border-blue-200 shadow-sm' :
                                    task.tags?.includes('essential') ? 'bg-orange-50/30 border-orange-200 ring-1 ring-orange-100/50' :
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
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                            <span className="text-blue-600 mr-1.5 font-bold">{index + 1}.</span>
                                            {task.description}
                                        </p>
                                        {task.tags?.includes('essential') && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-[10px] font-bold text-orange-700 border border-orange-200 shadow-sm animate-in fade-in zoom-in duration-500">
                                                <Star className="h-2.5 w-2.5 fill-orange-500" />
                                                AI Essential
                                            </span>
                                        )}
                                    </div>

                                    {task.tags?.includes('essential') && !task.status.includes('completed') && (
                                        <p className="text-[10px] text-orange-600 font-semibold mb-2 flex items-center gap-1 italic">
                                            <Sparkles className="h-3 w-3" />
                                            AI Nudge: Foundational concept – master this for exam success.
                                        </p>
                                    )}

                                    {/* Material References */}
                                    {task.materialReferences?.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-blue-700 font-medium">
                                            {task.materialReferences.map((ref, idx) => (
                                                <span key={idx} className="bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                                    {ref.sectionTitle || 'Ref'}: {ref.pageRange || 'N/A'}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                                            <BookOpen className="h-3 w-3" />
                                            {materialName || 'General Study'}
                                        </span>
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
                                    {isPomodoro ? (
                                        <div className="text-center bg-white rounded-lg p-3 border shadow-inner">
                                            <div className="flex items-center justify-center gap-2 mb-1">
                                                {pomodoroState === 'focus' ? (
                                                    <Timer className="h-4 w-4 text-red-500" />
                                                ) : (
                                                    <Coffee className="h-4 w-4 text-green-500" />
                                                )}
                                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    {pomodoroState === 'focus' ? 'Focus Session' : 'Short Break'}
                                                </span>
                                            </div>
                                            <div className={`text-3xl font-bold tabular-nums ${pomodoroState === 'focus' ? 'text-red-600' : 'text-green-600'}`}>
                                                {formatTime(pomodoroTimeRemaining)}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground mt-1">Total time: {formatTime(elapsedTime)}</p>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-blue-600 tabular-nums">
                                                {formatTime(elapsedTime)}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">Elapsed time</p>
                                        </div>
                                    )}

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
