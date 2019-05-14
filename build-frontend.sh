#!/bin/bash
set -e

HTML_DIR="volume/nginx/html"

if [ -d $HTML_DIR ]; then
  rm $HTML_DIR -r
fi

if [ ! -d $HTML_DIR ]; then
  mkdir -p $HTML_DIR
fi

cd ./frontends/app-a
npm i
npm run build
mkdir "../../$HTML_DIR/app-a"
cp -r build/* "../../$HTML_DIR/app-a"

cd ../app-b
npm i
npm run build
mkdir "../../$HTML_DIR/app-b"
cp -r dist/app-b "../../$HTML_DIR"

cd ../root-app
npm i
npm run build
cp -r dist/root-app "../../$HTML_DIR"
cp -r dist/index.html "../../$HTML_DIR"