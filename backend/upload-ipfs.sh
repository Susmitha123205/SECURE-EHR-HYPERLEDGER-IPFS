#!/bin/bash

FILE="$1"
TOKEN="$2"

if [[ ! -f "$FILE" ]]; then
  echo "❌ File not found: $FILE"
  exit 1
fi

echo "📦 Uploading $FILE to Pinata..."
RESPONSE=$(curl -s -X POST https://api.pinata.cloud/pinning/pinFileToIPFS \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$FILE")

HASH=$(echo "$RESPONSE" | jq -r '.IpfsHash')

if [[ "$HASH" == "null" ]]; then
  echo "❌ Upload failed: $RESPONSE"
else
  echo "✅ Uploaded to IPFS: $HASH"
  echo "🌐 URL: https://gateway.pinata.cloud/ipfs/$HASH"
fi
