"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import { generateSchedule } from "@/lib/schedule-generator";
import { generateStudyPlan } from "@/lib/ai-service";
import type { TestPreparation, Unit, StudyMaterial } from "@/types";
import dayjs from "dayjs";
import { Plus, Sparkles, Loader2, FileText, File as FileIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";

const CALENDAR_COLORS = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' },
];

export function CreateTestDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);

    // Form state
    const [testName, setTestName] = useState("");
    const [testDate, setTestDate] = useState("");
    const [testColor, setTestColor] = useState(CALENDAR_COLORS[0].value);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [userGoals, setUserGoals] = useState("");

    const { addMaterial, setCurrentTestPrep, addTestPreparation, setSchedules, addUnit, user } = useStore();

    const resetForm = () => {
        setTestName("");
        setTestDate("");
        setTestColor(CALENDAR_COLORS[0].value);
        setUploadedFiles([]);
        setUserGoals("");
        setStep(1);
    };

    const handleNext = () => {
        if (step === 1 && testName && testDate) {
            setStep(2);
        } else if (step === 2 && uploadedFiles.length > 0) {
            setStep(3);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setUploadedFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreate = async () => {
        if (!testName || !testDate || uploadedFiles.length === 0) return;

        setIsGenerating(true);

        try {
            // 1. Create test preparation
            const testPrepId = `test-${Date.now()}`;
            const newTestPrep: TestPreparation = {
                id: testPrepId,
                userId: user?.id || 'user-1',
                testName,
                testDate: new Date(testDate),
                createdAt: new Date(),
                status: 'planning',
                totalEstimatedMinutes: 0,
                completedMinutes: 0,
                progressPercentage: 0,
                color: testColor,
            };

            // 2. Add uploaded materials to store
            const newMaterials: StudyMaterial[] = uploadedFiles.map(file => ({
                id: `material-${Date.now()}-${Math.random()}`,
                testPrepId: testPrepId,
                fileName: file.name,
                fileType: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.docx') ? 'docx' : 'txt',
                fileSize: file.size,
                uploadedAt: new Date(),
                fileUrl: URL.createObjectURL(file), // Mock URL
                materialType: 'other',
                processingStatus: 'completed',
                extractedMetadata: {
                    estimatedReadingMinutes: Math.ceil(file.size / 10000),
                },
            }));

            newMaterials.forEach(m => addMaterial(m));

            // 3. AI Planning
            const aiPlan = await generateStudyPlan({
                testName,
                testDate: new Date(testDate),
                materials: newMaterials.map(m => m.fileName),
                userGoals,
                studyType: user?.preferences.studyType || 'balanced',
                intensityLevel: user?.preferences.intensityLevel || 'moderate',
            });

            const dailyMinutes = aiPlan?.dailyMinutes || 180;
            const newUnits: Unit[] = [];

            if (aiPlan?.focusAreas) {
                aiPlan.focusAreas.forEach((area: string, index: number) => {
                    const unit: Unit = {
                        id: `unit-${Date.now()}-${index}`,
                        testPrepId: testPrepId,
                        title: area,
                        order: index + 1,
                        materialIds: newMaterials.map(m => m.id),
                        estimatedMinutes: Math.floor(dailyMinutes * 2),
                        difficultyLevel: 'medium',
                        topics: [area],
                        status: 'not_started',
                    };
                    newUnits.push(unit);
                    addUnit(unit);
                });
            } else {
                // Default units from materials
                newMaterials.forEach((m, index) => {
                    const unit: Unit = {
                        id: `unit-${Date.now()}-${index}`,
                        testPrepId: testPrepId,
                        title: m.fileName.replace(/\.[^/.]+$/, ""),
                        order: index + 1,
                        materialIds: [m.id],
                        estimatedMinutes: m.extractedMetadata.estimatedReadingMinutes || 120,
                        difficultyLevel: 'medium',
                        topics: [],
                        status: 'not_started',
                    };
                    newUnits.push(unit);
                    addUnit(unit);
                });
            }

            newTestPrep.totalEstimatedMinutes = newUnits.reduce((sum, u) => sum + u.estimatedMinutes, 0);

            // 4. Save test & schedules
            addTestPreparation(newTestPrep);
            setCurrentTestPrep(newTestPrep);

            const schedules = generateSchedule({
                testPrep: newTestPrep,
                units: newUnits,
                dailyMinutes,
                bufferDays: user?.preferences.bufferDays || 2,
            });

            setSchedules(schedules);

            setOpen(false);
            resetForm();
            setIsGenerating(false);
            router.push(`/study-plan/${testPrepId}`);
        } catch (error) {
            console.error("Error creating test:", error);
            setIsGenerating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen) resetForm();
        }}>
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg hover:shadow-xl transition-all">
                    <Plus className="h-4 w-4" />
                    Create New Test
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden">
                <div className="p-6 border-b bg-slate-50/50">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-1">
                            {step === 1 && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-tighter">Step 1: Details</span>}
                            {step === 2 && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full uppercase tracking-tighter">Step 2: Materials</span>}
                            {step === 3 && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-tighter">Step 3: Goals</span>}
                        </div>
                        <DialogTitle className="text-2xl font-black text-slate-800">
                            {step === 1 ? "Start Your Study Plan" : step === 2 ? "Upload Your Resources" : "Personalize with AI"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            {step === 1 ? "Pick a subject and choose your theme." : step === 2 ? "Upload the files you want the AI to analyze." : "Tell us about your learning style."}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    {step === 1 && (
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="test-name" className="text-xs font-bold uppercase tracking-widest text-slate-400">Test Name</Label>
                                <Input
                                    id="test-name"
                                    placeholder="e.g., Organic Chemistry Midterm"
                                    value={testName}
                                    onChange={(e) => setTestName(e.target.value)}
                                    className="h-12 text-lg font-bold border-slate-200"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="test-date" className="text-xs font-bold uppercase tracking-widest text-slate-400">Exam Date</Label>
                                <Input
                                    id="test-date"
                                    type="date"
                                    min={dayjs().format('YYYY-MM-DD')}
                                    value={testDate}
                                    onChange={(e) => setTestDate(e.target.value)}
                                    className="h-12 border-slate-200 font-medium"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Theme Color</Label>
                                <div className="flex flex-wrap gap-3 p-1">
                                    {CALENDAR_COLORS.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() => setTestColor(color.value)}
                                            className={`w-10 h-10 rounded-xl transition-all ${testColor === color.value ? 'ring-4 ring-offset-2 ring-slate-200 scale-110 shadow-md' : 'hover:scale-105 opacity-60 hover:opacity-100'}`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid gap-4">
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                    if (e.dataTransfer.files) {
                                        setUploadedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files as FileList)]);
                                    }
                                }}
                                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'}`}
                            >
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm border">
                                    <FileIcon className="h-6 w-6 text-slate-400" />
                                </div>
                                <p className="text-sm font-bold text-slate-700">Drag & Drop Study Materials</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1 mb-4">PDF, DOCX, TXT Required</p>

                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.docx,.txt"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="test-upload"
                                />
                                <label htmlFor="test-upload">
                                    <Button asChild size="sm" variant="outline" className="font-bold border-slate-200">
                                        <span>Choose Files</span>
                                    </Button>
                                </label>
                            </div>

                            {uploadedFiles.length > 0 && (
                                <div className="grid gap-2 max-h-40 overflow-y-auto pr-2">
                                    {uploadedFiles.map((file, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-white border rounded-xl shadow-sm group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                <span className="text-xs font-bold text-slate-600 truncate">{file.name}</span>
                                            </div>
                                            <button onClick={() => removeFile(i)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {uploadedFiles.length === 0 && (
                                <p className="text-[10px] text-center text-red-500 font-bold uppercase tracking-widest">
                                    * At least one file is required for AI generation
                                </p>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="grid gap-4">
                            <div className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                                <Sparkles className="h-6 w-6 text-blue-600 fill-blue-600" />
                                <p className="text-xs text-blue-900 font-medium">
                                    AI will analyze your <span className="font-bold">{uploadedFiles.length} files</span> and create a schedule tailored to your goals.
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="user-goals" className="text-xs font-bold uppercase tracking-widest text-slate-400">Focus Areas & Learning Style</Label>
                                <Textarea
                                    id="user-goals"
                                    placeholder="e.g., I want to focus on thermodynamics. I'm a visual learner. Keep it light on weekends."
                                    value={userGoals}
                                    onChange={(e) => setUserGoals(e.target.value)}
                                    rows={5}
                                    className="resize-none border-slate-200 rounded-xl p-4 text-sm font-medium"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 bg-slate-50/50 border-t">
                    <div className="flex items-center justify-between w-full">
                        <Button variant="ghost" onClick={() => { setOpen(false); resetForm(); }} disabled={isGenerating} className="text-slate-500 font-bold">
                            Cancel
                        </Button>
                        <div className="flex gap-2">
                            {step > 1 && (
                                <Button variant="outline" onClick={() => setStep(prev => prev - 1)} disabled={isGenerating} className="font-bold border-slate-200">
                                    Back
                                </Button>
                            )}
                            {step < 3 ? (
                                <Button onClick={handleNext} disabled={(step === 1 && (!testName || !testDate)) || (step === 2 && uploadedFiles.length === 0)} className="font-black px-8">
                                    Continue
                                </Button>
                            ) : (
                                <Button onClick={handleCreate} disabled={isGenerating} className="font-black px-10 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Generate Plan
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
