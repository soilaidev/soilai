#!/bin/bash

message="$1"

if [ -z "$message" ]; then
    echo "No message provided. Exiting..."
    exit 1
fi

yarn build

cp ./dist/bundle.js ~/versoil/public/soilai.js

git add .

git commit -m "$message"

yarn patch

npm publish