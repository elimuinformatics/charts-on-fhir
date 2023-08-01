FROM node:18.13.0-alpine
RUN apk update && apk add jq
USER node
WORKDIR /home/node
COPY ./libs/ngx-charts-on-fhir/test-npm-package.sh ./libs/ngx-charts-on-fhir/
COPY ./libs/ngx-charts-on-fhir/package.json ./libs/ngx-charts-on-fhir/
COPY --chown=node ./dist/libs/ngx-charts-on-fhir ./dist/libs/ngx-charts-on-fhir
RUN ./libs/ngx-charts-on-fhir/test-npm-package.sh
WORKDIR /home/node/test-app
ENTRYPOINT []
CMD ["cat", "package.json"]
# To run the test app:
# docker run -p 4200:4200 test-npm-package npm start -- --host 0.0.0.0