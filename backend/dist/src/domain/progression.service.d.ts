import { PrescriptionStatus } from '@prisma/client';
export type ProgressionResult = {
    currentCycle: number;
    currentTrainingOrder: number;
    status: PrescriptionStatus;
};
export declare function computeProgressionAfterCompletion(trainingCount: number, cycleCount: number, currentCycle: number, currentTrainingOrder: number): ProgressionResult;
export declare class ProgressionService {
    computeAfterCompletion(trainingCount: number, cycleCount: number, currentCycle: number, currentTrainingOrder: number): ProgressionResult;
}
