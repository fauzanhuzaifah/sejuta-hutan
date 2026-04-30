# Git File Deletion Tool - PowerShell Version

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git File Deletion Tool for Windows" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cek apakah repository Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Ini bukan repository Git. Inisialisasi dulu dengan:" -ForegroundColor Red
    Write-Host "   git init" -ForegroundColor Yellow
    Write-Host "   git remote add origin https://github.com/fauzanhuzaifah/sejuta-hutan.git" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔧 Atau jalankan: setup-git-repo.ps1" -ForegroundColor Yellow
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "📁 Repository Git ditemukan!" -ForegroundColor Green
Write-Host ""

# Tampilkan file yang ada
Write-Host "📋 File yang tersedia untuk dihapus:" -ForegroundColor Yellow
git ls-files
Write-Host ""

# Cek apakah ada argument
if ($args.Count -eq 0) {
    Write-Host "Usage: .\git-delete-files.ps1 filename1 filename2 ..." -ForegroundColor Yellow
    Write-Host "Example: .\git-delete-files.ps1 old-file.txt unused.css" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Untuk menghapus semua file kecuali yang ada di folder ini:" -ForegroundColor Yellow
    Write-Host "   .\git-delete-files.ps1 --sync" -ForegroundColor Yellow
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Handle --sync option
if ($args[0] -eq "--sync") {
    Write-Host "🔄 Sync mode - akan hapus file lama dan upload yang baru..." -ForegroundColor Yellow
    Write-Host "Jalankan: .\sync-github.ps1 untuk proses lengkap" -ForegroundColor Yellow
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 0
}

# Hapus file satu per satu
Write-Host "🗑️  Menghapus file yang diminta..." -ForegroundColor Yellow
Write-Host ""

foreach ($file in $args) {
    Write-Host "Menghapus file: $file" -ForegroundColor Yellow
    git rm "$file" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ File $file berhasil dihapus dari staging" -ForegroundColor Green
    } else {
        Write-Host "⚠️  File $file tidak ditemukan atau gagal dihapus" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📋 Status setelah penghapusan:" -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "📝 Untuk commit perubahan:" -ForegroundColor Yellow
Write-Host "   git commit -m 'Delete unused files'" -ForegroundColor Yellow
Write-Host "   git push origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")