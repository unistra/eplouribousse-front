FROM node:lts-alpine AS build-stage
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

COPY package*.json pnpm-*.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build

# production stage
FROM nginxinc/nginx-unprivileged:latest AS production-stage
USER nginx
COPY nginx/paas.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 8080

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
