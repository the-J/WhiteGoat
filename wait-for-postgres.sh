#!/bin/bash

set -e
echo 'asd'
echo $0
echo 'asdasd'
echo $1
cmd=$1

until PGPASSWORD="postgres" psql -h "postgres" -U "postgres" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $1
