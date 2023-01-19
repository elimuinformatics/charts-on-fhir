### STAGE 1: Build ###
FROM node:18.13.0-alpine AS build
USER node
WORKDIR /home/node
COPY --chown=node package.json ./
RUN npm install
COPY --chown=node . .
RUN npm run build ngx-charts-on-fhir
ARG project
RUN npm run build ${project}

### STAGE 2: Run on nginx ###
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/
ARG project
COPY --from=build /home/node/dist/${project} /usr/share/nginx/html
ENTRYPOINT ["nginx", "-g", "daemon off;"]
