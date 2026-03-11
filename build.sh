#!/bin/bash
set -e

DIST_DIR="dist"
ZIP_NAME="fetch-interceptor.zip"

# Clean
rm -rf "$DIST_DIR" "$ZIP_NAME"
mkdir -p "$DIST_DIR"

# Copy files
cp manifest.json "$DIST_DIR/"
cp popup.html "$DIST_DIR/"
cp popup.js "$DIST_DIR/"
cp interceptor.js "$DIST_DIR/"
cp bridge.js "$DIST_DIR/"
cp -r icons "$DIST_DIR/"

# Create zip
cd "$DIST_DIR"
zip -r "../$ZIP_NAME" .
cd ..

echo ""
echo "Build successful!"
echo "Output: $ZIP_NAME"
echo ""
echo "To install:"
echo "  1. Open chrome://extensions/"
echo "  2. Enable Developer Mode"
echo "  3. Click 'Load unpacked' and select the 'dist' folder"
echo "  Or drag '$ZIP_NAME' to the extensions page"
