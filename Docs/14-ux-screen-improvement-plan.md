# Plano de melhoria de UX por tela — Personal Futebol (MVP)

Este plano deriva do [guia de marca e design system](./13-design-system-brand-guide.md) e mapeia **cada rota atual** do frontend (`frontend/src/App.tsx`) para melhorias **concretas** de layout, componentes e comportamento.

**Legenda de prioridade**

- **P0** — impacto alto em confiança, acessibilidade ou fluxo crítico (execução / prescrição).  
- **P1** — consistência visual, densidade, microcopy.  
- **P2** — polish, ilustração, delight.

---

## Visão geral das rotas

| Área | Rota | Componente |
|------|------|------------|
| Personal | `/login` | `PersonalLogin` |
| Personal | `/dashboard` | `Dashboard` |
| Personal | `/athletes` | `AthletesList` |
| Personal | `/athletes/new` | `AthleteNew` |
| Personal | `/athletes/:id` | `AthleteDetail` |
| Personal | `/protocols` | `ProtocolsList` |
| Personal | `/protocols/new` | `ProtocolNew` |
| Personal | `/protocols/:id/edit` | `ProtocolEdit` |
| Personal | `/exercises` | `ExercisesList` |
| Personal | `/exercises/new` | `ExerciseNew` |
| Personal | `/exercises/:id/edit` | `ExerciseEdit` |
| Personal | `/prescriptions/new` | `PrescriptionNew` |
| Atleta | `/athlete/login` | `AthleteLogin` |
| Atleta | `/athlete/home` | `AthleteHome` |
| Atleta | `/athlete/history` | `AthleteHistory` |
| Atleta | `/athlete/training/execution/:id` | `TrainingExecution` |

**Cross-cutting:** `PersonalNav`, `AthleteNav`, `PageLoading`, estilos globais em `index.css`, tratamento de erro (`ErrorRetry` onde existir).

---

## A. Área do personal

### A.1 Login (`/login`) — `PersonalLogin`

**Estado atual (síntese):** formulário funcional; modo login/registro em tabs; fundo escuro global; links em verde neon.

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Hierarquia | `PageHeader` com logo/wordmark + subtítulo alinhado à promessa do produto (“Prescrição guiada com aderência”) | P1 |
| Marca | Reduzir dependência do verde neon; CTA com token `accent-primary` do guia | P0 |
| Registro vs login | Segment control mais claro (estado ativo com fundo elevado); evitar dois botões que parecem iguais | P1 |
| Confiança | Link “Sou atleta” como secondary (não competir visualmente com CTA) | P1 |
| A11y | Garantir `aria-pressed` / `role="tablist"` se mantiver tabs; foco ao alternar modo | P1 |
| Erro | Mapear respostas da API para mensagens curtas; oferecer retry quando 5xx | P1 |

**Critério de pronto:** um novo usuário entende em **5 s** que é área do treinador e onde ir se for atleta.

---

### A.2 Dashboard (`/dashboard`) — `Dashboard`

**Objetivo do produto:** “visão operacional” — resumo, alertas, quem precisa de atenção ([01-mvp-scope](./01-mvp-scope.md)).

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Layout | Grid responsivo: **KPIs** (cards) → **alertas** (lista destacada) → **atletas / status** (tabela ou cards) | P0 |
| Densidade | `max-width` maior que 960 px para desktop; uso de 2 colunas em wide | P0 |
| Alertas | Badge semântico (`state-danger`, `state-warning`) + texto explicativo + link para perfil do atleta | P0 |
| Escaneabilidade | Tipografia de números consistente; evitar tudo na mesma cor de destaque | P1 |
| Vazio | `EmptyState` com CTA “Cadastrar atleta” / “Criar protocolo” | P1 |
| Loading | Skeleton alinhado ao layout final (não blocos genéricos soltos) | P2 |

**Critério de pronto:** o personal identifica **em até 1 scroll** quem está em risco e qual o próximo passo.

---

