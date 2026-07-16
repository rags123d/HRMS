#!/bin/bash
# SpoorthyHRMS Deployment Script
# Usage: ./deploy.sh

set -e

echo "=========================================="
echo "SpoorthyHRMS Deployment Script"
echo "=========================================="

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
git pull origin main

# Install/update API dependencies
echo "📦 Installing API dependencies..."
cd spoorthyapi
npm install --production

# Restart API with PM2
echo "🔄 Restarting API service..."
pm2 restart spoorthy-api || pm2 start ecosystem.config.js

# Build frontend
echo "🔨 Building frontend..."
cd ../spoorthi-ui 2>/dev/null || cd "../spoorthi ui"
npm install
ng build --prod --output-path=../spoorthyapi/public

echo "✅ Deployment completed successfully!"
echo "=========================================="