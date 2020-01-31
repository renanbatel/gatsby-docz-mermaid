#!/bin/bash

cd $(dirname $0)/..

BUILD_DIR="lambda/build"
FUNCS_DIR="lambda/functions"

if [ ! -d "$BUILD_DIR" ]; then
  mkdir -p $BUILD_DIR
fi

BUILD_FILE="$BUILD_DIR/auth.zip"

if [ -f $BUILD_FILE ]; then
  rm $BUILD_FILE
fi

zip -j $BUILD_FILE "$FUNCS_DIR/auth.js"

echo "Function compressed to $BUILD_FILE."
