/* ══════════════════════════════════════════════════════════════
   Shared site behaviour（Noir 版）：
   主題記憶、共用頁首、字體載入、difference 游標、捲動進場、標語逐字點亮。
   主題用 localStorage 的 'theme' 鍵 —— 與 Typhoon 預報站同一個，
   所以在任何一頁切過，整個網站（含預報站）都會沿用。
   ══════════════════════════════════════════════════════════════ */
(function () {
    var d = document.documentElement;
    d.classList.add('js');
    // 在第一次繪製前就決定主題（預設黑底，使用者切過就沿用上次的選擇），避免閃一下
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    d.setAttribute('data-theme', (saved === 'light' || saved === 'dark') ? saved : 'dark');

    // 字體：Oswald（標題）、Montserrat（內文）、Noto Sans TC（中文）
    if (!document.querySelector('link[data-noir-fonts]')) {
        var head = document.head || document.getElementsByTagName('head')[0];
        [['preconnect', 'https://fonts.googleapis.com'],
         ['preconnect', 'https://fonts.gstatic.com', true],
         ['stylesheet', 'https://fonts.googleapis.com/css2?family=Montserrat:wght@200..800&family=Oswald:wght@300..700&family=Noto+Sans+TC:wght@300..900&display=swap']
        ].forEach(function (l) {
            var el = document.createElement('link');
            el.rel = l[0]; el.href = l[1];
            if (l[2]) el.crossOrigin = '';
            if (l[0] === 'stylesheet') el.setAttribute('data-noir-fonts', '');
            head.appendChild(el);
        });
    }
})();

function applyTheme(theme, save) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-btn');
    if (btn) btn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
    if (save !== false) { try { localStorage.setItem('theme', theme); } catch (e) {} }
}

function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark', true);
}

/* Build the shared header. Reads data-* attributes off <body>,
   so each page only declares its own title/subtitle. */
function buildSiteHeader(opts) {
    opts = opts || {};
    var title = opts.title || document.title;
    var subtitle = opts.subtitle || '';
    var icon = opts.icon || '🌏';
    var home = opts.home || '../../index.html';

    var hdr = document.createElement('header');
    hdr.className = 'site-header';
    hdr.innerHTML =
        '<a class="site-brand" href="' + home + '">' +
          '<div class="brand-icon">' + icon + '</div>' +
          '<div class="brand-text">' +
            '<div class="bt-title">' + title + '</div>' +
            (subtitle ? '<small>' + subtitle + '</small>' : '') +
          '</div>' +
        '</a>' +
        '<div class="site-actions">' +
          '<a class="hdr-btn" href="' + home + '">← 回作品集</a>' +
          '<button class="hdr-btn" id="theme-btn" type="button">☾ Dark</button>' +
        '</div>' +
        '<div class="scroll-progress"></div>';

    document.body.insertBefore(hdr, document.body.firstChild);
    hdr.querySelector('#theme-btn').addEventListener('click', toggleTheme);
    applyTheme(document.documentElement.getAttribute('data-theme'), false);
}

/* 標語逐字點亮：拆成字詞 span（中文一字一組），保留 <strong> 強調 */
function splitWords(el) {
    var re = /[⺀-鿿豈-﫿＀-￯]|[^\s⺀-鿿豈-﫿＀-￯]+|\s+/g;
    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var wrap = function (s) {
        return (s.match(re) || []).map(function (tok) {
            return /^\s+$/.test(tok) ? ' ' : '<span class="wd">' + esc(tok) + '</span>';
        }).join('');
    };
    var out = '';
    el.childNodes.forEach(function (n) {
        if (n.nodeType === 3) out += wrap(n.textContent);
        else if (n.nodeType === 1) {
            var tag = n.tagName.toLowerCase();
            out += '<' + tag + '>' + wrap(n.textContent) + '</' + tag + '>';
        }
    });
    el.innerHTML = out;
}

