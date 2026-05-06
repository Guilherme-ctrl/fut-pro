# Contratos da API REST

## Geral

- Base URL: `http://localhost:PORT/api` (prefixo `/api` — decisão MVP).
- Auth: `Authorization: Bearer <jwt>`.
- Content-Type: `application/json`.
- Erros: status HTTP + JSON `{ "code": string, "message": string, "details"?: unknown }`.

## Auth

| Método | Rota | Body | Resposta |
|--------|------|------|----------|
| POST | `/auth/register` | `{ email, password, name }` | 201 + user + token |
| POST | `/auth/login` | `{ email, password }` | 200 + user + token |
| GET | `/auth/me` | — | 200 user + role + athleteId? |

**Nota**: Registro público apenas para `PERSONAL`; criação de atleta com login via rota autenticada de athletes (ver abaixo).

## Athletes (personal)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/athletes` | Lista atletas do personal |
| POST | `/athletes` | Cria atleta; body inclui `email`, `password?` para criar `User` ATHLETE |
| GET | `/athletes/:id` | Detalhe |
| PATCH | `/athletes/:id` | Atualiza |
| DELETE | `/athletes/:id` | Remove (se sem FKs bloqueando) |
| GET | `/athletes/:id/history` | Lista `TrainingExecution` ordenado desc |
| GET | `/athletes/:id/adherence` | Objeto de métricas (ver [10](./10-adherence-and-evolution-rules.md)) |
| GET | `/athletes/:id/alerts` | Lista alertas |

## Exercises

CRUD padrão em `/exercises` com escopo personal.

## Protocols

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/protocols` | Lista |
| POST | `/protocols` | Cria |
| GET | `/protocols/:id` | Detalhe com sessões e exercícios aninhados (ou query `?include=sessions`) |
| PATCH | `/protocols/:id` | Atualiza meta |
| DELETE | `/protocols/:id` | Remove se não usado em prescrição ativa (ou soft block) |
| POST | `/protocols/:id/training-sessions` | Cria sessão |
| PATCH | `/protocols/:id/training-sessions/:trainingSessionId` | Atualiza sessão |
| DELETE | `/protocols/:id/training-sessions/:trainingSessionId` | Remove sessão |

## Training session exercises

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/training-sessions/:id/exercises` | Anexa exercício à sessão |
| PATCH | `/training-sessions/:id/exercises/:trainingExerciseId` | Atualiza parâmetros |
| DELETE | `/training-sessions/:id/exercises/:trainingExerciseId` | Remove |

## Prescriptions

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/prescriptions` | Lista do personal (join atleta/protocolo) |
| POST | `/prescriptions` | Cria prescrição ACTIVE |
| GET | `/prescriptions/:id` | Detalhe |
| PATCH | `/prescriptions/:id` | Atualização manual: `currentCycle`, `currentTrainingOrder`, `status` (com validação) |
| POST | `/prescriptions/:id/pause` | `status=PAUSED` |
| POST | `/prescriptions/:id/resume` | `status=ACTIVE` |
| POST | `/prescriptions/:id/complete` | `status=COMPLETED` |
| GET | `/prescriptions/:id/current-training` | Resolve sessão e exercícios para o estado atual |

## Athlete — execução

Todas exigem `role=ATHLETE` e escopo do próprio atleta.

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/athlete/current-training` | Prescrição ativa + sessão alvo + exercícios |
| POST | `/athlete/training-executions/start` | Body `{ prescriptionId }` ou implícito da ativa; cria execution + steps |
| PATCH | `/athlete/training-executions/:id/steps/:stepId/complete` | Marca step completo |
| POST | `/athlete/training-executions/:id/complete` | Body feedback; finaliza; progressão; alertas |
| GET | `/athlete/history` | Execuções do atleta |

## Dashboard (personal)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/dashboard/summary` | Cards agregados |
| GET | `/dashboard/athletes-status` | Lista com status de aderência |
| GET | `/dashboard/alerts` | Alertas recentes (ex.: últimos 7 dias) |

## Códigos de erro sugeridos

- `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT` (ex.: duas prescrições ACTIVE), `BUSINESS_RULE` (ex.: completar treino errado).
