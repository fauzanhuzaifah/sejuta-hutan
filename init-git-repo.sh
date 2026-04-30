#!/bin/bash

# Script untuk inisialisasi Git dan setup repository

echo "🚀 Git Repository Initialization Script"
echo "======================================="
echo ""

# Inisialisasi Git repository
echo "📁 Initializing Git repository..."
git init

if [ $? -eq 0 ]; then
    echo "✅ Git repository initialized!"
    echo ""
    
    # Tambahkan remote repository
    echo "🔗 Adding remote repository..."
    git remote add origin https://github.com/fauzanhuzaifah/sejuta-hutan.git
    
    if [ $? -eq 0 ]; then
        echo "✅ Remote repository added!"
        echo ""
        echo "📋 Current Git status:"
        git status
        echo ""
        echo "📝 Available commands:"
        echo "• git add .              - Stage all files"
        echo "• git rm filename.ext    - Delete and stage file"
        echo "• git commit -m 'msg'    - Commit changes"
        echo "• git push origin main   - Push to GitHub"
    else
        echo "⚠️  Remote repository already exists or failed to add"
    fi
else
    echo "❌ Failed to initialize Git repository"
    exit 1
fi