#! /bin/bash

set -e
#   --allow-unauthenticated \
# aading beta fails3
#while getopts u:a:f: flag
#do
#  case "${flag}" in
#      u) username=${OPTARG};;
#      a) age=${OPTARG};;
#      f) fullname=${OPTARG};;
#  esac
#done
#echo "Username: $username";
#echo "Age: $age";
#echo "Full Name: $fullname";
#
#echo Script name: $0
#echo $# arguments
#if [ "$#" -ne 1 ]; then
#    echo "Illegal number of parameters"
#fi
#
#if [ -n "$1" ]; then
#  echo "You supplied the first parameter!"
#else
#  echo "Function name parameter not supplied."
#  exit 1
#fi

echo $1
echo $2
#if [ -z ${name+x} ]; then echo "name is unset"; exit 1; else echo "var is set to '$name'"; fi
#if [ -z ${entry+x} ]; then echo "entry is unset"; exit 1; else echo "var is set to '$entry'"; fi
gcloud functions deploy $1 \
  --runtime nodejs16 \
  --trigger-http \
  --region europe-west1 \
  --allow-unauthenticated \
  --entry-point=$1 \
  --source=$2 \
  --memory=256
##  --stage-bucket ariss-functions1 \
