### STAGE 1: Build ###
FROM node:18.13.0-alpine AS build
USER node
WORKDIR /home/node
COPY --chown=node package*.json ./
RUN npm ci --ignore-scripts
RUN npm rebuild @parcel/watcher nice-napi nx esbuild @swc/core
COPY --chown=node . .
ARG app
RUN npm run build ${app}

### STAGE 2: Run on nginx ###
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/
COPY ./docker-entrypoint.sh /etc/nginx/
ARG app
COPY --from=build /home/node/dist/apps/${app}/browser /usr/share/nginx/html
ENTRYPOINT ["/etc/nginx/docker-entrypoint.sh"]
CMD ["nginx"]
