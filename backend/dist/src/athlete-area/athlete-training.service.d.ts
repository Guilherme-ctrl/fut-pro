import { AdherenceService } from '../domain/adherence.service';
import { AlertService } from '../domain/alert.service';
import { ProgressionService } from '../domain/progression.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteTrainingDto } from '../prescriptions/dto/complete-training.dto';
import { StartTrainingDto } from './dto/start-training.dto';
export declare class AthleteTrainingService {
    private readonly prisma;
    private readonly progression;
    private readonly adherence;
    private readonly alerts;
    constructor(prisma: PrismaService, progression: ProgressionService, adherence: AdherenceService, alerts: AlertService);
    getActivePrescription(athleteId: string): Promise<({
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
    }) | null>;
    currentTraining(athleteId: string): Promise<{
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
        trainingSession: ({
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
        }) | null;
    } | null>;
    start(athleteId: string, dto: StartTrainingDto): Promise<({
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
        steps: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ExecutionStatus;
            startedAt: Date | null;
            finishedAt: Date | null;
            trainingExecutionId: string;
            trainingExerciseId: string;
        }[];
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
    }) | null>;
    completeStep(athleteId: string, executionId: string, stepId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ExecutionStatus;
        startedAt: Date | null;
        finishedAt: Date | null;
        trainingExecutionId: string;
        trainingExerciseId: string;
    }>;
    completeTraining(athleteId: string, executionId: string, dto: CompleteTrainingDto): Promise<{
        execution: {
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
        } | null;
        prescriptionProgress: import("../domain/progression.service").ProgressionResult;
    }>;
    history(athleteId: string): Promise<({
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
