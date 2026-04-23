#!/usr/bin/env python3
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find: closing grid div followed directly by table div
old_pattern = r'(            </div>\n        </div>)\n        (<div class="overflow-x-auto rounded-2xl border border-forest-800/30 light-mode:border-green-200">)'

new_replacement = r'''\1
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
        \2'''

if re.search(old_pattern, content):
    content = re.sub(old_pattern, new_replacement, content)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('✅ Fixed HTML structure successfully!')
else:
    print('❌ Pattern not found. Checking file content...')
    # Print surrounding context for debugging
    idx = content.find('</div>\n        </div>\n        <div class="overflow-x-auto')
    if idx != -1:
        print(f'Found at position {idx}:')
        print(repr(content[idx:idx+150]))
    else:
        print('Alternative pattern not found either')
