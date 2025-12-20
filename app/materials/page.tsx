"use client";

import { FileText, File, X, GraduationCap, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import dayjs from "dayjs";
import { CreateTestDialog } from "@/components/shared/create-test-dialog";

export default function MaterialsPage() {
    const { materials, removeMaterial, testPreparations, setCurrentTestPrep } = useStore();

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-6">
            {/* Header with action */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800">Study Materials</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your resources and track your exam preparations
                    </p>
                </div>
                <CreateTestDialog />
            </div>

            {/* Study Plans Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-700">Exam Study Plans</h2>
                        <p className="text-xs text-muted-foreground mt-1">Select a plan to see your full study timeline</p>
                    </div>
                </div>

                {testPreparations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testPreparations.map((tp) => (
                            <Card
                                key={tp.id}
                                className="group cursor-pointer hover:shadow-xl transition-all border-none overflow-hidden relative bg-white shadow-sm"
                                onClick={() => {
                                    setCurrentTestPrep(tp);
                                    window.location.href = `/study-plan/${tp.id}`;
                                }}
                            >
                                <div
                                    className="absolute top-0 left-0 w-full h-1.5"
                                    style={{ backgroundColor: tp.color || '#3b82f6' }}
                                />
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div
                                            className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-blue-50 transition-colors shadow-inner"
                                            style={{ color: tp.color || '#3b82f6' }}
                                        >
                                            <GraduationCap className="h-6 w-6" />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {dayjs(tp.testDate).diff(dayjs(), 'day')} Days
                                            </span>
                                            <span className="text-[8px] font-bold text-slate-300 uppercase underline decoration-blue-500/30">Remaining</span>
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl mt-4 group-hover:text-blue-600 transition-colors font-black text-slate-800">
                                        {tp.testName}
                                    </CardTitle>
                                    <CardDescription className="text-xs font-medium">
                                        {dayjs(tp.testDate).format('dddd, MMMM D, YYYY')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-500 font-bold uppercase tracking-tight">Daily Efficiency</span>
                                                <span className="font-black text-slate-700">{tp.progressPercentage}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                                                <div
                                                    className="h-full transition-all duration-1000 ease-in-out"
                                                    style={{
                                                        width: `${tp.progressPercentage}% `,
                                                        backgroundColor: tp.color || '#3b82f6'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                            <div className="flex -space-x-2">
                                                {materials.filter(m => m.testPrepId === tp.id).slice(0, 3).map((m, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-7 h-7 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-[10px] font-black shadow-sm text-slate-600"
                                                        title={m.fileName}
                                                    >
                                                        {m.fileName[0]}
                                                    </div>
                                                ))}
                                                {materials.filter(m => m.testPrepId === tp.id).length > 3 && (
                                                    <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-500">
                                                        +{materials.filter(m => m.testPrepId === tp.id).length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-[10px] font-black uppercase tracking-widest h-8 px-3">
                                                Open Schedule
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border shadow-sm">
                            <Plus className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-slate-800 font-bold">No active test plans</h3>
                        <p className="text-slate-400 text-xs mt-1 max-w-[250px] mx-auto">Click &quot;Create New Test&quot; to generate your first AI-optimized study schedule.</p>
                    </div>
                )}
            </div>

            {/* Library Section (Historical Materials) */}

            {/* Materials List */}
            <Card className="border-none shadow-sm bg-white">
                <CardHeader className="pb-4 border-b border-slate-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold">Library ({materials.length})</CardTitle>
                            <CardDescription className="text-xs">
                                All processed documents and materials
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4">
                    {materials.length > 0 ? (
                        <div className="grid gap-3">
                            {materials.map((material) => (
                                <div
                                    key={material.id}
                                    className="flex items-center justify-between p-3.5 border border-slate-50 rounded-xl hover:bg-slate-50/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className={`p - 2 rounded - lg ${material.fileType === 'pdf' ? 'bg-red-50' : 'bg-blue-50'} shadow - sm`}>
                                            {material.fileType === 'pdf' ? (
                                                <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                                            ) : (
                                                <File className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-700 truncate">{material.fileName}</p>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                                                <span className="text-blue-500">{material.materialType}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span>{formatFileSize(material.fileSize)}</span>
                                                {material.extractedMetadata.estimatedReadingMinutes && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                        <span className="text-slate-500">~{material.extractedMetadata.estimatedReadingMinutes} min</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeMaterial(material.id)}
                                        className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all h-8 w-8"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-slate-300 text-sm font-medium">Your library is currently empty</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
