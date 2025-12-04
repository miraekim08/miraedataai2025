import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
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

    // Study Session state
    currentSession: StudySession | null;
    startSession: (session: StudySession) => void;
    pauseSession: () => void;
    resumeSession: () => void;
    endSession: () => void;

    // UI state
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export const useStore = create<AppState>()(
    devtools(
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
            setSchedules: (schedules) => set({ schedules }),
            updateSchedule: (id, updates) =>
                set((state) => ({
                    schedules: state.schedules.map((s) =>
                        s.id === id ? { ...s, ...updates } : s
                    ),
                })),

            // Task state
            updateTask: (scheduleId, taskId, updates) =>
                set((state) => ({
                    schedules: state.schedules.map((schedule) =>
                        schedule.id === scheduleId
                            ? {
                                ...schedule,
                                tasks: schedule.tasks.map((task) =>
                                    task.id === taskId ? { ...task, ...updates } : task
                                ),
                            }
                            : schedule
                    ),
                })),

            // Study Session state
            currentSession: null,
            startSession: (session) => set({ currentSession: session }),
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
                    };
                }),

            // UI state
            isSidebarOpen: true,
            toggleSidebar: () =>
                set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        }),
        { name: 'StudyPlannerStore' }
    )
);
