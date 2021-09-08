#! /bin/bash

set -e
#   --allow-unauthenticated \
# aading beta fails3
if [ -n "$1" ]; then
  echo "You supplied the first parameter!"
else
  echo "First parameter not supplied."
fi
if [ -z ${name+x} ]; then echo "name is unset"; exit 1; else echo "var is set to '$name'"; fi
if [ -z ${entry+x} ]; then echo "entry is unset"; exit 1; else echo "var is set to '$entry'"; fi

gcloud functions deploy $name \
  --runtime nodejs$npm_package_engines_node \
  --trigger-http \
  --region europe-west1 \
  --allow-unauthenticated \
  --entry-point=$entry \
  --source=dist \
#  --stage-bucket ariss-functions1 \
  --memory=256MB
