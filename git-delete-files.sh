#!/bin/bash

# Script untuk menghapus file dengan Git
# Usage: ./git-delete-files.sh [nama_file1] [nama_file2] ...

echo "🗑️  Git File Deletion Script"
echo "==========================="
echo ""

# Cek apakah repository Git
if [ ! -d ".git" ]; then
    echo "❌ Ini bukan repository Git. Inisialisasi dulu dengan:"
    echo "   git init"
    echo "   git remote add origin https://github.com/fauzanhuzaifah/sejuta-hutan.git"
    exit 1
fi

# Cek apakah ada argument
if [ $# -eq 0 ]; then
    echo "📋 File yang tersedia untuk dihapus:"
    git ls-files
    echo ""
    echo "Usage: $0 filename1 filename2 ..."
    echo "Example: $0 old-file.txt unused.css"
    exit 1
fi

# Hapus file satu per satu
for file in "$@"; do
    if [ -f "$file" ]; then
        echo "🗑️  Menghapus file: $file"
        git rm "$file"
        if [ $? -eq 0 ]; then
            echo "✅ File $file berhasil dihapus dari staging"
        else
            echo "❌ Gagal menghapus file $file"
        fi
    else
        echo "⚠️  File $file tidak ditemukan"
    fi
done

echo ""
echo "📋 Status setelah penghapusan:"
git status

echo ""
echo "📝 Untuk commit perubahan:"
echo "   git commit -m 'Delete unused files'"
echo "   git push origin main"