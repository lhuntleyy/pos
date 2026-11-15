// Package httpapi berisi handler HTTP. Interface dan tipe dibuat dari OpenAPI (api.gen.go).
package httpapi

//go:generate go tool oapi-codegen -config oapi-codegen.yaml ../../../../packages/api-spec/openapi.yaml
