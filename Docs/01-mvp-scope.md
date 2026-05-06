# Escopo do MVP

## Objetivo

Validar que o treinador **prescreve e acompanha** e o atleta **executa o treino guiado pelo sistema**, com atualização de próximo treino, aderência e alertas básicos.

## Deve ter

### Personal

- Login (email + senha).
- Dashboard com resumo e alertas.
- CRUD de atletas.
- Perfil do atleta (dados, prescrição, histórico, aderência, alertas).
- CRUD de exercícios (com URL de vídeo quando houver).
- CRUD de protocolos e treinos (sessões) ordenados.
- Associação de exercícios a treinos com parâmetros (séries, reps, tempo, distância, descanso, tipo de execução, notas).
- Prescrição: protocolo + atleta + data de início + frequência semanal + ciclos.
- Visualização de histórico de execuções e feedbacks.
- Ajuste manual da prescrição quando necessário (ex.: pausar, retomar, posição na sequência — ver API).

### Atleta

- Login com as mesmas credenciais do cadastro (email definido pelo personal) **ou** fluxo por convite no MVP simplificado como: personal define senha inicial / atleta redefine no primeiro acesso — **decisão**: autenticação JWT igual ao personal, com `role` distinto; atleta só acessa rotas `/athlete/*` e endpoints de atleta.
- Home com treino atual e contexto (protocolo, ciclo, progresso).
- Execução guiada (etapas, timer quando aplicável).
- Conclusão de treino + feedback (dificuldade, dor, notas).
- Histórico simples de treinos concluídos.

## Fora do MVP

- IA gerando treinos.
- Marketplace, pagamentos.
- App nativo obrigatório, wearables, Strava.
- Chat interno, ranking social, gamificação complexa.
- Anamnese avançada, nutrição.
- Upload de vídeo pelo atleta, análise biomecânica.

## Critérios de aceite (demonstração)

1. Personal cria conta.
2. Personal cadastra atleta.
3. Personal usa protocolo seedado ou cria um.
4. Personal prescreve protocolo ao atleta.
5. Atleta acessa área do atleta.
6. Atleta vê treino atual.
7. Atleta executa treino guiado.
8. Atleta conclui e informa dificuldade/dor.
9. Sistema avança próximo treino na sequência (e ciclos quando aplicável).
10. Personal vê conclusão, aderência e alertas no dashboard/perfil.

## Decisões de produto (ambiguidades resolvidas)

| Tema | Decisão |
|------|---------|
| Convite atleta | MVP: personal cadastra email/senha ou envia credenciais por canal externo; não há fluxo de e-mail transacional obrigatório. |
| Múltiplas prescrições ativas | Uma prescrição **ACTIVE** por atleta por vez; nova prescrição exige pausar/completar a anterior ou erro de validação. |
| Fuso horário | Todas as datas em **UTC** no banco; UI pode usar timezone do browser (documentar no frontend). |
| Vídeo | `videoUrl` string (YouTube, Vimeo, link direto); embed ou link externo no MVP. |
