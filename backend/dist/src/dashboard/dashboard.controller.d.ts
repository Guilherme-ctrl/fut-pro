import type { JwtPayload } from '../auth/jwt.strategy';
import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboard;
    constructor(dashboard: DashboardService);
    summary(user: JwtPayload): Promise<{
        activeAthletes: number;
        averageAdherencePercent: number;
        athletesOnTrack: number;
        athletesAttention: number;
        athletesLate: number;
        athletesStopped: number;
        trainingsCompletedThisWeek: number;
        painAlertsLast7Days: number;
    }>;
    athletesStatus(user: JwtPayload): Promise<{
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
    alerts(user: JwtPayload): Promise<({
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
