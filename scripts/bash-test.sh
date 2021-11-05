#! /bin/bash

set -e

MONGO_URI=$(gcloud secrets versions access latest --secret=MONGO_URI --project=mussia8)

echo $MONGO_URI

export MYSQL_PASSWORD=gcp:///MONGO_URI
gcp-get-secret bash -c 'echo $MYSQL_PASSWORD'

#echo Branch name: ${GITHUB_REF##*/}
#echo HEAD_REF: $HEAD_REF
#echo sha: ${GITHUB_SHA::8}
#echo BRA: ${BRA}
#echo BRA: $BRA
#
#
#if [[ $BRA == *"/"* ]]; then
#    HEAD_REF=${GITHUB_SHA::8}
#    echo "It's there!"
#    echo $HEAD_REF
#  fi
