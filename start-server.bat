@echo off
echo Starting FutureBabe Development Server...
echo.
cd /d "c:\Users\Administrator\Documents\augment-projects\AIbeby"
echo Current directory: %CD%
echo.
echo Checking Node.js version...
node --version
echo.
echo Checking npm version...
npm --version
echo.
echo Starting Next.js development server...
echo Please wait for "Ready" message, then open http://localhost:3000
echo.
npx next dev
pause
