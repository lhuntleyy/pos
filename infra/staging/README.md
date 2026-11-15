# Staging (story F-02)

Satu VPS di Indonesia (misalnya 2 vCPU / 4 GB) dengan Docker. Semua layanan ada di `docker-compose.yml`.

## Langkah pertama kali

1. Arahkan 3 domain (API, app, situs) ke IP VPS.
2. Di VPS: pasang Docker, salin folder `infra/staging` ini, lalu `cp .env.example .env` dan isi semua nilainya.
3. Login ke GHCR supaya bisa menarik image: `echo $TOKEN | docker login ghcr.io -u USERNAME --password-stdin`.
4. Nyalakan database dulu, lalu buat role aplikasi tanpa BYPASSRLS:

   ```bash
   docker compose --env-file .env up -d postgres redis
   docker compose exec postgres psql -U postgres -d pos -c \
     "CREATE ROLE pos_app LOGIN PASSWORD '<POS_APP_DB_PASSWORD>' NOSUPERUSER NOBYPASSRLS; GRANT USAGE ON SCHEMA public TO pos_app;"
   ```
5. Jalankan migrasi, lalu semua layanan:

   ```bash
   docker compose --env-file .env run --rm api migrate
   docker compose --env-file .env up -d
   ```
6. Salin hasil build web ke `www/app` dan situs ke `www/site`.

## Yang belum ada (sisa F-02 dan F-07)

- Workflow deploy otomatis dari GitHub Actions (build image → push GHCR → SSH ke VPS → `docker compose pull && up -d`).
- Backup harian Postgres + uji restore (F-07).
- Monitoring: Sentry, Uptime Kuma (F-06).
