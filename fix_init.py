#!/usr/bin/env python3

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix app initialization to wait for DOM
old_init = '''// --- START APPLICATION ---
App.I18n.init();
App.UI.init();
App.Comments.init();'''

new_init = '''// --- START APPLICATION ---
function initApp() {
    App.I18n.init();
    App.UI.init();
    App.Comments.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}'''

if old_init in content:
    content = content.replace(old_init, new_init)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('✅ Fixed app initialization to wait for DOM')
else:
    print('❌ Pattern not found')
