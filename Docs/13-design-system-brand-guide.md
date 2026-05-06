# Guia de marca, design system e UX — futPro (MVP)

Documento de referência para alinhar **identidade**, **componentes** e **comportamentos** ao contexto do produto ([00-product-overview](./00-product-overview.md), [01-mvp-scope](./01-mvp-scope.md)). Serve de base para o [plano por tela](./14-ux-screen-improvement-plan.md).

---

## 1. Contexto da ideia (síntese)

### Problema

Treinadores de futebol de alta performance fragmentam protocolos entre PDF, planilhas, vídeos e WhatsApp. Isso gera inconsistência na prescrição, baixa visibilidade de **aderência** e pouca clareza para o atleta **durante** a sessão.

### Solução do MVP

Uma plataforma web que estrutura:

1. **Prescrever** — protocolos, sessões, exercícios, prescrição por atleta.  
2. **Acompanhar** — dashboard, alertas, histórico.  
3. **Guiar** — execução passo a passo com timer e mídia.  
4. **Medir aderência** — métricas e status.  
5. **Evoluir** — feedback pós-treino e alertas simples (sem IA/wearables no MVP).

### Duas experiências distintas (obrigatório refletir no design)

| Modo | Usuário | Contexto de uso | Estado emocional |
|------|---------|-------------------|------------------|
| **Personal** | Treinador(a) | Desktop/tablet, multitarefa, muitos atletas | Produtividade, escaneabilidade, confiança nos dados |
| **Atleta** | Jogador | Celular, campo/academia, mãos sujas/olhar rápido | Foco, baixa carga cognitiva, feedback imediato |

O design system deve suportar **dois “temas de intenção”** (não necessariamente dois produtos): **painel operacional** vs **modo execução**.

---

## 2. Referências de mercado (benchmark qualitativo)

Comparação focada em **padrões de UX** úteis ao MVP, não em copiar features fora de escopo.

### 2.1 Plataformas “coach + atleta” (B2B2C)

- **TrueCoach / CoachNow (família “remote coaching”)**  
  - **O que observar:** hierarquia clara lista → detalhe; formulários longos quebrados em seções; ênfase em “próxima ação” no app do atleta.  
  - **Lição:** o personal precisa de **densidade informacional controlada** (tabelas, filtros leves), o atleta de **um fluxo linear** com CTA óbvio.

- **Bridge Athletic / TeamBuildr (força condicionamento time)**  
  - **O que observar:** linguagem atlética sem ser “gamer”; status de sessão e leitura rápida de volume/intensidade.  
  - **Lição:** métricas e badges funcionam melhor com **semântica de estado** (ex.: no prazo, atrasado, alerta) do que com decoração genérica.

### 2.2 Apps de treino B2C (só inspiração de execução)

- **Strong / Hevy**  
  - **O que observar:** timer grande, controles com área de toque generosa, feedback háptico implícito via animação leve.  
  - **Lição:** na **execução guiada**, tipografia grande, números tabulares, poucos botões simultâneos.

- **Nike Training Club / Adidas Training (referência de “marca esportiva”)**  
  - **O que observar:** fotografia/gradientes, voz de marca calorosa mas direta.  
  - **Lição:** para **futebol de performance**, tende a funcionar melhor um tom **profissional-campeão** (clube, preparação) do que “neon genérico”.

### 2.3 Saúde / aderência (alertas e confiança)

- **MyFitnessPal / Strava (adesão e histórico)**  
  - **O que observar:** consistência de cores para sucesso/atenção/erro; histórico escaneável por data.  
  - **Lição:** alertas de dor/atraso devem ser **visíveis sem pânico visual** (severidade graduada).

### 2.4 Posicionamento desejado para futPro

- **Evitar:** estética “terminal/hacker” ou **verde neon em excesso** como cor primária global — associa a jogos e reduz **confiança percebida** em contexto clínico-desportivo.  
- **Buscar:** identidade **esportiva premium + operacional** (como um “painel de staff técnico” + “modo jogo” para o atleta), com contraste forte para uso ao ar livre mas sem sacrificar legibilidade.

---

## 3. Princípios de UX (não negociáveis)

1. **Progressão clara** — em todo fluxo, o usuário sabe onde está, o que falta e o que acontece a seguir (especialmente no atleta).  
2. **Confiança nos dados** — números, datas e estados alinhados ao backend (UTC no banco, timezone na UI — já decidido no MVP).  
3. **Acessibilidade mínima** — contraste WCAG AA onde possível; foco visível; alvos ≥ 44×44 px no atleta.  
4. **Feedback de sistema** — loading, erro com retry, sucesso discreto (toast ou inline), nunca “falha silenciosa”.  
5. **Respeito ao contexto** — personal: mais informação por tela; atleta: menos texto, mais ação.

---

## 4. Identidade visual e tokens

### 4.1 Direção de marca (proposta)

- **Nome / conceito:** “futPro” — conota **preparação**, **período**, **equipe técnica**.  
- **Personalidade:** direta, técnica, motivadora sem infantilizar.  
- **Tom de voz (UI):** frases curtas; verbos de ação (“Iniciar treino”, “Prescrever”, “Ver aderência”).

### 4.2 Paleta (sugestão de design system)

Substituir o uso exclusivo de verde neon (`#39ff14`) como cor de destaque por uma escala **semântica**:

