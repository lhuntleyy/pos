-- Dijalankan sekali saat volume Postgres dev pertama kali dibuat.
-- Role aplikasi TANPA superuser dan TANPA BYPASSRLS, supaya Row Level Security benar-benar berlaku.
-- Di staging/produksi, buat role yang sama dengan password kuat (lihat infra/staging/README.md).
CREATE ROLE pos_app LOGIN PASSWORD 'pos_app_dev' NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS;
GRANT CONNECT ON DATABASE pos TO pos_app;
GRANT USAGE ON SCHEMA public TO pos_app;
