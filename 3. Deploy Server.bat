@echo off
:: Navigate to the UtaTomo project directory
cd /d "D:\Unity Projects\UtaTomo"

:: Ensure we have all dependencies
call npm install

:: Build and deploy
call npm run build
call npm run deploy

:: Pause to keep window open
pause
