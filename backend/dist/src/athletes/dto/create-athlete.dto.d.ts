import { AthleteStatus } from '@prisma/client';
export declare class CreateAthleteDto {
    name: string;
    email: string;
    password: string;
    phone?: string;
    age?: number;
    position?: string;
    objective?: string;
    notes?: string;
    status?: AthleteStatus;
}
