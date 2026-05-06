import type { JwtPayload } from '../auth/jwt.strategy';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExercisesService } from './exercises.service';
export declare class ExercisesController {
    private readonly exercises;
    constructor(exercises: ExercisesService);
    list(user: JwtPayload): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    create(user: JwtPayload, dto: CreateExerciseDto): import(".prisma/client").Prisma.Prisma__ExerciseClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    get(user: JwtPayload, id: string): Promise<{
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
    }>;
    update(user: JwtPayload, id: string, dto: UpdateExerciseDto): Promise<{
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
    }>;
    remove(user: JwtPayload, id: string): Promise<{
        ok: boolean;
    }>;
}
