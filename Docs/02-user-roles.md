# Papéis e permissões

## Papéis

| Papel | Descrição |
|-------|-----------|
| `PERSONAL` | Dono da conta; gerencia atletas, conteúdo e prescrições. |
| `ATHLETE` | Atleta vinculado a um `personalId`; executa treinos e envia feedback. |

## Modelo de conta

- **Personal**: registro em `POST /auth/register` com role `PERSONAL`.
- **Atleta**: criado pelo personal (`POST /athletes`); credenciais: mesmo modelo de usuário com role `ATHLETE` e ligação ao registro `Athlete` **ou** atleta autentica com userId ligado a `Athlete`.

**Decisão MVP**: Tabela `User` com `role` (`PERSONAL` | `ATHLETE`), `email` único global. Tabela `Athlete` com `userId` opcional: se o atleta “tem login”, `userId` preenchido e senha no `User`. Personal cria atleta com email + senha temporária ou define senha inicial.

## Matriz de acesso (resumo)

| Recurso | Personal | Atleta |
|---------|----------|--------|
| Dashboard agregado | Sim | Não |
| CRUD atletas (do seu tenant) | Sim | Não (só próprio perfil leitura via API de atleta) |
| CRUD exercícios/protocolos | Sim | Não |
| Prescrições | Sim | Leitura do próprio contexto |
| Execução / steps | Não | Sim (própria) |
| Histórico | Sim (por atleta) | Sim (próprio) |

## Autorização

- JWT com `sub` (userId), `role`, e para atleta `athleteId` (claim ou resolvido via join).
- Guards: `PersonalGuard`, `AthleteGuard`; rotas públicas apenas login/register.

## Multi-tenant

- MVP: **um personal = um tenant**; todos os recursos (exercises, protocols, athletes) filtrados por `personalId` do usuário autenticado.