### A.3 Lista de atletas (`/athletes`) — `AthletesList`

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Cabeçalho | Título + botão primário “Novo atleta” à direita (padrão `PageHeader`) | P1 |
| Lista | Linhas com: nome, status, última atividade/aderência (se API expuser), seta ou affordance de clique | P1 |
| Busca/filtro | Campo de busca simples (client ou server) — P2 se API não existir | P2 |
| Estados | Empty / erro / loading consistentes com dashboard | P1 |

---

### A.4 Novo atleta (`/athletes/new`) — `AthleteNew`

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Form | Agrupar: dados pessoais → conta (email/senha) → notas; hints sobre senha inicial | P0 |
| Validação | Erros inline por campo; mensagem para email duplicado | P0 |
| Pós-sucesso | Navegação clara para perfil ou lista + toast de sucesso | P1 |

---

### A.5 Perfil do atleta (`/athletes/:id`) — `AthleteDetail`

**Objetivo:** dados + prescrição + histórico + aderência + alertas (escopo MVP).

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Estrutura | Abas ou âncoras: **Resumo | Prescrição | Histórico | Alertas** (evitar página longa sem hierarquia) | P0 |
| Prescrição | Card com estado (ativa/pausada), datas, protocolo; CTAs “Nova prescrição”, “Pausar” conforme API | P0 |
| Aderência | Visualização simples (últimos 7/30 dias) com cor semântica do guia | P1 |
| Alertas | Lista com severidade e timestamp | P0 |
| Ações secundárias | “Editar dados”, “Ver como atleta” (futuro) — não bloquear MVP | P2 |

---

### A.6 Protocolos — lista (`/protocols`) — `ProtocolsList`

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Cards ou tabela | Mostrar nº de sessões, objetivo, badge ativo/inativo | P1 |
| Ações | “Editar” e “Usar em prescrição” (atalho para `/prescriptions/new` com query pré-preenchida — P2) | P2 |

---

### A.7 Novo protocolo (`/protocols/new`) — `ProtocolNew`

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Wizard leve | Passo 1 metadados → passo 2 sessões (ou seções colapsáveis) | P1 |
| Feedback | Auto-save ou aviso “alterações não salvas” se houver edição longa | P2 |

---

### A.8 Editar protocolo (`/protocols/:id/edit`) — `ProtocolEdit`

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Complexidade | Lista de sessões com reorder visual (handle); exercícios em sub-card | P0 |
| Exercício | Preview de tipo (tempo, reps, intervalo) com ícones consistentes | P1 |
| Destructivo | Confirmar remoção de sessão/exercício | P1 |

---

### A.9 Exercícios — lista (`/exercises`) — `ExercisesList`

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Colunas | Nome, categoria, tipo de execução, link vídeo (ícone) | P1 |
| Empty | CTA “Criar exercício” | P1 |

---

### A.10 Novo / editar exercício (`/exercises/new`, `/exercises/:id/edit`)

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Tipo de execução | Campos dinâmicos conforme `ExecutionType` (evitar mostrar tudo de uma vez) | P0 |
| Vídeo | Preview de URL (YouTube) ou link “Abrir vídeo” | P1 |
| Ajuda | Texto curto por tipo (“Intervalo: trabalho e descanso em segundos”) | P1 |

---

### A.11 Nova prescrição (`/prescriptions/new`) — `PrescriptionNew`

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Seleção | Selects pesquisáveis para atleta e protocolo (se listas crescerem) | P1 |
| Resumo | Antes de salvar, bloco-resumo: quem, o quê, quando começa, frequência | P0 |
| Erro de negócio | Mensagem clara quando já existe prescrição ativa (conforme [01-mvp-scope](./01-mvp-scope.md)) | P0 |

---

### A.12 Navegação — `PersonalNav`

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Estrutura | Agrupar: **Principal** (Dashboard, Atletas) · **Biblioteca** (Protocolos, Exercícios) | P1 |
| Ativo | Estado visual claro; opcional: indicador de página no mobile | P1 |
| Logout | Estilo ghost consistente; confirmação opcional — P2 | P2 |

---

## B. Área do atleta

