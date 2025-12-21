"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Palette, CheckCircle2, Circle } from "lucide-react";

const CALENDAR_COLORS = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' },
];

export default function CalendarPage() {
    const { schedules, currentTestPrep, updateTestPrepColor, calendarView, setCalendarView } = useStore();
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [showColorPicker, setShowColorPicker] = useState(false);

    const testColor = currentTestPrep?.color || '#3b82f6';

    const getDaysInMonth = () => {
        const startOfMonth = currentDate.startOf('month');
        const days = [];

        // Add padding for start of month
        const startDay = startOfMonth.day();
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        for (let i = 1; i <= currentDate.daysInMonth(); i++) {
            days.push(startOfMonth.date(i));
        }

        return days;
    };

    const getSchedulesForDate = (date: dayjs.Dayjs) => {
        return schedules.filter(s => dayjs(s.date).isSame(date, 'day'));
    };

    const handlePrev = () => {
        if (calendarView === 'month') setCurrentDate(currentDate.subtract(1, 'month'));
        else if (calendarView === 'week') setCurrentDate(currentDate.subtract(1, 'week'));
        else setCurrentDate(currentDate.subtract(1, 'day'));
    };

    const handleNext = () => {
        if (calendarView === 'month') setCurrentDate(currentDate.add(1, 'month'));
        else if (calendarView === 'week') setCurrentDate(currentDate.add(1, 'week'));
        else setCurrentDate(currentDate.add(1, 'day'));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Study Calendar</h1>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                        View and manage your study blocks
                    </p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl w-fit">
                    {['day', 'week', 'month'].map((view) => (
                        <Button
                            key={view}
                            variant={calendarView === view ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setCalendarView(view as 'day' | 'week' | 'month')}
                            className={cn(
                                "h-8 px-3 text-xs capitalize transition-all",
                                calendarView === view ? 'bg-white shadow-sm font-bold text-blue-600' : 'text-slate-500'
                            )}
                        >
                            {view}
                        </Button>
                    ))}
                </div>
            </div>

            <Card className="border-none shadow-xl overflow-hidden rounded-2xl">
                <CardHeader className="bg-white border-b py-3 md:py-4 px-4 md:px-6">
                    <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-2 md:gap-4 shrink-0">
                            <h2 className="text-base md:text-xl font-bold text-slate-800 whitespace-nowrap">
                                {calendarView === 'month' ? currentDate.format('MMMM YYYY') :
                                    calendarView === 'week' ? `Week of ${currentDate.startOf('week').format('MMM D')}` :
                                        currentDate.format('MMM D, YYYY')}
                            </h2>
                            <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5">
                                <Button variant="ghost" size="icon" onClick={handlePrev} className="h-7 w-7 md:h-8 md:w-8 hover:bg-white hover:shadow-sm">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={handleNext} className="h-7 w-7 md:h-8 md:w-8 hover:bg-white hover:shadow-sm">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <div className="w-px h-4 bg-slate-200 mx-1 hidden md:block" />
                                <Button variant="ghost" size="sm" onClick={() => setCurrentDate(dayjs())} className="text-[10px] md:text-xs h-7 md:h-8 px-2">
                                    Today
                                </Button>
                            </div>
                        </div>

                        <div className="relative shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowColorPicker(!showColorPicker)}
                                className="gap-2 border-slate-200 h-8 md:h-9 px-2 md:px-3"
                            >
                                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: testColor }} />
                                <span className="text-[10px] md:text-xs font-bold text-slate-600 hidden sm:inline">Theme</span>
                                <Palette className="h-3 w-3 text-slate-400" />
                            </Button>

                            {showColorPicker && (
                                <div className="absolute right-0 mt-2 p-3 bg-white border rounded-2xl shadow-2xl z-50 w-48 border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Theme Color</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {CALENDAR_COLORS.map((color) => (
                                            <button
                                                key={color.value}
                                                className={`h-9 rounded-xl border-2 transition-all ${testColor === color.value ? 'border-slate-800 scale-105 shadow-md' : 'border-transparent hover:scale-105'}`}
                                                style={{ backgroundColor: color.value }}
                                                onClick={() => {
                                                    if (currentTestPrep) updateTestPrepColor(currentTestPrep.id, color.value);
                                                    setShowColorPicker(false);
                                                }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {calendarView === 'month' && (
                        <div className="bg-slate-50/50">
                            <div className="grid grid-cols-7 border-b bg-slate-100/50">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                                    <div key={day} className={`py-2 text-center text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest border-r last:border-r-0 ${i === 0 || i === 6 ? 'bg-slate-50' : ''}`}>
                                        <span className="hidden sm:inline">{day}</span>
                                        <span className="sm:hidden">{day[0]}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7">
                                {getDaysInMonth().map((date, idx) => {
                                    const daySchedules = date ? getSchedulesForDate(date) : [];
                                    const isToday = date?.isSame(dayjs(), 'day');
                                    const isWeekend = idx % 7 === 0 || idx % 7 === 6;

                                    return (
                                        <div
                                            key={idx}
                                            className={`min-h-[80px] md:min-h-[120px] p-1.5 md:p-2 border-r border-b last:border-r-0 relative group transition-colors ${!date ? 'bg-slate-50/30' : isWeekend ? 'bg-slate-50/10' : 'bg-white hover:bg-blue-50/30'}`}
                                        >
                                            {date && (
                                                <>
                                                    <span className={`text-[10px] md:text-xs font-bold inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-lg transition-colors ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 group-hover:text-blue-600'}`}>
                                                        {date.date()}
                                                    </span>
                                                    <div className="mt-1.5 md:mt-2 space-y-1">
                                                        {daySchedules.map(s => (
                                                            <div
                                                                key={s.id}
                                                                className="px-1.5 py-0.5 md:px-2 md:py-1 rounded-md text-[8px] md:text-[10px] font-black border-l-2 truncate shadow-sm backdrop-blur-sm"
                                                                style={{
                                                                    backgroundColor: `${testColor}15`,
                                                                    borderColor: testColor,
                                                                    color: testColor
                                                                }}
                                                            >
                                                                {s.tasks.length} {s.tasks.length === 1 ? 'Task' : 'Tasks'}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {(calendarView === 'week' || calendarView === 'day') && (
                        <div className="p-4 md:p-6 bg-slate-50/30 min-h-[400px]">
                            <div className="space-y-4 max-w-3xl mx-auto">
                                {(calendarView === 'week' ?
                                    Array.from({ length: 7 }).map((_, i) => currentDate.startOf('week').add(i, 'days')) :
                                    [currentDate]
                                ).map((date, i) => {
                                    const daySchedules = getSchedulesForDate(date);
                                    const isToday = date.isSame(dayjs(), 'day');

                                    return (
                                        <div key={i} className={`bg-white rounded-2xl border-none shadow-sm overflow-hidden transition-all hover:shadow-md ${isToday ? 'ring-2 ring-blue-500 ring-offset-4 scale-[1.01]' : ''}`}>
                                            <div className="px-4 py-3 bg-white border-b flex items-center justify-between">
                                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-3">
                                                    {date.format('dddd, MMMM D')}
                                                    {isToday && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-full">Today</span>}
                                                </h3>
                                            </div>
                                            <div className="p-3 md:p-4 space-y-2">
                                                {daySchedules.length > 0 ? (
                                                    daySchedules.map(s => (
                                                        <div key={s.id} className="space-y-2">
                                                            {s.tasks.map(t => (
                                                                <div
                                                                    key={t.id}
                                                                    className="flex items-center justify-between p-3 rounded-xl border-l-[3px] bg-white border border-slate-100 hover:border-blue-200 transition-all shadow-sm group"
                                                                    style={{ borderLeftColor: testColor }}
                                                                >
                                                                    <div className="flex items-center gap-3 min-w-0">
                                                                        <div className={`p-1.5 rounded-lg shrink-0 ${t.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors'}`}>
                                                                            {t.status === 'completed' ? (
                                                                                <CheckCircle2 className="h-4 w-4" />
                                                                            ) : (
                                                                                <Circle className="h-4 w-4" />
                                                                            )}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <p className={`text-xs md:text-sm font-bold truncate ${t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                                                                {t.description}
                                                                            </p>
                                                                            <div className="flex items-center gap-2 mt-1">
                                                                                <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.estimatedMinutes} mins</span>
                                                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                                                <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.taskType}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0 hidden sm:block ${s.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                                                                        {s.status}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-6 text-center">
                                                        <div className="p-3 bg-slate-50 rounded-2xl mb-2">
                                                            <Circle className="h-6 w-6 text-slate-200" />
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rest Day</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
