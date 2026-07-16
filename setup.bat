@echo off
REM Spoorthy HRMS - Quick Setup Script for Windows

echo.
echo ========================================
echo Spoorthy HRMS - Local Setup
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

REM Check if MongoDB is installed
echo.
echo Checking MongoDB installation...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MongoDB is not installed!
    echo Please install MongoDB from https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)
echo ✓ MongoDB is installed

REM Start MongoDB Service
echo.
echo Starting MongoDB Service...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MongoDB service started
) else (
    echo ! MongoDB service may already be running
)

REM Wait for MongoDB to start
timeout /t 3 /nobreak

REM Import Database
echo.
echo Importing MongoDB database...
cd "%~dp0spoorthy_db"
mongorestore --db spoorthy_db . >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Database imported successfully
) else (
    echo ! Database import completed (may already exist)
)

REM Install Backend Dependencies
echo.
echo Installing Backend dependencies...
cd "%~dp0spoorthyapi"
call npm install >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Backend dependencies installed
) else (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

REM Install Frontend Dependencies
echo.
echo Installing Frontend dependencies...
cd "%~dp0spoorthi ui"
call npm install >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Frontend dependencies installed
) else (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Open Terminal 1:
echo    cd "%~dp0spoorthyapi" && npm start
echo.
echo 2. Open Terminal 2:
echo    cd "%~dp0spoorthi ui" && npm start
echo.
echo 3. Open browser and visit: http://localhost:4200
echo.
echo ========================================
pause