### B.1 Login (`/athlete/login`) — `AthleteLogin`

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Marca | Visual distinto do personal (cor de acento ou hero leve) mantendo mesmo design system | P1 |
| Erro | Diferenciar “credenciais inválidas” vs “conta é de treinador” (já existe lógica — garantir copy clara) | P0 |
| Link | “Sou treinador(a)” em estilo secundário | P1 |

---

### B.2 Home (`/athlete/home`) — `AthleteHome`

**Objetivo:** treino atual + progresso + CTA de execução.

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Hero | Card principal com nome do treino, progresso macro, CTA **Iniciar treino** (full-width, altura mínima tocável) | P0 |
| Contexto | Protocolo, ciclo, próxima data — tipografia secundária | P1 |
| Histórico resumido | Últimas 2–3 sessões com link “Ver tudo” | P2 |
| Sem prescrição | Empty state orientando contato com treinador | P0 |

---

### B.3 Execução guiada (`/athlete/training/execution/:id`) — `TrainingExecution`

**Objetivo:** fluxo crítico — timer, etapas, descanso, conclusão ([pilares do produto](./00-product-overview.md)).

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Stepper | Sempre visível: “Exercício 2 de 8” + nome | P0 |
| Timer | `timer-panel` com hierarquia clara; estado **pausado** visível | P0 |
| Descanso | `rest-overlay` com countdown grande; botão “Pular descanso” opcional com confirmação | P1 |
| Mídia | Área para vídeo/link sem quebrar layout mobile | P1 |
| Conclusão | Fluxo de feedback (dificuldade, dor) com inputs grandes; confirmação de envio | P0 |
| A11y | Anúncios para leitores de tela em mudança de etapa (live region) — P2 | P2 |

---

### B.4 Histórico (`/athlete/history`) — `AthleteHistory`

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Lista | Agrupar por data; mostrar status e feedback resumido | P1 |
| Detalhe | Toque na linha expande ou navega para detalhe mínimo | P2 |
| Vazio | Mensagem motivacional leve | P2 |

---

### B.5 Navegação — `AthleteNav`

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Mobile | Bottom bar fixa com Home | Histórico | Sair (safe-area) | P0 |
| Brand | Nome do produto ou “Meu treino” — evitar termos internos | P1 |

---

## C. Global e sistema

### C.1 `index.css` / tokens

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Tokens | Migrar cores hardcoded para variáveis CSS (`--color-accent`, etc.) conforme guia | P0 |
| Links | Não usar cor de link = cor de sucesso global; diferenciar | P0 |
| Focus | `:focus-visible` com anel consistente | P0 |

### C.2 Roteamento e primeira impressão

| Item | Melhoria | Prioridade |
|------|----------|------------|
| `/` | Hoje redireciona para `/login`; considerar landing mínima com escolha **Personal | Atleta** (uma tela) | P2 |

### C.3 Loading e erro

| Item | Melhoria | Prioridade |
|------|----------|------------|
| Padrão | Todo fetch com estado loading + `ErrorRetry` + mensagem | P1 |
| Toasts | Sucesso de ações CRUD (opcional no MVP) | P2 |

---

## Ordem sugerida de implementação (sprints curtas)

1. **Sprint visual-base:** tokens CSS + botões/links + `PageHeader` + ajuste `PersonalNav` / `AthleteNav`.  
2. **Sprint personal operacional:** Dashboard + `AthleteDetail` + `PrescriptionNew` (informação densa e alertas).  
3. **Sprint atleta execução:** `AthleteHome` + `TrainingExecution` (stepper, CTA, overlay).  
4. **Sprint biblioteca:** `ProtocolEdit` + formulários de exercício (campos dinâmicos).  
5. **Sprint polish:** empty states, skeletons, microcopy, P2.

---

## Documentação relacionada

- Guia de design: [13-design-system-brand-guide.md](./13-design-system-brand-guide.md)  
- Escopo: [01-mvp-scope.md](./01-mvp-scope.md)  
- Plano técnico: [12-implementation-plan.md](./12-implementation-plan.md)
