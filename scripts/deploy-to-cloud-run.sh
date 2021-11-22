#! /bin/bash

set -e

if [ -z ${name+x} ]; then echo "name is unset"; exit 1; else echo "var is set to '$name'"; fi
if [ -z ${src+x} ]; then echo "src is unset"; exit 1; else echo "var is set to '$src'"; fi

gc_image=europe-west1-docker.pkg.dev/backed-monorepo/docker-registry/$name

docker build -t $gc_image ./$src --force-rm
echo 'Finished building!'

docker push $gc_image
echo 'Finished pushing!'

echo 'Starting Deploy!!'

if [[ "${GITHUB_REF##*/}" = "master" ]];
then
  gcloud beta run deploy $name \
    --image $gc_image \
    --platform managed \
    --allow-unauthenticated \
    --region europe-west1 \
    --port 3333 \
    --remove-env-vars=HEAD_REF \
    --set-secrets=MONGO_URI=MONGO_URI:latest

  gcloud run services update-traffic $name --platform=managed --to-latest --region europe-west1
else
  if [[ $HEAD_REF == *"/"* ]]; then
    HEAD_REF=sha-${GITHUB_SHA::8}
  fi
  echo $name
  echo $HEAD_REF
  gcloud run deploy $name \
    --image $gc_image \
    --platform managed \
    --allow-unauthenticated \
    --region europe-west1 \
    --port 3333 \
    --no-traffic \
    --tag $HEAD_REF \
    --set-env-vars=HEAD_REF=$HEAD_REF
fi

echo 'Finished Deploy!!'


# remove tag
# gcloud run services update-traffic bi-service --platform=managed  --region europe-west1 --remove-tags=sha-5317c35f
# the command returns trafiic object with revision name that went to 0


