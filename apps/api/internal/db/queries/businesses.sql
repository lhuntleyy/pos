-- Semua query di file ini dijalankan lewat postgres.InTenant (RLS aktif).

-- name: CreateBusiness :one
INSERT INTO businesses (id, name, business_type)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetBusiness :one
SELECT * FROM businesses
WHERE id = $1;

-- name: CreateOutlet :one
INSERT INTO outlets (id, business_id, name, address, timezone, tax_region_code)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: ListOutlets :many
SELECT * FROM outlets
ORDER BY created_at;
