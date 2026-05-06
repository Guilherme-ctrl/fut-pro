# Regras de execução do treino

## Objetivo

Garantir que o atleta siga uma **sequência linear** definida pela prescrição, sem escolher treino aleatório, com progressão e ciclos explícitos.

## Resolução do “treino atual”

Entrada: prescrição `ACTIVE`, protocolo com sessões ordenadas por `order` ascendente.

1. Selecionar `TrainingSession` onde `session.order === prescription.currentTrainingOrder`.
2. Se não existir sessão com essa ordem (inconsistência), erro de dados — admin corrige protocolo ou prescrição.

## Início de execução

- Somente uma execução `IN_PROGRESS` por atleta por vez (MVP).
- `start` cria `TrainingExecution` com `status=IN_PROGRESS` e steps `NOT_STARTED` para cada `TrainingExercise` ordenado por `order`.
- `trainingSessionId` deve ser o da sessão atual resolvida acima.

## Passos (steps)

- Completar step: marcar `COMPLETED`, registrar `finishedAt`.
- Ordem de conclusão: o cliente guia sequencialmente; backend valida que `stepId` pertence à execution e que não conclui duplicado.
- Pular step: **MVP**: não suportar `SKIPPED` salvo exceção manual pelo personal (fora do fluxo atleta); se necessário, apenas `COMPLETED` marca fim real da etapa.

## Timers

- Duração e descanso são **orientação**; o cliente exibe countdown. Backend pode aceitar `startedAt` em PATCH opcional para auditoria fraca — **decisão MVP**: timestamps de step opcionais; foco em completar etapa.

## Conclusão do treino

Pré-condições:

- Todos os steps `COMPLETED` **ou** decisão MVP: permitir concluir se último step completo e anteriores completos (validar ordem).

Pós-condições (transação):

1. Atualizar `TrainingExecution`: `status=COMPLETED`, `finishedAt=now`, feedback do atleta.
2. Aplicar `ProgressionService.advanceAfterCompletion(prescription, protocol)`:
   - Incrementar `currentTrainingOrder` em 1.
   - Se `currentTrainingOrder > trainingCount`: set `currentTrainingOrder = 1`, incrementar `currentCycle`.
   - Se `currentCycle > cycleCount`: `prescription.status = COMPLETED`.
3. Recalcular aderência (ver [10](./10-adherence-and-evolution-rules.md)).
4. Disparar `AlertService` para dor / muito difícil / padrões.

## Falta (não treinar em um dia)

- **Não** alterar `currentTrainingOrder` automaticamente pelo tempo.
- O “treino atual” permanece o mesmo até que uma execução seja completada.
- Métricas de “atraso” vêm da aderência (frequência semanal vs conclusões), não da progressão da ordem.

## Tipos de exercício (mapeamento)

O `executionType` indica o que mostrar no UI:

| executionType | UI principal |
|---------------|----------------|
| SERIES_REPS | Séries × repetições |
| TIME_BASED | Timer count-up/down por `durationSeconds` |
| DISTANCE_BASED | Distância (metros) |
| CIRCUIT | Bloco circuito (rodadas) |
| INTERVAL | Work/rest intervalado |
| FREE_INSTRUCTIONS | Texto / observações |

Múltiplos campos podem existir no mesmo registro; o tipo indica o **modo principal** da etapa.

## Ajuste manual (personal)

- Via `PATCH /prescriptions/:id` pode corrigir `currentTrainingOrder`, `currentCycle`, `status` com validação de limites.
