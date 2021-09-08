#! /bin/bash

set -e
#   --allow-unauthenticated \
# aading beta fails
gcloud functions deploy $npm_package_name \
  --runtime nodejs$npm_package_engines_node \
  --trigger-http \
  --region europe-west1 \
  --allow-unauthenticated \
  --entry-point=$npm_package_name \
  --source=dist
#  --stage-bucket ariss-functions1 \
#  --memory=256MB
