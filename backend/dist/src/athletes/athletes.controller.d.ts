import { AdherenceService } from '../domain/adherence.service';
import type { JwtPayload } from '../auth/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { AthletesService } from './athletes.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
export declare class AthletesController {
    private readonly athletes;
    private readonly adherence;
    private readonly prisma;
    constructor(athletes: AthletesService, adherence: AdherenceService, prisma: PrismaService);
    list(user: JwtPayload): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        personalId: string;
        phone: string | null;
        age: number | null;
        position: string | null;
        objective: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.AthleteStatus;
    }[]>;
    create(user: JwtPayload, dto: CreateAthleteDto): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        personalId: string;
        phone: string | null;
        age: number | null;
        position: string | null;
        objective: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.AthleteStatus;
    }>;
    get(user: JwtPayload, id: string): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        personalId: string;
        phone: string | null;
        age: number | null;
        position: string | null;
        objective: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.AthleteStatus;
    }>;
    update(user: JwtPayload, id: string, dto: UpdateAthleteDto): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        personalId: string;
        phone: string | null;
        age: number | null;
        position: string | null;
        objective: string | null;
        notes: string | null;
        status: import(".prisma/client").$Enums.AthleteStatus;
    }>;
    remove(user: JwtPayload, id: string): Promise<{
        ok: boolean;
    }>;
    history(user: JwtPayload, id: string): Promise<({
        trainingSession: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            order: number;
            type: import(".prisma/client").$Enums.TrainingType;
            estimatedDurationMinutes: number | null;
            generalInstructions: string | null;
            protocolId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ExecutionStatus;
        trainingSessionId: string;
        athleteId: string;
        perceivedDifficulty: import(".prisma/client").$Enums.Difficulty | null;
        feltPain: boolean | null;
        painLocation: string | null;
        athleteNotes: string | null;
        prescriptionId: string;
        startedAt: Date;
        finishedAt: Date | null;
    })[]>;
    adherenceMetrics(user: JwtPayload, id: string): Promise<import("../domain/adherence.service").AdherenceMetrics | null>;
    alerts(user: JwtPayload, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.AlertType;
        athleteId: string;
        prescriptionId: string | null;
        message: string;
        isRead: boolean;
        trainingExecutionId: string | null;
    }[]>;
}
