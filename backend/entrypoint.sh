#!/bin/sh
set -e

# Clear the server.pid if it exists. Sometimes rails fails to clean it up when
# run under docker, see: https://stackoverflow.com/a/38732187/42559
if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

# bundle install if it needs to be done. Note that we have set /bundle as the
# bundle cache in the Dockerfile, and added /bundle as a data volume in the 
# docker-compose file
# https://engineering.adwerx.com/rails-on-docker-compose-7e2cf235fa0e
echo "bundle path: $BUNDLE_PATH"
bundle check || bundle install

exec bundle exec "$@"
