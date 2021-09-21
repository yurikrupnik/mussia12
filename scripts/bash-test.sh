#! /bin/bash

set -e


echo Branch name: ${GITHUB_REF##*/}
echo HEAD_REF: $HEAD_REF
echo sha: ${GITHUB_SHA::8}



