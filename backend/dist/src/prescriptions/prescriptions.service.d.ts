import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
export declare class PrescriptionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    ensureOwnedByPersonal(personalId: string, prescriptionId: string): Promise<{
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
    list(personalId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    create(personalId: string, dto: CreatePrescriptionDto): Promise<{
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
    getOne(personalId: string, id: string): Promise<{
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
    update(personalId: string, id: string, dto: UpdatePrescriptionDto): Promise<{
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
    pause(personalId: string, id: string): Promise<{
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
    resume(personalId: string, id: string): Promise<{
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
    completeManual(personalId: string, id: string): Promise<{
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
    currentTraining(personalId: string, prescriptionId: string): Promise<{
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
