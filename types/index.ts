// User and Preferences
export interface UserPreferences {
    studyType: 'visual' | 'reading' | 'practice' | 'balanced';
    intensityLevel: 'light' | 'moderate' | 'intensive' | 'custom';
    customDailyMinutes?: number;
    spacedRepetition: boolean;
    preferredStudyTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
    bufferDays: number;
    activeRecallFrequency: 'low' | 'medium' | 'high';
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    timezone: string;
    createdAt: Date;
    preferences: UserPreferences;
}

// Test Preparation
export interface TestPreparation {
    id: string;
    userId: string;
    testName: string;
    testDate: Date;
    createdAt: Date;
    status: 'planning' | 'active' | 'completed' | 'expired';
    totalEstimatedMinutes: number;
    completedMinutes: number;
    progressPercentage: number;
}

// Study Material
export interface ExtractedMetadata {
    pageCount?: number;
    chapterTitles?: string[];
    topicKeywords?: string[];
    estimatedReadingMinutes?: number;
}

export interface StudyMaterial {
    id: string;
    testPrepId: string;
    fileName: string;
    fileType: 'pdf' | 'docx' | 'txt' | 'image' | 'epub';
    fileSize: number;
    uploadedAt: Date;
    fileUrl: string;
    materialType: 'textbook' | 'notes' | 'assignment' | 'quiz' | 'syllabus' | 'other';
    processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
    extractedMetadata: ExtractedMetadata;
}

// Unit
export interface Unit {
    id: string;
    testPrepId: string;
    title: string;
    order: number;
    materialIds: string[];
    estimatedMinutes: number;
    difficultyLevel: 'easy' | 'medium' | 'hard';
    dependsOn?: string[];
    topics: string[];
    status: 'not_started' | 'in_progress' | 'completed';
}

// Task
export interface MaterialReference {
    materialId: string;
    pageRange?: string;
    sectionTitle?: string;
}

export interface Task {
    id: string;
    scheduleId: string;
    unitId: string;
    taskType: 'read' | 'review' | 'practice' | 'create' | 'quiz';
    description: string;
    materialReferences: MaterialReference[];
    estimatedMinutes: number;
    actualMinutes: number;
    status: 'pending' | 'in_progress' | 'completed' | 'partially_completed' | 'skipped';
    completedAt?: Date;
    notes?: string;
}

// Daily Schedule
export interface DailySchedule {
    id: string;
    testPrepId: string;
    date: Date;
    totalEstimatedMinutes: number;
    tasks: Task[];
    completedTasks: number;
    totalTasks: number;
    actualMinutesSpent: number;
    status: 'upcoming' | 'active' | 'completed' | 'partial' | 'skipped';
}

// Study Session
export interface StudySession {
    id: string;
    taskId: string;
    startedAt: Date;
    endedAt?: Date;
    durationMinutes: number;
    pausedDurations: number[];
    status: 'active' | 'paused' | 'completed';
}

// Schedule Adjustment
export interface ScheduleAdjustment {
    id: string;
    testPrepId: string;
    triggeredAt: Date;
    reason: 'user_behind' | 'user_ahead' | 'manual_request' | 'date_change';
    adjustmentType: 'compress' | 'extend' | 'redistribute' | 'reprioritize';
    affectedDates: Date[];
    accepted: boolean;
}
