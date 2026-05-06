import { Difficulty, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { AdherenceLabel } from './adherence.service';
export declare class AlertService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createAlert(data: Prisma.AlertCreateInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.AlertType;
        athleteId: string;
        prescriptionId: string | null;
        message: string;
        isRead: boolean;
        trainingExecutionId: string | null;
    }>;
    onTrainingCompleted(params: {
        athleteId: string;
        prescriptionId: string;
        executionId: string;
        feltPain: boolean;
        painLocation?: string | null;
        perceivedDifficulty?: Difficulty | null;
    }): Promise<void>;
    syncScheduleAlerts(athleteId: string, prescriptionId: string, status: AdherenceLabel): Promise<void>;
}
