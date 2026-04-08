# AcademIA — Deploy en server de producción

Guía operativa para levantar el stack en un servidor Linux. Pensada para ser leída por **Claude Code corriendo en el server** (o por un humano).

> **Identidad del proyecto:** AcademIA. El repo todavía contiene referencias legacy a "mentingo" — ignorar.

---

## 0. Stack y arquitectura

```
Internet ──> Caddy/Nginx (443) ──> Web (Vite SSR :5173)  ──┐
                                ──> API (NestJS :3000)    ──┤
                                                            ├──> Postgres (pgvector) :5432
                                                            ├──> Redis :6379
                                                            ├──> MinIO :9100/:9101
                                                            └──> Mailhog :1025/:8025 (solo dev)
```

- `apps/web` → Remix en **SPA mode** (`vite.config.ts` con `ssr: false`). En prod corre con `node ./server.js` que sirve los assets buildeados.
- `apps/api` → NestJS. En prod corre con `node dist/src/main`.
- `docker-compose.yml` levanta toda la infra (Postgres, Redis, MinIO, Mailhog).

---

## 1. Prerequisitos del server

```bash
# Node 20.x + pnpm
node -v          # >= 20.15
corepack enable
corepack prepare pnpm@10.22.0 --activate
pnpm -v          # 10.22.x

# Docker + Compose plugin
docker --version
docker compose version

# Reverse proxy (elegir uno)
caddy version    # opción A (recomendada, TLS automático)
nginx -v         # opción B
```

Si falta algo, instalar antes de seguir. En Ubuntu 22/24:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs docker.io docker-compose-plugin caddy git
sudo usermod -aG docker $USER   # relogin después
```

---

## 2. Clonar el repo

```bash
cd /opt
sudo git clone https://github.com/kheprai/AcademIA.git academia
sudo chown -R $USER:$USER academia
cd academia
```

> El repo fue renombrado de `kheprai/mentingo` → `kheprai/AcademIA`. Si Claude Code en el server tiene un clone viejo, actualizar el remote:
>
> ```bash
> git remote set-url origin https://github.com/kheprai/AcademIA.git
> ```

---

## 3. Configurar variables de entorno

Hay dos archivos `.env` que **no** están en git y hay que crear a mano:

### `apps/api/.env`

```bash
cp apps/api/.env.example apps/api/.env
```

Mínimo a editar para producción (lo demás puede quedar vacío si no se usa el feature):

| Variable                                  | Valor prod                                                                                         |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `CORS_ORIGIN`                             | `https://academia.tu-dominio.com`                                                                  |
| `DATABASE_URL`                            | `postgres://postgres:guidebook@localhost:5432/guidebook` (o el host real si Postgres no es Docker) |
| `REDIS_URL`                               | `redis://localhost:6379`                                                                           |
| `JWT_SECRET`                              | `openssl rand -base64 64`                                                                          |
| `JWT_REFRESH_SECRET`                      | `openssl rand -base64 64`                                                                          |
| `MASTER_KEY`                              | `openssl rand -base64 32` (32 bytes — **obligatorio**, la API no arranca sin esto)                 |
| `EMAIL_ADAPTER`                           | `smtp` (en prod) — y completar `SMTP_HOST/PORT/USER/PASSWORD/SMTP_EMAIL_FROM`                      |
| `S3_*`                                    | apuntar a MinIO local (`http://localhost:9100`) o a S3/Bunny según lo que se use                   |
| `KAPSO_API_KEY` + `KAPSO_PHONE_NUMBER_ID` | de la cuenta Kapso (auth por WhatsApp)                                                             |
| `PHONE_DEBUG`                             | **`false`** en prod (en dev `true` retorna OTP en la response)                                     |
| `STRIPE_*`                                | claves productivas de Stripe                                                                       |
| `MERCADOPAGO_*`                           | claves productivas de MercadoPago                                                                  |
| `OPENAI_API_KEY`                          | si se usa el AI mentor                                                                             |
| `ANALYTICS_SECRET`                        | `openssl rand -base64 32`                                                                          |

### `apps/web/.env`

```bash
cp apps/web/.env.example apps/web/.env
```

```env
VITE_API_URL='https://api.academia.tu-dominio.com'
API_INTERNAL_URL='http://localhost:3000'
VITE_APP_URL='https://academia.tu-dominio.com'
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

Activar OAuth providers solo si se usan (`VITE_GOOGLE_OAUTH_ENABLED=true`, etc — y poner los `*_CLIENT_ID/SECRET` correspondientes en ambos `.env`).

---

## 4. Levantar la infra (Docker)

```bash
docker compose up -d
docker compose ps         # todos en "healthy"
```

Esto crea: `project-db` (Postgres pgvector), `redis`, `minio` (+ `minio-setup` que crea el bucket), `mailhog`.

Volúmenes persistidos: `lms-db-data`, `lms-redis-data`, `minio-data`. **Nunca usar `--volumes` al hacer down** salvo que se quiera borrar todo.

> **Para producción real:** sería ideal mover Postgres a un servicio managed (RDS, Supabase, Neon) y MinIO a S3/Bunny. Mientras tanto, los containers son válidos pero hay que asegurar backups del volumen `lms-db-data`.

---

## 5. Instalar dependencias y build

```bash
pnpm install --frozen-lockfile
```

> Importante: el `package.json` raíz tiene un override de React 19 (`pnpm.overrides`). El install respeta esto automáticamente.

Build de ambos apps:

```bash
pnpm run --filter=api build         # → apps/api/dist
pnpm run --filter=web build         # → apps/web/build
```

---

## 6. Migraciones y seed

```bash
# Migraciones (siempre antes del primer start y después de cada git pull)
pnpm run --filter=api db:migrate

