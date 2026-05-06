"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressionService = void 0;
exports.computeProgressionAfterCompletion = computeProgressionAfterCompletion;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
function computeProgressionAfterCompletion(trainingCount, cycleCount, currentCycle, currentTrainingOrder) {
    let nextOrder = currentTrainingOrder + 1;
    let nextCycle = currentCycle;
    if (nextOrder > trainingCount) {
        nextOrder = 1;
        nextCycle = currentCycle + 1;
    }
    if (nextCycle > cycleCount) {
        return {
            status: client_1.PrescriptionStatus.COMPLETED,
            currentCycle: cycleCount,
            currentTrainingOrder: trainingCount,
        };
    }
    return {
        status: client_1.PrescriptionStatus.ACTIVE,
        currentCycle: nextCycle,
        currentTrainingOrder: nextOrder,
    };
}
let ProgressionService = class ProgressionService {
    computeAfterCompletion(trainingCount, cycleCount, currentCycle, currentTrainingOrder) {
        return computeProgressionAfterCompletion(trainingCount, cycleCount, currentCycle, currentTrainingOrder);
    }
};
exports.ProgressionService = ProgressionService;
exports.ProgressionService = ProgressionService = __decorate([
    (0, common_1.Injectable)()
], ProgressionService);
//# sourceMappingURL=progression.service.js.map