#!/bin/bash

while read -r package; do
  if [[ $package != \#* ]]; then
    scopes+=(--scope="$package")
  fi
done < .nogrc

lerna run start --stream "${scopes[@]}"