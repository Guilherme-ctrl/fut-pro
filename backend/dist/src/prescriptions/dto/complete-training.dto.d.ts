import { Difficulty } from '@prisma/client';
export declare class CompleteTrainingDto {
    perceivedDifficulty: Difficulty;
    feltPain: boolean;
    painLocation?: string;
    athleteNotes?: string;
}
