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
exports.TrainingSessionExercisesController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const add_training_exercise_dto_1 = require("./dto/add-training-exercise.dto");
const update_training_exercise_dto_1 = require("./dto/update-training-exercise.dto");
const protocols_service_1 = require("./protocols.service");
let TrainingSessionExercisesController = class TrainingSessionExercisesController {
    constructor(protocols) {
        this.protocols = protocols;
    }
    add(user, sessionId, dto) {
        return this.protocols.addExerciseToSession(user.sub, sessionId, dto);
    }
    update(user, sessionId, teId, dto) {
        return this.protocols.updateSessionExercise(user.sub, sessionId, teId, dto);
    }
    remove(user, sessionId, teId) {
        return this.protocols.removeSessionExercise(user.sub, sessionId, teId);
    }
};
exports.TrainingSessionExercisesController = TrainingSessionExercisesController;
__decorate([
    (0, common_1.Post)(':id/exercises'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_training_exercise_dto_1.AddTrainingExerciseDto]),
    __metadata("design:returntype", void 0)
], TrainingSessionExercisesController.prototype, "add", null);
__decorate([
    (0, common_1.Patch)(':id/exercises/:trainingExerciseId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('trainingExerciseId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, update_training_exercise_dto_1.UpdateTrainingExerciseDto]),
    __metadata("design:returntype", void 0)
], TrainingSessionExercisesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id/exercises/:trainingExerciseId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('trainingExerciseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], TrainingSessionExercisesController.prototype, "remove", null);
exports.TrainingSessionExercisesController = TrainingSessionExercisesController = __decorate([
    (0, common_1.Controller)('training-sessions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __metadata("design:paramtypes", [protocols_service_1.ProtocolsService])
], TrainingSessionExercisesController);
//# sourceMappingURL=training-session-exercises.controller.js.map