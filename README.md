<<<<<<< HEAD
# README - Start Here! 👋

## What You Need to Know

Your Spoorthy HRMS project has:
- ✅ **Backend API** (Node.js/Express) - Runs on port 443
- ✅ **Frontend UI** (Angular 10) - Runs on port 4200  
- ✅ **Database** (MongoDB) - Pre-configured with data

---

## Prerequisites (Install Once)

1. **Node.js** → https://nodejs.org/ (includes npm)
2. **MongoDB Community** → https://www.mongodb.com/try/download/community

---

## Quick Start (Choose ONE)

### 🟢 EASIEST: Auto Setup Script
```powershell
# Right-click on PowerShell, select "Run as Administrator"
cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip"

# Then run (copy-paste this):
powershell -ExecutionPolicy Bypass -File setup.ps1
```

Then open 2 new PowerShell windows and run:
```powershell
# Terminal 1:
cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\spoorthyapi" && npm start

# Terminal 2:
cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\spoorthi ui" && npm start
```

### 🔵 STANDARD: Manual Steps

**One-time setup:**
```powershell
cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip"
net start MongoDB
mongorestore --db spoorthy_db .\spoorthy_db
cd .\spoorthyapi && npm install
cd ..\spoorthi\ ui && npm install
```

**Every time you want to run:**
- Terminal 1: `cd c:\SpoorthyHRMS\Spoorthy\ Zip\Spoorthy\ Zip\spoorthyapi && npm start`
- Terminal 2: `cd c:\SpoorthyHRMS\Spoorthy\ Zip\Spoorthy\ Zip\spoorthi\ ui && npm start`
- Browser: Open http://localhost:4200

---

## If Port 443 Doesn't Work

Use port 8100 instead:
```powershell
# Auto setup for port 8100:
powershell -ExecutionPolicy Bypass -File setup.ps1 -UsePort8100
```

Or manually update:
- Backend: `spoorthyapi/.env` → Change `PORT = 443` to `PORT = 8100`
- Frontend: `spoorthi ui/src/environments/environment.ts` → Change `:443` to `:8100`

---

## What Happens When You Run Everything?

1. **Terminal 1 shows:**
   ```
   MongoDB is Connected
   Example app listening on port 443!
   ```

2. **Terminal 2 shows:**
   ```
   ✔ Application bundle generation complete
   Application running on http://localhost:4200
   ```

3. **Browser (http://localhost:4200):**
   - Login page / Dashboard appears
   - No red errors in console (F12 to open)

---

## ☁️ Deploying to Production (VPS)

For deploying to a Linux VPS server, see **[DEPLOYMENT.md](DEPLOYMENT.md)** which covers:
- GitHub repository setup
- VPS server preparation (Node.js, MongoDB, Nginx, PM2)
- Production environment configuration
- SSL setup with Let's Encrypt
- Deployment automation scripts

### Quick VPS Deployment Commands

```bash
# On your VPS
git clone https://github.com/YOUR_USERNAME/spoorthy-hrms.git
cd spoorthy-hrms/spoorthyapi
npm install --production

# Create .env from .env.example and update values
cp .env.example .env

# Setup MongoDB and seed admin
sudo systemctl start mongodb
node seed-admin.js

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

---

## Detailed Guides

📄 [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete detailed setup for local development
📄 [STARTUP.md](STARTUP.md) - Troubleshooting & advanced options
📄 [QUICK_START.md](QUICK_START.md) - Command reference
📄 [DEPLOYMENT.md](DEPLOYMENT.md) - VPS deployment guide

---

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| `node: command not found` | Restart PowerShell after installing Node.js |
| `Port 443 in use` | Use port 8100 instead (see above) |
| `MongoDB connection refused` | Run `net start MongoDB` |
| `npm install fails` | Run `npm cache clean --force` then retry |
| `Frontend shows API errors` | Make sure backend is running |

---

## Files I've Created for You

✅ **setup.ps1** - Automated setup script (PowerShell)
✅ **setup.bat** - Automated setup script (Command Prompt)
✅ **SETUP_GUIDE.md** - Comprehensive setup guide
✅ **STARTUP.md** - Startup instructions & troubleshooting
✅ **QUICK_START.md** - Quick command reference
✅ **Fixed package.json** - Corrected backend entry point

---

## I also fixed a bug in your project:
❌ Backend `package.json` was pointing to non-existent `app.js`
✅ Fixed to point to correct `index.js` entry point

---

## Next Steps

1. Install prerequisites (Node.js & MongoDB) if not done
2. Run the auto setup script OR follow manual steps
3. Start backend & frontend in separate terminals
4. Open http://localhost:4200 in browser
5. Login with your admin credentials from the database

**You're all set! Let me know if you hit any issues. 🚀**

---

*For Windows Systems • April 2026*
=======
# HRMS
>>>>>>> 809b534dc75e8cfa97c7c4d0c649ec8815440f39
