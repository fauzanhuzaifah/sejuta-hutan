const https = require('https');
const fs = require('fs');
const path = require('path');

// Konfigurasi
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Token harus diset sebagai environment variable
const OWNER = 'fauzanhuzaifah';
const REPO = 'sejuta-hutan';
const BRANCH = 'main'; // atau branch yang digunakan

// Fungsi untuk melakukan request ke GitHub API
function githubRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(json);
                    } else {
                        reject(new Error(`GitHub API Error: ${res.statusCode} - ${json.message || body}`));
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse response: ${body}`));
                }
            });
        });
        
        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// Fungsi untuk mendapatkan SHA dari file
async function getFileSha(filePath) {
    const options = {
        hostname: 'api.github.com',
        path: `/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`,
        method: 'GET',
        headers: {
            'User-Agent': 'Node.js',
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    };

    try {
        const response = await githubRequest(options);
        return response.sha;
    } catch (error) {
        if (error.message.includes('404')) {
            return null; // File tidak ditemukan
        }
        throw error;
    }
}

// Fungsi untuk menghapus file di GitHub
async function deleteFile(filePath, sha) {
    const options = {
        hostname: 'api.github.com',
        path: `/repos/${OWNER}/${REPO}/contents/${filePath}`,
        method: 'DELETE',
        headers: {
            'User-Agent': 'Node.js',
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        }
    };

    const data = {
        message: `Delete ${filePath} - replaced with new content`,
        sha: sha,
        branch: BRANCH
    };

    return await githubRequest(options, data);
}

// Fungsi untuk upload file baru ke GitHub
async function uploadFile(filePath, content) {
    // Cek apakah file sudah ada
    const existingSha = await getFileSha(filePath);
    
    const options = {
        hostname: 'api.github.com',
        path: `/repos/${OWNER}/${REPO}/contents/${filePath}`,
        method: 'PUT',
        headers: {
            'User-Agent': 'Node.js',
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        }
    };

    const data = {
        message: `Upload ${filePath}`,
        content: content.toString('base64'),
        branch: BRANCH
    };

    if (existingSha) {
        data.sha = existingSha; // Update file yang sudah ada
    }

    return await githubRequest(options, data);
}

// Fungsi untuk membaca semua file dalam folder
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
        if (file === '.git' || file === 'node_modules' || file === '.env') {
            return; // Skip folder tertentu
        }
        
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });
    
    return arrayOfFiles;
}

// Fungsi utama
async function main() {
    if (!GITHUB_TOKEN) {
        console.error('Error: GITHUB_TOKEN environment variable is required');
        console.log('Usage: GITHUB_TOKEN=your_token node github-sync.js');
        process.exit(1);
    }

    try {
        console.log('Starting GitHub repository sync...');
        
        // Dapatkan semua file dalam folder saat ini
        const currentDir = __dirname;
        const allFiles = getAllFiles(currentDir);
        
        console.log(`Found ${allFiles.length} files to sync`);
        
        // Upload setiap file
        for (const filePath of allFiles) {
            const relativePath = path.relative(currentDir, filePath);
            
            try {
                const content = fs.readFileSync(filePath);
                await uploadFile(relativePath, content);
                console.log(`✓ Uploaded: ${relativePath}`);
            } catch (error) {
                console.error(`✗ Failed to upload ${relativePath}: ${error.message}`);
            }
        }
        
        console.log('\nSync completed!');
        
    } catch (error) {
        console.error('Error during sync:', error.message);
        process.exit(1);
    }
}

// Jalankan script
if (require.main === module) {
    main();
}

module.exports = { deleteFile, uploadFile, getFileSha };