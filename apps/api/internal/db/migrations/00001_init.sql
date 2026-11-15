-- Skema awal: usaha, outlet, pengguna, keanggotaan, perangkat, dan ledger event sinkron.
-- ID dibuat aplikasi (UUIDv7). Uang selalu BIGINT Rupiah.

-- +goose Up
-- +goose StatementBegin

-- Fungsi bantu: business_id dari transaksi saat ini (dipasang oleh postgres.InTenant).
-- NULLIF karena setelah transaksi selesai nilainya jadi '' di koneksi yang dipakai ulang pool.
CREATE FUNCTION current_business_id() RETURNS uuid
    LANGUAGE sql STABLE
AS $$
    SELECT NULLIF(current_setting('app.business_id', true), '')::uuid
$$;

CREATE TABLE businesses (
    id            uuid PRIMARY KEY,
    name          text        NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
    business_type text        NOT NULL CHECK (business_type IN ('fnb', 'retail', 'jasa')),
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE outlets (
    id              uuid PRIMARY KEY,
    business_id     uuid        NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
    name            text        NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
    address         text,
    timezone        text        NOT NULL DEFAULT 'Asia/Jakarta'
                    CHECK (timezone IN ('Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura')),
    tax_region_code text,       -- kode kota/kabupaten untuk tarif PBJT
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX outlets_business_id_idx ON outlets (business_id);

-- Pengguna bersifat global: satu nomor HP bisa jadi pemilik di beberapa usaha.
CREATE TABLE users (
    id         uuid PRIMARY KEY,
    phone      text        NOT NULL UNIQUE CHECK (phone ~ '^62[0-9]{8,13}$'),
    name       text,
    email      text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE memberships (
    business_id uuid        NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
    user_id     uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role        text        NOT NULL CHECK (role IN ('pemilik', 'manajer', 'kasir', 'pelayan', 'dapur')),
    created_at  timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (business_id, user_id)
);
CREATE INDEX memberships_user_id_idx ON memberships (user_id);

CREATE TABLE devices (
    id             uuid PRIMARY KEY,
    business_id    uuid        NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
    outlet_id      uuid        NOT NULL REFERENCES outlets (id) ON DELETE CASCADE,
    name           text        NOT NULL,
    platform       text        NOT NULL CHECK (platform IN ('android', 'ios', 'windows')),
    receipt_prefix text        NOT NULL CHECK (receipt_prefix ~ '^[A-Z][0-9]{1,2}$'),
    token_hash     bytea,
    paired_at      timestamptz NOT NULL DEFAULT now(),
    last_seen_at   timestamptz,
    revoked_at     timestamptz,
    UNIQUE (outlet_id, receipt_prefix)
);
CREATE INDEX devices_business_id_idx ON devices (business_id);

-- Ledger event dari outbox perangkat. event_id sebagai primary key membuat push idempoten:
-- event yang dikirim ulang ditolak oleh constraint, bukan dicatat dua kali (ADR-0004).
CREATE TABLE sync_events (
    event_id    uuid PRIMARY KEY,
    business_id uuid        NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
    device_id   uuid        NOT NULL REFERENCES devices (id),
    type        text        NOT NULL,
    occurred_at timestamptz NOT NULL,
    received_at timestamptz NOT NULL DEFAULT now(),
    payload     jsonb       NOT NULL
);
CREATE INDEX sync_events_business_received_idx ON sync_events (business_id, received_at);
CREATE INDEX sync_events_device_idx ON sync_events (device_id, occurred_at);

-- Row Level Security: setiap tabel milik toko hanya terlihat oleh transaksi dengan app.business_id yang sama.
ALTER TABLE businesses  ENABLE ROW LEVEL SECURITY;
ALTER TABLE outlets     ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices     ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON businesses
    USING (id = current_business_id()) WITH CHECK (id = current_business_id());
CREATE POLICY tenant_isolation ON outlets
    USING (business_id = current_business_id()) WITH CHECK (business_id = current_business_id());
CREATE POLICY tenant_isolation ON memberships
    USING (business_id = current_business_id()) WITH CHECK (business_id = current_business_id());
CREATE POLICY tenant_isolation ON devices
    USING (business_id = current_business_id()) WITH CHECK (business_id = current_business_id());
CREATE POLICY tenant_isolation ON sync_events
    USING (business_id = current_business_id()) WITH CHECK (business_id = current_business_id());

-- Role aplikasi (tanpa BYPASSRLS) dibuat oleh infra (lihat infra/dev/postgres/init.sql).
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'pos_app') THEN
        GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO pos_app;
        GRANT EXECUTE ON FUNCTION current_business_id() TO pos_app;
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO pos_app;
    END IF;
END
$$;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS sync_events;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS memberships;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS outlets;
DROP TABLE IF EXISTS businesses;
DROP FUNCTION IF EXISTS current_business_id();
-- +goose StatementEnd
