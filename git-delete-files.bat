@echo off
echo ========================================
echo Git File Deletion Tool for Windows
echo ========================================
echo.

REM Cek apakah repository Git
if not exist ".git" (
    echo ❌ Ini bukan repository Git. Inisialisasi dulu dengan:
    echo    git init
    echo    git remote add origin https://github.com/fauzanhuzaifah/sejuta-hutan.git
    echo.
    echo 🔧 Atau jalankan: setup-git-repo.bat
    pause
    exit /b 1
)

echo 📁 Repository Git ditemukan!
echo.

REM Tampilkan file yang ada
echo 📋 File yang tersedia untuk dihapus:
git ls-files
echo.

REM Cek apakah ada argument
if "%1"=="" (
    echo Usage: %0 filename1 filename2 ...
    echo Example: %0 old-file.txt unused.css
    echo.
    echo Untuk menghapus semua file kecuali yang ada di folder ini:
    echo   %0 --sync
    pause
    exit /b 1
)

REM Handle --sync option
if "%1"=="--sync" (
    echo 🔄 Sync mode - akan hapus file lama dan upload yang baru...
    echo Jalankan: sync-github.bat untuk proses lengkap
    pause
    exit /b 0
)

REM Hapus file satu per satu
echo 🗑️  Menghapus file yang diminta...
echo.

:loop
if "%1"=="" goto done
    echo Menghapus file: %1
    git rm "%1" 2>nul
    if %errorlevel% equ 0 (
        echo ✅ File %1 berhasil dihapus dari staging
    ) else (
        echo ⚠️  File %1 tidak ditemukan atau gagal dihapus
    )
    shift
goto loop

:done
echo.
echo 📋 Status setelah penghapusan:
git status
echo.
echo 📝 Untuk commit perubahan:
echo    git commit -m "Delete unused files"
echo    git push origin main
echo.
echo Press any key to exit...
pause > nul