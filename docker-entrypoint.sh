#!/bin/sh

if [ -z "$CLIENT_ID" ]; then
  echo "CLIENT_ID is not set"
  exit 1
fi

# envsubst is used to replace environment variables in env.js when the container is started
envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js

exec "$@"
