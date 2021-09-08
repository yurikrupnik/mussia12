#! /bin/bash

set -e

gc_image=eu.gcr.io/mussia8/$name

docker build -t $gc_image . --force-rm
echo 'Finished building!'

docker push $gc_image
echo 'Finished pushing!'

##  --no-traffic \
##  --tag=tag1 \
gcloud run deploy $name \
  --image $gc_image \
  --platform managed \
  --allow-unauthenticated \
  --region europe-west1 \
  --port 3333

#
#gcloud run services update-traffic $npm_package_name --platform=managed --to-latest --region europe-central2
