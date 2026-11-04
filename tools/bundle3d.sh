#!/bin/sh
# Builds vendor/pxp3d.bundle.js: the 3D logo (pxp3d.js) with only the parts of three.js it uses.
# Run after editing pxp3d.js. Needs Node; installs esbuild and three r160 into a temp folder.
set -e
cd "$(dirname "$0")/.."
T=$(mktemp -d)
(cd "$T" && npm i --silent esbuild@0.24.0 three@0.160.0 >/dev/null)
sed "s#'/vendor/#'./vendor/#" pxp3d.js > "$T/pxp3d.src.js"
mkdir -p "$T/vendor" && cp vendor/FontLoader.js vendor/TextGeometry.js "$T/vendor/"
"$T/node_modules/.bin/esbuild" "$T/pxp3d.src.js" --bundle --minify --format=esm --banner:js="/* three.js r160 (MIT License, Copyright 2010-2023 Three.js Authors) + Chairlift 3D logo */" --outfile=vendor/pxp3d.bundle.js
rm -rf "$T"
