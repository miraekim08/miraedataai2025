"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Frown, Meh, Smile, Brain, Clock } from "lucide-react";

interface CompleteTaskDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onComplete: (feedback: {
        actualMinutes: number;
        feelingAboutProgress: string;
        feelingAboutMaterial: 'easy' | 'normal' | 'hard';
    }) => void;
    taskTitle: string;
    estimatedMinutes: number;
    elapsedMinutes: number;
}

export function CompleteTaskDialog({
    isOpen,
    onOpenChange,
    onComplete,
    taskTitle,
    estimatedMinutes,
    elapsedMinutes
}: CompleteTaskDialogProps) {
    const [actualMinutes, setActualMinutes] = useState(elapsedMinutes || estimatedMinutes);
    const [feelingAboutProgress, setFeelingAboutProgress] = useState("satisfied");
    const [feelingAboutMaterial, setFeelingAboutMaterial] = useState<'easy' | 'normal' | 'hard'>("normal");

    const handleSubmit = () => {
        onComplete({
            actualMinutes: Number(actualMinutes),
            feelingAboutProgress,
            feelingAboutMaterial
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Task Completed!</DialogTitle>
                    <DialogDescription>
                        Great job completing &quot;{taskTitle}&quot;. Let us know how it went to optimize your plan.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Time Spent */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                How many minutes did you spend?
                            </Label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                value={actualMinutes}
                                onChange={(e) => setActualMinutes(Number(e.target.value))}
                                className="w-24 font-bold text-blue-600 bg-blue-50"
                            />
                            <span className="text-sm text-muted-foreground italic">
                                Estimated: {estimatedMinutes} min | Recorded: {elapsedMinutes} min
                            </span>
                        </div>
                    </div>

                    {/* Progress Feeling */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                            <Smile className="h-4 w-4 text-orange-500" />
                            How do you feel about your progress?
                        </Label>
                        <RadioGroup
                            value={feelingAboutProgress}
                            onValueChange={setFeelingAboutProgress}
                            className="flex justify-between gap-2"
                        >
                            <div className="flex-1">
                                <RadioGroupItem value="struggled" id="struggled" className="sr-only" />
                                <Label
                                    htmlFor="struggled"
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${feelingAboutProgress === 'struggled' ? 'border-orange-500 bg-orange-50' : 'border-transparent bg-slate-50'}`}
                                >
                                    <Frown className={`h-6 w-6 mb-1 ${feelingAboutProgress === 'struggled' ? 'text-orange-600' : 'text-slate-400'}`} />
                                    <span className="text-[10px]">Struggled</span>
                                </Label>
                            </div>
                            <div className="flex-1">
                                <RadioGroupItem value="satisfied" id="satisfied" className="sr-only" />
                                <Label
                                    htmlFor="satisfied"
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${feelingAboutProgress === 'satisfied' ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-slate-50'}`}
                                >
                                    <Meh className={`h-6 w-6 mb-1 ${feelingAboutProgress === 'satisfied' ? 'text-blue-600' : 'text-slate-400'}`} />
                                    <span className="text-[10px]">Satisfied</span>
                                </Label>
                            </div>
                            <div className="flex-1">
                                <RadioGroupItem value="great" id="great" className="sr-only" />
                                <Label
                                    htmlFor="great"
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${feelingAboutProgress === 'great' ? 'border-green-500 bg-green-50' : 'border-transparent bg-slate-50'}`}
                                >
                                    <Smile className={`h-6 w-6 mb-1 ${feelingAboutProgress === 'great' ? 'text-green-600' : 'text-slate-400'}`} />
                                    <span className="text-[10px]">Great!</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Material Difficulty */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-500" />
                            How was the study material?
                        </Label>
                        <RadioGroup
                            value={feelingAboutMaterial}
                            onValueChange={(val: 'easy' | 'normal' | 'hard') => setFeelingAboutMaterial(val)}
                            className="grid grid-cols-3 gap-2"
                        >
                            <div className="flex-1">
                                <RadioGroupItem value="easy" id="easy" className="sr-only" />
                                <Label
                                    htmlFor="easy"
                                    className={`flex items-center justify-center p-2 rounded-md border text-xs cursor-pointer transition-all ${feelingAboutMaterial === 'easy' ? 'border-green-500 bg-green-50 text-green-700 font-bold' : 'bg-slate-50 border-transparent'}`}
                                >
                                    Easy
                                </Label>
                            </div>
                            <div className="flex-1">
                                <RadioGroupItem value="normal" id="normal" className="sr-only" />
                                <Label
                                    htmlFor="normal"
                                    className={`flex items-center justify-center p-2 rounded-md border text-xs cursor-pointer transition-all ${feelingAboutMaterial === 'normal' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'bg-slate-50 border-transparent'}`}
                                >
                                    Normal
                                </Label>
                            </div>
                            <div className="flex-1">
                                <RadioGroupItem value="hard" id="hard" className="sr-only" />
                                <Label
                                    htmlFor="hard"
                                    className={`flex items-center justify-center p-2 rounded-md border text-xs cursor-pointer transition-all ${feelingAboutMaterial === 'hard' ? 'border-red-500 bg-red-50 text-red-700 font-bold' : 'bg-slate-50 border-transparent'}`}
                                >
                                    Hard
                                </Label>
                            </div>
                        </RadioGroup>
                        {feelingAboutMaterial === 'hard' && (
                            <p className="text-[10px] text-red-500 italic">
                                Note: Future similar tasks will be given more time to ensure focus.
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                        Complete & Regenerate Plan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
