# Copilot instructions for maxo-simple-cms

- Big picture
  - Monorepo with two workspaces: `ui/` (Vue 3 + Vite) and `api/` (Express + TypeScript + TypeORM). Root `package.json` defines convenience scripts (see "Key commands").
  - The API serves static files from `api/public` and also exposes JSON endpoints. The API boot file is `api/src/app.ts` (listens on port 8525 in code).
  - Database schema/entities live under `api/db/entity/*.ts`. Init SQL and containerized DB are under `init/` and `docker-compose.yml`.
  - Shared type definitions and small helpers are under `shared/` and `ui/src/inc`.

- Key commands / developer workflows
  - UI (dev): cd into `ui` and run `npm run ui` (uses Vite). Root shortcut: `npm run ui` from repo root runs the same.
  - UI (build): `cd ui && npm run build` or root `npm run ui:build` (installs deps then builds).
  - API (dev): `cd api && npm run api` — starts `ts-node-dev` with `tsconfig-paths/register` to resolve path aliases (e.g. `@inc`, `@src`).
  - API (release / prod build): `cd api && npm run release` (pulls, installs, runs `tsc` and `tsc-alias`). Root `npm run api:release` proxies to that.
  - TypeORM migrations: root `npm run api:migrations` -> invokes TypeORM CLI with the project ts-node config and `scripts/typeorm-datasource-game` as datasource.
  - Docker: `docker-compose up` (root) will start a node container and a MariaDB 11 container. Environment vars used inside container: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

- Project-specific conventions and patterns
  - Path aliases: code imports like `@inc/db` and `@src/inc/cors` — these are resolved via `tsconfig.json` + `tsconfig-paths/register` used by `ts-node-dev`. Keep alias edits in sync with `tsconfig.json` files in `api/` and `ui/`.
  - API middleware: authentication and multisite logic are applied globally in `api/src/app.ts` via `./middleware/auth` and `./middleware/multisite`. Add new cross-cutting concerns as middleware in that folder and register in `app.ts`.
  - Static files: API serves static content from `publicPath` (see `api/src/helpers/general.ts` and `api/public`). When adding assets meant for production static serving, place them under `api/public`.
  - Entities and DB: entities are plain TypeORM entities under `api/db/entity`. Use existing entity patterns (e.g. moUsersAuth.ts) when adding entities.
  - Frontend structure: Vue pages live under `ui/src/pages`, reusable components under `ui/src/components`, and global styles in `ui/styles`. Use `router` and `vuex` for navigation/state (see `ui/src/router.ts` and `ui/src/store`).

- Integration points and external dependencies
  - Database: MariaDB is the supported DB (docker-compose uses mariadb:11). Migration & bootstrap SQL files are in `init/`.
  - TypeORM: migrations and datasource are wired via scripts in `package.json` and `scripts/` helper files. Check `api/ormconfig.json` and `api/tsconfig.json` when debugging migrations.
  - Authentication: implemented in `api/src/middleware/auth.ts` and modules under `api/src/modules`. Frontend login flow emits an event `login-success` (example in `ui/src/app.vue` using `<router-view @login-success="handleLoginSuccess" />`).

- Files and examples to reference when coding
  - Entry points: `api/src/app.ts`, `ui/src/main.ts` (vite + vue bootstrap)
  - Middleware: `api/src/middleware/auth.ts`, `api/src/middleware/multisite.ts`
  - Routes/modules: `api/src/routes/*` and `api/src/modules/*` (follow existing route registration pattern in `app.ts`).
  - DB entities: `api/db/entity/*.ts` (follow naming/structure of `mo*.ts` files).
  - UI: `ui/src/pages/*`, `ui/src/components/*`, `ui/src/inc/api.ts` (frontend API wrapper)
  - Config and environment: `config.json`, `docker-compose.yml`, `init/entrypoint.sh` and `init/init.sql`.

- Small actionable tips
  - When running the API locally, use `npm run api` inside `api/` so `ts-node-dev` picks up path aliases. If running compiled JS, `npm run start:prod` (inside `api`) expects compiled files under `public/api`.
  - Linting/type checks: `npm run ui:lint` will run eslint and `vue-tsc` for the UI.
  - Releases run `tsc` + `tsc-alias` — remember to keep path aliases compatible with `tsc-alias` rules.
  - Commit messages follow `git-commit-hook` rules (types: feat, fix, chore, merge). Keep lines <= 120.

Please review and tell me if you want more details on any of these areas (for example: adding a new API route end-to-end, running migrations locally, or how frontend auth flow should dispatch to the store).