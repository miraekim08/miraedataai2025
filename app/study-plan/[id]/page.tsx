"use client";

import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, CheckCircle2, Circle, ArrowLeft, X } from "lucide-react";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudyPlanPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { schedules, testPreparations, setCurrentTestPrep } = useStore();

    const testPrep = testPreparations.find(tp => tp.id === params.id);
    const testSchedules = schedules.filter(s => s.testPrepId === params.id).sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

    useEffect(() => {
        if (testPrep) {
            setCurrentTestPrep(testPrep);
        }
    }, [testPrep, setCurrentTestPrep]);

    if (!testPrep) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="p-4 bg-red-50 text-red-600 rounded-full">
                    <X className="h-12 w-12" />
                </div>
                <h1 className="text-2xl font-bold">Plan Not Found</h1>
                <Link href="/materials">
                    <Button variant="outline">Back to Materials</Button>
                </Link>
            </div>
        );
    }

    const testColor = testPrep.color || '#3b82f6';

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Materials
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl shadow-sm" style={{ backgroundColor: `${testColor} 15`, color: testColor }}>
                            <GraduationCap className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-800">{testPrep.testName}</h1>
                            <p className="text-muted-foreground">Comprehensive Study Timeline • {testSchedules.length} Days Planned</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Exam Date</p>
                        <p className="text-sm font-bold text-slate-700">{dayjs(testPrep.testDate).format('MMMM D, YYYY')}</p>
                    </div>
                    <Card className="bg-white px-6 py-3 border shadow-sm">
                        <div className="text-center font-bold text-2xl" style={{ color: testColor }}>
                            {testPrep.progressPercentage}%
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest text-center mt-1">Completion</div>
                    </Card>
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-12 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
                {testSchedules.map((schedule, idx) => {
                    const isToday = dayjs(schedule.date).isSame(dayjs(), 'day');
                    const isPast = dayjs(schedule.date).isBefore(dayjs(), 'day');

                    return (
                        <div key={schedule.id} className="relative pl-24 group">
                            {/* Date Marker */}
                            <div className={`absolute left - 0 top - 0 w - 16 text - center transition - all ${isToday ? 'scale-110' : ''} `}>
                                <div className={`text - [10px] font - bold uppercase tracking - tighter ${isToday ? 'text-blue-600' : 'text-slate-400'} `}>
                                    {dayjs(schedule.date).format('MMM')}
                                </div>
                                <div className={`text - 2xl font - black ${isToday ? 'text-blue-600' : 'text-slate-800'} `}>
                                    {dayjs(schedule.date).format('DD')}
                                </div>
                            </div>

                            {/* Timeline Node */}
                            <div
                                className={`absolute left - [30px] top - 4 w - 4 h - 4 rounded - full border - 4 bg - white z - 10 transition - all ${isToday ? 'ring-4 ring-blue-100 scale-125' : ''} `}
                                style={{ borderColor: isPast ? '#94a3b8' : isToday ? '#2563eb' : '#cbd5e1' }}
                            />

                            <Card className={`border - none shadow - md transition - all hover: translate - x - 1 ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''} `}>
                                <CardHeader className="py-4 border-b bg-white/50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-slate-400" />
                                            <h3 className="font-bold text-slate-700">
                                                {dayjs(schedule.date).format('dddd, MMMM D')}
                                                {isToday && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full">Today</span>}
                                            </h3>
                                        </div>
                                        <span className={`text - [10px] font - bold px - 2 py - 0.5 rounded - full uppercase tracking - widest ${schedule.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            schedule.status === 'active' ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-500'
                                            } `}>
                                            {schedule.status}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 bg-white">
                                    <div className="grid gap-3">
                                        {schedule.tasks.map(task => (
                                            <div
                                                key={task.id}
                                                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-all bg-slate-50/50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {task.status === 'completed' ? (
                                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <Circle className="h-5 w-5 text-slate-200" />
                                                    )}
                                                    <div>
                                                        <p className={`text - sm font - semibold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'} `}>
                                                            {task.description}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 font-medium">
                                                            {task.estimatedMinutes} mins • {task.taskType}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-300 uppercase letter tracking-widest">
                                                    {idx + 1}.{schedule.tasks.indexOf(task) + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
