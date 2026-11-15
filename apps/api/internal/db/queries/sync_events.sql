-- name: InsertSyncEvent :execrows
-- Mengembalikan 0 kalau event_id sudah pernah diterima (duplikat), 1 kalau baru.
INSERT INTO sync_events (event_id, business_id, device_id, type, occurred_at, payload)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (event_id) DO NOTHING;
