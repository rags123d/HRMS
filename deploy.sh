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
pm2 restart spoorthyapi || pm2 start ecosystem.config.js

# Build frontend
echo "🔨 Building frontend..."
cd ../spoorthy-ui
export NODE_OPTIONS=--openssl-legacy-provider
npm install --legacy-peer-deps
npx ng build --configuration production --output-path=dist/spoorthy

# Deploy built frontend to the live served path
echo "🚚 Deploying frontend to /var/www/spoorthy-hrms..."
cp -r dist/spoorthy/* /var/www/spoorthy-hrms/
chown -R www-data:www-data /var/www/spoorthy-hrms

echo "✅ Deployment completed successfully!"
echo "=========================================="
