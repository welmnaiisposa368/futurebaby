Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FutureBabe Development Server Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
Set-Location "c:\Users\Administrator\Documents\augment-projects\AIbeby"
Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Check if package.json exists
if (Test-Path "package.json") {
    Write-Host "✓ package.json found" -ForegroundColor Green
} else {
    Write-Host "✗ package.json NOT found - Wrong directory!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""
Write-Host "Starting Next.js development server..." -ForegroundColor Yellow
Write-Host "Please wait for 'Ready' message, then open http://localhost:3000" -ForegroundColor Yellow
Write-Host ""

# Start the server
try {
    npx next dev
} catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
}
