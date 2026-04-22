@echo off
echo ========================================
echo FutureBabe Debug Startup Script
echo ========================================
echo.

echo Step 1: Checking current directory...
cd /d "c:\Users\Administrator\Documents\augment-projects\AIbeby"
echo Current directory: %CD%
echo.

echo Step 2: Checking if package.json exists...
if exist package.json (
    echo ✓ package.json found
) else (
    echo ✗ package.json NOT found - Wrong directory!
    pause
    exit
)
echo.

echo Step 3: Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ✗ Node.js not found or not in PATH
    pause
    exit
)
echo ✓ Node.js is working
echo.

echo Step 4: Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ✗ npm not found or not in PATH
    pause
    exit
)
echo ✓ npm is working
echo.

echo Step 5: Checking if node_modules exists...
if exist node_modules (
    echo ✓ node_modules found
) else (
    echo ✗ node_modules NOT found - Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ✗ npm install failed
        pause
        exit
    )
)
echo.

echo Step 6: Checking port 3000...
netstat -an | findstr :3000 > nul
if %errorlevel% equ 0 (
    echo ⚠ Port 3000 is already in use
    echo Trying port 3001 instead...
    set PORT_FLAG=-p 3001
    echo Open http://localhost:3001 in your browser
) else (
    echo ✓ Port 3000 is available
    set PORT_FLAG=
    echo Open http://localhost:3000 in your browser
)
echo.

echo Step 7: Starting Next.js development server...
echo ========================================
echo Please wait for "Ready" message...
echo Then refresh your browser page
echo ========================================
echo.

npx next dev %PORT_FLAG%

echo.
echo Server stopped. Press any key to exit...
pause
