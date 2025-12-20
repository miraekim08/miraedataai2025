"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Target, Lightbulb, Zap } from "lucide-react";

interface StudyAdviceProps {
    advice?: {
        focusAreas: string[];
        studyTechniques: string[];
        timeline: string;
        customRecommendations: string;
    };
}

export function StudyAdvice({ advice }: StudyAdviceProps) {
    if (!advice) return null;

    return (
        <Card className="bg-blue-50/50 border-blue-200">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">AI Study Advice</CardTitle>
                </div>
                <CardDescription className="text-blue-700 font-medium">
                    Personalized strategy for your test
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Target className="h-4 w-4 text-orange-500" />
                        Key Focus Areas
                    </div>
                    <ul className="grid grid-cols-1 gap-1 pl-6">
                        {advice.focusAreas.map((area, i) => (
                            <li key={i} className="text-xs text-slate-600 list-disc">{area}</li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        Recommended Techniques
                    </div>
                    <div className="flex flex-wrap gap-1.5 pl-1">
                        {advice.studyTechniques.map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white border border-blue-100 rounded text-[10px] text-blue-700 font-medium">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Lightbulb className="h-4 w-4 text-blue-500" />
                        AI Recommendation
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                        &quot;{advice.customRecommendations}&quot;
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