| Token | Uso | Exemplo (ajustar em implementação) |
|-------|-----|-----------------------------------|
| `bg-base` | Fundo principal | `#0c0e11` → leve aquecimento (azul-cinza) em vez de preto puro |
| `bg-elevated` | Cards, painéis | `#141820` |
| `border-subtle` | Bordas | `#252d38` |
| `text-primary` | Texto principal | `#f0f3f7` |
| `text-secondary` | Metadados | `#8b96a8` |
| `accent-primary` | CTA principal, progresso | **Verde-menta ou âmbar-esportivo** (escolher **uma** família e manter consistente) — ex. `#22c55e` ou `#d97706` derivados |
| `accent-secondary` | Links secundários, highlights | Tom complementar (ex. ciano suave `#06b6d4` *se* o primário for âmbar) |
| `state-success` | Concluído, no prazo | Verde calmo, não neon |
| `state-warning` | Atenção, atraso leve | Âmbar |
| `state-danger` | Dor, falha, alerta crítico | Vermelho coral `#f87171` com texto legível |
| `state-info` | Neutro informativo | Azul acinzentado |

**Regra:** o verde pode continuar **presente** (futebol = campo), mas como **parte de gradiente ou detalhe**, não como único significado de “clicável”.

### 4.3 Tipografia

- **Família:** uma **sans** de alta legibilidade em tela pequena (ex.: **Inter**, **DM Sans**, **Source Sans 3**, ou sistema com `system-ui` como fallback controlado).  
- **Escala:** modular (ex. 12 / 14 / 16 / 20 / 24 / 32 px).  
- **Pesos:** 400 corpo, 600 títulos e botões, 700 só para hero numérico (timer).  
- **Números:** `font-variant-numeric: tabular-nums` em timers, contagens e métricas (já alinhado ao CSS atual do timer).

### 4.4 Espaçamento e layout

- **Grid base:** múltiplos de **4 px**; padding de card **16–24 px**.  
- **Personal:** `max-width` maior (ex. 1200 px) para dashboard e listas.  
- **Atleta:** coluna única; `max-width` ~ 28–36 rem; **safe-area** já considerada — manter.

### 4.5 Raio, sombra e profundidade

- **Radius:** 8 px inputs/botões; 12–16 px cards; pill para progresso e chips.  
- **Sombra:** sutil em cards elevados no personal (`0 4px 24px rgba(0,0,0,.25)`); no atleta, preferir contraste por cor de fundo a sombras pesadas.

### 4.6 Movimento

- **Duração:** 150–200 ms (UI); 300–400 ms (transições de passo no treino).  
- **Princípio:** motion **funcional** (confirmar conclusão de etapa, pulse leve no timer), evitar animação decorativa longa.

---

## 5. Componentes e comportamentos

### 5.1 Inventário mínimo (design system)

| Componente | Variantes | Comportamento-chave |
|------------|-----------|---------------------|
| **Button** | primary, secondary, ghost, danger, link | loading inline; disabled com `aria-disabled`; full-width no mobile atleta |
| **Input / Select / Textarea** | default, error, hint | mensagem de erro ligada por `aria-describedby` |
| **Card** | default, interactive | hover só em desktop para cards clicáveis |
| **Badge / Tag** | status: ok, warning, danger, neutral | texto + cor semântica, não só cor |
| **PageHeader** | título, subtítulo, ações à direita | padronizar todas as telas do personal |
| **DataTable / ListRow** | lista de atletas, protocolos | linha clicável com hit-area mínima |
| **EmptyState** | ilustração leve opcional + CTA | uma ação primária clara |
| **Toast / Banner** | success, error | erros persistentes com retry |
| **Modal / Drawer** | confirmações, descanso full-screen | foco preso; ESC fecha quando seguro |
| **Stepper** | execução de treino | passo atual, total, nome do exercício |
| **ProgressBar** | sessão / macro | preenchimento + label percentual opcional |

### 5.2 Padrões de interação

- **Navegação personal:** barra superior ou lateral colapsável em mobile; indicar rota ativa.  
- **Navegação atleta:** bottom bar ou header compacto com 2–3 itens (Home, Histórico, Sair).  
- **Formulários longos (protocolo, exercício):** seções com títulos; salvar rascunho vs publicar (futuro); no MVP, ao menos agrupar campos semanticamente.  
- **Destructivo:** excluir ou cancelar prescrição exige confirmação explícita.

### 5.3 Acessibilidade (checklist)

- Contraste texto/fundo ≥ 4.5:1 (corpo).  
- Foco visível em links e botões.  
- Formulários com labels reais (não só placeholder).  
- Ícones com `aria-label` quando não houver texto.

---

## 6. Íconografia e ilustração

- Preferir **ícones line** consistentes (um set: Lucide, Phosphor ou Heroicons).  
- Evitar misturar estilos (outline + filled aleatório).  
- Ilustrações: opcionais em empty states; se usar, estilo **flat geométrico** alinhado ao tom “clube / performance”.

---

## 7. Conteúdo e microcopy (diretrizes)

- **Personal:** linguagem operacional (“Prescrição ativa”, “Aderência 7 dias”, “Alertas”).  
- **Atleta:** linguagem de ação (“Próximo exercício”, “Descanso”, “Como foi o treino?”).  
- **Erros:** mensagem humana + código técnico só em log (“Não foi possível salvar. Tente novamente.”).

---

## 8. Métricas de sucesso de design (pós-refino)

- Tempo para o personal localizar **atleta em risco** no dashboard.  
- Taxa de conclusão do fluxo **início → fim do treino guiado** sem abandono na primeira sessão (qualitativo no MVP).  
- Feedback explícito em testes: “parece profissional / confio nos dados”.

---

## Documentação relacionada

- Plano por tela: [14-ux-screen-improvement-plan.md](./14-ux-screen-improvement-plan.md)  
- Escopo funcional: [01-mvp-scope.md](./01-mvp-scope.md)
