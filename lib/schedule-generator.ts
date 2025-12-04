import type { TestPreparation, DailySchedule, Task, Unit } from '@/types';
import dayjs from 'dayjs';

export interface GenerateScheduleParams {
    testPrep: TestPreparation;
    units: Unit[];
    dailyMinutes: number;
    bufferDays: number;
}

export function generateSchedule(params: GenerateScheduleParams): DailySchedule[] {
    const { testPrep, units, dailyMinutes, bufferDays } = params;

    const startDate = dayjs();
    const testDate = dayjs(testPrep.testDate);
    const totalDays = testDate.diff(startDate, 'days');
    const studyDays = totalDays - bufferDays;

    if (studyDays <= 0) {
        return [];
    }

    // Distribute units across available days
    const schedules: DailySchedule[] = [];
    let currentUnitIndex = 0;
    let remainingMinutesInUnit = units[0]?.estimatedMinutes || 0;

    for (let day = 0; day < studyDays; day++) {
        const currentDate = startDate.add(day, 'days');
        let dailyMinutesRemaining = dailyMinutes;
        const dailyTasks: Task[] = [];

        while (dailyMinutesRemaining > 0 && currentUnitIndex < units.length) {
            const currentUnit = units[currentUnitIndex];
            const minutesForThisTask = Math.min(dailyMinutesRemaining, remainingMinutesInUnit);

            if (minutesForThisTask > 0) {
                const task: Task = {
                    id: `task-${day}-${currentUnitIndex}-${Math.random()}`,
                    scheduleId: `schedule-${day}`,
                    unitId: currentUnit.id,
                    taskType: 'read', // Simplified for now
                    description: `Study ${currentUnit.title}`,
                    materialReferences: currentUnit.materialIds.map(id => ({ materialId: id })),
                    estimatedMinutes: minutesForThisTask,
                    actualMinutes: 0,
                    status: 'pending',
                };

                dailyTasks.push(task);
                dailyMinutesRemaining -= minutesForThisTask;
                remainingMinutesInUnit -= minutesForThisTask;
            }

            if (remainingMinutesInUnit <= 0) {
                currentUnitIndex++;
                remainingMinutesInUnit = units[currentUnitIndex]?.estimatedMinutes || 0;
            }
        }

        if (dailyTasks.length > 0) {
            schedules.push({
                id: `schedule-${day}`,
                testPrepId: testPrep.id,
                date: currentDate.toDate(),
                totalEstimatedMinutes: dailyMinutes - dailyMinutesRemaining,
                tasks: dailyTasks,
                completedTasks: 0,
                totalTasks: dailyTasks.length,
                actualMinutesSpent: 0,
                status: day === 0 ? 'active' : 'upcoming',
            });
        }
    }

    return schedules;
}
