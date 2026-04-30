@echo off
echo ========================================
echo GitHub Repository Sync Tool
echo ========================================
echo.

REM Cek GitHub Token
if "%GITHUB_TOKEN%"=="" (
    echo ❌ Error: GITHUB_TOKEN environment variable is required
    echo.
    echo 🔑 Please set your GitHub token first:
    echo set GITHUB_TOKEN=your_github_token_here
    echo.
    echo 📖 How to get GitHub token:
    echo 1. Go to GitHub Settings ^> Developer settings ^> Personal access tokens
    echo 2. Generate new token with "repo" scope
    echo.
    echo Press any key to exit...
    pause > nul
    exit /b 1
)

echo ✅ GitHub token detected
echo 📁 Current directory: %cd%
echo 🎯 Target repository: fauzanhuzaifah/sejuta-hutan
echo.

REM Langkah 1: Hapus semua file
echo 📋 Step 1: Deleting all files from GitHub repository...
node github-delete-all.js
if %errorlevel% neq 0 (
    echo ❌ Error during deletion step
    pause
    exit /b 1
)

REM Langkah 2: Upload file baru
echo.
echo 📋 Step 2: Uploading new files to GitHub repository...
node github-sync.js
if %errorlevel% neq 0 (
    echo ❌ Error during upload step
    pause
    exit /b 1
)

echo.
echo 🎉 Success! Repository has been updated.
echo.
echo 📄 You can check the repository at:
echo https://github.com/fauzanhuzaifah/sejuta-hutan
echo.
echo Press any key to exit...
pause > nul