"use client";

import { CheckCircle2, Clock, Circle, BookOpen, Star, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task, StudyMaterial } from "@/types";
import { cn } from "@/lib/utils";

interface TaskItemProps {
    task: Task;
    index?: number;
    material?: StudyMaterial;
    isActive?: boolean;
    onStart?: (task: Task) => void;
    onComplete?: (task: Task) => void;
    variant?: 'default' | 'compact';
}

export function TaskItem({
    task,
    index,
    material,
    isActive,
    onStart,
    onComplete,
    variant = 'default'
}: TaskItemProps) {
    const isCompleted = task.status === 'completed';
    const isInProgress = task.status === 'in_progress';
    const isEssential = task.tags?.includes('essential');

    const materialName = material?.fileName.replace(/\.[^/.]+$/, "") || 'General Study';

    if (variant === 'compact') {
        return (
            <div className={cn(
                "p-2.5 rounded-xl border transition-all",
                isEssential ? "bg-orange-50/20 border-orange-100" : "bg-slate-50/50 border-slate-100"
            )}>
                <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                        {isCompleted ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                            <Circle className="h-3.5 w-3.5 text-slate-300" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="text-[10px] font-bold text-slate-700 truncate line-clamp-1">
                                {task.description}
                            </p>
                            {isEssential && (
                                <Star className="h-2.5 w-2.5 text-orange-400 fill-orange-400 shrink-0" />
                            )}
                        </div>

                        {isEssential && (
                            <p className="text-[9px] text-orange-600/80 font-medium leading-tight mb-1 line-clamp-1 italic">
                                AI: Foundational concept – master this.
                            </p>
                        )}

                        <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                            <span className="flex items-center gap-0.5">
                                <Clock className="h-2 w-2" />
                                {task.estimatedMinutes}m
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                            <span className="truncate">{task.taskType}</span>
                        </div>

                        {task.materialReferences?.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                                {task.materialReferences.slice(0, 1).map((ref, idx) => (
                                    <span key={idx} className="bg-blue-50/50 text-blue-600 px-1 py-0 rounded text-[8px] font-black border border-blue-100/50 truncate">
                                        {ref.sectionTitle || 'Ref'}: {ref.pageRange || 'N/A'}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "border rounded-lg p-4 transition-all",
                isCompleted ? "bg-green-50 border-green-200" :
                    isActive ? "bg-blue-50 border-blue-200 shadow-sm" :
                        isEssential ? "bg-orange-50/30 border-orange-200 ring-1 ring-orange-100/50" :
                            "hover:border-slate-300 hover:shadow-sm"
            )}
        >
            <div className="flex items-start gap-3">
                {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : isInProgress ? (
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0 animate-pulse" />
                ) : (
                    <Circle className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className={cn(
                            "text-sm font-medium",
                            isCompleted ? "line-through text-muted-foreground" : ""
                        )}>
                            {index !== undefined && (
                                <span className="text-blue-600 mr-1.5 font-bold">{index + 1}.</span>
                            )}
                            {task.description}
                        </p>
                        {isEssential && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-[10px] font-bold text-orange-700 border border-orange-200 shadow-sm">
                                <Star className="h-2.5 w-2.5 fill-orange-500" />
                                AI Essential
                            </span>
                        )}
                    </div>

                    {isEssential && !isCompleted && (
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
                        <span className="flex items-center gap-1 font-semibold text-slate-700 truncate min-w-0">
                            <BookOpen className="h-3 w-3 shrink-0" />
                            <span className="truncate">{materialName}</span>
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                            <Clock className="h-3 w-3" />
                            {task.estimatedMinutes} min
                        </span>
                        <span className="capitalize px-2 py-0.5 bg-slate-100 rounded shrink-0">
                            {task.taskType}
                        </span>
                    </div>
                </div>
            </div>

            {!isActive && task.status === 'pending' && onStart && (
                <div className="mt-3 pt-3 border-t">
                    <Button
                        size="sm"
                        onClick={() => onStart(task)}
                        className="w-full"
                    >
                        <Play className="h-3 w-3 mr-1" />
                        Start Task
                    </Button>
                </div>
            )}
        </div>
    );
}
