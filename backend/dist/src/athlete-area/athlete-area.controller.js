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
exports.AthleteAreaController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const complete_training_dto_1 = require("../prescriptions/dto/complete-training.dto");
const athlete_training_service_1 = require("./athlete-training.service");
const start_training_dto_1 = require("./dto/start-training.dto");
let AthleteAreaController = class AthleteAreaController {
    constructor(training) {
        this.training = training;
    }
    current(user) {
        return this.training.currentTraining(user.athleteId);
    }
    start(user, dto) {
        return this.training.start(user.athleteId, dto);
    }
    completeStep(user, id, stepId) {
        return this.training.completeStep(user.athleteId, id, stepId);
    }
    complete(user, id, dto) {
        return this.training.completeTraining(user.athleteId, id, dto);
    }
    history(user) {
        return this.training.history(user.athleteId);
    }
};
exports.AthleteAreaController = AthleteAreaController;
__decorate([
    (0, common_1.Get)('current-training'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AthleteAreaController.prototype, "current", null);
__decorate([
    (0, common_1.Post)('training-executions/start'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, start_training_dto_1.StartTrainingDto]),
    __metadata("design:returntype", void 0)
], AthleteAreaController.prototype, "start", null);
__decorate([
    (0, common_1.Patch)('training-executions/:id/steps/:stepId/complete'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('stepId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AthleteAreaController.prototype, "completeStep", null);
__decorate([
    (0, common_1.Post)('training-executions/:id/complete'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, complete_training_dto_1.CompleteTrainingDto]),
    __metadata("design:returntype", void 0)
], AthleteAreaController.prototype, "complete", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AthleteAreaController.prototype, "history", null);
exports.AthleteAreaController = AthleteAreaController = __decorate([
    (0, common_1.Controller)('athlete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ATHLETE),
    __metadata("design:paramtypes", [athlete_training_service_1.AthleteTrainingService])
], AthleteAreaController);
//# sourceMappingURL=athlete-area.controller.js.map