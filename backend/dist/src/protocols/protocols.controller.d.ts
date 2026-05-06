import type { JwtPayload } from '../auth/jwt.strategy';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { CreateTrainingSessionDto } from './dto/create-training-session.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { UpdateTrainingSessionDto } from './dto/update-training-session.dto';
import { ProtocolsService } from './protocols.service';
export declare class ProtocolsController {
    private readonly protocols;
    constructor(protocols: ProtocolsService);
    list(user: JwtPayload): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        objective: string | null;
        description: string | null;
        trainingCount: number;
        cycleCount: number;
        isActive: boolean;
    }[]>;
    create(user: JwtPayload, dto: CreateProtocolDto): import(".prisma/client").Prisma.Prisma__ProtocolClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        objective: string | null;
        description: string | null;
        trainingCount: number;
        cycleCount: number;
        isActive: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    get(user: JwtPayload, id: string): Promise<({
        trainingSessions: ({
            trainingExercises: ({
                exercise: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    personalId: string;
                    description: string | null;
                    videoUrl: string | null;
                    category: string | null;
                    equipment: string | null;
                    technicalNotes: string | null;
                    alternativeInstructions: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                notes: string | null;
                order: number;
                sets: number | null;
                repetitions: number | null;
                durationSeconds: number | null;
                distanceMeters: number | null;
                restSeconds: number | null;
                rounds: number | null;
                executionType: import(".prisma/client").$Enums.ExecutionType;
                trainingSessionId: string;
                exerciseId: string;
            })[];
        } & {
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
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        objective: string | null;
        description: string | null;
        trainingCount: number;
        cycleCount: number;
        isActive: boolean;
    }) | null>;
    update(user: JwtPayload, id: string, dto: UpdateProtocolDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        personalId: string;
        objective: string | null;
        description: string | null;
        trainingCount: number;
        cycleCount: number;
        isActive: boolean;
    }>;
    remove(user: JwtPayload, id: string): Promise<{
        ok: boolean;
    }>;
    addSession(user: JwtPayload, id: string, dto: CreateTrainingSessionDto): Promise<{
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
    }>;
    updateSession(user: JwtPayload, id: string, sessionId: string, dto: UpdateTrainingSessionDto): Promise<{
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
    }>;
    removeSession(user: JwtPayload, id: string, sessionId: string): Promise<{
        ok: boolean;
    }>;
}
