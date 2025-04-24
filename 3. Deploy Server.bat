@echo off
:: Navigate to the UtaTomo project directory
cd /d "D:\Unity Projects\UtaTomo"

:: Ensure we have all dependencies
call npm install

:: Set production environment and build
SET NODE_ENV=production
call npm run build
call npm run deploy

:: Pause to keep window open
pause
