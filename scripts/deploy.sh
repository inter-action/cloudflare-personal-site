#!/bin/bash

set -e

echo "🚀 Building the project..."

npm run build
npm run build:api

echo "📦 Deploying to Cloudflare Pages..."
wrangler pages deploy dist --project-name=cloudflare-personal-site

echo "✅ Deployment complete!"
