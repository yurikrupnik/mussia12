#! /bin/bash

set -e

if [ -z ${name+x} ]; then echo "name is unset"; exit 1; else echo "var is set to '$name'"; fi
if [ -z ${src+x} ]; then echo "src is unset"; exit 1; else echo "var is set to '$src'"; fi

gc_image=eu.gcr.io/mussia8/$name

docker build -t $gc_image ./$src --force-rm
echo 'Finished building!'

docker push $gc_image
echo 'Finished pushing!'

echo 'Starting Deploy!!'
if [[ "${GITHUB_REF##*/}" = "testing" ]];
then
  MONGO_URI=$(gcloud secrets versions access latest --secret="MONGO_URI_TESTING")
elif [[ "${GITHUB_REF##*/}" = "production" ]];
then
  MONGO_URI=$(gcloud secrets versions access latest --secret="MONGO_URI_PRODUCTION")
elif [[ "${GITHUB_REF##*/}" = "master" ]];
then
  MONGO_URI=$(gcloud secrets versions access latest --secret="MONGO_URI")
else
  MONGO_URI=$(gcloud secrets versions access latest --secret="MONGO_URI")
fi

# master is like dev env
if [[ "${GITHUB_REF##*/}" = "master" ]];
then
  gcloud run deploy $name \
    --image $gc_image \
    --platform managed \
    --allow-unauthenticated \
    --region europe-west1 \
    --port 3333 \
    --remove-env-vars=HEAD_REF \
    --set-secrets=MONGO_URI=$MONGO_URI

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
    --set-env-vars=HEAD_REF=$HEAD_REF \
    --set-secrets=MONGO_URI=$MONGO_URI
fi

echo 'Finished Deploy!!'
