### STAGE 1: Build ###
FROM node:18.13.0-alpine AS build
USER node
WORKDIR /home/node
COPY --chown=node package*.json ./
RUN npm ci
COPY --chown=node . .
RUN npm run build ngx-charts-on-fhir
ARG project
RUN npm run build ${project}

### STAGE 2: Run on nginx ###
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/
COPY ./docker-entrypoint.sh /etc/nginx/
ARG project
COPY --from=build /home/node/dist/${project} /usr/share/nginx/html
ENTRYPOINT ["/etc/nginx/docker-entrypoint.sh"]
CMD ["nginx"]
