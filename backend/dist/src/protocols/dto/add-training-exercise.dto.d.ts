import { ExecutionType } from '@prisma/client';
export declare class AddTrainingExerciseDto {
    exerciseId: string;
    order: number;
    sets?: number;
    repetitions?: number;
    durationSeconds?: number;
    distanceMeters?: number;
    restSeconds?: number;
    rounds?: number;
    executionType?: ExecutionType;
    notes?: string;
}
