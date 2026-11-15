# syntax=docker/dockerfile:1
# Build dari root repo: docker build -f apps/wa-gateway/Dockerfile -t pos-wa-gateway .
FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY apps/wa-gateway/package.json apps/wa-gateway/
RUN pnpm install --frozen-lockfile --filter @pos/wa-gateway...
COPY apps/wa-gateway apps/wa-gateway
RUN pnpm --filter @pos/wa-gateway build \
 && pnpm deploy --filter @pos/wa-gateway --prod --legacy /out

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /out .
USER node
EXPOSE 8090
CMD ["node", "dist/index.js"]
