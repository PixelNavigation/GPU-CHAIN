@echo off
echo 🔄 Refreshing GPU Chain Frontend...
echo.
echo ⏹️ Stopping development server...
taskkill /F /IM node.exe 2>nul

echo.
echo 🧹 Clearing cache...
timeout /t 2 /nobreak >nul

cd /d "d:\CODE\React\GPU-CHAIN\client"

echo.
echo 🚀 Starting fresh development server...
echo 📍 Contract address should be: 0x0B306BF915C4d645ff596e518fAf3F9669b97016
echo.
echo 💡 After starting, please hard refresh your browser (Ctrl+F5)
echo.

npm run dev
