# syntax=docker/dockerfile:1.6
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
# Lockfile is intentionally NOT copied: even with `npm install`, the presence
# of a lockfile generated on a different platform makes npm skip platform
# optional deps (rollup native, tailwindcss/oxide native), causing build to
# fail with "Cannot find module @rollup/rollup-linux-x64-musl".
# See https://github.com/npm/cli/issues/4828
RUN npm install --no-audit --no-fund

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs luxe
COPY --from=builder --chown=luxe:nodejs /app/dist ./dist
COPY --from=builder --chown=luxe:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=luxe:nodejs /app/package.json ./package.json
COPY --from=builder --chown=luxe:nodejs /app/server-node.mjs ./server-node.mjs
USER luxe
EXPOSE 3000
CMD ["node", "server-node.mjs"]
