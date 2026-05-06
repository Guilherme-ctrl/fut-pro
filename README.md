# futPro — MVP (Prescrição guiada com aderência)

Monorepo do MVP descrito em `/Docs`: especificações (SDD), API NestJS + Prisma, app Vite/React e PostgreSQL via Docker.

## Pré-requisitos

- Node.js 20+ (recomendado LTS)
- Docker Desktop ou Docker Engine + Compose

## Configuração rápida

1. Suba o banco na raiz do repositório:

```bash
docker compose up -d
```

2. Backend — variáveis, dependências, migrações e seed:

```bash
cp .env.example backend/.env
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
```

Garanta que `backend/.env` define pelo menos `DATABASE_URL` e **`JWT_SECRET`** (qualquer string forte em desenvolvimento).

**Credenciais demo** (após o seed):

| Papel    | Email               | Senha    |
|----------|---------------------|----------|
| Personal | `personal@demo.com` | `demo123` |
| Atleta   | `atleta@demo.com`   | `demo123` |

**Importante:** esses e-mails precisam existir com os papéis acima. Se você criou antes uma conta **“Criar conta”** no app do personal usando `atleta@demo.com`, esse usuário ficou como treinador — o login do atleta falha (“conta é de treinador”) ou o fluxo quebra. Rode de novo `npx prisma db seed` na pasta `backend/` para **resetar senha e corrigir os papéis** dos dois usuários demo.

3. API (porta **3333** por padrão — `PORT` em `backend/.env`):

```bash
cd backend
npm run start:dev
```

Abrir só **http://localhost:3333** no navegador mostra um JSON de boas-vindas; as rotas úteis são **`/api/...`** (ex.: `POST /api/auth/login`). O app web está no Vite (passo 4).

4. Frontend (em desenvolvimento, o Vite faz proxy de `/api` para `http://localhost:3333`):

```bash
cd frontend
npm install
npm run dev
```

Abra **http://localhost:5173**. A raiz (`/`) oferece a escolha **treinador** ou **atleta**; você pode ir direto a `/login` ou `/athlete/login` se preferir.

Se o atleta demo não tiver prescrição ativa, rode de novo `npx prisma db seed` na pasta `backend/` (o seed cria protocolo exemplo + prescrição para o atleta demo).

## Testes (backend)

```bash
cd backend
npm test          # unitários (ex.: progressão)
npm run test:e2e  # e2e mínimo (ex.: /api/auth/me sem token)
```

## Checklist de aceite do MVP

Fluxo demonstrável (alinhado a `Docs/01-mvp-scope.md`):

1. Personal cria conta ou usa `personal@demo.com`.
2. Personal cadastra atleta (ou usa o seed).
3. Personal usa protocolo seedado ou cria/edita em **Protocolos** / **Exercícios**.
4. Personal cria **Nova prescrição** para o atleta (uma prescrição `ACTIVE` por atleta).
5. Atleta faz login em **Área do atleta**.
6. Atleta vê o treino atual na home.
7. Atleta inicia **treino guiado** (timers e descanso opcionais).
8. Atleta conclui etapas e envia **feedback**.
9. O sistema avança o próximo treino na sequência (ver regras em `Docs/`).
10. Personal vê métricas no **Dashboard** e detalhes no **perfil do atleta** (aderência, alertas, histórico).

## Resolução de problemas

| Problema | O que verificar |
|----------|------------------|
| Erro de conexão com o banco | `docker compose ps`, `DATABASE_URL` com usuário `pf`, DB `futpro`, porta `5432`. |
| `401` em todas as rotas | `JWT_SECRET` definido; reinicie o backend após alterar `.env`. |
| Frontend não chama a API | Backend na porta 3333; `npm run dev` do Vite usa o proxy de `/api`. |
| Conflito ao prescrever | Já existe prescrição `ACTIVE` para o atleta — pause/conclua a atual ou use outro atleta. |
| Credenciais demo “inválidas” ou atleta vira treinador | Rode `npx prisma db seed` no `backend/`. Evite registrar `atleta@demo.com` pela área do personal antes do seed. |
| Atleta sem senha / não entra no app | No cadastro, a senha é obrigatória. Atletas antigos sem conta: abra o **perfil do atleta** e use **Definir senha** no bloco “Senha no app do atleta”. |

## Deploy (Vercel + Render)

### Banco (Render Postgres)

