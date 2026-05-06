# Requisitos funcionais

## RF-01 — Autenticação

- RF-01.1: Registrar personal com email, senha, nome.
- RF-01.2: Login retorna JWT.
- RF-01.3: `GET /auth/me` retorna usuário e papel.
- RF-01.4: Atleta autentica com credenciais criadas/vinculadas ao registro de atleta.

## RF-02 — Atletas (personal)

- RF-02.1: CRUD de atletas do personal.
- RF-02.2: Campos: nome, email, telefone, idade, posição, objetivo, notas, status operacional (ativo/inativo no MVP: campo `status` string ou enum simples).
- RF-02.3: Obter histórico de execuções e feedback por atleta.
- RF-02.4: Obter métricas de aderência e lista de alertas por atleta.

## RF-03 — Exercícios

- RF-03.1: CRUD de exercícios escopados por personal.
- RF-03.2: Campos conforme domínio (incl. `videoUrl`, notas técnicas, alternativas).

## RF-04 — Protocolos e treinos (sessões)

- RF-04.1: CRUD de protocolo: nome, descrição, objetivo, `trainingCount` derivado ou armazenado, `cycleCount`, `isActive`.
- RF-04.2: Treinos (`TrainingSession`) ordenados por `order` inteiro (1..N) dentro do protocolo.
- RF-04.3: CRUD de sessões via rotas aninhadas em protocolo (ver API).
- RF-04.4: Exercícios da sessão (`TrainingExercise`): ordem, parâmetros de carga/volume, `executionType`, notas.

## RF-05 — Prescrição

- RF-05.1: Criar prescrição: `athleteId`, `protocolId`, `startDate`, `weeklyFrequency`, estado inicial `currentCycle=1`, `currentTrainingOrder=1`, `status=ACTIVE`.
- RF-05.2: Validar uma prescrição ACTIVE por atleta.
- RF-05.3: Operações: pausar, retomar, completar manualmente.
- RF-05.4: Endpoint `current-training` resolve sessão alvo pela regra de progressão (ver [09](./09-training-execution-rules.md), [10](./10-adherence-and-evolution-rules.md)).

## RF-06 — Execução pelo atleta

- RF-06.1: Iniciar execução cria `TrainingExecution` + `TrainingExecutionStep` por `TrainingExercise` da sessão atual.
- RF-06.2: Completar etapa atualiza step; timer é responsabilidade do cliente (backend armazena timestamps opcionais).
- RF-06.3: Completar treino: status da execução, feedback, atualização da prescrição, recálculo aderência, alertas.
- RF-06.4: Não permitir concluir treino de outra sessão que não a “atual” prescrita (validação).

## RF-07 — Dashboard (personal)

- RF-07.1: Resumo: atletas ativos, média aderência, treinos concluídos na semana, contagem por status de aderência, alertas recentes.
- RF-07.2: Lista de status por atleta para triagem rápida.

## RF-08 — Alertas

- RF-08.1: Gerar alertas: dor, muito difícil, muito difícil repetido, atrasado, parado (regras em [10](./10-adherence-and-evolution-rules.md)).
- RF-08.2: Marcar lido (opcional MVP se tempo permitir; spec inclui campo `isRead`).

## RF-09 — Frontend

- RF-09.1: Rotas e telas conforme [08-frontend-routes-and-screens.md](./08-frontend-routes-and-screens.md).
- RF-09.2: Estados de loading, vazio e erro em listas e formulários principais.
