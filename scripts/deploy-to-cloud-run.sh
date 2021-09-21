#! /bin/bash

set -e

if [ -z ${name+x} ]; then echo "name is unset"; exit 1; else echo "var is set to '$name'"; fi
if [ -z ${src+x} ]; then echo "src is unset"; exit 1; else echo "var is set to '$src'"; fi

gc_image=eu.gcr.io/mussia8/$name

docker build -t $gc_image ./$src --force-rm
echo 'Finished building!'

docker push $gc_image
echo 'Finished pushing!'
echo Branch name: ${GITHUB_REF##*/}
echo HEAD_REF: $HEAD_REF
echo sha: ${GITHUB_SHA::8}
if [[ "${GITHUB_REF##*/}" = "master" ]];
then
  gcloud run deploy $name \
    --image $gc_image \
    --platform managed \
    --allow-unauthenticated \
    --region europe-west1 \
    --port 3333

  gcloud run services update-traffic $name --platform=managed --to-latest --region europe-west1
else
  echo 'Pre Starting Deploy!!'
  echo name: $name
  echo gc_image: $gc_image
  echo BRANCH_NAME: $BRANCH_NAME
  echo ${GITHUB_REF##*/}: ${GITHUB_REF##*/}
  echo name: $name
  echo 'Starting Deploy!!'
  if [[ $HEAD_REF == *"/"* ]]; then
    HEAD_REF=${GITHUB_SHA::8}
    echo "It's there!"
  fi
  echo $name
  gcloud run deploy ariss \
    --image $gc_image \
    --platform managed \
    --allow-unauthenticated \
    --region europe-west1 \
    --port 3333 \
    --no-traffic \
    --tag ${GITHUB_SHA::8}
fi


