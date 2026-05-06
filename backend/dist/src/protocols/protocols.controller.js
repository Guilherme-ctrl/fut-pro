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
exports.ProtocolsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const create_protocol_dto_1 = require("./dto/create-protocol.dto");
const create_training_session_dto_1 = require("./dto/create-training-session.dto");
const update_protocol_dto_1 = require("./dto/update-protocol.dto");
const update_training_session_dto_1 = require("./dto/update-training-session.dto");
const protocols_service_1 = require("./protocols.service");
let ProtocolsController = class ProtocolsController {
    constructor(protocols) {
        this.protocols = protocols;
    }
    list(user) {
        return this.protocols.list(user.sub);
    }
    create(user, dto) {
        return this.protocols.create(user.sub, dto);
    }
    get(user, id) {
        return this.protocols.getOne(user.sub, id);
    }
    update(user, id, dto) {
        return this.protocols.update(user.sub, id, dto);
    }
    remove(user, id) {
        return this.protocols.remove(user.sub, id);
    }
    addSession(user, id, dto) {
        return this.protocols.addTrainingSession(user.sub, id, dto);
    }
    updateSession(user, id, sessionId, dto) {
        return this.protocols.updateTrainingSession(user.sub, id, sessionId, dto);
    }
    removeSession(user, id, sessionId) {
        return this.protocols.removeTrainingSession(user.sub, id, sessionId);
    }
};
exports.ProtocolsController = ProtocolsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProtocolsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_protocol_dto_1.CreateProtocolDto]),
    __metadata("design:returntype", void 0)
], ProtocolsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProtocolsController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_protocol_dto_1.UpdateProtocolDto]),
    __metadata("design:returntype", void 0)
], ProtocolsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProtocolsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/training-sessions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_training_session_dto_1.CreateTrainingSessionDto]),
    __metadata("design:returntype", void 0)
], ProtocolsController.prototype, "addSession", null);
__decorate([
    (0, common_1.Patch)(':id/training-sessions/:trainingSessionId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('trainingSessionId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, update_training_session_dto_1.UpdateTrainingSessionDto]),
    __metadata("design:returntype", void 0)
], ProtocolsController.prototype, "updateSession", null);
__decorate([
    (0, common_1.Delete)(':id/training-sessions/:trainingSessionId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('trainingSessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ProtocolsController.prototype, "removeSession", null);
exports.ProtocolsController = ProtocolsController = __decorate([
    (0, common_1.Controller)('protocols'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __metadata("design:paramtypes", [protocols_service_1.ProtocolsService])
], ProtocolsController);
//# sourceMappingURL=protocols.controller.js.map