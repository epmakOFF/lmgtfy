FROM nginx
USER nonroot
WORKDIR /usr/share/nginx/html
COPY . .