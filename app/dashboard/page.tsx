"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { Clock, TrendingUp, BookOpen, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { CreateTestDialog } from "@/components/shared/create-test-dialog";
import { TaskList } from "@/components/shared/task-list";
import { StudyAdvice } from "@/components/shared/study-advice";
import { StudyWorkspace } from "@/components/shared/study-workspace";

export default function DashboardPage() {
    const {
        user,
        setUser,
        currentTestPrep,
        setCurrentTestPrep,
        materials,
        addMaterial,
        schedules,
        setSchedules,
        showWorkspace
    } = useStore();

    // Initialize mock data on first load
    useEffect(() => {
        if (!user) {
            import("@/lib/mock-data").then(({ mockUser, mockTestPrep, mockMaterials, mockSchedules }) => {
                setUser(mockUser);
                setCurrentTestPrep(mockTestPrep);
                mockMaterials.forEach(addMaterial);
                setSchedules(mockSchedules);
            });
        }
    }, [user, setUser, setCurrentTestPrep, addMaterial, setSchedules]);

    const todaySchedule = schedules.find(s =>
        dayjs(s.date).isSame(dayjs(), 'day')
    );

    const daysUntilTest = currentTestPrep
        ? dayjs(currentTestPrep.testDate).diff(dayjs(), 'days')
        : 0;

    const totalTasks = todaySchedule?.totalTasks || 0;
    const completedTasks = todaySchedule?.completedTasks || 0;

    if (!currentTestPrep) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <Target className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-2xl">Welcome to Study Planner!</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Get started by uploading your study materials and creating your first test preparation
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-6">
                        <CreateTestDialog />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {showWorkspace ? (
                <StudyWorkspace />
            ) : (
                <>
                    {/* Workspace Indicator if session is active */}
                    {useStore.getState().currentSession && (
                        <div className="bg-blue-600 text-white p-3 rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-500">
                            <div className="flex items-center gap-3">
                                <Sparkles className="h-5 w-5 animate-pulse" />
                                <span className="text-sm font-medium">Session in progress: {useStore.getState().schedules.flatMap(s => s.tasks).find(t => t.id === useStore.getState().currentSession?.taskId)?.description}</span>
                            </div>
                            <Button variant="secondary" size="sm" onClick={() => useStore.getState().setShowWorkspace(true)}>
                                Return to Workspace
                            </Button>
                        </div>
                    )}

                    {/* Stats Overview */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${daysUntilTest <= 3 ? 'text-red-600' : daysUntilTest <= 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                                    {daysUntilTest} days
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Until {dayjs(currentTestPrep.testDate).format('MMM D, YYYY')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{currentTestPrep.progressPercentage}%</div>
                                <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
                                    <div
                                        className="bg-blue-600 h-1.5 rounded-full transition-all"
                                        style={{ width: `${currentTestPrep.progressPercentage}%` }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Today&apos;s Tasks</CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {totalTasks === 0 ? 'No tasks today' : `${Math.round((completedTasks / totalTasks) * 100)}% complete`}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Study Materials</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{materials.length}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {materials.length === 0 ? 'Upload materials' : 'Files uploaded'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Col - Advice & Today's Focus */}
                        <div className="lg:col-span-2 space-y-6">
                            <StudyAdvice advice={currentTestPrep.metadata?.recommendations} />

                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Today&apos;s Focus</CardTitle>
                                    <CardDescription>
                                        {dayjs().format('dddd, MMMM D, YYYY')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <TaskList schedule={todaySchedule} />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - Materials & Quick Stats */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Test Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Test Name</p>
                                        <p className="text-sm font-semibold mt-1">{currentTestPrep.testName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Test Date</p>
                                        <p className="text-sm font-semibold mt-1">
                                            {dayjs(currentTestPrep.testDate).format('MMMM D, YYYY')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                                        <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${currentTestPrep.status === 'active' ? 'bg-green-100 text-green-800' :
                                            currentTestPrep.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                                                'bg-slate-100 text-slate-800'
                                            }`}>
                                            {currentTestPrep.status}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Recent Materials</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {materials.length > 0 ? (
                                        materials.slice(0, 3).map((material) => (
                                            <div key={material.id} className="p-2 rounded hover:bg-slate-50 cursor-pointer transition-colors">
                                                <p className="text-sm font-medium truncate">{material.fileName}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{material.materialType}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No materials uploaded</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
