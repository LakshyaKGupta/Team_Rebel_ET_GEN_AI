@echo off
echo Killing all processes on ports 3000-3003...
for /L %%i in (3000,1,3003) do (
    for /F "tokens=5" %%a in ('netstat -aon ^| findstr :%%i') do (
        taskkill /F /PID %%a >nul 2>&1
    )
)
echo Starting Next.js on port 3000...
set PORT=3000
npm run dev
