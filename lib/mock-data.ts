import type {
    User,
    TestPreparation,
    StudyMaterial,
    Unit,
    DailySchedule,
    Task,
} from '@/types';
import dayjs from 'dayjs';

export const mockUser: User = {
    id: 'user-1',
    email: 'student@example.com',
    fullName: 'Alex Johnson',
    timezone: 'America/New_York',
    createdAt: new Date('2024-01-15'),
    preferences: {
        studyType: 'balanced',
        intensityLevel: 'moderate',
        customDailyMinutes: undefined,
        spacedRepetition: true,
        preferredStudyTime: 'evening',
        bufferDays: 2,
        activeRecallFrequency: 'medium',
    },
};

export const mockTestPrep: TestPreparation = {
    id: 'test-1',
    userId: 'user-1',
    testName: 'Organic Chemistry Midterm',
    testDate: dayjs().add(14, 'days').toDate(),
    createdAt: new Date(),
    status: 'active',
    totalEstimatedMinutes: 1800, // 30 hours
    completedMinutes: 360, // 6 hours completed
    progressPercentage: 20,
    color: '#3b82f6',
    metadata: {
        recommendations: {
            focusAreas: [
                'First Law of Thermodynamics',
                'Enthalpy Calculations',
                'State Functions vs Path Functions'
            ],
            studyTechniques: [
                'Active Recall on Formulae',
                'Practice Problems (set 5)',
                'Feynman Technique for Entropy'
            ],
            timeline: 'You are on track. Focus 40% of time on entropy tomorrow.',
            customRecommendations: 'Your progress in Chapter 5 is steady. Consider revisiting the Gibbs Free Energy derivation if you struggle with problem set 5.'
        }
    }
};

export const mockMaterials: StudyMaterial[] = [
    {
        id: 'material-1',
        testPrepId: 'test-1',
        fileName: 'Chapter_5_Thermodynamics.pdf',
        fileType: 'pdf',
        fileSize: 2500000,
        uploadedAt: new Date(),
        fileUrl: '/mock/chapter5.pdf',
        materialType: 'textbook',
        processingStatus: 'completed',
        extractedMetadata: {
            pageCount: 45,
            chapterTitles: ['Energy and Enthalpy', 'Entropy and Free Energy', 'Chemical Equilibrium'],
            topicKeywords: ['enthalpy', 'entropy', 'gibbs free energy', 'equilibrium'],
            estimatedReadingMinutes: 180,
        },
    },
    {
        id: 'material-2',
        testPrepId: 'test-1',
        fileName: 'Lecture_Notes_Week_6.pdf',
        fileType: 'pdf',
        fileSize: 1200000,
        uploadedAt: new Date(),
        fileUrl: '/mock/lecture6.pdf',
        materialType: 'notes',
        processingStatus: 'completed',
        extractedMetadata: {
            pageCount: 12,
            estimatedReadingMinutes: 45,
        },
    },
    {
        id: 'material-3',
        testPrepId: 'test-1',
        fileName: 'Problem_Set_5.pdf',
        fileType: 'pdf',
        fileSize: 800000,
        uploadedAt: new Date(),
        fileUrl: '/mock/problemset5.pdf',
        materialType: 'assignment',
        processingStatus: 'completed',
        extractedMetadata: {
            pageCount: 8,
            estimatedReadingMinutes: 120,
        },
    },
];

export const mockUnits: Unit[] = [
    {
        id: 'unit-1',
        testPrepId: 'test-1',
        title: 'Chapter 5: Thermodynamics',
        order: 1,
        materialIds: ['material-1', 'material-2'],
        estimatedMinutes: 300,
        difficultyLevel: 'hard',
        topics: ['enthalpy', 'entropy', 'free energy'],
        status: 'in_progress',
    },
    {
        id: 'unit-2',
        testPrepId: 'test-1',
        title: 'Chemical Equilibrium',
        order: 2,
        materialIds: ['material-1'],
        estimatedMinutes: 240,
        difficultyLevel: 'medium',
        topics: ['equilibrium constant', 'le chateliers principle'],
        status: 'not_started',
    },
];

const mockTasks: Task[] = [
    {
        id: 'task-1',
        scheduleId: 'schedule-today',
        unitId: 'unit-1',
        taskType: 'read',
        description: 'Read textbook pages 120–145',
        materialReferences: [
            {
                materialId: 'material-1',
                pageRange: '120-145',
                sectionTitle: 'Energy and Enthalpy',
            },
        ],
        estimatedMinutes: 45,
        actualMinutes: 0,
        status: 'pending',
        tags: ['essential'],
    },
    {
        id: 'task-2',
        scheduleId: 'schedule-today',
        unitId: 'unit-1',
        taskType: 'review',
        description: 'Review lecture notes from Week 6',
        materialReferences: [
            {
                materialId: 'material-2',
                sectionTitle: 'Thermodynamics Lecture',
            },
        ],
        estimatedMinutes: 20,
        actualMinutes: 0,
        status: 'pending',
    },
    {
        id: 'task-3',
        scheduleId: 'schedule-today',
        unitId: 'unit-1',
        taskType: 'practice',
        description: 'Complete problem set 5, questions 1–15',
        materialReferences: [
            {
                materialId: 'material-3',
                pageRange: '1-3',
            },
        ],
        estimatedMinutes: 35,
        actualMinutes: 0,
        status: 'pending',
        tags: ['essential'],
    },
];

export const mockSchedules: DailySchedule[] = [
    {
        id: 'schedule-today',
        testPrepId: 'test-1',
        date: dayjs().toDate(),
        totalEstimatedMinutes: 120,
        tasks: mockTasks,
        completedTasks: 0,
        totalTasks: 3,
        actualMinutesSpent: 0,
        status: 'active',
    },
    {
        id: 'schedule-tomorrow',
        testPrepId: 'test-1',
        date: dayjs().add(1, 'day').toDate(),
        totalEstimatedMinutes: 150,
        tasks: [],
        completedTasks: 0,
        totalTasks: 4,
        actualMinutesSpent: 0,
        status: 'upcoming',
    },
];
