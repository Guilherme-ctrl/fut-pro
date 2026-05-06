# Rotas e telas (frontend)

## Stack de navegação

**Decisão MVP**: React + Vite + `react-router-dom` v6; layout distinto para personal vs atleta após login.

## Área do personal (prefixo `/`)

| Rota | Tela | Conteúdo principal |
|------|------|-------------------|
| `/login` | Login | Email, senha; redirect dashboard |
| `/dashboard` | Dashboard | Cards, alertas, resumo atletas |
| `/athletes` | Lista | Tabela/cards: nome, posição, protocolo, próximo treino, último treino, aderência, status |
| `/athletes/:id` | Perfil atleta | Dados, prescrição, ciclo, histórico, feedbacks, alertas, CTA prescrever |
| `/protocols` | Lista protocolos | Nome, #treinos, ciclos, ativo |
| `/protocols/new` | Novo protocolo | Form meta + redireciona para edição |
| `/protocols/:id/edit` | Editor | Sessões ordenadas, exercícios por sessão |
| `/exercises` | Biblioteca | Lista exercícios |
| `/exercises/new` | Novo exercício | Form completo |
| `/prescriptions/new` | Nova prescrição | Seletor atleta, protocolo, data início, frequência, ciclos |

Proteção: rotas exigem `role=PERSONAL`.

## Área do atleta (prefixo `/athlete`)

| Rota | Tela | Conteúdo principal |
|------|------|-------------------|
| `/athlete/login` | Login atleta | Mesmo backend; pode reutilizar componente com redirect `/athlete/home` |
| `/athlete/home` | Home | Treino atual, protocolo, ciclo, progresso, CTA iniciar |
| `/athlete/training/current` | Detalhe treino atual | Resumo antes de iniciar (opcional se home já basta) |
| `/athlete/training/execution/:executionId` | Execução guiada | Passos, vídeo, timer, concluir etapa/treino |
| `/athlete/history` | Histórico | Lista treinos concluídos com data e feedback resumido |

Proteção: `role=ATHLETE`.

## Componentes-chave (pastas sugeridas)

- `components/layout`: `PersonalShell`, `AthleteShell`, header mobile-first.
- `components/training`: `ExerciseStepCard`, `RestTimer`, `TrainingProgressBar`.
- `components/dashboard`: `StatCard`, `AthleteStatusBadge`, `AlertsList`.

## Fluxo UX — execução

1. Home → “Iniciar treino” → `POST start` → navega para `/athlete/training/execution/:id`.
2. Por cada step: iniciar (opcional) → timer local se TIME_BASED → “Concluir etapa”.
3. Última etapa → “Concluir treino” → modal/página de feedback → `POST complete` → redirect home com sucesso.

## Feedback pós-treino

Campos: dificuldade (4 níveis), dor sim/não, local dor (texto), observações (texto).
