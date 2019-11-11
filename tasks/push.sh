#!/usr/bin/env bash

if [ -z "$1" ]
  then
    echo "Please provide a commit message"
    exit 1
fi

set -e

echo "== Reset ./dist folder =="
rm -rf ./dist
mkdir -p ./dist
cd ./dist
git init
git remote add origin git@github.com:adrien-gueret/yath-editor.git
git pull origin gh-pages

echo "== Create and push branch with compiled file =="
git checkout -b gh-pages
git rm -r *
cd ../
yarn build:prod
cd ./dist
git add .
set +e
git commit -m "$1"
set -e
git push origin gh-pages
cd ../

echo "= Operation success ="
exit 0