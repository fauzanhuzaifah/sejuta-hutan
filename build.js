// Build script untuk inject environment variables
const fs = require('fs');
const path = require('path');

// Baca environment variables
const env = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'sejutapohon2025'
};

// Fungsi untuk replace placeholders
function injectEnv(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace placeholders
  content = content.replace(/%DATABASE_URL%/g, env.DATABASE_URL);
  content = content.replace(/%ADMIN_PASSWORD%/g, env.ADMIN_PASSWORD);
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Injected env variables into ${filePath}`);
}

// Process files
console.log('🚀 Injecting environment variables...');
injectEnv('index.html');
injectEnv('admin.html');
console.log('✅ Build completed!');