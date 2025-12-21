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
        <div className="flex flex-col h-full lg:h-[calc(100vh-8rem)] space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-3 md:p-4 rounded-xl border shadow-sm shrink-0">
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg shrink-0">
                        <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                    </div>
                    <div className="truncate">
                        <h2 className="text-sm md:text-lg font-bold text-slate-800 truncate">{task.description}</h2>
                        <p className="text-[10px] md:text-xs text-muted-foreground truncate">Active Session • {material?.fileName || 'General Study'}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowWorkspace(false)}
                    className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 shrink-0 h-8 md:h-10 px-2 md:px-4"
                >
                    <LayoutDashboard className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Back to Dashboard</span>
                </Button>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0 overflow-y-auto lg:overflow-visible pb-4 lg:pb-0">

                {/* Column 1: Summary */}
                <Card className="flex flex-col overflow-hidden border-none shadow-md bg-gradient-to-b from-blue-50/50 to-white min-h-[300px] lg:min-h-0">
                    <CardHeader className="py-2 md:py-3 border-b bg-white/50 backdrop-blur-sm">
                        <CardTitle className="text-xs md:text-sm font-bold flex items-center gap-2 text-blue-700">
                            <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
                            AI Concept Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <div className="h-full p-3 md:p-4 overflow-auto">
                            <div className="space-y-3 md:space-y-4 prose prose-sm">
                                <div className="p-2 md:p-3 bg-white rounded-lg border border-blue-100 shadow-sm">
                                    <h4 className="text-[10px] md:text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Key Highlights</h4>
                                    <ul className="text-[10px] md:text-xs space-y-1.5 md:space-y-2 text-slate-600 list-disc pl-4">
                                        <li>Focus on the relationship between enthalpy and temperature.</li>
                                        <li>Remember to distinguish between state and path functions.</li>
                                        <li>The First Law of Thermodynamics is foundational.</li>
                                    </ul>
                                </div>

                                <div className="space-y-1.5 md:space-y-2">
                                    <h4 className="text-xs md:text-sm font-semibold text-slate-800">Overview</h4>
                                    <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed">
                                        This section covers the fundamental principles of energy conservation. You will explore how heat and work interact within closed systems.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Column 2: Personal Notes */}
                <Card className="flex flex-col overflow-hidden border-none shadow-md min-h-[300px] lg:min-h-0">
                    <CardHeader className="py-2 md:py-3 border-b bg-white shadow-sm">
                        <CardTitle className="text-xs md:text-sm font-bold flex items-center gap-2 text-slate-700">
                            <PenLine className="h-3 w-3 md:h-4 md:w-4 text-orange-500" />
                            Study Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden relative">
                        <Textarea
                            className="h-full w-full p-4 md:p-6 resize-none border-none focus-visible:ring-0 text-xs md:text-sm leading-relaxed bg-[#fffcf0]"
                            placeholder="Write your thoughts here..."
                            value={sessionNotes}
                            onChange={(e) => setSessionNotes(e.target.value)}
                        />
                        <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 text-[9px] md:text-[10px] text-slate-400 italic">
                            Saved automatically
                        </div>
                    </CardContent>
                </Card>

                {/* Column 3: Material Content */}
                <Card className="flex flex-col overflow-hidden border-none shadow-md min-h-[300px] lg:min-h-0">
                    <CardHeader className="py-2 md:py-3 border-b bg-white shadow-sm">
                        <CardTitle className="text-xs md:text-sm font-bold flex items-center gap-2 text-slate-700">
                            <FileText className="h-3 w-3 md:h-4 md:w-4 text-purple-500" />
                            Study Material
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <div className="h-full flex flex-col items-center justify-center p-6 md:p-8 text-center bg-slate-50">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3 md:mb-4 border ring-4 ring-slate-100/50">
                                <FileText className="h-6 w-6 md:h-8 md:w-8 text-slate-400" />
                            </div>
                            <h3 className="text-xs md:text-sm font-bold text-slate-800 break-all px-2">{material?.fileName || 'General Content'}</h3>
                            <p className="text-[10px] md:text-xs text-muted-foreground mt-2 max-w-[200px]">
                                {task.materialReferences?.map(ref =>
                                    `${ref.sectionTitle || 'Ref'}: ${ref.pageRange || 'Full'}`
                                ).join(', ')}
                            </p>
                            <div className="mt-4 md:mt-6 p-3 md:p-4 bg-white rounded-lg border border-dashed border-slate-300 w-full">
                                <p className="text-[9px] md:text-[10px] text-slate-500 mb-2 uppercase font-bold tracking-widest">AI Preview</p>
                                <p className="text-[10px] md:text-xs text-slate-400 italic">Material viewer integration...</p>
                            </div>
                            <Button variant="outline" size="sm" className="mt-4 md:mt-6 text-[10px] md:text-xs bg-white">
                                Open Material
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
