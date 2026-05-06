"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthletesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../prisma/prisma.service");
let AthletesService = class AthletesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(personalId) {
        return this.prisma.athlete.findMany({
            where: { personalId },
            orderBy: { name: 'asc' },
        });
    }
    async getOne(personalId, id) {
        const athlete = await this.prisma.athlete.findFirst({
            where: { id, personalId },
        });
        if (!athlete) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Atleta não encontrado' });
        }
        return athlete;
    }
    async create(personalId, dto) {
        const email = dto.email.toLowerCase();
        const existsUser = await this.prisma.user.findUnique({ where: { email } });
        if (existsUser) {
            throw new common_1.ConflictException({
                code: 'CONFLICT',
                message: 'Email já usado por outro usuário',
            });
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
                name: dto.name,
                role: client_1.UserRole.ATHLETE,
            },
        });
        const userId = user.id;
        try {
            return await this.prisma.athlete.create({
                data: {
                    personalId,
                    userId,
                    name: dto.name,
                    email,
                    phone: dto.phone,
                    age: dto.age,
                    position: dto.position,
                    objective: dto.objective,
                    notes: dto.notes,
                    status: dto.status,
                },
            });
        }
        catch {
            await this.prisma.user.delete({ where: { id: userId } }).catch(() => undefined);
            throw new common_1.ConflictException({
                code: 'CONFLICT',
                message: 'Não foi possível criar o atleta (email duplicado para este personal?)',
            });
        }
    }
    async update(personalId, id, dto) {
        await this.getOne(personalId, id);
        const data = { ...dto };
        if (dto.email) {
            data.email = dto.email.toLowerCase();
        }
        if (dto.password) {
            const athlete = await this.prisma.athlete.findFirst({
                where: { id, personalId },
                include: { user: true },
            });
            if (!athlete) {
                throw new common_1.NotFoundException();
            }
            const passwordHash = await bcrypt.hash(dto.password, 10);
            if (athlete.userId) {
                await this.prisma.user.update({
                    where: { id: athlete.userId },
                    data: { passwordHash },
                });
            }
            else {
                const user = await this.prisma.user.create({
                    data: {
                        email: data.email ?? athlete.email,
                        passwordHash,
                        name: dto.name ?? athlete.name,
                        role: client_1.UserRole.ATHLETE,
                    },
                });
                data.userId = user.id;
            }
            delete data.password;
        }
        return this.prisma.athlete.update({
            where: { id },
            data: data,
        });
    }
    async remove(personalId, id) {
        const athlete = await this.prisma.athlete.findFirst({
            where: { id, personalId },
            include: { user: true },
        });
        if (!athlete) {
            throw new common_1.NotFoundException();
        }
        await this.prisma.athlete.delete({ where: { id } });
        if (athlete.userId) {
            await this.prisma.user.delete({ where: { id: athlete.userId } }).catch(() => undefined);
        }
        return { ok: true };
    }
    async history(personalId, athleteId) {
        await this.getOne(personalId, athleteId);
        return this.prisma.trainingExecution.findMany({
            where: { athleteId },
            orderBy: { finishedAt: 'desc' },
            include: { trainingSession: true },
        });
    }
};
exports.AthletesService = AthletesService;
exports.AthletesService = AthletesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AthletesService);
//# sourceMappingURL=athletes.service.js.map