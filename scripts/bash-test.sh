#! /bin/bash

set -e

ds=$(gcloud secrets versions access latest --secret="MONGO_URI")
echo $ds
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
