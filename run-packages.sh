#!/bin/bash

while read -r package; do
  scopes+=(--scope="$package")
done < .newordergamerc

lerna run start --stream "${scopes[@]}"