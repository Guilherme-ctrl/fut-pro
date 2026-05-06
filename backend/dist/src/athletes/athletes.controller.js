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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthletesController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const adherence_service_1 = require("../domain/adherence.service");
const prisma_service_1 = require("../prisma/prisma.service");
const athletes_service_1 = require("./athletes.service");
const create_athlete_dto_1 = require("./dto/create-athlete.dto");
const update_athlete_dto_1 = require("./dto/update-athlete.dto");
let AthletesController = class AthletesController {
    constructor(athletes, adherence, prisma) {
        this.athletes = athletes;
        this.adherence = adherence;
        this.prisma = prisma;
    }
    list(user) {
        return this.athletes.list(user.sub);
    }
    create(user, dto) {
        return this.athletes.create(user.sub, dto);
    }
    get(user, id) {
        return this.athletes.getOne(user.sub, id);
    }
    update(user, id, dto) {
        return this.athletes.update(user.sub, id, dto);
    }
    remove(user, id) {
        return this.athletes.remove(user.sub, id);
    }
    history(user, id) {
        return this.athletes.history(user.sub, id);
    }
    async adherenceMetrics(user, id) {
        await this.athletes.getOne(user.sub, id);
        return this.adherence.getMetricsForAthlete(id);
    }
    async alerts(user, id) {
        await this.athletes.getOne(user.sub, id);
        return this.prisma.alert.findMany({
            where: { athleteId: id },
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
};
exports.AthletesController = AthletesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AthletesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_athlete_dto_1.CreateAthleteDto]),
    __metadata("design:returntype", void 0)
], AthletesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AthletesController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_athlete_dto_1.UpdateAthleteDto]),
    __metadata("design:returntype", void 0)
], AthletesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AthletesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AthletesController.prototype, "history", null);
__decorate([
    (0, common_1.Get)(':id/adherence'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AthletesController.prototype, "adherenceMetrics", null);
__decorate([
    (0, common_1.Get)(':id/alerts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AthletesController.prototype, "alerts", null);
exports.AthletesController = AthletesController = __decorate([
    (0, common_1.Controller)('athletes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __metadata("design:paramtypes", [athletes_service_1.AthletesService,
        adherence_service_1.AdherenceService,
        prisma_service_1.PrismaService])
], AthletesController);
//# sourceMappingURL=athletes.controller.js.map