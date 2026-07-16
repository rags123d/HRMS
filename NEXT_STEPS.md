# Installation Complete ✅

Your dependencies are now installed! Here's what you need to do next:

## 1️⃣ Install MongoDB (One-time setup)

**Download MongoDB Community Edition:**
- Go to: https://www.mongodb.com/try/download/community
- Select **Windows** → **MSI** 
- Run the installer and follow the setup wizard
- Check ✅ "Install MongoDB as a Service" during installation

**Verify Installation:**
```powershell
mongod --version
```

---

## 2️⃣ Start MongoDB Service

```powershell
net start MongoDB
```

If you get an error, start mongod manually:
```powershell
mongod
```

---

## 3️⃣ Import Database

Open a **NEW PowerShell window** (keep mongod running in another window):

```powershell
cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip"
mongorestore --db spoorthy_db .\spoorthy_db
```

You should see:
```
2026-04-02T08:25:00.000+0000 connected to: mongodb://localhost:27017/
2026-04-02T08:25:00.000+0000 restoring db on my machine
...
2026-04-02T08:25:01.000+0000 done
```

---

## 4️⃣ Now Start Backend API

Open **NEW PowerShell window**:

```powershell
cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\spoorthyapi"
npm start
```

✅ Wait for this output:
```
MongoDB is Connected
Example app listening on port 443!
```

---

## 5️⃣ Start Frontend UI

Open **ANOTHER NEW PowerShell window**:

```powershell
cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\spoorthi ui"
npm start
```

✅ Wait for this output:
```
✔ Compiled successfully. App is running on http://localhost:4200
```

Browser may open automatically. If not, visit: **http://localhost:4200**

---

## 🎯 You should now have 3-4 windows open:

1. **MongoDB** (mongod running)
2. **Backend API** (npm start - port 443)
3. **Frontend** (npm start - port 4200)  
4. **Browser** (http://localhost:4200)

---

## ✅ How to Know Everything is Working

- [ ] MongoDB terminal shows: `waiting for connections on port 27017`
- [ ] Backend terminal shows: `MongoDB is Connected` and `listening on port 443`
- [ ] Frontend terminal shows: `Compiled successfully` and `running on http://localhost:4200`
- [ ] Browser shows the HRMS application/login page
- [ ] No red errors in browser console (F12 to check)

---

## 🆘 Quick Troubleshooting

**Port 443 blocked?** Use port 8100:
- Edit `spoorthyapi/.env`: Change `PORT = 443` to `PORT = 8100`
- Edit `spoorthi ui/src/environments/environment.ts`: Change `:443` to `:8100`
- Restart both servers

**Can't find ng command?** (already fixed)
- Already installed with `npm install --legacy-peer-deps`

**Still getting errors?**
- Check SETUP_GUIDE.md for detailed troubleshooting

---

## After Everything is Running

- Login with admin credentials from the database
- Check STARTUP.md for how to stop/restart services
- Use Ctrl+C to stop any service

Good luck! 🚀
