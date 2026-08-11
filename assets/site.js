/* ══════════════════════════════════════════════════════════════
   Shared site behaviour: theme persistence + header injection.
   Uses localStorage key 'theme' — the same key the Typhoon
   forecast page already uses, so the choice carries across pages.
   ══════════════════════════════════════════════════════════════ */
(function () {
    // Apply stored theme before first paint to avoid a flash.
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (e) {}
    if (!stored) {
        stored = window.matchMedia &&
                 window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', stored);
})();

function applyTheme(theme, save) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
    if (save !== false) { try { localStorage.setItem('theme', theme); } catch (e) {} }
}

function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark', true);
}

/* Build the shared header. Reads data-* attributes off the <script> tag
   or off <body>, so each page only declares its own title/subtitle. */
function buildSiteHeader(opts) {
    opts = opts || {};
    var title = opts.title || document.title;
    var subtitle = opts.subtitle || '';
    var icon = opts.icon || '🌏';
    var home = opts.home || '../../index.html';

    var hdr = document.createElement('header');
    hdr.className = 'site-header';
    hdr.innerHTML =
        '<div class="site-brand">' +
          '<div class="brand-icon">' + icon + '</div>' +
          '<div class="brand-text">' +
            '<div class="bt-title">' + title + '</div>' +
            (subtitle ? '<small>' + subtitle + '</small>' : '') +
          '</div>' +
        '</div>' +
        '<div class="site-actions">' +
          '<a class="hdr-btn" href="' + home + '">← 回作品集</a>' +
          '<button class="hdr-btn" id="theme-btn" type="button">🌙 Dark</button>' +
        '</div>';

    document.body.insertBefore(hdr, document.body.firstChild);
    hdr.querySelector('#theme-btn').addEventListener('click', toggleTheme);
    applyTheme(document.documentElement.getAttribute('data-theme'), false);
}

/* Auto-init from <body data-page-title="..." data-page-subtitle="..."> */
document.addEventListener('DOMContentLoaded', function () {
    var b = document.body;
    if (b && b.hasAttribute('data-page-title')) {
        buildSiteHeader({
            title:    b.getAttribute('data-page-title'),
            subtitle: b.getAttribute('data-page-subtitle') || '',
            icon:     b.getAttribute('data-page-icon') || '🌏',
            home:     b.getAttribute('data-home') || '../../index.html'
        });
    } else if (document.getElementById('theme-btn')) {
        /* Page supplies its own header but reuses our toggle — sync the label. */
        applyTheme(document.documentElement.getAttribute('data-theme'), false);
    }
});
