FROM nginx:mainline-alpine-slim
WORKDIR /usr/share/nginx/html
COPY . .
EXPOSE 80
