#!/bin/bash
# Clean rebuild script for Next.js

echo "🧹 Cleaning Next.js build cache..."
rm -rf .next

echo "📦 Rebuilding Next.js project..."
npm run build

echo "✅ Build complete! Start the dev server with: npm run dev"
