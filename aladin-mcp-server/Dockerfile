FROM node:22-slim AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY src/ src/
COPY tsup.config.ts ./
RUN pnpm build


FROM node:22-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY .env .env

CMD ["node", "dist/index.js"]
