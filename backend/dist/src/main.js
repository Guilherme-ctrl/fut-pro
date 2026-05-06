"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    const raw = config.get('CORS_ORIGIN') ?? 'http://localhost:5173';
    const origins = raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    const fallback = 'http://localhost:5173';
    const origin = origins.length === 0
        ? fallback
        : origins.length === 1
            ? origins[0]
            : origins;
    app.enableCors({ origin, credentials: true });
    const port = config.get('PORT') ?? 3333;
    app.getHttpAdapter().get('/', (_req, res) => {
        res.status(200).json({
            ok: true,
            service: 'personal-futebol-api',
            apiBase: '/api',
            hint: 'O frontend roda em http://localhost:5173. Ex.: POST /api/auth/login',
        });
    });
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map