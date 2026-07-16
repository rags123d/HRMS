# Spoorthy HRMS - Startup Instructions

## 🚀 Easiest Way to Start (Automated Setup)

### Option 1: Using PowerShell (Recommended)
```powershell
# For port 443 (default):
& "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\setup.ps1"

# For port 8100:
& "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\setup.ps1" -UsePort8100
```

### Option 2: Using Command Prompt
```cmd
cd c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip
setup.bat
```

---

## 🔧 Manual Startup (3 Easy Steps)

### Step 1: Database & Dependencies (One-time setup)
Open PowerShell as Administrator:
```powershell
cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip"

# Start MongoDB
net start MongoDB

# Import database
mongorestore --db spoorthy_db .\spoorthy_db

# Install backend dependencies
cd .\spoorthyapi
npm install

# Install frontend dependencies
cd ..\spoorthi\ ui
npm install
```

### Step 2: Start Backend Server
Open **NEW PowerShell window**:
```powershell
cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\spoorthyapi"
npm start
```
✅ Wait for: `MongoDB is Connected` and `listening on port 443`

### Step 3: Start Frontend
Open **ANOTHER NEW PowerShell window**:
```powershell
cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\spoorthi ui"
npm start
```
✅ Wait for: `Application bundle generation complete` and URL will open automatically

### Step 4: Access Application
Open browser and go to: **http://localhost:4200**

---

## 🆘 Troubleshooting

### Issue: "Port 443 already in use" or "Permission denied"
**Solution:** Use port 8100 instead:
```powershell
# Run setup with port 8100
& "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\setup.ps1" -UsePort8100

# Or manually edit .env in spoorthyapi folder:
# Change: PORT = 443
# To:     PORT = 8100
```

### Issue: "MongoDB connection refused"
**Solution:** Start MongoDB Service:
```powershell
# Check if running
Get-Service MongoDB

# Start if not running
net start MongoDB
```

### Issue: npm install fails
**Solution:** Clear cache and retry:
```powershell
npm cache clean --force
npm install
```

### Issue: Can't find npm command
**Solution:** Restart PowerShell after installing Node.js

### Issue: Frontend shows "Cannot GET /api/..."
**Solution:** Make sure backend is running. Check:
1. Backend terminal shows "listening on port 443"
2. No errors in backend terminal
3. Open http://localhost:443 in browser to verify backend is up

---

## 📊 Service Status Check

```powershell
# Check MongoDB service
Get-Service MongoDB

# Check what's using port 443
netstat -ano | findstr :443

# Check what's using port 4200
netstat -ano | findstr :4200
```

---

## 📁 Project Configuration Files

- **Backend API**: `spoorthyapi/.env`
- **Frontend Environment**: `spoorthi ui/src/environments/environment.ts`
- **Database Config**: `spoorthyapi/index.js` (line 28-33)

---

## ✅ Success Checklist

After starting all services, you should see:

**Backend Terminal:**
```
MongoDB is Connected
Example app listening on port 443!
```

**Frontend Terminal:**
```
✔ Compiled successfully. App is running on http://localhost:4200
```

**Browser (http://localhost:4200):**
- [ ] Page loads without errors
- [ ] See HRMS dashboard/login page
- [ ] No red error messages in console (F12)
- [ ] Network requests show 200/304 status codes

---

## 🎯 Common Scenarios

### "I want to stop everything"
```
Ctrl + C in each terminal window
```

### "I want to restart backend only"
```
1. Press Ctrl + C in backend terminal
2. Type: npm start
```

### "I want to restart frontend only"
```
1. Press Ctrl + C in frontend terminal
2. Type: npm start
```

### "I want to restart MongoDB"
```powershell
net stop MongoDB
net start MongoDB
```

### "Database looks wrong"
```powershell
# Clear and reimport database
# Stop backend first (Ctrl+C)
mongorestore --drop --db spoorthy_db .\spoorthy_db
```

---

## 📞 Support

If issues persist:
1. Check that all prerequisites are installed
2. Ensure no other applications are using ports 443, 4200, or 27017
3. Restart your computer
4. Try the automated setup script first
5. Check the detailed SETUP_GUIDE.md for more information

Happy coding! 🚀
