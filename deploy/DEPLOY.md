# MVST production deployment

Two Next.js apps + Postgres in Docker, fronted by host nginx + certbot.

- **mvst.tsumteam.ru** → storefront (`mvst.ru`) on `127.0.0.1:3000`
- **crmmvst.tsumteam.ru** → admin (`mvst-crm`) on `127.0.0.1:3001`
- Postgres on internal docker network only.

DNS for both subdomains must already point at the server (you said it does), and certbot must be installed.

---

## 0. One-time prerequisite (your machine)

The CRM repo is currently local only. Push it to GitHub:

```bash
cd /c/projects/mvst/mvst-crm
gh repo create dnikolay95/mvst-crm --private --source=. --remote=origin --push
# or, if you create the repo in the UI:
# git remote add origin https://github.com/dnikolay95/mvst-crm.git
# git push -u origin master
```

If you use a different repo URL, pass it later via `CRM_REPO=...` to `bootstrap.sh`.

---

## 1. Server: install Docker (skip if already there)

```bash
ssh tsumteam@your-server
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
exit && ssh tsumteam@your-server   # re-login so docker group takes effect
docker --version
docker compose version
```

## 2. Server: clone and bootstrap

```bash
sudo mkdir -p /opt/mvst && sudo chown $USER:$USER /opt/mvst
cd /opt/mvst
git clone https://github.com/dnikolay95/mvst.git mvst.ru
cd mvst.ru/deploy
chmod +x bootstrap.sh
./bootstrap.sh
```

`bootstrap.sh` clones `mvst-crm` next to `mvst.ru`, then copies the three `*.env.example` files to `*.env`. Final layout:

```
/opt/mvst
├── mvst.ru/
│   └── deploy/
│       ├── docker-compose.yml
│       ├── .env         <- postgres password
│       ├── site.env     <- storefront env
│       ├── crm.env      <- crm env
│       └── nginx/
└── mvst-crm/
```

## 3. Server: fill the env files

Edit each file in `/opt/mvst/mvst.ru/deploy/`:

### `.env` (Postgres)
```
POSTGRES_DB=mvst_crm
POSTGRES_USER=crm
POSTGRES_PASSWORD=<openssl rand -base64 24>
```

### `site.env` (storefront)
```
NODE_ENV=production
API_DOMAIN=api.tsum.ru
SSR_API_DOMAIN=https://api.tsum.ru
CRM_URL=http://mvst-crm:3001
CRM_INGEST_KEY=<same secret as in crm.env below>
```

### `crm.env` (admin)
```
NODE_ENV=production
DATABASE_URL=postgresql://crm:<POSTGRES_PASSWORD from .env>@postgres:5432/mvst_crm
SESSION_PASSWORD=<openssl rand -hex 32>
SESSION_COOKIE_NAME=mvst_crm_session
SESSION_COOKIE_SECURE=true
SEED_ADMIN_LOGIN=admin
SEED_ADMIN_PASSWORD=<your initial admin password>
CRM_INGEST_KEY=<same secret as in site.env>
PORT=3001

# FIRST BOOT ONLY — flip to true to seed boutiques+admin, then back to false
RUN_SEED=true
```

Quick way to generate secrets:
```bash
openssl rand -base64 24       # postgres password
openssl rand -hex 32          # SESSION_PASSWORD
openssl rand -hex 24          # CRM_INGEST_KEY
```

## 4. Server: start everything

```bash
cd /opt/mvst/mvst.ru/deploy
docker compose up -d --build
docker compose ps
docker compose logs -f mvst-crm   # watch for "prisma migrate deploy" + "ready on 0.0.0.0:3001"
docker compose logs -f mvst-site  # ready on 0.0.0.0:3000
```

After the CRM has booted once with `RUN_SEED=true` and you see "[entrypoint] seeding database..." complete:
```bash
sed -i 's/RUN_SEED=true/RUN_SEED=false/' crm.env
docker compose up -d mvst-crm
```

Sanity check from the host:
```bash
curl -I http://127.0.0.1:3000        # storefront
curl -I http://127.0.0.1:3001        # crm
```

## 5. Server: nginx + certbot

```bash
cd /opt/mvst/mvst.ru/deploy
sudo cp nginx/mvst.tsumteam.ru.conf      /etc/nginx/sites-available/
sudo cp nginx/crmmvst.tsumteam.ru.conf   /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/mvst.tsumteam.ru.conf     /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/crmmvst.tsumteam.ru.conf  /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo certbot --nginx -d mvst.tsumteam.ru -d crmmvst.tsumteam.ru
# choose: redirect HTTP to HTTPS

sudo nginx -t && sudo systemctl reload nginx
```

Certbot rewrites the two site files in place, adding `listen 443 ssl`, cert paths, and a 301 from :80. Auto-renew is already wired via the certbot systemd timer.

Verify:
```bash
curl -I https://mvst.tsumteam.ru
curl -I https://crmmvst.tsumteam.ru
```

---

## Updates after the initial deploy

**Storefront only:**
```bash
cd /opt/mvst/mvst.ru && git pull
cd deploy && docker compose up -d --build mvst-site
```

**CRM only:**
```bash
cd /opt/mvst/mvst-crm && git pull
cd /opt/mvst/mvst.ru/deploy && docker compose up -d --build mvst-crm
```

**Both:**
```bash
cd /opt/mvst/mvst.ru && git pull
cd /opt/mvst/mvst-crm && git pull
cd /opt/mvst/mvst.ru/deploy && docker compose up -d --build
```

---

## Troubleshooting

| Symptom | Check |
|---|---|
| `502 Bad Gateway` | `docker compose ps` — is the service up? `docker compose logs <name>` |
| CRM container restarts on boot | bad `DATABASE_URL` in `crm.env`, or postgres healthcheck never went healthy. `docker compose logs postgres` |
| `prisma migrate deploy` errors | first boot? db creds wrong? confirm `POSTGRES_PASSWORD` in `.env` matches the password in `DATABASE_URL` |
| Login on CRM fails | did you flip `RUN_SEED=true` on first boot? logs should say `[entrypoint] seeding database...`. To re-seed manually: `docker compose exec mvst-crm npx prisma db seed` |
| Cert renewal fails | `sudo certbot renew --dry-run`. nginx must serve `:80` for the ACME challenge. |

## Postgres backups (recommended)

```bash
# one-shot dump
docker compose exec -T postgres pg_dump -U crm mvst_crm | gzip > /opt/mvst/backup-$(date +%F).sql.gz

# add to crontab as $USER:
# 0 3 * * * docker compose -f /opt/mvst/mvst.ru/deploy/docker-compose.yml exec -T postgres pg_dump -U crm mvst_crm | gzip > /opt/mvst/backup-$(date +\%F).sql.gz
```
