"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AthleteAreaModule = void 0;
const common_1 = require("@nestjs/common");
const athlete_area_controller_1 = require("./athlete-area.controller");
const athlete_training_service_1 = require("./athlete-training.service");
let AthleteAreaModule = class AthleteAreaModule {
};
exports.AthleteAreaModule = AthleteAreaModule;
exports.AthleteAreaModule = AthleteAreaModule = __decorate([
    (0, common_1.Module)({
        controllers: [athlete_area_controller_1.AthleteAreaController],
        providers: [athlete_training_service_1.AthleteTrainingService],
    })
], AthleteAreaModule);
//# sourceMappingURL=athlete-area.module.js.map