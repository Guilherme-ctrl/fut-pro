import { PrismaService } from '../prisma/prisma.service';
export type AdherenceLabel = 'EM_DIA' | 'ATENCAO' | 'ATRASADO' | 'PARADO';
export type AdherenceMetrics = {
    prescribed: number;
    completed: number;
    adherencePercent: number;
    daysSinceLastTraining: number | null;
    currentStreakWeek: number;
    currentCycle: number;
    currentTrainingOrder: number;
    missedOrLate: number;
    status: AdherenceLabel;
};
export declare class AdherenceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    labelFromMetrics(m: {
        daysSinceLastTraining: number | null;
        adherencePercent: number;
        weeklyFrequency: number;
    }): AdherenceLabel;
    getMetricsForAthlete(athleteId: string, prescriptionId?: string): Promise<AdherenceMetrics | null>;
}
