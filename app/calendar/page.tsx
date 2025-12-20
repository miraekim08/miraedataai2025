"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Study Calendar</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage your study blocks
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <Button
                        variant={calendarView === 'day' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setCalendarView('day')}
                        className={calendarView === 'day' ? 'bg-white shadow-sm' : ''}
                    >
                        Day
                    </Button>
                    <Button
                        variant={calendarView === 'week' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setCalendarView('week')}
                        className={calendarView === 'week' ? 'bg-white shadow-sm' : ''}
                    >
                        Week
                    </Button>
                    <Button
                        variant={calendarView === 'month' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setCalendarView('month')}
                        className={calendarView === 'month' ? 'bg-white shadow-sm' : ''}
                    >
                        Month
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-white border-b py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold text-slate-800">
                                {calendarView === 'month' ? currentDate.format('MMMM YYYY') :
                                    calendarView === 'week' ? `Week of ${currentDate.startOf('week').format('MMM D')}` :
                                        currentDate.format('MMMM D, YYYY')}
                            </h2>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={handlePrev} className="h-8 w-8">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={handleNext} className="h-8 w-8">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setCurrentDate(dayjs())} className="text-xs">
                                    Today
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowColorPicker(!showColorPicker)}
                                className="gap-2 border-slate-200"
                            >
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: testColor }} />
                                <span className="text-xs font-medium">Test Color</span>
                                <Palette className="h-3 w-3 text-slate-500" />
                            </Button>

                            {showColorPicker && (
                                <div className="absolute right-0 mt-2 p-3 bg-white border rounded-xl shadow-xl z-50 w-48 animate-in fade-in zoom-in duration-200">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Choose Theme Color</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {CALENDAR_COLORS.map((color) => (
                                            <button
                                                key={color.value}
                                                className={`h-8 rounded-lg border-2 transition-all ${testColor === color.value ? 'border-slate-800 scale-110' : 'border-transparent hover:scale-105'}`}
                                                style={{ backgroundColor: color.value }}
                                                onClick={() => {
                                                    if (currentTestPrep) updateTestPrepColor(currentTestPrep.id, color.value);
                                                }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full mt-3 text-xs"
                                        onClick={() => setShowColorPicker(false)}
                                    >
                                        Close
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {calendarView === 'month' && (
                        <div className="bg-slate-50/30">
                            <div className="grid grid-cols-7 border-b bg-slate-50">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="py-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider border-r last:border-r-0">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7">
                                {getDaysInMonth().map((date, idx) => {
                                    const daySchedules = date ? getSchedulesForDate(date) : [];
                                    const isToday = date?.isSame(dayjs(), 'day');

                                    return (
                                        <div
                                            key={idx}
                                            className={`min-h-[120px] p-2 border-r border-b last:border-r-0 relative group transition-colors ${!date ? 'bg-slate-50/50' : 'bg-white hover:bg-slate-50/50'}`}
                                        >
                                            {date && (
                                                <>
                                                    <span className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
                                                        {date.date()}
                                                    </span>
                                                    <div className="mt-2 space-y-1">
                                                        {daySchedules.map(s => (
                                                            <div
                                                                key={s.id}
                                                                className="px-2 py-1 rounded text-[10px] font-bold border-l-2 truncate shadow-sm"
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
                        <div className="p-6 bg-slate-50/30 min-h-[400px]">
                            <div className="space-y-4">
                                {(calendarView === 'week' ?
                                    Array.from({ length: 7 }).map((_, i) => currentDate.startOf('week').add(i, 'days')) :
                                    [currentDate]
                                ).map((date, i) => {
                                    const daySchedules = getSchedulesForDate(date);
                                    const isToday = date.isSame(dayjs(), 'day');

                                    return (
                                        <div key={i} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                                            <div className="px-4 py-3 bg-slate-50 border-b flex items-center justify-between">
                                                <h3 className="text-sm font-bold text-slate-800">
                                                    {date.format('dddd, MMMM D')}
                                                    {isToday && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full">Today</span>}
                                                </h3>
                                            </div>
                                            <div className="p-4">
                                                {daySchedules.length > 0 ? (
                                                    daySchedules.map(s => (
                                                        <div key={s.id} className="space-y-3">
                                                            {s.tasks.map(t => (
                                                                <div
                                                                    key={t.id}
                                                                    className="flex items-center justify-between p-3 rounded-lg border-l-4 bg-white hover:bg-slate-50 transition-colors"
                                                                    style={{ borderColor: testColor }}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        {t.status === 'completed' ? (
                                                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                                        ) : (
                                                                            <Circle className="h-5 w-5 text-slate-300" />
                                                                        )}
                                                                        <div>
                                                                            <p className={`text-sm font-medium ${t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                                                                {t.description}
                                                                            </p>
                                                                            <p className="text-[10px] text-slate-400">{t.estimatedMinutes} mins • {t.taskType}</p>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.status}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-slate-400 italic py-4 text-center">No tasks scheduled for this day</p>
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
