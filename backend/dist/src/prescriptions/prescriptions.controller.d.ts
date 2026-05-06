import type { JwtPayload } from '../auth/jwt.strategy';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { PrescriptionsService } from './prescriptions.service';
export declare class PrescriptionsController {
    private readonly prescriptions;
    constructor(prescriptions: PrescriptionsService);
    list(user: JwtPayload): import(".prisma/client").Prisma.PrismaPromise<({
        athlete: {
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
        };
        protocol: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PrescriptionStatus;
        protocolId: string;
        athleteId: string;
        startDate: Date;
        weeklyFrequency: number;
        currentCycle: number;
        currentTrainingOrder: number;
    })[]>;
    create(user: JwtPayload, dto: CreatePrescriptionDto): Promise<{
        athlete: {
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
        };
        protocol: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PrescriptionStatus;
        protocolId: string;
        athleteId: string;
        startDate: Date;
        weeklyFrequency: number;
        currentCycle: number;
        currentTrainingOrder: number;
    }>;
    get(user: JwtPayload, id: string): Promise<{
        athlete: {
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
        };
        protocol: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PrescriptionStatus;
        protocolId: string;
        athleteId: string;
        startDate: Date;
        weeklyFrequency: number;
        currentCycle: number;
        currentTrainingOrder: number;
    }>;
    update(user: JwtPayload, id: string, dto: UpdatePrescriptionDto): Promise<{
        athlete: {
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
        };
        protocol: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PrescriptionStatus;
        protocolId: string;
        athleteId: string;
        startDate: Date;
        weeklyFrequency: number;
        currentCycle: number;
        currentTrainingOrder: number;
    }>;
    pause(user: JwtPayload, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PrescriptionStatus;
        protocolId: string;
        athleteId: string;
        startDate: Date;
        weeklyFrequency: number;
        currentCycle: number;
        currentTrainingOrder: number;
    }>;
    resume(user: JwtPayload, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PrescriptionStatus;
        protocolId: string;
        athleteId: string;
        startDate: Date;
        weeklyFrequency: number;
        currentCycle: number;
        currentTrainingOrder: number;
    }>;
    complete(user: JwtPayload, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PrescriptionStatus;
        protocolId: string;
        athleteId: string;
        startDate: Date;
        weeklyFrequency: number;
        currentCycle: number;
        currentTrainingOrder: number;
    }>;
    currentTraining(user: JwtPayload, id: string): Promise<{
        prescription: {
            athlete: {
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
            };
            protocol: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PrescriptionStatus;
            protocolId: string;
            athleteId: string;
            startDate: Date;
            weeklyFrequency: number;
            currentCycle: number;
            currentTrainingOrder: number;
        };
        trainingSession: {
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
        };
    }>;
}
