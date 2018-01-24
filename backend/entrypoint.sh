#!/bin/sh
set -e

# Clear the server.pid if it exists. Sometimes rails fails to clean it up when
# run under docker, see: https://stackoverflow.com/a/38732187/42559
if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

exec bundle exec "$@"
