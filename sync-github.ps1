# GitHub Repository Sync Tool - PowerShell Version

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Repository Sync Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cek GitHub Token
if (-not $env:GITHUB_TOKEN) {
    Write-Host "❌ Error: GITHUB_TOKEN environment variable is required" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔑 Please set your GitHub token first:" -ForegroundColor Yellow
    Write-Host "`$env:GITHUB_TOKEN = 'your_github_token_here'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📖 How to get GitHub token:" -ForegroundColor Yellow
    Write-Host "1. Go to GitHub Settings > Developer settings > Personal access tokens" -ForegroundColor Yellow
    Write-Host "2. Generate new token with 'repo' scope" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "✅ GitHub token detected" -ForegroundColor Green
Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host "🎯 Target repository: fauzanhuzaifah/sejuta-hutan" -ForegroundColor Green
Write-Host ""

try {
    # Langkah 1: Hapus semua file
    Write-Host "📋 Step 1: Deleting all files from GitHub repository..." -ForegroundColor Yellow
    node github-delete-all.js
    if ($LASTEXITCODE -ne 0) {
        throw "Error during deletion step"
    }

    # Langkah 2: Upload file baru
    Write-Host ""
    Write-Host "📋 Step 2: Uploading new files to GitHub repository..." -ForegroundColor Yellow
    node github-sync.js
    if ($LASTEXITCODE -ne 0) {
        throw "Error during upload step"
    }

    Write-Host ""
    Write-Host "🎉 Success! Repository has been updated." -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 You can check the repository at:" -ForegroundColor Green
    Write-Host "https://github.com/fauzanhuzaifah/sejuta-hutan" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

} catch {
    Write-Host ""
    Write-Host "❌ Error during sync: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}