# ---------- Base Builder Layer ----------
FROM docker.arvancloud.ir/node:20-alpine as base

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml* package.json ./

RUN pnpm install --frozen-lockfile

COPY . .
    
# ---------- Build Layer ----------
FROM base as builder
RUN pnpm build

# ---------- Production Layer ----------
FROM docker.arvancloud.ir/node:20-alpine as production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=80
RUN npm install -g pnpm
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
EXPOSE 80

CMD ["pnpm", "start"]
    

# ---------- Development Layer ----------
FROM base as develop

EXPOSE 3000

CMD ["pnpm", "dev"]
