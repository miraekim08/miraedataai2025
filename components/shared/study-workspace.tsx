"use client";

import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, FileText, PenLine, Sparkles, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StudyWorkspace() {
    const {
        currentSession,
        schedules,
        materials,
        sessionNotes,
        setSessionNotes,
        setShowWorkspace
    } = useStore();

    if (!currentSession) return null;

    const task = schedules
        .flatMap(s => s.tasks)
        .find(t => t.id === currentSession.taskId);

    if (!task) return null;

    const material = task.materialReferences?.[0]?.materialId
        ? materials.find(m => m.id === task.materialReferences[0].materialId)
        : null;

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">{task.description}</h2>
                        <p className="text-xs text-muted-foreground">Active Study Session • {material?.fileName || 'General Study'}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowWorkspace(false)}
                    className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Button>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

                {/* Column 1: Summary */}
                <Card className="flex flex-col overflow-hidden border-none shadow-md bg-gradient-to-b from-blue-50/50 to-white">
                    <CardHeader className="pb-3 border-b bg-white/50 backdrop-blur-sm">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-700">
                            <Sparkles className="h-4 w-4" />
                            AI Concept Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <div className="h-full p-4 overflow-auto">
                            <div className="space-y-4 prose prose-sm">
                                <div className="p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Key Highlights</h4>
                                    <ul className="text-xs space-y-2 text-slate-600 list-disc pl-4">
                                        <li>Focus on the relationship between enthalpy and temperature.</li>
                                        <li>Remember to distinguish between state and path functions.</li>
                                        <li>The First Law of Thermodynamics is foundational for the upcoming problem set.</li>
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-slate-800">Overview</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        This section covers the fundamental principles of energy conservation. You will explore how heat and work interact within closed systems, specifically focusing on Enthalpy (H) as a measure of total heat content.
                                    </p>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Pay special attention to the sign conventions for ΔU = Q + W, as this is a common area for errors in the midterm.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Column 2: Personal Notes */}
                <Card className="flex flex-col overflow-hidden border-none shadow-md">
                    <CardHeader className="pb-3 border-b bg-white shadow-sm">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                            <PenLine className="h-4 w-4 text-orange-500" />
                            Study Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden relative">
                        <Textarea
                            className="h-full w-full p-6 resize-none border-none focus-visible:ring-0 text-sm leading-relaxed bg-[#fffcf0]"
                            placeholder="Write your thoughts, key formulas, or questions here..."
                            value={sessionNotes}
                            onChange={(e) => setSessionNotes(e.target.value)}
                        />
                        <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 italic">
                            Saved automatically to your session
                        </div>
                    </CardContent>
                </Card>

                {/* Column 3: Material Content */}
                <Card className="flex flex-col overflow-hidden border-none shadow-md">
                    <CardHeader className="pb-3 border-b bg-white shadow-sm">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                            <FileText className="h-4 w-4 text-purple-500" />
                            Study Material
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border ring-4 ring-slate-100/50">
                                <FileText className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-800">{material?.fileName || 'General Content'}</h3>
                            <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">
                                {task.materialReferences?.map(ref =>
                                    `${ref.sectionTitle || 'Ref'}: ${ref.pageRange || 'Full'}`
                                ).join(', ')}
                            </p>
                            <div className="mt-6 p-4 bg-white rounded-lg border border-dashed border-slate-300 w-full">
                                <p className="text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">AI Preview</p>
                                <p className="text-xs text-slate-400 italic">Material viewer integration placeholder...</p>
                            </div>
                            <Button variant="outline" size="sm" className="mt-6 text-xs bg-white">
                                Open Full Material
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