1. No [Render](https://render.com), crie um **PostgreSQL** (plano free ou pago).
2. Copie a **Internal Database URL** (ou External, se for o caso) — será o `DATABASE_URL` da API.

### Backend (Render — Web Service)

1. **New → Web Service**, conecte o repositório Git.
2. **Root Directory**: exatamente `backend` (pasta que contém o `package.json` da API). **Não** use `src/backend` — se o log mostrar `Cannot find module '.../src/backend/dist/main'`, o diretório raiz do serviço está errado ou o build não gerou `dist/`.
3. **Build Command**: `npm install --include=dev && rm -rf dist tsconfig.build.tsbuildinfo && npx prisma generate && npx prisma migrate deploy && npm run build`  
   O `rm -rf dist …` evita deploy sem ficheiros quando o cache incremental do TypeScript acha que não há nada a emitir.  
   O `--include=dev` evita falha do `nest build` quando existe `NODE_ENV=production` no ambiente (sem isso o npm pode omitir `@nestjs/cli` e o `dist/` nunca é criado).
4. **Start Command**: `npm run start:prod` (equivale a `node dist/main.js` dentro da pasta `backend`). Não use caminho absoluto tipo `/opt/render/project/...`.
5. **Environment** (exemplos):
   - `DATABASE_URL` — do Postgres acima (mesmo valor que no `.env` local, formato `postgresql://...`).
   - `JWT_SECRET` — string longa e aleatória.
   - `JWT_EXPIRES_DAYS` — opcional (padrão do app: `7`).
   - `CORS_ORIGIN` — URL do front na Vercel, **sem barra no final** (ex.: `https://seu-app.vercel.app`). Várias origens: separe por vírgula (útil se você tiver mais de um domínio). Deploys de **preview** da Vercel têm URL própria — inclua essa URL em `CORS_ORIGIN` se for testar contra a API de produção, ou teste só pelo domínio de produção.
6. Aguarde o deploy e anote a URL pública (ex.: `https://futpro-api.onrender.com`).

Opcional: na raiz do repo existe [`render.yaml`](render.yaml) para criar o serviço via **Blueprint** (ainda é preciso configurar variáveis secretas no painel).

**Seed em produção** (usuários demo): após o primeiro deploy com migrations, no shell do Render ou localmente com `DATABASE_URL` de produção: `cd backend && npx prisma db seed`.

### Frontend (Vercel)

1. Importe o repo em [Vercel](https://vercel.com).
2. **Root Directory**: `frontend`.
3. **Environment Variables**:
   - `VITE_API_URL` — URL pública da API no Render, **sem barra no final** (ex.: `https://futpro-api.onrender.com`).
4. Deploy. O [`frontend/vercel.json`](frontend/vercel.json) redireciona rotas do React Router para `index.html`.

Depois do primeiro deploy do front, confira se `CORS_ORIGIN` no Render inclui exatamente a URL do site Vercel que o navegador usa (incluindo `https`).

### Render: `MODULE_NOT_FOUND` em `dist/main`

- Confira nos **logs de build** se `npm run build` terminou com sucesso e se a pasta `dist/` foi gerada.
- **Settings → Root Directory** = `backend` (mesmo nível que `frontend` no repositório deste MVP).
- Se você definiu `NODE_ENV=production` nas variáveis de ambiente, use o `npm install --include=dev` do passo 3 ou remova `NODE_ENV` do painel até o build estabilizar.
- O caminho `/opt/render/project/src/backend/...` é o layout interno do Render (equivale à pasta `backend` do repo). O erro real costuma ser **`node dist/main` quando o Nest emitiu `dist/src/main.js`** — o `tsconfig.build.json` deste projeto foi ajustado para gerar **`dist/main.js`**. Não commite a pasta `backend/dist` no Git (ela está no `.gitignore`); se já subiu, remova do repositório (`git rm -r --cached backend/dist`) para o build de CI ser a fonte da verdade.

## Documentação do produto

Toda a especificação está em **`/Docs`**, começando por [Docs/00-product-overview.md](Docs/00-product-overview.md) e [Docs/12-implementation-plan.md](Docs/12-implementation-plan.md). Para **marca, design system e plano de UX por tela**, ver [Docs/13-design-system-brand-guide.md](Docs/13-design-system-brand-guide.md) e [Docs/14-ux-screen-improvement-plan.md](Docs/14-ux-screen-improvement-plan.md).

## Estado da implementação (resumo)

- **Backend**: auth JWT, CRUD (atletas, exercícios, protocolos, sessões, prescrições), execução do atleta, dashboard, aderência e alertas, seed com protocolo “Pré-Temporada Futebol — Exemplo”.
- **Frontend personal**: dashboard, atletas (lista, novo, perfil), protocolos (lista, novo, editor), exercícios, nova prescrição; estados de carregamento, vazio e erro com nova tentativa onde aplicável; layout responsivo.
- **Frontend atleta**: login, home com progresso, execução guiada com timer e descanso, feedback, histórico; layout mobile-first (`app-shell--athlete`).

## Licença

Uso interno / MVP — ajustar conforme necessário.
