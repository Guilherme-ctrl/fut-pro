import { AdherenceService } from '../domain/adherence.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    private readonly adherence;
    constructor(prisma: PrismaService, adherence: AdherenceService);
    private weekStart;
    summary(personalId: string): Promise<{
        activeAthletes: number;
        averageAdherencePercent: number;
        athletesOnTrack: number;
        athletesAttention: number;
        athletesLate: number;
        athletesStopped: number;
        trainingsCompletedThisWeek: number;
        painAlertsLast7Days: number;
    }>;
    athletesStatus(personalId: string): Promise<{
        id: string;
        name: string;
        email: string;
        position: string | null;
        protocolName: string | null;
        nextTraining: string | null;
        lastTraining: string | null;
        lastTrainingDate: Date | null;
        adherencePercent: number | null;
        daysSinceLastTraining: number | null;
        status: import("../domain/adherence.service").AdherenceLabel | null;
    }[]>;
    alerts(personalId: string): Promise<({
        athlete: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.AlertType;
        athleteId: string;
        prescriptionId: string | null;
        message: string;
        isRead: boolean;
        trainingExecutionId: string | null;
    })[]>;
}
