# SpoorthyHRMS Deployment Documentation

## Project Overview

SpoorthyHRMS is a Human Resource Management System consisting of:
- **Backend API**: Node.js + Express + MongoDB
- **Frontend UI**: Angular 10 application

## Project Structure

```
Spoorthy Zip/
├── spoorthyapi/           # Node.js Backend API
│   ├── app/
│   │   ├── assets/      # Images and templates
│   │   ├── config/      # App configuration
│   │   ├── constants/   # Enum constants
│   │   ├── controller/  # API controllers
│   │   ├── middleware/  # Express middleware
│   │   ├── model/     # Mongoose models
│   │   ├── route/     # API routes
│   │   ├── service/   # Business logic services
│   │   ├── utils/     # Utility functions
│   │   └── validations/ # Joi validations
│   ├── public/        # Static files (uploads)
│   ├── uploads/       # File uploads storage
│   ├── .env           # Environment variables
│   ├── index.js       # Main entry point
│   ├── seed-admin.js  # Admin user seeder
│   └── package.json   # Node.js dependencies
│
└── spoorthi ui/        # Angular Frontend
    ├── src/           # Source code
    ├── src/assets/    # Static assets
    ├── dist/          # Built application
    ├── environments/  # Environment configs
    └── package.json   # Angular dependencies
```

## Prerequisites for VPS Deployment

### System Requirements
- **OS**: Ubuntu 20.04 LTS or Ubuntu 22.04 LTS (recommended)
- **Node.js**: v16.x (LTS) - The project includes node16 runtime
- **npm**: v8.x or later
- **MongoDB**: v4.4 or v5.x
- **Nginx** (recommended for reverse proxy)
- **PM2** (for process management)
- **Git** (for repository cloning)

### Software to Install on VPS

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 16.x
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt install -y mongodb

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

---

## Step 1: GitHub Repository Setup

### Initialize Git Repository

```bash
# Navigate to project root
cd /path/to/SpoorthyZip

# Initialize git repository
git init

# Create .gitignore file
cat > .gitignore << 'EOF'
# Node.js
node_modules/
spoorthyapi/node_modules/
spoorthi\ ui/node_modules/

# Environment files
.env
*.env
.env.local
.env.*.local

# Build outputs
spoorthi\ ui/dist/

# Upload files (optional - exclude if you don't want uploads in repo)
spoorthyapi/uploads/*
!spoorthyapi/uploads/.gitkeep

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Runtime
*.pid
*.seed

# Archives
*.zip
*.tar.gz
EOF
```

### Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and create a new repository
2. Repository name: `spoorthy-hrms` (or your preferred name)

```bash
# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/spoorthy-hrms.git

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: SpoorthyHRMS application"

# Push to GitHub
git push -u origin main
```

### Repository Structure Recommendation

After setup, your GitHub repository should be organized as:

```
spoorthy-hrms/
├── spoorthyapi/
│   ├── app/
│   ├── public/
│   ├── uploads/.gitkeep
│   ├── .env.example
│   ├── index.js
│   ├── seed-admin.js
│   └── package.json
├── spoorthi-ui/ (rename from "spoorthi ui")
│   ├── src/
│   ├── .env.example (for API endpoints)
│   ├── angular.json
│   └── package.json
├── DEPLOYMENT.md
└── README.md
```

---

## Step 2: VPS Deployment

### 2.1 Clone Repository

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/spoorthy-hrms.git
cd spoorthy-hrms

# Install API dependencies
cd spoorthyapi
npm install --production
```

### 2.2 Configure Environment Variables

Create `.env` file in `spoorthyapi/` directory:

```bash
# Backend Environment (.env)
cat > spoorthyapi/.env << 'EOF'
PORT=8100
SECRET_KEY="your-secure-secret-key-change-this"
TOKEN_EXPIRY=432000000
REFRESH_TOKEN_SECRET_KEY="your-refresh-secret-key-change-this"
REFRESH_TOKEN_EXPIRY=450000000

SMS_API_KEY=A1f198fe5db876ffd62f5e81b89ddd921
SMS_SENDER_ID=DEODKS

DATA_BASE_PATH="mongodb://localhost:27017/spoorthy_db"

DOCUMENT_BASE_PATH="https://your-domain.com/uploads/"
EOF
```

### 2.3 MongoDB Setup

```bash
# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database and user (optional but recommended)
mongo << 'EOF'
use spoorthy_db
db.createUser({
  user: "spoorthy_user",
  pwd: "secure_password_here",
  roles: ["readWrite", "dbAdmin"]
})
EOF

# Update .env with authenticated connection
# DATA_BASE_PATH="mongodb://spoorthy_user:secure_password_here@localhost:27017/spoorthy_db"
```

### 2.4 Seed Initial Data

```bash
# Navigate to API directory
cd spoorthyapi

# Seed admin user
node seed-admin.js
```

Default admin credentials (from seed-admin.js):
- **Username**: `HR`
- **Password**: `Admin@123`

### 2.5 Build Angular Frontend

```bash
# Navigate to UI directory
cd ../spoorthi\ ui

# Install dependencies
npm install

# Build for production (note the space in directory name)
# If the space causes issues, rename the directory first
mv "../spoorthi ui" "../spoorthi-ui" 2>/dev/null || true
cd ../spoorthi-ui

# Install dependencies
npm install

