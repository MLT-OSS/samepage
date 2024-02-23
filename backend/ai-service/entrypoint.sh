#!/bin/bash

set -e

mkdir -p ./log
mkdir -p ./data

if [[ "${MODE}" == "worker" ]]; then
  celery -A app.celery worker -c ${CELERY_WORKER_AMOUNT:-20} --loglevel INFO
else
  if [[ "${DEBUG}" == "true" ]]; then
    flask run --host=${SERVER_BIND_ADDRESS:-0.0.0.0} --port=${SERVER_PORT:-8082} --debug
  else
    gunicorn \
      --bind "${SERVER_BIND_ADDRESS:-0.0.0.0}:${SERVER_PORT:-8082}" \
      --workers ${SERVER_WORKER_AMOUNT:-8} \
      --worker-class ${SERVER_WORKER_CLASS:-gevent} \
      app:app
  fi
fi

