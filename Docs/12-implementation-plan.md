# Plano de implementação

## Fase 1 — Setup

- [x] Criar pastas `backend/`, `frontend/`, `Docs/` (specs prontas).
- [x] `docker-compose.yml` na raiz com PostgreSQL.
- [x] Inicializar NestJS em `backend/`; Prisma init; `schema.prisma` alinhado a [06-database-model.md](./06-database-model.md).
- [x] `.env.example` na raiz ou em `backend/`.
- [x] Inicializar Vite React-TS em `frontend/`.
- [x] README com: pré-requisitos, `docker compose up -d`, migrate, seed, `npm run dev` (ambos).

## Fase 2 — Backend base

- [x] Modelo Prisma completo + primeira migration.
- [x] Módulo Auth (register personal, login, me).
- [x] Seed: personal demo, protocolo “Pré-Temporada Futebol — Exemplo”, 5 sessões, exercícios variados, URLs de vídeo exemplo.
- [x] CRUD Athletes (com criação de User ATHLETE quando senha fornecida).
- [x] CRUD Exercises.
- [x] CRUD Protocols + TrainingSessions + TrainingExercises.

## Fase 3 — Prescrição e execução

- [x] CRUD Prescriptions + regra uma ACTIVE por atleta.
- [x] `GET /prescriptions/:id/current-training` e `GET /athlete/current-training`.
- [x] `ProgressionService` conforme [09](./09-training-execution-rules.md).
- [x] Fluxo `start` → steps → `complete` com transação.
- [x] Testes unitários: avanço ordem, ciclo, conclusão de prescrição, não avanço por tempo.

## Fase 4 — Dashboard e aderência

- [x] `AdherenceService` com percentual e status ([10](./10-adherence-and-evolution-rules.md)).
- [x] `AlertService` + persistência `Alert`.
- [x] Endpoints dashboard ([07](./07-api-contracts.md)).
- [ ] Testes automatizados extras: aderência, status, alertas dor/muito difícil/sobrecarga (opcional pós-MVP).

## Fase 5 — Frontend personal

- [x] Layout, login, tema escuro + verde neon.
- [x] Dashboard, atletas, perfil atleta.
- [x] Protocolos (lista + editor), exercícios, nova prescrição.

## Fase 6 — Frontend atleta

- [x] Login, home, execução guiada, timers, feedback, histórico.

## Fase 7 — Ajustes finais

- [x] Loading / empty / error states (personal: `PageLoading` + retry; atleta já tinha skeletons).
- [x] Responsividade (nav personal, grid dashboard, safe-area; atleta em `app-shell--athlete`).
- [x] README final e checklist do fluxo de aceite ([01-mvp-scope.md](./01-mvp-scope.md)).
- [x] Revisão leve specs vs código: decisões já documentadas nos `Docs` iniciais; evoluções futuras via novas entradas neste arquivo.

## Ordem sugerida de primeiro fluxo integrado

Auth personal → criar atleta → prescrever seed → login atleta → start → steps → complete → ver dashboard personal.

## Riscos e mitigação

| Risco | Mitigação |
|-------|-----------|
| Regra de aderência vaga | Constantes centralizadas + testes; docs [10](./10-adherence-and-evolution-rules.md) |
| Sincronização de ordem de treinos | Unique `(protocolId, order)` + reorder explícito no editor |
| Tempo de MVP | Cortar “marcar alerta lido” e paginação se necessário |
