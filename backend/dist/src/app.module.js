"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const athlete_area_module_1 = require("./athlete-area/athlete-area.module");
const athletes_module_1 = require("./athletes/athletes.module");
const auth_module_1 = require("./auth/auth.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const domain_module_1 = require("./domain/domain.module");
const exercises_module_1 = require("./exercises/exercises.module");
const prescriptions_module_1 = require("./prescriptions/prescriptions.module");
const prisma_module_1 = require("./prisma/prisma.module");
const protocols_module_1 = require("./protocols/protocols.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            domain_module_1.DomainModule,
            auth_module_1.AuthModule,
            athletes_module_1.AthletesModule,
            exercises_module_1.ExercisesModule,
            protocols_module_1.ProtocolsModule,
            prescriptions_module_1.PrescriptionsModule,
            athlete_area_module_1.AthleteAreaModule,
            dashboard_module_1.DashboardModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map