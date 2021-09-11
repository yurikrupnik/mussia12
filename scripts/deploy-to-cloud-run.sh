#! /bin/bash

set -e

if [ -z ${name+x} ]; then echo "name is unset"; exit 1; else echo "var is set to '$name'"; fi
if [ -z ${src+x} ]; then echo "src is unset"; exit 1; else echo "var is set to '$src'"; fi

gc_image=eu.gcr.io/mussia8/$name

docker build -t $gc_image ./$src --force-rm
echo 'Finished building!'

docker push $gc_image
echo 'Finished pushing!'
echo $BRANCH_NAME
if [[ "$BRANCH_NAME" = "master" ]];
then
  gcloud run deploy $name \
    --image $gc_image \
    --platform managed \
    --allow-unauthenticated \
    --region europe-west1 \
    --port 3333

  gcloud run services update-traffic $name --platform=managed --to-latest --region europe-west1
else
  gcloud run deploy $name \
    --image $gc_image \
    --platform managed \
    --allow-unauthenticated \
    --region europe-west1 \
    --port 3333
#    --no-traffic \
#    --tag $BRANCH_NAME
fi


