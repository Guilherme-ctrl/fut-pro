import { PrismaService } from '../prisma/prisma.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
export declare class AthletesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(personalId: string): Promise<{
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
    getOne(personalId: string, id: string): Promise<{
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
    create(personalId: string, dto: CreateAthleteDto): Promise<{
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
    update(personalId: string, id: string, dto: UpdateAthleteDto): Promise<{
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
    remove(personalId: string, id: string): Promise<{
        ok: boolean;
    }>;
    history(personalId: string, athleteId: string): Promise<({
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
}