# Build for production
ng build --prod --output-path=../spoorthyapi/public
```

### 2.6 Configure Nginx Reverse Proxy

```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/spoorthy-hrms << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    # Serve static files (Angular build)
    location / {
        root /var/www/spoorthyapi/public;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:8100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Uploads directory
    location /uploads {
        alias /var/www/spoorthyapi/uploads;
        expires 30d;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/spoorthy-hrms /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 2.7 Start API with PM2

```bash
# Navigate to project
cd /var/www/spoorthy-hrms/spoorthyapi

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'spoorthy-api',
    script: './index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 8100
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Enable PM2 startup
pm2 startup
```

### 2.8 Setup SSL with Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

Update Nginx config after SSL setup to use HTTPS.

---

## Step 3: Production Environment Configuration

### Update Frontend Environment

Update `spoorthi-ui/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  baseUrl: 'https://your-domain.com/api/',
  baseUrl2: 'https://your-domain.com/',
  docUrl: 'https://your-domain.com/',
  costDivision: 100000
};
```

Rebuild the frontend after updating:

```bash
cd spoorthi-ui
ng build --prod --output-path=../spoorthyapi/public
```

---

## Step 4: Deployment Scripts

### Create Deployment Script

```bash
# Create deploy.sh
cat > deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Install/update API dependencies
cd spoorthyapi
npm install --production

# Restart API
pm2 restart spoorthy-api

# Build frontend
cd ../spoorthi-ui
npm install
ng build --prod --output-path=../spoorthyapi/public

echo "Deployment completed!"
EOF

chmod +x deploy.sh
```

### Create Backup Script

```bash
# Create backup.sh
cat > backup.sh << 'EOF'
#!/bin/bash
set -e

BACKUP_DIR="/var/backups/spoorthy-hrms"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --db spoorthy_db --out $BACKUP_DIR/mongo_$DATE

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/spoorthyapi/uploads

# Keep backups for 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x backup.sh
```

---

## Step 5: Monitoring & Maintenance

### PM2 Monitoring

```bash
# View running processes
pm2 list

# View logs
pm2 logs spoorthy-api

# Monitor in real-time
pm2 monit

# Restart on file changes (development)
pm2 start ecosystem.config.js --watch
```

### MongoDB Backup Schedule (Cron)

```bash
# Add to crontab
crontab -e

# Add these lines:
0 2 * * * /var/www/spoorthy-hrms/backup.sh >> /var/log/spoorthy-backup.log 2>&1
```

---

## Directory Structure After Deployment

```
/var/www/spoorthy-hrms/
├── spoorthyapi/
│   ├── app/
│   ├── public/          # Angular build output
│   ├── uploads/         # File uploads
│   ├── .env
│   ├── ecosystem.config.js
│   └── index.js
├── spoorthi-ui/
│   └── (source files)
├── backup.sh
└── deploy.sh
```

---

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `cors` middleware is configured properly in `index.js`

2. **MongoDB Connection Failed**: Check if MongoDB is running:
   ```bash
   sudo systemctl status mongodb
   ```

3. **Permission Denied for Uploads**:
   ```bash
   sudo chown -R www-data:www-data /var/www/spoorthyapi/uploads
   sudo chmod -R 755 /var/www/spoorthyapi/uploads
   ```

4. **Angular Build Fails**: Ensure Node.js version is 16.x and run:
   ```bash
   npm install --legacy-peer-deps
   ```

5. **Port Already in Use**:
   ```bash
   # Find process on port 8100
   sudo lsof -i :8100
   # Kill if necessary
   sudo kill -9 <PID>
   ```

---

## Security Checklist

- [ ] Change default admin credentials after first deployment
- [ ] Use strong SECRET_KEY values in `.env`
- [ ] Enable HTTPS with SSL certificate
- [ ] Configure firewall (ufw):
  ```bash
  sudo ufw allow 22
  sudo ufw allow 80
  sudo ufw allow 443
  sudo ufw enable
  ```
- [ ] Set up MongoDB authentication
- [ ] Remove or protect seed-admin.js script after initial setup
- [ ] Configure proper file permissions for uploads directory

---

## Quick Deployment Summary

```bash
# 1. Clone repo
git clone https://github.com/YOUR_USERNAME/spoorthy-hrms.git
cd spoorthy-hrms

# 2. Setup API
cd spoorthyapi
npm install --production
# Create .env file with production values

# 3. Setup MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# 4. Seed admin
node seed-admin.js

# 5. Build frontend
cd ../spoorthi-ui
npm install
ng build --prod --output-path=../spoorthyapi/public

# 6. Start with PM2
cd ../spoorthyapi
pm2 start ecosystem.config.js
pm2 save

# 7. Configure Nginx (see above)
sudo systemctl restart nginx
```

---

## Default Credentials

| Field | Value |
|-------|-------|
| Username | HR |
| Password | Admin@123 |
| Database | spoorthy_db |
| API Port | 8100 |
| MongoDB | mongodb://localhost:27017/spoorthy_db |

**IMPORTANT**: Change these credentials immediately after deployment!

---

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | API server port | 8100 |
| `SECRET_KEY` | JWT secret key | - |
| `TOKEN_EXPIRY` | JWT token expiry (ms) | 432000000 |
| `SMS_API_KEY` | SMS service API key | - |
| `SMS_SENDER_ID` | SMS sender ID | DEODKS |
| `DATA_BASE_PATH` | MongoDB connection string | mongodb://localhost:27017/spoorthy_db |
| `DOCUMENT_BASE_PATH` | Base URL for uploaded documents | http://localhost:8100/uploads/ |

---

For support or questions, refer to the project documentation or contact the development team.