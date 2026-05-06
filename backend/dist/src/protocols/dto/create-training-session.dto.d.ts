import { TrainingType } from '@prisma/client';
export declare class CreateTrainingSessionDto {
    order: number;
    name: string;
    type: TrainingType;
    description?: string;
    estimatedDurationMinutes?: number;
    generalInstructions?: string;
}
