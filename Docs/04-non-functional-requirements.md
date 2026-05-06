# Requisitos não funcionais

## RNF-01 — Qualidade de código

- TypeScript estrito no backend e frontend.
- Separação controller → service → repositório/acesso a dados (NestJS modules ou camadas equivalentes no Express).
- Validação de entrada: `class-validator` (Nest) ou Zod/Joi no Express.
- Erros HTTP padronizados: corpo `{ code, message, details? }` com códigos estáveis para o cliente.

## RNF-02 — Segurança (MVP)

- Senhas com hash (bcrypt ou argon2).
- JWT em header `Authorization: Bearer`.
- CORS configurável via env para origem do frontend.
- Sem exposição de stack trace em produção.

## RNF-03 — Performance

- MVP: sem requisitos rígidos; listagens pagináveis quando > 50 itens (opcional na primeira versão — implementar se natural no ORM).

## RNF-04 — UX

- Layout responsivo; prioridade mobile na jornada do atleta.
- Feedback visual em ações destrutivas e em sucesso/erro.
- Identidade: base escura/neutra, verde neon como destaque (ver prompt de produto).

## RNF-05 — Observabilidade

- Logs estruturados simples (console) no MVP.
- Request ID opcional.

## RNF-06 — Testes

- Testes unitários para serviços de domínio críticos: progressão, aderência, alertas (ver [12](./12-implementation-plan.md)).

## RNF-07 — Operações locais

- Docker Compose só para PostgreSQL.
- `.env.example` com todas as variáveis necessárias.
- README com comandos: instalar deps, migrate, seed, run api, run web.

## RNF-08 — Dados

- Migrations versionadas (Prisma).
- Seed reproduzível para protocolo “Pré-Temporada Futebol — Exemplo”.
