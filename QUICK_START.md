# Quick Start - Run These Commands in PowerShell

## Terminal 1: Restore Database
```powershell
cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\spoorthy_db"
mongorestore --db spoorthy_db .
```

## Terminal 2: Start Backend API
```powershell
cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\spoorthyapi"
npm install
npm start
# Backend runs on: http://localhost:443/api/
```

## Terminal 3: Start Frontend UI
```powershell
cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\spoorthi ui"
npm install
npm start
# Frontend runs on: http://localhost:4200
```

## Then open browser and visit:
http://localhost:4200

---

## If Port 443 is Blocked:

### Edit Backend .env:
- Change `PORT = 443` to `PORT = 8100`
- Change `DOCUMENT_BASE_PATH = "http://localhost:8100/uploads/"`

### Edit Frontend environment.ts:
- Update all baseUrl entries from :443 to :8100

Then restart both servers.
