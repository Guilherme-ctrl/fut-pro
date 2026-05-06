import type { JwtPayload } from '../auth/jwt.strategy';
import { AddTrainingExerciseDto } from './dto/add-training-exercise.dto';
import { UpdateTrainingExerciseDto } from './dto/update-training-exercise.dto';
import { ProtocolsService } from './protocols.service';
export declare class TrainingSessionExercisesController {
    private readonly protocols;
    constructor(protocols: ProtocolsService);
    add(user: JwtPayload, sessionId: string, dto: AddTrainingExerciseDto): Promise<{
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
    update(user: JwtPayload, sessionId: string, teId: string, dto: UpdateTrainingExerciseDto): Promise<{
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
    remove(user: JwtPayload, sessionId: string, teId: string): Promise<{
        ok: boolean;
    }>;
}
