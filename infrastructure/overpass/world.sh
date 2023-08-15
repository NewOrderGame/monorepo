#!/bin/sh
docker run \
  -e OVERPASS_META=yes \
  -e OVERPASS_MODE=clone \
  -e OVERPASS_DIFF_URL=https://planet.openstreetmap.org/replication/minute/ \
  -v /big/docker/overpass_clone_db/:/db \
  -p 12346:80 \
  -i -t \
  --name overpass_world \
  wiktorn/overpass-api
