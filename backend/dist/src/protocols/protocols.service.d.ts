import { PrismaService } from '../prisma/prisma.service';
import { AddTrainingExerciseDto } from './dto/add-training-exercise.dto';
import { CreateProtocolDto } from './dto/create-protocol.dto';
import { CreateTrainingSessionDto } from './dto/create-training-session.dto';
import { UpdateProtocolDto } from './dto/update-protocol.dto';
import { UpdateTrainingExerciseDto } from './dto/update-training-exercise.dto';
import { UpdateTrainingSessionDto } from './dto/update-training-session.dto';
export declare class ProtocolsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private syncTrainingCount;
    ensureProtocol(personalId: string, protocolId: string): Promise<{
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
    list(personalId: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    getOne(personalId: string, id: string): Promise<({
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
    create(personalId: string, dto: CreateProtocolDto): import(".prisma/client").Prisma.Prisma__ProtocolClient<{
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
    update(personalId: string, id: string, dto: UpdateProtocolDto): Promise<{
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
    remove(personalId: string, id: string): Promise<{
        ok: boolean;
    }>;
    addTrainingSession(personalId: string, protocolId: string, dto: CreateTrainingSessionDto): Promise<{
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
    updateTrainingSession(personalId: string, protocolId: string, sessionId: string, dto: UpdateTrainingSessionDto): Promise<{
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
    removeTrainingSession(personalId: string, protocolId: string, sessionId: string): Promise<{
        ok: boolean;
    }>;
    addExerciseToSession(personalId: string, trainingSessionId: string, dto: AddTrainingExerciseDto): Promise<{
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
    }>;
    updateSessionExercise(personalId: string, trainingSessionId: string, trainingExerciseId: string, dto: UpdateTrainingExerciseDto): Promise<{
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
    }>;
    removeSessionExercise(personalId: string, trainingSessionId: string, trainingExerciseId: string): Promise<{
        ok: boolean;
    }>;
}
