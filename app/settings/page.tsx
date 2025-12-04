"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStore } from "@/lib/store";
import type { UserPreferences } from "@/types";

export default function SettingsPage() {
    const { user, setUser } = useStore();
    const [preferences, setPreferences] = useState<UserPreferences>(
        user?.preferences || {
            studyType: 'balanced',
            intensityLevel: 'moderate',
            spacedRepetition: true,
            preferredStudyTime: 'evening',
            bufferDays: 2,
            activeRecallFrequency: 'medium',
        }
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        if (!user) return;
        setIsSaving(true);

        // Update user preferences
        setUser({
            ...user,
            preferences,
        });

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
        }, 500);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your study preferences and account settings
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p className="text-muted-foreground">{user?.fullName || 'Not set'}</p>
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-muted-foreground">{user?.email || 'Not set'}</p>
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Timezone</Label>
                        <p className="text-muted-foreground">{user?.timezone || 'Not set'}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Study Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Study Type */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Study Type</Label>
                        <RadioGroup
                            value={preferences.studyType}
                            onValueChange={(value) =>
                                setPreferences({ ...preferences, studyType: value as UserPreferences['studyType'] })
                            }
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="visual" id="visual" />
                                <Label htmlFor="visual" className="font-normal">
                                    <span className="font-medium">Visual Learner</span> - Prioritizes diagrams, charts, and concept mapping
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="reading" id="reading" />
                                <Label htmlFor="reading" className="font-normal">
                                    <span className="font-medium">Reading-Focused</span> - Emphasizes textbook reading and note review
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="practice" id="practice" />
                                <Label htmlFor="practice" className="font-normal">
                                    <span className="font-medium">Practice-Driven</span> - Front-loads problem-solving exercises
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="balanced" id="balanced" />
                                <Label htmlFor="balanced" className="font-normal">
                                    <span className="font-medium">Balanced</span> - Even distribution across reading, review, and practice
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Intensity Level */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Intensity Level</Label>
                        <RadioGroup
                            value={preferences.intensityLevel}
                            onValueChange={(value) =>
                                setPreferences({ ...preferences, intensityLevel: value as UserPreferences['intensityLevel'] })
                            }
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="light" id="light" />
                                <Label htmlFor="light" className="font-normal">
                                    <span className="font-medium">Light</span> (1-2 hours/day)
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="moderate" id="moderate" />
                                <Label htmlFor="moderate" className="font-normal">
                                    <span className="font-medium">Moderate</span> (2-4 hours/day)
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="intensive" id="intensive" />
                                <Label htmlFor="intensive" className="font-normal">
                                    <span className="font-medium">Intensive</span> (4-6 hours/day)
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Preferred Study Time */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Preferred Study Time</Label>
                        <RadioGroup
                            value={preferences.preferredStudyTime}
                            onValueChange={(value) =>
                                setPreferences({ ...preferences, preferredStudyTime: value as UserPreferences['preferredStudyTime'] })
                            }
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="morning" id="morning" />
                                <Label htmlFor="morning" className="font-normal">Morning</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="afternoon" id="afternoon" />
                                <Label htmlFor="afternoon" className="font-normal">Afternoon</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="evening" id="evening" />
                                <Label htmlFor="evening" className="font-normal">Evening</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="flexible" id="flexible" />
                                <Label htmlFor="flexible" className="font-normal">Flexible</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Spaced Repetition */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Spaced Repetition</Label>
                        <RadioGroup
                            value={preferences.spacedRepetition ? "enabled" : "disabled"}
                            onValueChange={(value) =>
                                setPreferences({ ...preferences, spacedRepetition: value === "enabled" })
                            }
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="enabled" id="spaced-yes" />
                                <Label htmlFor="spaced-yes" className="font-normal">Enabled - Review previous material regularly</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="disabled" id="spaced-no" />
                                <Label htmlFor="spaced-no" className="font-normal">Disabled - Focus only on new content</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Buffer Days */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Buffer Days Before Test</Label>
                        <RadioGroup
                            value={preferences.bufferDays.toString()}
                            onValueChange={(value) =>
                                setPreferences({ ...preferences, bufferDays: parseInt(value) })
                            }
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="0" id="buffer-0" />
                                <Label htmlFor="buffer-0" className="font-normal">0 days</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="buffer-1" />
                                <Label htmlFor="buffer-1" className="font-normal">1 day</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="2" id="buffer-2" />
                                <Label htmlFor="buffer-2" className="font-normal">2 days</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="3" id="buffer-3" />
                                <Label htmlFor="buffer-3" className="font-normal">3 days</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="pt-4">
                        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
                            {isSaving ? 'Saving...' : 'Save Preferences'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
