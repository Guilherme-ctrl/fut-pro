import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
export declare class ExercisesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(personalId: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    getOne(personalId: string, id: string): Promise<{
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
    create(personalId: string, dto: CreateExerciseDto): import(".prisma/client").Prisma.Prisma__ExerciseClient<{
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
    update(personalId: string, id: string, dto: UpdateExerciseDto): Promise<{
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
    remove(personalId: string, id: string): Promise<{
        ok: boolean;
    }>;
}
