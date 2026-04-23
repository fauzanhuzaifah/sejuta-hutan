const fs = require('fs');

const file = 'index.html';
let content = fs.readFileSync(file, 'utf8');

// Find and replace the broken HTML structure
const oldStr = `            </div>
        </div>
        <div class="overflow-x-auto rounded-2xl border border-forest-800/30 light-mode:border-green-200">`;

const newStr = `            </div>
        </div>
    </div>
</section>

<!-- Di antara section satu dan section berikutnya -->
<div class="section-divider"></div>

<!-- BAGIAN: DATA TABLE -->
<section class="py-20 bg-forest-950 relative light-mode:bg-white">
    <div class="max-w-7xl mx-auto px-6 reveal">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h3 class="text-xl font-bold text-forest-200 flex items-center gap-2 light-mode:text-forest-800"><i data-lucide="table" class="w-5 h-5 text-forest-400"></i><span data-i18n="datatable_title">Data Peserta Terdaftar</span></h3>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="App.Data.clear(); App.Data.sync();" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-forest-800/50 text-forest-300 hover:bg-forest-800 transition-colors text-sm" title="Hapus cache dan reload dari server">
                    <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                    <span>Refresh Data</span>
                </button>
                <a href="/admin" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-forest-800/50 text-forest-300 hover:bg-forest-800 transition-colors text-sm">
                    <i data-lucide="shield" class="w-4 h-4"></i>
                    <span>Panel Admin</span>
                </a>
            </div>
        </div>
        <div class="overflow-x-auto rounded-2xl border border-forest-800/30 light-mode:border-green-200">`;

if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    fs.writeFileSync(file, content);
    console.log('✅ Fixed HTML structure - table section is now properly separated from Alur section');
} else {
    console.log('❌ Could not find the target string to replace');
    console.log('Searching for alternative...');
    
    // Try alternative patterns
    const altPattern = '</div>\n        </div>\n        <div class="overflow-x-auto';
    if (content.includes(altPattern)) {
        console.log('Found alternative pattern');
    } else {
        console.log('Pattern not found. Manual fix needed.');
    }
}
