import { PrescriptionStatus } from '@prisma/client';
export declare class UpdatePrescriptionDto {
    currentCycle?: number;
    currentTrainingOrder?: number;
    status?: PrescriptionStatus;
}
