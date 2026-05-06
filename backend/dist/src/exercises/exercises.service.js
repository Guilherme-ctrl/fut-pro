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
exports.ExercisesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExercisesService = class ExercisesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(personalId) {
        return this.prisma.exercise.findMany({
            where: { personalId },
            orderBy: { name: 'asc' },
        });
    }
    async getOne(personalId, id) {
        const row = await this.prisma.exercise.findFirst({
            where: { id, personalId },
        });
        if (!row) {
            throw new common_1.NotFoundException({ code: 'NOT_FOUND', message: 'Exercício não encontrado' });
        }
        return row;
    }
    create(personalId, dto) {
        return this.prisma.exercise.create({
            data: {
                personalId,
                ...dto,
            },
        });
    }
    async update(personalId, id, dto) {
        await this.getOne(personalId, id);
        return this.prisma.exercise.update({
            where: { id },
            data: dto,
        });
    }
    async remove(personalId, id) {
        await this.getOne(personalId, id);
        await this.prisma.exercise.delete({ where: { id } });
        return { ok: true };
    }
};
exports.ExercisesService = ExercisesService;
exports.ExercisesService = ExercisesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExercisesService);
//# sourceMappingURL=exercises.service.js.map