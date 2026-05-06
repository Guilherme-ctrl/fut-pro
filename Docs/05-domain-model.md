# Modelo de domínio

## Contexto delimitado (MVP)

Entidades centrais: **Personal** (via User), **Athlete**, **Exercise**, **Protocol**, **TrainingSession**, **TrainingExercise**, **Prescription**, **TrainingExecution**, **TrainingExecutionStep**, **Alert**.

## Entidades e responsabilidades

### User (infra + domínio)

Representa credenciais. Campos conceituais: `id`, `email`, `passwordHash`, `role` (`PERSONAL` | `ATHLETE`), `name`, `personalId` null para personal root — **decisão**: Personal tem registro em `User`; `Athlete` tem `userId` FK opcional para login.

### PersonalProfile (opcional) ou User como personal

**Decisão MVP**: Uma linha `User` com `role=PERSONAL` identifica o treinador; `Athlete.personalId` aponta para `User.id` do personal (ou tabela `Personal` separada). Para simplificar Prisma: `User` id do personal; `Athlete.personalId` → `User.id` onde `role=PERSONAL`.

### Athlete

Atleta sob responsabilidade de um personal. Campos: `id`, `personalId`, `userId?`, `name`, `email`, `phone`, `age`, `position`, `objective`, `notes`, `status` (ex.: `ACTIVE` | `INACTIVE`), timestamps.

### Exercise

Biblioteca do personal. `personalId`, conteúdo descritivo, `videoUrl`, categorização, equipamento, notas.

### Protocol

Template macro: nome, descrição, objetivo, `cycleCount`, `isActive`. `trainingCount` pode ser campo persistido atualizado ao mudar sessões ou calculado — **decisão**: campo persistido `trainingCount` atualizado no service ao CRUD de sessões.

### TrainingSession

Uma “ficha” de treino dentro do protocolo: `order`, `name`, `type` (`TrainingType`), `estimatedDurationMinutes`, `generalInstructions`.

### TrainingExercise

Junção sessão–exercício com prescrição de execução: ordem, séries, reps, duração, distância, descanso, rodadas, `executionType`, notas.

### Prescription

Vínculo atleta–protocolo em vigor: `startDate`, `weeklyFrequency`, `currentCycle`, `currentTrainingOrder`, `status` (`ACTIVE` | `PAUSED` | `COMPLETED` | `CANCELLED`).

Invariantes:

- `currentTrainingOrder` ∈ [1 .. N] onde N = número de sessões do protocolo.
- Ao completar última sessão do ciclo, incrementar `currentCycle` e resetar ordem para 1.
- Se `currentCycle > cycleCount` após conclusão, `status = COMPLETED`.

### TrainingExecution

Registro de uma tentativa/conclusão de sessão: liga `prescriptionId`, `trainingSessionId`, `athleteId`, timestamps, `status`, feedback (`perceivedDifficulty`, `feltPain`, `painLocation`, `athleteNotes`).

### TrainingExecutionStep

Granularidade por `TrainingExercise`: `status`, `startedAt`, `finishedAt`.

### Alert

Evento para o personal: `type`, `message`, associações a atleta/prescrição/execução, `isRead`.

## Enums (TypeScript / Prisma)

Alinhar aos enums do documento de produto:

- `TrainingType`: INTERVALADO, HIIT, CORRIDA_RESISTIDA, AGILIDADE, MOBILIDADE_CORE, HIIT_MUSCULAR, VELOCIDADE, OUTRO
- `ExecutionType`: SERIES_REPS, TIME_BASED, DISTANCE_BASED, CIRCUIT, INTERVAL, FREE_INSTRUCTIONS
- `PrescriptionStatus`, `ExecutionStatus`, `Difficulty`, `AthleteAdherenceStatus`

## Serviços de domínio (puros onde possível)

- `NextTrainingResolver`: determina `TrainingSession` alvo a partir da prescrição e protocolo.
- `ProgressionService`: aplica regras ao concluir treino.
- `AdherenceService`: calcula métricas e status.
- `AlertService`: cria alertas a partir de regras.

Ver regras detalhadas em [09](./09-training-execution-rules.md) e [10](./10-adherence-and-evolution-rules.md).
