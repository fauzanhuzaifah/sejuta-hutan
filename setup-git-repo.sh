#!/bin/bash

# Script untuk clone repository dan setup Git
# Repository: https://github.com/fauzanhuzaifah/sejuta-hutan

echo "🚀 Git Repository Setup Script"
echo "==============================="
echo ""

# Clone repository GitHub
echo "📥 Cloning repository from GitHub..."
git clone https://github.com/fauzanhuzaifah/sejuta-hutan.git temp_repo

if [ $? -eq 0 ]; then
    echo "✅ Repository cloned successfully!"
    echo ""
    echo "📁 Repository location: ./temp_repo"
    echo ""
    echo "📝 Next steps:"
    echo "1. cd temp_repo"
    echo "2. git status"
    echo "3. git rm filename.ext (to delete files)"
    echo "4. git commit -m 'Delete files'"
    echo "5. git push origin main"
else
    echo "❌ Failed to clone repository"
    exit 1
fi