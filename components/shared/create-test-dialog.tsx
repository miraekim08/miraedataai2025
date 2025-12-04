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
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/lib/store";
import { generateSchedule } from "@/lib/schedule-generator";
import type { TestPreparation } from "@/types";
import dayjs from "dayjs";
import { Plus } from "lucide-react";

export function CreateTestDialog() {
    const [open, setOpen] = useState(false);
    const [testName, setTestName] = useState("");
    const [testDate, setTestDate] = useState("");
    const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());

    const { materials, setCurrentTestPrep, addTestPreparation, setSchedules, user, units } = useStore();

    const handleCreate = () => {
        if (!testName || !testDate) return;

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

        addTestPreparation(newTestPrep);
        setCurrentTestPrep(newTestPrep);

        // Generate schedule
        const dailyMinutes = user?.preferences.intensityLevel === 'light' ? 90 :
            user?.preferences.intensityLevel === 'intensive' ? 300 : 180;

        const bufferDays = user?.preferences.bufferDays || 2;

        if (units.length > 0) {
            const schedules = generateSchedule({
                testPrep: newTestPrep,
                units,
                dailyMinutes,
                bufferDays,
            });
            setSchedules(schedules);
        }

        setOpen(false);
        setTestName("");
        setTestDate("");
        setSelectedMaterials(new Set());
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Test
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Create Test Preparation</DialogTitle>
                    <DialogDescription>
                        Set up a new test and generate your study schedule automatically.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="test-name">Test Name</Label>
                        <Input
                            id="test-name"
                            placeholder="e.g., Organic Chemistry Midterm"
                            value={testName}
                            onChange={(e) => setTestName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="test-date">Test Date</Label>
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
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={!testName || !testDate}>
                        Create & Generate Schedule
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
