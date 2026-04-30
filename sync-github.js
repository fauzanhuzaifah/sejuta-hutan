#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Fungsi untuk menjalankan command
function runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: 'inherit',
            shell: true,
            ...options
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });

        child.on('error', reject);
    });
}

// Fungsi utama
async function main() {
    console.log('🚀 GitHub Repository Sync Tool');
    console.log('================================');
    
    // Cek GitHub Token
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        console.error('❌ Error: GITHUB_TOKEN environment variable is required');
        console.log('\n🔑 Please set your GitHub token first:');
        console.log('set GITHUB_TOKEN=your_github_token_here');
        console.log('\n📖 How to get GitHub token:');
        console.log('1. Go to GitHub Settings > Developer settings > Personal access tokens');
        console.log('2. Generate new token with "repo" scope');
        process.exit(1);
    }

    console.log('✅ GitHub token detected');
    console.log(`📁 Current directory: ${process.cwd()}`);
    console.log(`🎯 Target repository: fauzanhuzaifah/sejuta-hutan`);
    
    try {
        // Langkah 1: Hapus semua file di repository
        console.log('\n📋 Step 1: Deleting all files from GitHub repository...');
        await runCommand('node', ['github-delete-all.js']);
        
        // Langkah 2: Upload file baru
        console.log('\n📋 Step 2: Uploading new files to GitHub repository...');
        await runCommand('node', ['github-sync.js']);
        
        console.log('\n🎉 Success! Repository has been updated.');
        console.log('\n📄 You can check the repository at:');
        console.log('https://github.com/fauzanhuzaifah/sejuta-hutan');
        
    } catch (error) {
        console.error('\n❌ Error during sync:', error.message);
        process.exit(1);
    }
}

// Jalankan script
if (require.main === module) {
    main();
}