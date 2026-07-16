# Spoorthy HRMS - Local Setup Guide

## 📋 Prerequisites

Before starting, ensure you have installed:
- **Node.js** v12+ and npm (download from https://nodejs.org/)
- **MongoDB Community Edition** (download from https://www.mongodb.com/try/download/community)
- **MongoDB Compass** (optional, for database visualization)

## 🏗️ Project Structure

```
Spoorthy HRMS/
├── spoorthi ui/        (Angular 10 Frontend)
├── spoorthyapi/        (Node.js/Express Backend)
└── spoorthy_db/        (MongoDB Database exports)
```

---

## 🚀 Setup Instructions

### Step 1: Install MongoDB

1. **Download and Install MongoDB Community Edition**
   - Visit: https://www.mongodb.com/try/download/community
   - Follow the installation wizard (use default settings)
   - MongoDB will run as a Windows Service by default

2. **Verify MongoDB Installation**
   ```powershell
   mongod --version
   mongo --version
   ```

3. **Start MongoDB Service** (if not running)
   ```powershell
   net start MongoDB
   ```

### Step 2: Import Database

1. **Navigate to the database folder in PowerShell:**
   ```powershell
   cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\spoorthy_db"
   ```

2. **Restore all MongoDB collections** by running this command:
   ```powershell
   mongorestore --db spoorthy_db .
   ```

3. **Verify the database was imported** by connecting to MongoDB:
   ```powershell
   mongo
   ```
   Then in the MongoDB shell:
   ```javascript
   use spoorthy_db
   show collections
   ```

### Step 3: Setup Backend API

1. **Open PowerShell and navigate to the backend folder:**
   ```powershell
   cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\spoorthyapi"
   ```

2. **Install Node dependencies:**
   ```powershell
   npm install
   ```

3. **Verify .env file configuration:**
   - The `.env` file should already exist with:
     ```
     PORT = 443
     DATA_BASE_PATH = "mongodb://localhost:27017/spoorthy_db"
     ```
   - If you need to use a different port instead of 443 (requires admin), modify:
     ```
     PORT = 8100
     ```

4. **Start the backend server:**
   ```powershell
   npm start
   ```
   
   You should see:
   ```
   MongoDB is Connected
   Example app listening on port 443!
   ```

### Step 4: Setup Frontend UI

1. **Open a new PowerShell window and navigate to the frontend folder:**
   ```powershell
   cd "c:\SpoorthyHRMS\Spoorthy Zip\Spoorthy Zip\spoorthi ui"
   ```

2. **Install Angular dependencies:**
   ```powershell
   npm install
   ```

3. **Verify environment configuration:**
   - Check `src/environments/environment.ts` for correct API URL
   - Should be: `baseUrl: 'http://localhost:443/api/'`
   - If using port 8100, update this to `'http://localhost:8100/api/'`

4. **Start the Angular development server:**
   ```powershell
   npm start
   ```
   
   The app will be available at: http://localhost:4200

---

## 🔧 If Using Port 8100 Instead of 443

If you cannot use port 443, follow these steps:

### Backend Configuration:
1. Edit `spoorthyapi/.env`:
   ```
   PORT = 8100
   DOCUMENT_BASE_PATH = "http://localhost:8100/uploads/"
   ```

2. Restart the backend server

### Frontend Configuration:
1. Edit `spoorthi ui/src/environments/environment.ts`:
   ```typescript
   export const environment = {
     baseUrl: 'http://localhost:8100/api/',
     baseUrl2: 'http://localhost:8100/',
     docUrl: 'http://localhost:8100/',
     production: false,
     costDivision: 100000,
   };
   ```

2. Restart the frontend development server

---

## ✅ Verification Checklist

- [ ] MongoDB is installed and running
- [ ] Database imported successfully (8+ collections visible)
- [ ] Backend dependencies installed (`node_modules` folder exists)
- [ ] Backend server running (port 443 or 8100)
- [ ] Frontend dependencies installed
- [ ] Frontend running on http://localhost:4200
- [ ] Can access the application UI in browser

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB service is running
```powershell
# Check status
net start MongoDB

# Or check if monod is running
tasklist | findstr mongod
```

### Port Already in Use
```
Error: listen EACCES: permission denied 0.0.0.0:443
```
**Solution:** Either change to port 8100 in `.env` and `environment.ts`, or run with admin privileges

### CORS Errors in Browser Console
**Solution:** The backend `.env` file has CORS enabled. If still having issues:
1. Clear browser cache and restart
2. Ensure backend is running on the correct port
3. Check environment URLs match exactly

### Dependencies Installation Fails
**Solution:** Clear cache and reinstall
```powershell
# Backend
cd spoorthyapi
rm -r node_modules
rm package-lock.json
npm cache clean --force
npm install

# Frontend
cd ..\spoorthi\ ui
rm -r node_modules
rm package-lock.json
npm cache clean --force
npm install
```

---

## 📝 Default Credentials

Check the MongoDB database after import for admin user credentials. You may need to:
1. Open MongoDB Compass and connect to `mongodb://localhost:27017`
2. Navigate to `spoorthy_db` database
3. Check the `users` or `admins` collection for credentials

---

## 🌐 Access Points

Once everything is running:
- **Application UI:** http://localhost:4200
- **Backend API:** http://localhost:443/api/ (or http://localhost:8100/api/)
- **MongoDB:** mongodb://localhost:27017/spoorthy_db

---

## 📦 Key Technologies

- **Frontend:** Angular 10, Bootstrap, DataTables, Material UI
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **PDF Generation:** PDFMake, html-pdf

---

## 🆘 Need Help?

If you face issues:
1. Check MongoDB is running
2. Verify all dependencies are installed
3. Ensure ports are not in use by other applications
4. Check firewall settings
5. Restart all services (MongoDB, Backend, Frontend)

Good luck! 🚀
