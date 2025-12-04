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
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/lib/store";
import { generateSchedule } from "@/lib/schedule-generator";
import { generateStudyPlan } from "@/lib/ai-service";
import type { TestPreparation, Unit } from "@/types";
import dayjs from "dayjs";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateTestDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);

    // Form state
    const [testName, setTestName] = useState("");
    const [testDate, setTestDate] = useState("");
    const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
    const [userGoals, setUserGoals] = useState("");

    const { materials, setCurrentTestPrep, addTestPreparation, setSchedules, addUnit, user } = useStore();

    const resetForm = () => {
        setTestName("");
        setTestDate("");
        setSelectedMaterials(new Set());
        setUserGoals("");
        setStep(1);
    };

    const handleNext = () => {
        if (step === 1 && testName && testDate) {
            setStep(2);
        }
    };

    const handleCreate = async () => {
        if (!testName || !testDate) return;

        setIsGenerating(true);

        try {
            // Create test preparation
            const newTestPrep: TestPreparation = {
                id: `test-${Date.now()}`,
                userId: user?.id || 'user-1',
                testName,
                testDate: new Date(testDate),
                createdAt: new Date(),
                status: 'planning',
                totalEstimatedMinutes: 0,
                completedMinutes: 0,
                progressPercentage: 0,
            };

            // Get AI recommendations if user provided goals
            let aiPlan = null;
            if (userGoals.trim()) {
                const selectedMaterialNames = Array.from(selectedMaterials)
                    .map(id => materials.find(m => m.id === id)?.fileName)
                    .filter(Boolean) as string[];

                aiPlan = await generateStudyPlan({
                    testName,
                    testDate: new Date(testDate),
                    materials: selectedMaterialNames,
                    userGoals,
                    studyType: user?.preferences.studyType || 'balanced',
                    intensityLevel: user?.preferences.intensityLevel || 'moderate',
                });
            }

            // Use AI-suggested daily minutes or default based on intensity
            const dailyMinutes = aiPlan?.dailyMinutes ||
                (user?.preferences.intensityLevel === 'light' ? 90 :
                    user?.preferences.intensityLevel === 'intensive' ? 300 : 180);

            // Create units from selected materials or AI focus areas
            const newUnits: Unit[] = [];

            if (aiPlan?.focusAreas) {
                aiPlan.focusAreas.forEach((area: string, index: number) => {
                    const unit: Unit = {
                        id: `unit-${Date.now()}-${index}`,
                        testPrepId: newTestPrep.id,
                        title: area,
                        order: index + 1,
                        materialIds: Array.from(selectedMaterials),
                        estimatedMinutes: Math.floor(dailyMinutes * 2), // 2 days worth per focus area
                        difficultyLevel: 'medium',
                        topics: [area],
                        status: 'not_started',
                    };
                    newUnits.push(unit);
                    addUnit(unit);
                });
            } else if (selectedMaterials.size > 0) {
                // Create units from selected materials
                Array.from(selectedMaterials).forEach((materialId, index) => {
                    const material = materials.find(m => m.id === materialId);
                    if (material) {
                        const unit: Unit = {
                            id: `unit-${Date.now()}-${index}`,
                            testPrepId: newTestPrep.id,
                            title: material.fileName.replace(/\.[^/.]+$/, ""), // Remove extension
                            order: index + 1,
                            materialIds: [materialId],
                            estimatedMinutes: material.extractedMetadata.estimatedReadingMinutes || 120,
                            difficultyLevel: 'medium',
                            topics: [],
                            status: 'not_started',
                        };
                        newUnits.push(unit);
                        addUnit(unit);
                    }
                });
            } else {
                // Create a default unit
                const unit: Unit = {
                    id: `unit-${Date.now()}`,
                    testPrepId: newTestPrep.id,
                    title: `Study for ${testName}`,
                    order: 1,
                    materialIds: [],
                    estimatedMinutes: dailyMinutes * 3,
                    difficultyLevel: 'medium',
                    topics: [],
                    status: 'not_started',
                };
                newUnits.push(unit);
                addUnit(unit);
            }

            // Update test prep with total estimated minutes
            newTestPrep.totalEstimatedMinutes = newUnits.reduce((sum, u) => sum + u.estimatedMinutes, 0);

            // Save test preparation
            addTestPreparation(newTestPrep);
            setCurrentTestPrep(newTestPrep);

            // Generate schedule
            const bufferDays = user?.preferences.bufferDays || 2;
            const schedules = generateSchedule({
                testPrep: newTestPrep,
                units: newUnits,
                dailyMinutes,
                bufferDays,
            });

            setSchedules(schedules);

            // Close dialog and redirect
            setOpen(false);
            resetForm();
            setIsGenerating(false);

            // Redirect to dashboard
            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            console.error("Error creating test:", error);
            setIsGenerating(false);
        }
    };

    const toggleMaterial = (materialId: string) => {
        const newSelected = new Set(selectedMaterials);
        if (newSelected.has(materialId)) {
            newSelected.delete(materialId);
        } else {
            newSelected.add(materialId);
        }
        setSelectedMaterials(newSelected);
    };

    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            setOpen(newOpen);
            if (!newOpen) resetForm();
        }}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Test
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {step === 1 ? "Create Test Preparation" : "AI Study Planning"}
                    </DialogTitle>
                    <DialogDescription>
                        {step === 1
                            ? "Set up a new test and we'll generate your study schedule."
                            : "Tell us about your study goals and we'll optimize your schedule."}
                    </DialogDescription>
                </DialogHeader>

                {step === 1 ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="test-name">Test Name *</Label>
                            <Input
                                id="test-name"
                                placeholder="e.g., Organic Chemistry Midterm"
                                value={testName}
                                onChange={(e) => setTestName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="test-date">Test Date *</Label>
                            <Input
                                id="test-date"
                                type="date"
                                min={dayjs().format('YYYY-MM-DD')}
                                value={testDate}
                                onChange={(e) => setTestDate(e.target.value)}
                            />
                        </div>
                        {materials.length > 0 && (
                            <div className="grid gap-2">
                                <Label>Select Materials (Optional)</Label>
                                <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                                    {materials.map((material) => (
                                        <div key={material.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`material-${material.id}`}
                                                checked={selectedMaterials.has(material.id)}
                                                onCheckedChange={() => toggleMaterial(material.id)}
                                            />
                                            <label
                                                htmlFor={`material-${material.id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {material.fileName}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            <p className="text-sm text-blue-900">
                                AI will analyze your goals and create a personalized study plan
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="user-goals">What are your study goals and focus areas?</Label>
                            <Textarea
                                id="user-goals"
                                placeholder="Example: I struggle with thermodynamics and need extra practice on equilibrium problems. I'm a visual learner and prefer diagrams. I want to focus on understanding concepts deeply rather than memorization..."
                                value={userGoals}
                                onChange={(e) => setUserGoals(e.target.value)}
                                rows={6}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                Tell us about your learning style, weak areas, priorities, or any specific topics you want to focus on.
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {step === 2 && (
                        <Button variant="outline" onClick={() => setStep(1)} disabled={isGenerating}>
                            Back
                        </Button>
                    )}
                    <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }} disabled={isGenerating}>
                        Cancel
                    </Button>
                    {step === 1 ? (
                        <Button onClick={handleNext} disabled={!testName || !testDate}>
                            Next: AI Planning
                        </Button>
                    ) : (
                        <Button onClick={handleCreate} disabled={isGenerating}>
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Create & Generate
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