document.addEventListener('DOMContentLoaded', function () {
    var root = document.documentElement;
    var b = document.body;
    var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── 共用頁首 ──
    if (b && b.hasAttribute('data-page-title')) {
        buildSiteHeader({
            title:    b.getAttribute('data-page-title'),
            subtitle: b.getAttribute('data-page-subtitle') || '',
            icon:     b.getAttribute('data-page-icon') || '🌏',
            home:     b.getAttribute('data-home') || '../../index.html'
        });
    } else if (document.getElementById('theme-btn')) {
        /* Page supplies its own header but reuses our toggle — sync the label. */
        applyTheme(root.getAttribute('data-theme'), false);
    }

    // ── 設計出處：版面參考 usta.agency。頁面自己沒放的話，補在最底部 ──
    if (!document.querySelector('.design-credit')) {
        var credit = document.createElement('p');
        credit.className = 'design-credit';
        credit.innerHTML = 'Design inspired by <a href="https://usta.agency/" target="_blank" rel="noopener">USTA Agency（usta.agency）</a>';
        b.appendChild(credit);
    }

    // ── 頁首下緣的捲動進度線 ──
    var bar = document.querySelector('.scroll-progress');
    var words = [].slice.call(document.querySelectorAll('.words'));
    words.forEach(splitWords);
    function onScroll() {
        if (bar) {
            var max = document.documentElement.scrollHeight - innerHeight;
            bar.style.setProperty('--p', max > 0 ? (scrollY / max).toFixed(4) : 0);
        }
        words.forEach(function (el) {
            var ws = el.querySelectorAll('.wd');
            var r = el.getBoundingClientRect();
            var p = reduced ? 1 : (innerHeight * 0.82 - r.top) / (r.height + innerHeight * 0.3);
            var lit = Math.round(Math.max(0, Math.min(1, p)) * ws.length);
            for (var i = 0; i < ws.length; i++) ws[i].classList.toggle('lit', i < lit);
        });
    }
    var raf = 0;
    addEventListener('scroll', function () {
        if (!raf) raf = requestAnimationFrame(function () { raf = 0; onScroll(); });
    }, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    onScroll();

    // ── 捲動進場 ──
    var rv = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduced) {
        var io = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
        }, { rootMargin: '0px 0px -8% 0px' });
        rv.forEach(function (el) { io.observe(el); });
    } else {
        rv.forEach(function (el) { el.classList.add('in'); });
    }

    // ── 自訂游標：白點以 difference 混色反白底下的內容，移到可點的東西上會放大 ──
    var canHover = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (canHover && !reduced && !b.hasAttribute('data-no-cursor')) {
        var cur = document.createElement('div');
        cur.id = 'cursor';
        cur.setAttribute('aria-hidden', 'true');
        b.appendChild(cur);
        root.classList.add('has-cursor');
        var x = 0, y = 0, cx = 0, cy = 0, frame = 0, shown = false;
        var follow = function () {
            cx += (x - cx) * 0.24; cy += (y - cy) * 0.24;
            cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
            frame = (Math.abs(x - cx) + Math.abs(y - cy) > 0.2) ? requestAnimationFrame(follow) : 0;
        };
        document.addEventListener('pointermove', function (e) {
            if (e.pointerType !== 'mouse') return;
            x = e.clientX; y = e.clientY;
            if (!shown) { cx = x; cy = y; shown = true; cur.classList.add('on'); }
            var hit = e.target.closest && e.target.closest('a, button, select, label, input, summary, [role="button"], [onclick]');
            cur.classList.toggle('big', !!hit);
            if (!frame) frame = requestAnimationFrame(follow);
        }, { passive: true });
        root.addEventListener('mouseleave', function () { cur.classList.remove('on'); shown = false; });
        // 游標移進 iframe（Plotly 圖、Google Drive 文件）時隱藏，iframe 內用原生游標
        document.addEventListener('pointerover', function (e) {
            if (e.target.tagName === 'IFRAME') cur.classList.remove('on');
        });
        document.addEventListener('pointerdown', function () { cur.classList.add('press'); });
        document.addEventListener('pointerup', function () { cur.classList.remove('press'); });
    }
});
