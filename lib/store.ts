import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
    User,
    TestPreparation,
    StudyMaterial,
    Unit,
    DailySchedule,
    Task,
    StudySession
} from '@/types';

interface AppState {
    // User state
    user: User | null;
    setUser: (user: User | null) => void;

    // Test Preparation state
    currentTestPrep: TestPreparation | null;
    testPreparations: TestPreparation[];
    setCurrentTestPrep: (testPrep: TestPreparation | null) => void;
    addTestPreparation: (testPrep: TestPreparation) => void;
    updateTestPreparation: (id: string, updates: Partial<TestPreparation>) => void;

    // Study Materials state
    materials: StudyMaterial[];
    addMaterial: (material: StudyMaterial) => void;
    updateMaterial: (id: string, updates: Partial<StudyMaterial>) => void;
    removeMaterial: (id: string) => void;

    // Units state
    units: Unit[];
    addUnit: (unit: Unit) => void;
    updateUnit: (id: string, updates: Partial<Unit>) => void;

    // Schedule state
    schedules: DailySchedule[];
    setSchedules: (schedules: DailySchedule[]) => void;
    updateSchedule: (id: string, updates: Partial<DailySchedule>) => void;

    // Task state
    updateTask: (scheduleId: string, taskId: string, updates: Partial<Task>) => void;
    completeTaskWithFeedback: (
        scheduleId: string,
        taskId: string,
        feedback: {
            actualMinutes: number;
            feelingAboutProgress: string;
            feelingAboutMaterial: 'easy' | 'normal' | 'hard';
        }
    ) => void;

    // Study Session state
    currentSession: StudySession | null;
    sessionNotes: string;
    setSessionNotes: (notes: string) => void;
    startSession: (session: StudySession) => void;
    pauseSession: () => void;
    resumeSession: () => void;
    endSession: () => void;

    // UI state
    isSidebarOpen: boolean;
    showWorkspace: boolean;
    calendarView: 'day' | 'week' | 'month';
    setShowWorkspace: (show: boolean) => void;
    setCalendarView: (view: 'day' | 'week' | 'month') => void;
    toggleSidebar: () => void;
    updateTestPrepColor: (id: string, color: string) => void;
}

