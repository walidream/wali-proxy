#!/bin/bash
set -e

DIST_DIR="dist"

# Clean
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Copy files
cp manifest.json "$DIST_DIR/"
cp popup.html "$DIST_DIR/"
cp popup.js "$DIST_DIR/"
cp interceptor.js "$DIST_DIR/"
cp bridge.js "$DIST_DIR/"
cp -r icons "$DIST_DIR/"

echo ""
echo "Build successful!"
echo ""
echo "To install:"
echo "  1. Open chrome://extensions/"
echo "  2. Enable Developer Mode"
echo "  3. Click 'Load unpacked' and select the 'dist' folder"
