# Aderência e evolução

## Definições

- **Prescrito (período)**: com base em `startDate`, `weeklyFrequency` e calendário, estimar quantos treinos “esperados” até a data de referência (geralmente **hoje**).
- **Concluído**: contagem de `TrainingExecution` com `status=COMPLETED` para a prescrição (ou atleta + prescrição) no mesmo período.

**Decisão MVP (janela de aderência)**:

- Calcular **treinos esperados desde startDate** como: `floor(diasDecorridos / 7) * weeklyFrequency` + proporcional parcial opcional — para simplicidade:  
  `expected = ceil((daysSinceStart / 7) * weeklyFrequency)` com mínimo 1 após primeira semana completa.
- Documento alternativo simples: **esperado = número de semanas completas × weeklyFrequency**, limitado superiormente por `trainingCount * cycleCount` quando faz sentido como teto do programa.

**Regra fixa para implementação**:

```
weeksElapsed = floor(daysBetween(startDate, today) / 7)
expectedSessions = min(weeksElapsed * weeklyFrequency, totalProgramSessions - completedCapAdjustment)
```

Onde `totalProgramSessions = trainingCount * cycleCount` representa o teto de sessões planejadas no programa. Enquanto `currentCycle` e ordem não completaram o programa, usar o teto.

Se isso gerar ambiguidade, usar versão mais simples **aprovada para código**:

### Versão simplificada (implementar no MVP)

- `prescribed = número de treinos que deveriam ter sido concluídos desde startDate dado weeklyFrequency`, **cap** em `trainingCount * cycleCount`.
- `completed = count(COMPLETED executions)` ligadas à prescrição.
- `adherencePercent = prescribed === 0 ? 100 : min(100, round((completed / prescribed) * 100))` com `prescribed` mínimo 1 se já passou pelo menos um dia útil da primeira semana.

**Detalhe de “dia útil”**: MVP ignora finais de semana — conta apenas dias corridos e frequência semanal como média (aceitar imperfeição documentada).

## Métricas por atleta

| Métrica | Descrição |
|---------|-----------|
| prescribed | Treinos esperados no período (regra acima) |
| completed | Execuções COMPLETED |
| adherencePercent | `completed / prescribed` |
| daysSinceLastTraining | Dias desde último `finishedAt` |
| currentStreak | Dias/semanas consecutivos com treino — **MVP**: sequência de sessões concluídas em dias consecutivos de calendário (simplificado) ou “últimos 7 dias count” |
| currentCycle / currentTrainingOrder | Da prescrição ativa |
| missedOrLate | `max(0, prescribed - completed)` aproximado |

**Decisão streak MVP**: `currentStreak` = número de treinos concluídos na semana corrente (reset semanal) para evitar lógica complexa.

## Status `AthleteAdherenceStatus`

Calcular a partir de `daysSinceLastTraining`, `adherencePercent` e `weeklyFrequency`.

### Limiares (ajustáveis por constante)

| Status | Condição sugerida |
|--------|-------------------|
| EM_DIA | `daysSinceLastTraining <= ceil(7 / weeklyFrequency)` **ou** aderência ≥ 85% e dias sem treinar ≤ 2 |
| ATENCAO | entre EM_DIA e ATRASADO: ex. 3–4 dias sem treinar ou aderência 60–84% |
| ATRASADO | ≥ 5 dias sem treinar ou aderência < 60% mas ainda houve atividade na última 2 semanas |
| PARADO | ≥ 10 dias sem treinar **ou** aderência muito baixa com último treino > 14 dias |

**Implementação**: centralizar constantes `THRESHOLDS` no `AdherenceService` e testar.

## Alertas

| Tipo | Gatilho |
|------|---------|
| PAIN | `feltPain === true` na conclusão |
| VERY_HARD | `perceivedDifficulty === VERY_HARD` |
| OVERLOAD | ≥ 2 `VERY_HARD` nos últimos 3 treinos concluídos |
| BEHIND_SCHEDULE | status ATRASADO |
| STOPPED | status PARADO |

Mensagens: texto curto em português para o dashboard.

## Evolução (MVP)

- Sem IA: “evolução” = visualização de histórico + alertas + aderência.
- Personal decide ajustes com base nos dados.
