# Arquitetura técnica

## Visão geral

Monorepo leve com dois pacotes na raiz:

```
personal-futebol-mvp/
  Docs/
  backend/          # NestJS + Prisma
  frontend/         # Vite + React + TypeScript
  docker-compose.yml
  README.md
```

**Decisão**: **NestJS** para velocidade com módulos, validação e injeção; **Vite** para frontend rápido sem SSR no MVP.

## Backend

- **Runtime**: Node.js LTS.
- **Framework**: NestJS 10+.
- **ORM**: Prisma 5+ com PostgreSQL.
- **Auth**: `@nestjs/jwt` + `passport-jwt`; senha bcrypt.
- **Validação**: `class-validator` / `class-transformer`.
- **Estrutura de pastas** (alinhada ao prompt):

```
backend/
  src/
    modules/
      auth/
      athletes/
      exercises/
      protocols/
      training-sessions/
      prescriptions/
      training-executions/
      dashboard/
    domain/
      progression.service.ts
      adherence.service.ts
      alert.service.ts
    shared/
      prisma/
      guards/
      filters/
      decorators/
    main.ts
  prisma/
    schema.prisma
    seed.ts
  docker-compose.yml   # opcional: só DB na raiz do monorepo
  .env.example
```

## Frontend

- **Vite** + **React 18** + **TypeScript**.
- **Roteamento**: `react-router-dom`.
- **HTTP**: `fetch` encapsulado em `services/api.ts` com interceptor de token (localStorage MVP).
- **Estado**: React Query (TanStack Query) **recomendado** para cache de listas — **decisão MVP**: usar React Query se setup rápido; senão `useEffect` + context mínimo.

## Banco de dados

- PostgreSQL 16 (imagem oficial Docker).
- Volume persistente nomeado.
- Porta exposta `5432` local.

## Variáveis de ambiente (exemplo)

```
DATABASE_URL=postgresql://user:pass@localhost:5432/personal_futebol
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
PORT=3333
CORS_ORIGIN=http://localhost:5173
```

## Segurança

- Guards por role.
- Validação de ownership: personal só acessa recursos com seu `personalId`.

## Build e deploy

- MVP local apenas; Dockerfile da API opcional na fase final.

## Diagrama de fluxo (conclusão de treino)

```mermaid
sequenceDiagram
  participant A as Athlete App
  participant API as Nest API
  participant P as ProgressionService
  participant AD as AdherenceService
  participant AL as AlertService
  A->>API: POST complete execution + feedback
  API->>P: advance prescription
  API->>AD: recalculate metrics
  API->>AL: evaluate alerts
  API-->>A: 200 OK + next state
```
