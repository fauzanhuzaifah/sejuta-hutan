const https = require('https');

// Konfigurasi
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'fauzanhuzaifah';
const REPO = 'sejuta-hutan';
const BRANCH = 'main';

// Fungsi untuk melakukan request ke GitHub API
function githubRequest(options) {
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
        req.end();
    });
}

// Fungsi untuk mendapatkan konten repository
async function getRepositoryContents(path = '') {
    const options = {
        hostname: 'api.github.com',
        path: `/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
        method: 'GET',
        headers: {
            'User-Agent': 'Node.js',
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    };

    return await githubRequest(options);
}

// Fungsi untuk menghapus file
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
        message: `Delete ${filePath}`,
        sha: sha,
        branch: BRANCH
    };

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
        req.write(JSON.stringify(data));
        req.end();
    });
}

// Fungsi rekursif untuk menghapus semua file dan folder
async function deleteAllContents(path = '') {
    try {
        const contents = await getRepositoryContents(path);
        
        // Urutkan: file dulu, folder terakhir
        const files = contents.filter(item => item.type === 'file');
        const folders = contents.filter(item => item.type === 'dir');
        
        // Hapus semua file
        for (const file of files) {
            try {
                await deleteFile(file.path, file.sha);
                console.log(`✓ Deleted file: ${file.path}`);
            } catch (error) {
                console.error(`✗ Failed to delete file ${file.path}: ${error.message}`);
            }
        }
        
        // Hapus semua folder (rekursif)
        for (const folder of folders) {
            await deleteAllContents(folder.path);
            
            // Setelah isi folder dihapus, coba hapus folder itu sendiri
            // Note: GitHub tidak memungkinkan penghapusan folder kosong secara eksplisit,
            // folder akan otomatis hilang ketika tidak ada file lagi
            console.log(`✓ Emptied folder: ${folder.path}`);
        }
        
    } catch (error) {
        if (error.message.includes('404')) {
            console.log(`Path not found: ${path}`);
        } else {
            throw error;
        }
    }
}

// Fungsi utama
async function main() {
    if (!GITHUB_TOKEN) {
        console.error('Error: GITHUB_TOKEN environment variable is required');
        console.log('Usage: GITHUB_TOKEN=your_token node github-delete-all.js');
        console.log('\nTo get a GitHub token:');
        console.log('1. Go to GitHub Settings > Developer settings > Personal access tokens');
        console.log('2. Generate new token with "repo" scope');
        process.exit(1);
    }

    console.log('Starting to delete all files from GitHub repository...');
    console.log(`Repository: ${OWNER}/${REPO}`);
    console.log(`Branch: ${BRANCH}`);
    console.log('');

    try {
        await deleteAllContents();
        console.log('\n✓ All files have been deleted from the repository!');
        
    } catch (error) {
        console.error('Error during deletion:', error.message);
        process.exit(1);
    }
}

// Jalankan script
if (require.main === module) {
    main();
}