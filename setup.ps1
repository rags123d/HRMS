# Spoorthy HRMS - Setup Script for PowerShell
# Run this script to automatically setup the project

param(
    [switch]$UsePort8100 = $false
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Spoorthy HRMS - Local Setup Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    node --version | Out-Null
    Write-Host "✓ Node.js is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check MongoDB
Write-Host "Checking MongoDB installation..." -ForegroundColor Yellow
try {
    mongod --version | Out-Null
    Write-Host "✓ MongoDB is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ MongoDB is not installed!" -ForegroundColor Red
    Write-Host "  Download from: https://www.mongodb.com/try/download/community" -ForegroundColor Red
    exit 1
}

# Start MongoDB
Write-Host "`nStarting MongoDB Service..." -ForegroundColor Yellow
try {
    net start MongoDB | Out-Null
    Write-Host "✓ MongoDB service started" -ForegroundColor Green
} catch {
    Write-Host "! MongoDB service may already be running" -ForegroundColor Yellow
}

Start-Sleep -Seconds 3

# Import Database
Write-Host "`nImporting database..." -ForegroundColor Yellow
Push-Location "$PSScriptRoot\spoorthy_db"
mongorestore --db spoorthy_db . | Out-Null
Write-Host "✓ Database restored" -ForegroundColor Green
Pop-Location

# Install Backend Dependencies
Write-Host "`nInstalling Backend dependencies..." -ForegroundColor Yellow
Push-Location "$PSScriptRoot\spoorthyapi"

# Fix port configuration if requested
if ($UsePort8100) {
    Write-Host "  Updating .env for port 8100..." -ForegroundColor Cyan
    (Get-Content .env) -replace 'PORT = 443', 'PORT = 8100' | Set-Content .env
    (Get-Content .env) -replace 'http://localhost:443/uploads/', 'http://localhost:8100/uploads/' | Set-Content .env
}

npm install | Out-Null
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
Pop-Location

# Install Frontend Dependencies
Write-Host "`nInstalling Frontend dependencies..." -ForegroundColor Yellow
Push-Location "$PSScriptRoot\spoorthi ui"

# Fix environment configuration if requested
if ($UsePort8100) {
    Write-Host "  Updating environment.ts for port 8100..." -ForegroundColor Cyan
    $envFile = "src\environments\environment.ts"
    (Get-Content $envFile) -replace "baseUrl: 'http://localhost:443/api/'", "baseUrl: 'http://localhost:8100/api/'" | Set-Content $envFile
    (Get-Content $envFile) -replace "baseUrl2: 'http://localhost:443/'", "baseUrl2: 'http://localhost:8100/'" | Set-Content $envFile
    (Get-Content $envFile) -replace "docUrl: 'http://localhost:443/'", "docUrl: 'http://localhost:8100/'" | Set-Content $envFile
}

npm install | Out-Null
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
Pop-Location

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next Steps:" -ForegroundColor White
Write-Host "1. Open PowerShell Terminal 1 and run:" -ForegroundColor White
Write-Host "   cd '$PSScriptRoot\spoorthyapi'" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Open PowerShell Terminal 2 and run:" -ForegroundColor White
Write-Host "   cd '$PSScriptRoot\spoorthi ui'" -ForegroundColor Cyan
Write-Host "   npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Open your browser and visit: http://localhost:4200" -ForegroundColor Cyan
Write-Host "`n========================================`n" -ForegroundColor Cyan

if ($UsePort8100) {
    Write-Host "✓ Port 8100 configuration has been applied" -ForegroundColor Green
} else {
    Write-Host "Note: Using port 443. If blocked, run: .\setup.ps1 -UsePort8100" -ForegroundColor Yellow
}

Write-Host ""