# Seed productivo (crea el admin inicial — solo la primera vez)
pnpm run --filter=api db:seed-prod
```

El admin por defecto está documentado en `CLAUDE.md`:

- Email: `admin@example.com`
- Phone: `+5491123500639`

**Cambiar el password/teléfono apenas se loguee.**

---

## 7. Arrancar los procesos (API + Web)

### Opción A — `pm2` (recomendada para empezar)

```bash
sudo npm i -g pm2

# API
cd apps/api
pm2 start "pnpm run start:prod" --name academia-api --cwd $PWD

# Web (Remix server)
cd ../web
pm2 start "pnpm run start" --name academia-web --cwd $PWD

pm2 save
pm2 startup    # ejecutar el comando que imprime para autostart en boot
```

Logs:

```bash
pm2 logs academia-api
pm2 logs academia-web
```

### Opción B — `systemd`

Crear `/etc/systemd/system/academia-api.service`:

```ini
[Unit]
Description=AcademIA API
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/academia/apps/api
EnvironmentFile=/opt/academia/apps/api/.env
ExecStart=/usr/bin/node dist/src/main
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Y `/etc/systemd/system/academia-web.service`:

```ini
[Unit]
Description=AcademIA Web
After=network.target academia-api.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/academia/apps/web
EnvironmentFile=/opt/academia/apps/web/.env
Environment=NODE_ENV=production
ExecStart=/usr/bin/node ./server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now academia-api academia-web
sudo systemctl status academia-api academia-web
```

---

## 8. Reverse proxy (Caddy — recomendado)

`/etc/caddy/Caddyfile`:

```
academia.tu-dominio.com {
    encode zstd gzip
    reverse_proxy localhost:5173
}

api.academia.tu-dominio.com {
    encode zstd gzip
    reverse_proxy localhost:3000
}

storage.academia.tu-dominio.com {
    encode zstd gzip
    reverse_proxy localhost:9100
}
```

```bash
sudo systemctl reload caddy
```

Caddy obtiene certificados Let's Encrypt automáticamente. Confirmar que los DNS A apunten al server **antes** del reload.

> Si se usa Nginx en vez de Caddy, replicar el mismo routing y manejar TLS con `certbot`.

---

## 9. Verificar que todo está vivo

```bash
# Containers
docker compose ps

# Procesos
pm2 status                    # opción A
sudo systemctl status academia-api academia-web   # opción B

# Puertos
ss -tlnp | grep -E ':(3000|5173|5432|6379|9100)'

# Endpoints
curl -fsS https://api.academia.tu-dominio.com/api/health   # (si existe el endpoint)
curl -fsS -o /dev/null -w "%{http_code}\n" https://academia.tu-dominio.com/
```

---

## 10. Ciclo de actualización (cada vez que se pushea a `main`)

```bash
cd /opt/academia
git pull origin main
pnpm install --frozen-lockfile
pnpm run --filter=api db:migrate
pnpm run --filter=api build
pnpm run --filter=web build

# pm2
pm2 restart academia-api academia-web

# o systemd
sudo systemctl restart academia-api academia-web
```

Verificar logs después de cada deploy:

```bash
pm2 logs --lines 100
# o
journalctl -u academia-api -u academia-web -f
```

---

## 11. Backups (mínimo viable)

```bash
# Postgres dump diario
docker exec mentingo-project-db-1 pg_dump -U postgres guidebook | gzip > /var/backups/academia-db-$(date +%F).sql.gz

# MinIO (si se mantiene local) — sincronizar el volumen a S3 externo
```

Agendar con `cron` o `systemd timer`.

---

## 12. Troubleshooting rápido

| Síntoma                                       | Causa probable                                   | Fix                                                                      |
| --------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ |
| API no arranca, error sobre `MASTER_KEY`      | Falta o no es 32 bytes base64                    | `openssl rand -base64 32` y poner en `apps/api/.env`                     |
| Web devuelve 502 desde Caddy                  | Proceso `academia-web` caído                     | `pm2 restart academia-web` y revisar logs                                |
| `pnpm install` muy lento o con peer warnings  | Cache corrupto                                   | `pnpm store prune && rm -rf node_modules && pnpm install`                |
| Migración falla con `relation already exists` | Drizzle vs estado real desincronizado            | NO forzar — investigar `apps/api/src/storage/migrations/` antes de tocar |
| Login no recibe OTP por WhatsApp              | Kapso template no aprobado o `KAPSO_API_KEY` mal | Ver dashboard Kapso, revisar logs API                                    |
| `PHONE_DEBUG` está en prod                    | Misconfig                                        | Setear `PHONE_DEBUG=false` y reiniciar API                               |

---

## 13. Notas para Claude Code en el server

- **Nunca** correr `docker compose down --volumes` (borra la DB).
- **Nunca** correr `db:seed` en prod (es el seed de desarrollo y borra/recrea data). Solo `db:seed-prod`, y solo la primera vez.
- Antes de cualquier `git push` desde el server: este server es de **deploy**, no de desarrollo. Si hubo cambios locales, investigar de dónde vienen antes de tocar.
- Para reiniciar servicios después de un cambio de `.env`: hay que reiniciar el proceso (pm2/systemd), no alcanza con recargar.
- Si Caddy falla por TLS, verificar que los registros DNS A estén apuntando al server **y** que los puertos 80/443 estén abiertos en el firewall (`ufw allow 80,443/tcp`).
