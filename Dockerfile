#STAGE 1
FROM node:22.11.0-alpine AS builder
WORKDIR /app
RUN apk add git

COPY ./package.json ./

RUN npm install
COPY . .

RUN npm run build

#STAGE 2
FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY --from=builder /app/dist/app /usr/share/nginx/html