export const useStore = create<AppState>()(
    devtools(
        persist(
            (set) => ({
                // User state
                user: null,
                setUser: (user) => set({ user }),

                // Test Preparation state
                currentTestPrep: null,
                testPreparations: [],
                setCurrentTestPrep: (testPrep) => set({ currentTestPrep: testPrep }),
                addTestPreparation: (testPrep) =>
                    set((state) => ({
                        testPreparations: [...state.testPreparations, testPrep],
                        currentTestPrep: testPrep,
                    })),
                updateTestPreparation: (id, updates) =>
                    set((state) => ({
                        testPreparations: state.testPreparations.map((tp) =>
                            tp.id === id ? { ...tp, ...updates } : tp
                        ),
                        currentTestPrep:
                            state.currentTestPrep?.id === id
                                ? { ...state.currentTestPrep, ...updates }
                                : state.currentTestPrep,
                    })),

                // Study Materials state
                materials: [],
                addMaterial: (material) =>
                    set((state) => ({ materials: [...state.materials, material] })),
                updateMaterial: (id, updates) =>
                    set((state) => ({
                        materials: state.materials.map((m) =>
                            m.id === id ? { ...m, ...updates } : m
                        ),
                    })),
                removeMaterial: (id) =>
                    set((state) => ({
                        materials: state.materials.filter((m) => m.id !== id),
                    })),

                // Units state
                units: [],
                addUnit: (unit) => set((state) => ({ units: [...state.units, unit] })),
                updateUnit: (id, updates) =>
                    set((state) => ({
                        units: state.units.map((u) => (u.id === id ? { ...u, ...updates } : u)),
                    })),

                // Schedule state
                schedules: [],
                setSchedules: (newSchedules) =>
                    set((state) => {
                        // Filter out old schedules for the same test if they exist
                        const testPrepId = newSchedules[0]?.testPrepId;
                        if (!testPrepId) return { schedules: newSchedules };

                        const filteredSchedules = state.schedules.filter(s => s.testPrepId !== testPrepId);
                        return { schedules: [...filteredSchedules, ...newSchedules] };
                    }),
                updateSchedule: (id, updates) =>
                    set((state) => ({
                        schedules: state.schedules.map((s) =>
                            s.id === id ? { ...s, ...updates } : s
                        ),
                    })),

                // Task state
                updateTask: (scheduleId, taskId, updates) =>
                    set((state) => {
                        const updatedSchedules = state.schedules.map((schedule) =>
                            schedule.id === scheduleId
                                ? {
                                    ...schedule,
                                    tasks: schedule.tasks.map((task) =>
                                        task.id === taskId ? { ...task, ...updates } : task
                                    ),
                                }
                                : schedule
                        );

                        // Recalculate schedule-level stats
                        const finalSchedules = updatedSchedules.map(schedule => {
                            if (schedule.id === scheduleId) {
                                const completedTasks = schedule.tasks.filter(t => t.status === 'completed').length;
                                const actualMinutesSpent = schedule.tasks.reduce((acc, t) => acc + (t.actualMinutes || 0), 0);
                                return {
                                    ...schedule,
                                    completedTasks,
                                    actualMinutesSpent,
                                    status: (completedTasks === schedule.totalTasks ? 'completed' :
                                        completedTasks > 0 ? 'partial' : 'active') as DailySchedule['status']
                                };
                            }
                            return schedule;
                        });

                        // Recalculate global test preparation progress
                        let updatedTestPrep = state.currentTestPrep;
                        if (updatedTestPrep) {
                            const allTasks = finalSchedules.flatMap(s => s.tasks);
                            const totalTasks = allTasks.length;
                            const completedTasksCount = allTasks.filter(t => t.status === 'completed').length;
                            const totalCompletedMinutes = allTasks.reduce((acc, t) => acc + (t.actualMinutes || 0), 0);

                            updatedTestPrep = {
                                ...updatedTestPrep,
                                completedMinutes: totalCompletedMinutes,
                                progressPercentage: totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0
                            };
                        }

                        // Also update in the list of test preparations
                        const updatedTestPreparations = state.testPreparations.map(tp =>
                            tp.id === updatedTestPrep?.id ? updatedTestPrep : tp
                        );

                        return {
                            schedules: finalSchedules,
                            currentTestPrep: updatedTestPrep,
                            testPreparations: updatedTestPreparations
                        };
                    }),

                completeTaskWithFeedback: (scheduleId, taskId, feedback) =>
                    set((state) => {
                        const updatedSchedules = state.schedules.map((schedule) =>
                            schedule.id === scheduleId
                                ? {
                                    ...schedule,
                                    tasks: schedule.tasks.map((task) =>
                                        task.id === taskId
                                            ? {
                                                ...task,
                                                status: 'completed' as Task['status'],
                                                actualMinutes: feedback.actualMinutes,
                                                notes: `Feedback: ${feedback.feelingAboutProgress}, Material: ${feedback.feelingAboutMaterial}`,
                                                completedAt: new Date(),
                                            }
                                            : task
                                    ),
                                }
                                : schedule
                        );

                        // Replanning logic: If hard, increase time for future tasks of same unit/type
                        let finalSchedules = updatedSchedules;
                        if (feedback.feelingAboutMaterial === 'hard') {
                            const completedTask = state.schedules.find(s => s.id === scheduleId)?.tasks.find(t => t.id === taskId);
                            if (completedTask) {
                                finalSchedules = updatedSchedules.map(schedule => ({
                                    ...schedule,
                                    tasks: schedule.tasks.map(task => {
                                        if (task.status === 'pending' && (task.unitId === completedTask.unitId || task.taskType === completedTask.taskType)) {
                                            return { ...task, estimatedMinutes: Math.round(task.estimatedMinutes * 1.25) };
                                        }
                                        return task;
                                    })
                                }));
                            }
                        }

                        // Recalculate stats
                        finalSchedules = finalSchedules.map(schedule => {
                            if (schedule.id === scheduleId) {
                                const completedTasksCount = schedule.tasks.filter(t => t.status === 'completed').length;
                                const actualMinutesSpent = schedule.tasks.reduce((acc, t) => acc + (t.actualMinutes || 0), 0);
                                return {
                                    ...schedule,
                                    completedTasks: completedTasksCount,
                                    totalTasks: schedule.tasks.length,
                                    actualMinutesSpent,
                                    status: (completedTasksCount === schedule.tasks.length ? 'completed' :
                                        completedTasksCount > 0 ? 'partial' : 'active') as DailySchedule['status']
                                };
                            }
                            return schedule;
                        });

                        // Re-sync currentTestPrep
                        let updatedTestPrep = state.currentTestPrep;
                        if (updatedTestPrep) {
                            const allTasks = finalSchedules.flatMap(s => s.tasks);
                            const completedTasksCount = allTasks.filter(t => t.status === 'completed').length;
                            const totalCompletedMinutes = allTasks.reduce((acc, t) => acc + (t.actualMinutes || 0), 0);

                            updatedTestPrep = {
                                ...updatedTestPrep,
                                completedMinutes: totalCompletedMinutes,
                                progressPercentage: allTasks.length > 0 ? Math.round((completedTasksCount / allTasks.length) * 100) : 0
                            };
                        }

                        return {
                            schedules: finalSchedules,
                            currentTestPrep: updatedTestPrep,
                            testPreparations: state.testPreparations.map(tp => tp.id === updatedTestPrep?.id ? updatedTestPrep : tp)
                        };
                    }),

                // Study Session state
                currentSession: null,
                sessionNotes: '',
                setSessionNotes: (notes) => set({ sessionNotes: notes }),
                startSession: (session) => set({
                    currentSession: session,
                    sessionNotes: '', // Reset for new session
                    showWorkspace: true // Auto-show workspace
                }),
                pauseSession: () =>
                    set((state) => {
                        if (!state.currentSession) return state;
                        return {
                            currentSession: {
                                ...state.currentSession,
                                status: 'paused',
                            },
                        };
                    }),
                resumeSession: () =>
                    set((state) => {
                        if (!state.currentSession) return state;
                        return {
                            currentSession: {
                                ...state.currentSession,
                                status: 'active',
                            },
                        };
                    }),
                endSession: () =>
                    set((state) => {
                        if (!state.currentSession) return state;
                        return {
                            currentSession: {
                                ...state.currentSession,
                                status: 'completed',
                                endedAt: new Date(),
                            },
                            showWorkspace: false // Close workspace on completion
                        };
                    }),

                // UI state
                isSidebarOpen: true,
                showWorkspace: false,
                calendarView: 'month',
                setShowWorkspace: (show) => set({ showWorkspace: show }),
                setCalendarView: (view) => set({ calendarView: view }),
                toggleSidebar: () =>
                    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
                updateTestPrepColor: (id, color) =>
                    set((state) => ({
                        testPreparations: state.testPreparations.map(tp =>
                            tp.id === id ? { ...tp, color } : tp
                        ),
                        currentTestPrep: state.currentTestPrep?.id === id
                            ? { ...state.currentTestPrep, color }
                            : state.currentTestPrep
                    })),
            }),
            {
                name: 'study-planner-storage',
            }
        ),
        { name: 'StudyPlannerStore' }
    )
);
