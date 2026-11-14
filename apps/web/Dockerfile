# Build from the repository root (the web app imports ../../packages/api-client):
#   docker build -f apps/web/Dockerfile --build-arg NEXT_PUBLIC_API_URL=https://<api-host> -t alleviare-web .
FROM node:22-alpine AS build
WORKDIR /repo
COPY packages/api-client ./packages/api-client
COPY apps/web ./apps/web
WORKDIR /repo/apps/web
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npx next build

FROM node:22-alpine
ENV NODE_ENV=production PORT=3001 HOSTNAME=0.0.0.0
WORKDIR /app
COPY --from=build /repo/apps/web/.next/standalone ./
COPY --from=build /repo/apps/web/.next/static ./apps/web/.next/static
RUN adduser -D -u 10001 app
USER app
EXPOSE 3001
CMD ["node", "apps/web/server.js"]
