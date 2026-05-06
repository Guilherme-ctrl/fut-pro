# Modelo de dados (Prisma / PostgreSQL)

## Convenções

- PKs: `cuid()` ou `uuid()` — **decisão**: `cuid()` para legibilidade em logs MVP.
- Timestamps: `createdAt`, `updatedAt` em entidades principais.
- Soft delete: **não** no MVP (DELETE real com cuidado em FKs).

## Diagrama lógico (texto)

```
User (personal/athlete login)
  └── Athlete (personalId → User id do personal, userId → User do atleta)

User (personal)
  ├── Exercise (personalId)
  ├── Protocol (personalId)
  │     └── TrainingSession (protocolId)
  │           └── TrainingExercise (trainingSessionId, exerciseId)
  └── Prescription (athleteId, protocolId)
        └── TrainingExecution
              └── TrainingExecutionStep (trainingExecutionId, trainingExerciseId)

Alert (athleteId, prescriptionId?, trainingExecutionId?)
```

## Tabelas principais

### `User`

| Coluna | Tipo | Notas |
|--------|------|--------|
| id | String PK | |
| email | String | @unique |
| passwordHash | String | |
| name | String | |
| role | Enum | PERSONAL, ATHLETE |
| createdAt / updatedAt | DateTime | |

### `Athlete`

| Coluna | Tipo | Notas |
|--------|------|--------|
| id | PK | |
| personalId | FK User | dono (personal) |
| userId | FK User? | login do atleta |
| name, email, phone | String | email pode repetir entre personais? **decisão**: unique por (personalId, email) |
| age | Int? | |
| position, objective, notes | String? | |
| status | String ou Enum | ACTIVE, INACTIVE |
| createdAt / updatedAt | | |

### `Exercise`

Campos conforme [05-domain-model.md](./05-domain-model.md): `personalId`, `name`, `description`, `videoUrl`, `category`, `equipment`, `technicalNotes`, `alternativeInstructions`.

### `Protocol`

`personalId`, `name`, `description`, `objective`, `trainingCount` Int, `cycleCount` Int, `isActive` Boolean.

### `TrainingSession`

`protocolId`, `order` Int, `name`, `type` TrainingType, `description`, `estimatedDurationMinutes` Int?, `generalInstructions` Text?.

Índice único: `(protocolId, order)`.

### `TrainingExercise`

`trainingSessionId`, `exerciseId`, `order`, `sets`, `repetitions`, `durationSeconds`, `distanceMeters`, `restSeconds`, `rounds`, `executionType`, `notes`.

Índice único: `(trainingSessionId, order)`.

### `Prescription`

`athleteId`, `protocolId`, `startDate` DateTime, `weeklyFrequency` Int, `currentCycle` Int default 1, `currentTrainingOrder` Int default 1, `status` PrescriptionStatus.

Índice: filtrar por `athleteId` + `status`. Unique parcial **desejável**: um ACTIVE por atleta — enforce na aplicação + migration opcional com partial unique (Postgres) em fase 2 se necessário.

### `TrainingExecution`

`prescriptionId`, `trainingSessionId`, `athleteId`, `startedAt`, `finishedAt`, `status` ExecutionStatus, `perceivedDifficulty` Difficulty?, `feltPain` Boolean?, `painLocation` String?, `athleteNotes` String?.

### `TrainingExecutionStep`

`trainingExecutionId`, `trainingExerciseId`, `status`, `startedAt`, `finishedAt`.

### `Alert`

`athleteId`, `prescriptionId`?, `trainingExecutionId`?, `type` String ou Enum, `message`, `isRead` Boolean default false.

## Migrations e seed

- `prisma migrate dev` no desenvolvimento.
- `seed.ts`: personal demo, atleta demo, protocolo “Pré-Temporada Futebol — Exemplo” com 5 sessões e exercícios variados.
