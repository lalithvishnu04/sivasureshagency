/**
 * SIVA SURESH AGENCY  —  E-Commerce Frontend (v71)
 * Main client-side logic: product display, filtering, cart, orders
 */

// ===== SVG Avatar Generator =====
function generateProductSVG(product) {
    const category = product.category;
    const gender = product.gender || 'male';
    const sleeve = product.sleeve || 'full';
    const bgGradients = {
        'doctor-coats': ['#e8f4fd', '#d4e8f7'],
        'scrub-suits': ['#e8f8f0', '#d0f0e0'],
        'hospital-uniforms': ['#eae4f7', '#ddd4f0'],
        'hospital-linen': ['#f0f8ff', '#e0f0ff'],
        'bedsheets': ['#fff0f0', '#ffe8e8'],
        'hotel-linen': ['#fff8e8', '#fff0d0']
    };
    const bg = bgGradients[category] || bgGradients['doctor-coats'];
    const skinTones = ['#f5cba7', '#d4a574', '#8d5524', '#f8d9b0'];
    const skinTone = skinTones[product.id % skinTones.length];
    const skinShadow = skinTone === '#f5cba7' ? '#e8b98a' : skinTone === '#d4a574' ? '#b8885c' : skinTone === '#8d5524' ? '#6b3a12' : '#e0c090';
    const hairColors = ['#4a3728', '#1a1a2e', '#8b4513', '#2c1810'];
    const hairColor = hairColors[product.id % hairColors.length];
    let hairSVG = '', faceSVG = '', eyesSVG = '', noseMouthSVG = '', neckSVG = '', bodySVG = '';

    if (category === 'bedsheets' || category === 'hospital-linen' || category === 'hotel-linen') {
        // Non-person products
        if (category === 'bedsheets') {
            bodySVG = `<rect x="95" y="100" width="110" height="80" rx="8" fill="#f8e8e8" stroke="#e0c8c8" stroke-width="1"/><rect x="100" y="105" width="100" height="70" rx="6" fill="#fff5f5"/><rect x="110" y="108" width="4" height="64" fill="#ffb3b3" opacity="0.4"/><rect x="130" y="108" width="4" height="64" fill="#ffb3b3" opacity="0.4"/><rect x="150" y="108" width="4" height="64" fill="#ffb3b3" opacity="0.4"/><rect x="170" y="108" width="4" height="64" fill="#ffb3b3" opacity="0.4"/><ellipse cx="150" cy="210" rx="40" ry="20" fill="#e8f4ff" stroke="#c8dced" stroke-width="1"/>`;
        } else if (category === 'hospital-linen') {
            bodySVG = `<rect x="100" y="80" width="100" height="130" rx="5" fill="#e8f8f0" stroke="#b8e0d0" stroke-width="1.5"/><rect x="108" y="88" width="84" height="114" rx="3" fill="#f0fff8"/><rect x="140" y="110" width="20" height="60" rx="3" fill="#48cae4" opacity="0.3"/><rect x="125" y="130" width="50" height="20" rx="3" fill="#48cae4" opacity="0.3"/><rect x="125" y="195" width="50" height="12" rx="3" fill="#fff" stroke="#48cae4" stroke-width="0.5"/><text x="150" y="204" font-family="Arial" font-size="7" fill="#48cae4" text-anchor="middle">STERILE</text>`;
        } else {
            bodySVG = `<rect x="95" y="85" width="110" height="75" rx="6" fill="#fffff0" stroke="#e8dcc0" stroke-width="1.5"/><rect x="100" y="90" width="100" height="65" rx="4" fill="#fffdf5"/><rect x="105" y="95" width="90" height="55" rx="2" fill="none" stroke="#f0e0a0" stroke-width="0.8"/><ellipse cx="150" cy="200" rx="30" ry="18" fill="#fffcf0" stroke="#e8dcc0" stroke-width="1"/><text x="150" y="125" font-family="Arial" font-size="10" fill="#c89f30" text-anchor="middle">★★★★★</text>`;
        }
    } else {
        // Person-based products
        if (gender === 'female') {
            hairSVG = `<ellipse cx="150" cy="72" rx="32" ry="35" fill="${hairColor}"/><path d="M120 72 Q120 45 150 40 Q180 45 180 72 Q180 55 170 50 Q150 42 130 50 Q120 55 120 72" fill="${hairColor}"/><path d="M122 80 Q118 100 120 115 Q122 120 125 115 Q127 100 126 85 Z" fill="${hairColor}"/><path d="M178 80 Q182 100 180 115 Q178 120 175 115 Q173 100 174 85 Z" fill="${hairColor}"/>`;
        } else {
            hairSVG = `<ellipse cx="150" cy="68" rx="28" ry="28" fill="${hairColor}"/><path d="M124 70 Q124 48 150 42 Q176 48 176 70 Q176 55 165 48 Q150 40 135 48 Q124 55 124 70" fill="${hairColor}"/>`;
        }
        faceSVG = `<ellipse cx="150" cy="82" rx="24" ry="28" fill="${skinTone}"/><ellipse cx="127" cy="82" rx="5" ry="7" fill="${skinTone}"/><ellipse cx="173" cy="82" rx="5" ry="7" fill="${skinTone}"/>`;
        eyesSVG = `<ellipse cx="141" cy="80" rx="5" ry="5.5" fill="#fff"/><ellipse cx="159" cy="80" rx="5" ry="5.5" fill="#fff"/><circle cx="141" cy="81" r="3" fill="#3d2314"/><circle cx="159" cy="81" r="3" fill="#3d2314"/><circle cx="140" cy="79.5" r="1.2" fill="#fff"/><circle cx="158" cy="79.5" r="1.2" fill="#fff"/><path d="M136 74 Q141 72 146 74" fill="none" stroke="${hairColor}" stroke-width="1.8" stroke-linecap="round"/><path d="M154 74 Q159 72 164 74" fill="none" stroke="${hairColor}" stroke-width="1.8" stroke-linecap="round"/>`;
        noseMouthSVG = `<path d="M148 87 Q150 90 152 87" fill="none" stroke="${skinShadow}" stroke-width="1" stroke-linecap="round"/><path d="M143 96 Q150 101 157 96" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/>`;
        neckSVG = `<rect x="143" y="105" width="14" height="12" rx="2" fill="${skinTone}"/>`;

        if (category === 'doctor-coats') {
            const sl = sleeve === 'half' ? 155 : 185;
            bodySVG = `<path d="M125 117 Q125 115 130 113 L170 113 Q175 115 175 117 L180 210 Q180 215 170 215 L130 215 Q120 215 120 210 Z" fill="#fff" stroke="#e0e7ed" stroke-width="0.5"/><path d="M140 113 L145 125 L150 118 L155 125 L160 113" fill="#fff" stroke="#e0e7ed" stroke-width="1"/><circle cx="150" cy="140" r="2.5" fill="#e0e7ed"/><circle cx="150" cy="155" r="2.5" fill="#e0e7ed"/><circle cx="150" cy="170" r="2.5" fill="#e0e7ed"/><path d="M125 117 L108 127 Q104 130 107 ${sl} L115 ${sl+2}" fill="#fff" stroke="#e0e7ed" stroke-width="0.5"/><path d="M175 117 L192 127 Q196 130 193 ${sl} L185 ${sl+2}" fill="#fff" stroke="#e0e7ed" stroke-width="0.5"/><ellipse cx="111" cy="${sl+5}" rx="6" ry="7" fill="${skinTone}"/><ellipse cx="189" cy="${sl+5}" rx="6" ry="7" fill="${skinTone}"/><path d="M145 120 Q140 130 138 150 Q136 165 140 170" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round"/><circle cx="140" cy="172" r="4" fill="#666" stroke="#444" stroke-width="1"/>`;
        } else if (category === 'scrub-suits') {
            const colors = ['#1a5276', '#1e8449', '#6c3483', '#922b21'];
            const c = colors[product.id % colors.length];
            bodySVG = `<path d="M127 117 Q127 115 132 113 L168 113 Q173 115 173 117 L175 178 L125 178 Z" fill="${c}"/><path d="M142 113 L150 130 L158 113" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/><path d="M127 117 L108 127 Q104 130 106 155 L114 157" fill="${c}"/><path d="M173 117 L192 127 Q196 130 194 155 L186 157" fill="${c}"/><ellipse cx="110" cy="160" rx="6" ry="7" fill="${skinTone}"/><ellipse cx="190" cy="160" rx="6" ry="7" fill="${skinTone}"/><path d="M128 178 L126 220 L142 220 L148 185 L152 185 L158 220 L174 220 L172 178 Z" fill="${c}" opacity="0.85"/>`;
        } else {
            const colors = ['#2980b9', '#8e44ad', '#27ae60', '#16a085'];
            const c = colors[product.id % colors.length];
            bodySVG = `<path d="M128 117 Q128 115 133 113 L167 113 Q172 115 172 117 L174 180 L126 180 Z" fill="${c}"/><path d="M128 117 L110 127 Q106 130 108 155 L116 157" fill="${c}"/><path d="M172 117 L190 127 Q194 130 192 155 L184 157" fill="${c}"/><ellipse cx="112" cy="160" rx="6" ry="7" fill="${skinTone}"/><ellipse cx="188" cy="160" rx="6" ry="7" fill="${skinTone}"/>${gender === 'female' ? `<path d="M126 180 L122 240 L178 240 L174 180 Z" fill="${c}" opacity="0.85"/>` : `<path d="M126 180 L124 240 L142 240 L148 185 L152 185 L158 240 L176 240 L174 180 Z" fill="#2c3e50"/>`}`;
        }
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 260"><defs><linearGradient id="bg${product.id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${bg[0]}"/><stop offset="100%" style="stop-color:${bg[1]}"/></linearGradient></defs><rect width="300" height="260" fill="url(#bg${product.id})" rx="12"/><g>${bodySVG}${neckSVG}${faceSVG}${eyesSVG}${noseMouthSVG}${hairSVG}</g></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ===== Product Data =====
// ===== Color Options Config =====
// Color options for order customization (no image change)
const colorOptions = {
    'doctor-uniform': [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Light Blue', hex: '#B3D9FF' },
        { name: 'Mint Green', hex: '#A8E6CF' },
        { name: 'Navy', hex: '#1A237E' },
        { name: 'Gray', hex: '#9E9E9E' },
    ],
    'staff-uniform': [
        { name: 'Blue', hex: '#2196F3' },
        { name: 'Green', hex: '#4CAF50' },
        { name: 'Pink', hex: '#E91E63' },
        { name: 'Maroon', hex: '#880E4F' },
        { name: 'Gray', hex: '#607D8B' },
        { name: 'Brown', hex: '#795548' },
    ],
    'bedsheets': [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Sky Blue', hex: '#4FC3F7' },
        { name: 'Forest Green', hex: '#388E3C' },
        { name: 'Navy Blue', hex: '#1A237E' },
        { name: 'Maroon', hex: '#880E4F' },
    ],
    'hospital-linen': [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Teal', hex: '#00897B' },
        { name: 'Royal Blue', hex: '#1565C0' },
        { name: 'Forest Green', hex: '#2E7D32' },
        { name: 'Charcoal', hex: '#424242' },
    ],
    'hotel-linen': [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Ivory', hex: '#F5E6CA' },
        { name: 'Sky Blue', hex: '#4FC3F7' },
        { name: 'Peach', hex: '#FFAB91' },
        { name: 'Sage Green', hex: '#81C784' },
    ],
    'scrub-suits': [
        { name: 'Ceil Blue', hex: '#6CA0DC' },
        { name: 'Hunter Green', hex: '#355E3B' },
        { name: 'Navy', hex: '#1A237E' },
        { name: 'Burgundy', hex: '#800020' },
        { name: 'Charcoal', hex: '#36454F' },
        { name: 'Pewter', hex: '#8BA7A7' },
        { name: 'Caribbean Blue', hex: '#00B5CC' },
        { name: 'Black', hex: '#1A1A1A' },
    ],
};

function getProductColors(product) {
    if (product.colorVariants && product.colorVariants.length > 0)
        return product.colorVariants.map(cv => ({ name: cv.name, hex: cv.hex }));
    return null;
}

function escapeRichText(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function applyInlineRichText(str) {
    let s = escapeRichText(str);
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__(.+?)__/g, '<u>$1</u>');
    s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
    return s;
}

function renderRichText(str) {
    const input = String(str || '').replace(/\r\n?/g, '\n');
    if (!input.trim()) return '';

    const lines = input.split('\n');
    const out = [];
    let inList = false;

    const closeList = () => {
        if (inList) {
            out.push('</ul>');
            inList = false;
        }
    };

    for (const line of lines) {
        const trimmed = line.trim();
        const bullet = trimmed.match(/^[-*•]\s+(.+)$/);
        if (bullet) {
            if (!inList) {
                out.push('<ul>');
                inList = true;
            }
            out.push('<li>' + applyInlineRichText(bullet[1]) + '</li>');
            continue;
        }

        closeList();
        if (!trimmed) {
            out.push('<br>');
        } else {
            out.push('<p>' + applyInlineRichText(line) + '</p>');
        }
    }
    closeList();
    return out.join('');
}

// Products are loaded exclusively from Supabase via _initProductSync below.
// No hardcoded fallback — Supabase is the single source of truth.
const productsData = [];
productsData.forEach(p => { if (!p.image) p.image = generateProductSVG(p); });

// Auto-assign a single colorVariant to existing local products (derived from image filename)
(function _initColorVariants() {
    const _cm = {
        'Male Full Sleeve.jpg':                  {name:'White',      hex:'#FFFFFF'},
        'Male Half Sleeve.jpg':                  {name:'White',      hex:'#FFFFFF'},
        'Female Full Sleeve.jpg':                {name:'White',      hex:'#FFFFFF'},
        'Female Half Sleeve.jpg':                {name:'White',      hex:'#FFFFFF'},
        'Male Uniform (Beige Style).jpg':        {name:'Beige',      hex:'#C8A882'},
        'Male Uniform (Blue Style).jpg':         {name:'Blue',       hex:'#1565C0'},
        'Male Uniform (Brown Style).jpg':        {name:'Brown',      hex:'#795548'},
        'Male Uniform (Gray Style).jpg':         {name:'Gray',       hex:'#607D8B'},
        'Male Uniform (Blue Ward Boy).jpg':      {name:'Blue',       hex:'#1565C0'},
        'Male Uniform (Gray Ward Boy).jpg':      {name:'Gray',       hex:'#607D8B'},
        'Male Uniform (Green Ward Boy).jpg':     {name:'Green',      hex:'#2E7D32'},
        'Female Uniform (Blue Style).jpg':       {name:'Blue',       hex:'#1565C0'},
        'Female Uniform (Blue Style 02).jpg':    {name:'Blue',       hex:'#1565C0'},
        'Female Uniform (Dark Pink).jpg':        {name:'Dark Pink',  hex:'#AD1457'},
        'Female Uniform (Green Color).jpg':      {name:'Green',      hex:'#2E7D32'},
        'Female Uniform (Pink Style).jpg':       {name:'Pink',       hex:'#E91E63'},
        'Female Uniform (Pink Style) (2).jpg':   {name:'Pink',       hex:'#E91E63'},
        'Female Uniform (Red Style).jpg':        {name:'Red',        hex:'#C62828'},
        'Striped Sheet.jpg':                     {name:'Blue & White',hex:'#B3D9FF'},
        'Hospital Towel.jpg':                    {name:'White',      hex:'#FFFFFF'},
        'Head cap and Mask.jpg':                 {name:'White',      hex:'#FFFFFF'},
        'Surgeon Apron.jpg':                     {name:'Green',      hex:'#2E7D32'},
        'Male Surgeon Apron.jpg':                {name:'Green',      hex:'#2E7D32'},
        'abdominal Sheet 9x9.jpg':               {name:'White',      hex:'#FFFFFF'},
        'Eye Pad.jpg':                           {name:'White',      hex:'#FFFFFF'},
        'Female Surgoen Apron.jpg':              {name:'Green',      hex:'#2E7D32'},
        'OT Nighty.jpg':                         {name:'White',      hex:'#FFFFFF'},
        'Stripped Bedspread and Pillow Cover.jpg':{name:'Blue Stripe',hex:'#B3D9FF'},
    };
    productsData.forEach(p => {
        if (!p.colorVariants && p.image && !p.image.startsWith('data:') && !p.image.startsWith('blob:')) {
            const imgFile = p.image.split('/').pop();
            const cv = _cm[imgFile];
            if (cv) p.colorVariants = [{ ...cv, images: [p.image] }];
        }
    });
})();

// ===== Category System (admin-managed, synced to frontend) =====
// The category list is the single source of truth for the shop filter chips and
// the admin product-category dropdown. Admin edits write to settings/categories;
// the public site renders chips from this list (cached in localStorage, refreshed
// from Supabase on load). `signature` flags the CliniFlex-style highlighted chip.
const DEFAULT_CATEGORIES = [
    { slug: 'scrub-suits',     label: 'CliniFlex\u2122 Scrubs', signature: true },
    { slug: 'doctor-uniform',  label: 'Doctor Uniform',  signature: false },
    { slug: 'staff-uniform',   label: 'Staff Uniform',   signature: false },
    { slug: 'bedsheets',       label: 'Bedsheets',       signature: false },
    { slug: 'hospital-linen',  label: 'Hospital Linen',  signature: false },
    { slug: 'hotel-linen',     label: 'Hotel Linen',     signature: false },
];
const _CATS_CACHE_KEY = 'ssa_categories_v1';

function getCategoryList() {
    try {
        const raw = localStorage.getItem(_CATS_CACHE_KEY);
        if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list) && list.length) return list;
        }
    } catch (e) { /* ignore */ }
    return DEFAULT_CATEGORIES.slice();
}
window.getCategoryList = getCategoryList;

function getCategoryLabel(slug) {
    try {
        const tax = getTaxonomy();
        for (const h of tax) { if (h.slug === slug) return h.label; }
        for (const h of tax) { for (const c of (h.cats || [])) { if (c.slug === slug) return c.label; } }
        for (const h of tax) { if (_headingCatSet(h).has(slug)) return h.label; }
    } catch (e) { /* ignore */ }
    const c = getCategoryList().find(c => c.slug === slug);
    if (c) return c.label;
    return String(slug || '').replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
}
window.getCategoryLabel = getCategoryLabel;

// Sub-categories live inside each category as an optional `subs` array
// [{ slug, label, image }]. Products map to one via their `subCategory` slug.
function getSubCategories(catSlug) {
    const tax = getTaxonomy();
    const norm = String(catSlug || '').trim();
    if (norm) {
        for (const heading of tax) {
            for (const cat of (heading && heading.cats) || []) {
                const resolved = _resolveCatFilter(cat);
                if (cat.slug === norm || resolved.cat === norm) {
                    return (Array.isArray(cat.subs) ? cat.subs : []).filter(s => s && s.slug);
                }
            }
        }
    }
    const c = getCategoryList().find(item => item.slug === catSlug);
    return (c && Array.isArray(c.subs)) ? c.subs.filter(s => s && s.slug) : [];
}
window.getSubCategories = getSubCategories;

function getSubCategoryLabel(catSlug, subSlug) {
    const s = getSubCategories(catSlug).find(s => s.slug === subSlug);
    if (s) return s.label || s.slug;
    return String(subSlug || '').replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
}
window.getSubCategoryLabel = getSubCategoryLabel;

function _productMatchesSubFilter(product, subSlug) {
    const sub = String(subSlug || '').trim().toLowerCase();
    if (!sub) return true;
    const productSub = String(product?.subCategory || '').trim().toLowerCase();
    if (productSub && productSub === sub) return true;
    // Also match when stored value is the human-readable label (not yet slugified)
    const subNorm = sub.replace(/-/g, ' ');
    if (productSub && productSub.replace(/-/g, ' ') === subNorm) return true;
    const name = String(product?.name || '').trim().toLowerCase();
    const fallbackTerms = {
        sheets: ['bedsheet', 'sheet'],
        'pillow-accessories': ['pillow', 'pillow cover', 'pillow covers', 'pillow set'],
        // "sheets-and-pillow-accessories" covers both sheets and pillow products
        'sheets-and-pillow-accessories': ['bedsheet', 'sheet', 'pillow'],
        bedspreads: ['bedspread', 'bed spread'],
        'abdominal': ['abdominal']
    };
    return (fallbackTerms[sub] || []).some(term => name.includes(term));
}

// Build the shop filter chips on categories.html from the taxonomy headings.
function _activeHeadingSlug() {
    const f = window._currentFilter || currentFilter || 'all';
    if (f === 'all') return 'all';
    const tax = getTaxonomy();
    if (tax.some(h => h.slug === f)) return f;
    for (const h of tax) { if (_headingCatSet(h).has(f)) return h.slug; }
    return f;
}
window._activeHeadingSlug = _activeHeadingSlug;

function renderShopFilters() {
    const bar = document.getElementById('shopFilters');
    if (!bar) return;
    const tax = getTaxonomy();
    const activeH = _activeHeadingSlug();
    let html = `<button class="filter-btn${activeH === 'all' ? ' active' : ''}" data-filter="all">All Products</button>`;
    for (const h of tax) {
        const isSig = !!h.signature;
        const cls = 'filter-btn' + (isSig ? ' filter-btn-scrubs' : '') + (activeH === h.slug ? ' active' : '');
        const label = escapeRichText(h.label) + _headingSymbolStr(h);
        html += `<button class="${cls}" data-filter="${escapeRichText(h.slug)}">`
             + (isSig ? `<i class="fas fa-star"></i> ${label} <span class="scrubs-pill">Signature</span>` : label)
             + `</button>`;
    }
    bar.innerHTML = html;
    if (typeof bindFilterButtons === 'function') bindFilterButtons();
    if (typeof renderSubFilters === 'function') renderSubFilters(activeH);
}
window.renderShopFilters = renderShopFilters;

// Secondary chip row: the active heading's Main Categories only (no sub-categories).
// Each applies its resolved product filter.
function renderSubFilters(activeHeadingSlug) {
    const bar = document.getElementById('shopFilters');
    if (!bar) return;
    let row = document.getElementById('shopSubFilters');
    const tax = getTaxonomy();
    const heading = (activeHeadingSlug && activeHeadingSlug !== 'all') ? tax.find(h => h.slug === activeHeadingSlug) : null;
    const cats = heading ? (heading.cats || []) : [];
    if (!cats.length) { if (row) row.remove(); return; }
    if (!row) { row = document.createElement('div'); row.id = 'shopSubFilters'; row.className = 'shop-subfilters'; (bar.closest('.shop-toolbar') || bar).insertAdjacentElement('afterend', row); }
    const curCat = window._currentFilter || currentFilter || '';
    const curG = window._currentGender || '', curS = window._currentSleeve || '', curSub = window._currentSub || '';
    const isActive = (r) => curCat === r.cat && curG === (r.gender || '') && curS === (r.sleeve || '') && curSub === (r.sub || '');
    const allActive = curCat === activeHeadingSlug && !curG && !curS && !curSub;
    let html = `<button class="subfilter-btn${allActive ? ' active' : ''}" data-filter="${escapeRichText(activeHeadingSlug)}" data-gender="" data-sleeve="" data-sub="">All ${escapeRichText(heading.label)}</button>`;
    for (const c of cats) {
        const r = _resolveCatFilter(c);
        html += `<button class="subfilter-btn${isActive(r) ? ' active' : ''}" data-filter="${escapeRichText(r.cat)}" data-gender="${escapeRichText(r.gender)}" data-sleeve="${escapeRichText(r.sleeve)}" data-sub="">${escapeRichText(c.label)}</button>`;
        // NOTE: Sub-categories are NOT shown here; users filter by Main Category only
    }
    row.innerHTML = html;
    row.querySelectorAll('.subfilter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const f = btn.dataset.filter || 'all';
            const g = btn.dataset.gender || null, sl = btn.dataset.sleeve || null, sub = btn.dataset.sub || null;
            currentFilter = f; window._currentFilter = f;
            window._currentGender = g; window._currentSleeve = sl; window._currentSub = sub;
            displayedProducts = 12;
            try {
                const url = new URL(window.location.href);
                ['gender', 'sleeve', 'sub', 'heading'].forEach(k => url.searchParams.delete(k));
                url.searchParams.set('cat', f);
                if (g) url.searchParams.set('gender', g);
                if (sl) url.searchParams.set('sleeve', sl);
                if (sub) url.searchParams.set('sub', sub);
                history.replaceState({}, '', url);
            } catch (e) { /* ignore */ }
            row.querySelectorAll('.subfilter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            _syncWindowState();
            renderProducts(f, displayedProducts, g, sl, currentSearch, sub);
        });
    });
}
window.renderSubFilters = renderSubFilters;

// The nav mega-menu / CliniFlex dropdown are authored in HTML with fixed group
// columns. Admin-added categories carry a `group` (the data-cat of the column they
// belong under) so we can inject them into the site navigation in the right place.
// Built-in slugs are already present in the HTML and must not be duplicated.
const DEFAULT_CATEGORY_SLUGS = new Set(['scrub-suits', 'doctor-uniform', 'staff-uniform', 'bedsheets', 'hospital-linen', 'hotel-linen']);

function initCustomCategoryNav() {
    // The header nav is now fully generated from the taxonomy (see renderMegaMenu),
    // so the legacy injection is no longer needed.
    return;
}
window.initCustomCategoryNav = initCustomCategoryNav;

// ===== Editable Mega Menu (main / sub category headings) =====
// The nav "Categories" mega-menu is data-driven: columns → items (optionally bold
// main headings) → children (sub-items). Admin edits are stored in Supabase
// settings/megamenu (JSON in `name`) + localStorage, and rendered on every page.
const _MEGA_CACHE_KEY = 'ssa_megamenu_v1';
const DEFAULT_MEGA_MENU = [
    { title: 'Doctor Uniform', cat: 'doctor-uniform', icon: 'user-md', items: [
        { label: 'Male Doctor Uniform', bold: true, cat: 'doctor-uniform', gender: 'male', children: [
            { label: 'Full Sleeve', cat: 'doctor-uniform', gender: 'male', sleeve: 'full' },
            { label: 'Half Sleeve', cat: 'doctor-uniform', gender: 'male', sleeve: 'half' },
        ] },
        { label: 'Female Doctor Uniform', bold: true, cat: 'doctor-uniform', gender: 'female', children: [
            { label: 'Full Sleeve', cat: 'doctor-uniform', gender: 'female', sleeve: 'full' },
            { label: 'Half Sleeve', cat: 'doctor-uniform', gender: 'female', sleeve: 'half' },
        ] },
    ] },
    { title: 'Staff Uniform', cat: 'staff-uniform', icon: 'tshirt', items: [
        { label: 'Male Staff Uniform', bold: false, cat: 'staff-uniform', gender: 'male', children: [] },
        { label: 'Female Staff Uniform', bold: false, cat: 'staff-uniform', gender: 'female', children: [] },
        { label: 'All Staff Uniforms', bold: false, cat: 'staff-uniform', children: [] },
    ] },
    { title: 'Linen & Bedsheets', cat: 'hospital-linen', icon: 'bed', items: [
        { label: 'Bedsheets & Pillow Covers', bold: false, cat: 'bedsheets', children: [] },
        { label: 'Hospital Linen', bold: true, cat: 'hospital-linen', children: [
            { label: 'Surgeon Aprons', cat: 'hospital-linen' },
            { label: 'OT Accessories', cat: 'hospital-linen' },
            { label: 'Patient Wear', cat: 'hospital-linen' },
        ] },
        { label: 'Hotel Linen', bold: true, cat: 'hotel-linen', children: [] },
    ] },
];

// ===== Taxonomy: 3-level tree (Main Heading → Main Category → Sub Category) =====
// Stored in Supabase settings/taxonomy (JSON in `name`) + localStorage. Each Main
// Category / Sub Category node may carry a product-filter map {cat,gender,sleeve,sub}.
// When the map is absent, it defaults to the node's own slug — so brand-new nodes
// the admin creates map products by their own slug automatically.
const _TAX_CACHE_KEY = 'ssa_taxonomy_v1';
const DEFAULT_TAXONOMY = [
    { slug: 'doctor-uniform', label: 'Doctor Uniform', icon: 'user-md', cats: [
        { slug: 'male-doctor-uniform', label: 'Male Doctor Uniform', image: '', map: { cat: 'doctor-uniform', gender: 'male' }, subs: [
            { slug: 'male-doctor-full', label: 'Full Sleeve', image: '', map: { cat: 'doctor-uniform', gender: 'male', sleeve: 'full' } },
            { slug: 'male-doctor-half', label: 'Half Sleeve', image: '', map: { cat: 'doctor-uniform', gender: 'male', sleeve: 'half' } },
        ] },
        { slug: 'female-doctor-uniform', label: 'Female Doctor Uniform', image: '', map: { cat: 'doctor-uniform', gender: 'female' }, subs: [
            { slug: 'female-doctor-full', label: 'Full Sleeve', image: '', map: { cat: 'doctor-uniform', gender: 'female', sleeve: 'full' } },
            { slug: 'female-doctor-half', label: 'Half Sleeve', image: '', map: { cat: 'doctor-uniform', gender: 'female', sleeve: 'half' } },
        ] },
    ] },
    { slug: 'staff-uniform', label: 'Staff Uniform', icon: 'tshirt', cats: [
        { slug: 'male-staff-uniform', label: 'Male Staff Uniform', image: '', map: { cat: 'staff-uniform', gender: 'male' }, subs: [] },
        { slug: 'female-staff-uniform', label: 'Female Staff Uniform', image: '', map: { cat: 'staff-uniform', gender: 'female' }, subs: [] },
    ] },
    { slug: 'linen-bedsheets', label: 'Linen & Bedsheets', icon: 'bed', cats: [
        { slug: 'bedsheets', label: 'Bedsheets & Pillow Covers', image: '', map: { cat: 'bedsheets' }, subs: [
            { slug: 'sheets', label: 'Sheets', image: '', map: { cat: 'bedsheets', sub: 'sheets' } },
            { slug: 'pillow-accessories', label: 'Pillow Accessories', image: '', map: { cat: 'bedsheets', sub: 'pillow-accessories' } },
        ] },
        { slug: 'hospital-linen', label: 'Hospital Linen', image: '', map: { cat: 'hospital-linen' }, subs: [] },
        { slug: 'hotel-linen', label: 'Hotel Linen', image: '', map: { cat: 'hotel-linen' }, subs: [] },
    ] },
    { slug: 'scrub-suits', label: 'CliniFlex\u2122 Scrubs', icon: 'award', signature: true, cats: [
        { slug: 'gents-scrubs', label: 'Gents Scrub Suits', image: '', map: { cat: 'scrub-suits', gender: 'male' }, subs: [] },
        { slug: 'ladies-scrubs', label: 'Ladies Scrub Suits', image: '', map: { cat: 'scrub-suits', gender: 'female' }, subs: [] },
        { slug: 'all-scrubs', label: 'All Scrub Suits', image: '', map: { cat: 'scrub-suits' }, subs: [] },
    ] },
];

// Return the HTML symbol string for a taxonomy heading based on its `symbol` field.
// symbol: 'tm' → ™  |  symbol: 'r' → ®  |  anything else → ''
function _headingSymbolStr(heading) {
    if (!heading) return '';
    const sym = heading.symbol || '';
    if (sym === 'tm') return '<sup style="font-size:0.55em;vertical-align:super">&trade;</sup>';
    if (sym === 'r')  return '<sup style="font-size:0.55em;vertical-align:super">&reg;</sup>';
    return '';
}
window._headingSymbolStr = _headingSymbolStr;

function getTaxonomy() {
    try {
        const raw = localStorage.getItem(_TAX_CACHE_KEY);
        if (raw) {
            const t = JSON.parse(raw);
            if (Array.isArray(t) && t.length) {
                // Use STORED taxonomy ONLY — no hardcoded defaults.
                // Admin controls everything; frontend shows only what admin configured.
                return t.map(storedH => {
                    if (!storedH || !storedH.slug) return null;
                    const storedCats = Array.isArray(storedH.cats) ? storedH.cats : [];
                    const cats = storedCats.map(storedC => {
                        if (!storedC || !storedC.slug) return null;
                        // Use ONLY stored subcategories — no defaults
                        const storedSubs = Array.isArray(storedC.subs) ? storedC.subs : [];
                        return { ...storedC, subs: storedSubs };
                    }).filter(Boolean);
                    return { ...storedH, cats };
                }).filter(Boolean);
            }
        }
    } catch (e) { /* ignore */ }
    return DEFAULT_TAXONOMY;
}
window.getTaxonomy = getTaxonomy;

// Resolve the product-filter for a Main Category / Sub Category node.
function _resolveCatFilter(cat) {
    const m = (cat && cat.map) || {};
    return { cat: m.cat || cat.slug, gender: m.gender || '', sleeve: m.sleeve || '', sub: '' };
}
function _resolveSubFilter(cat, sub) {
    const cm = (cat && cat.map) || {}, sm = (sub && sub.map) || {};
    return {
        cat: sm.cat || cm.cat || cat.slug,
        gender: sm.gender || cm.gender || '',
        sleeve: sm.sleeve || cm.sleeve || '',
        sub: sm.sub || ((sm.gender || sm.sleeve) ? '' : sub.slug)
    };
}
function _filterHref(r, opts = {}) {
    const includeGender = opts.includeGender !== false;
    const includeSleeve = opts.includeSleeve !== false;
    const includeSub = opts.includeSub !== false;
    let u = 'categories.html?cat=' + encodeURIComponent(r.cat);
    if (includeGender && r.gender) u += '&gender=' + encodeURIComponent(r.gender);
    if (includeSleeve && r.sleeve) u += '&sleeve=' + encodeURIComponent(r.sleeve);
    if (includeSub && r.sub) u += '&sub=' + encodeURIComponent(r.sub);
    return u;
}
window._resolveCatFilter = _resolveCatFilter;
window._resolveSubFilter = _resolveSubFilter;
window._filterHref = _filterHref;

// The set of product-category slugs that belong to a heading (to filter a whole heading).
function _headingCatSet(heading) {
    const s = new Set();
    (heading && heading.cats || []).forEach(c => s.add(_resolveCatFilter(c).cat));
    return s;
}
window._headingCatSet = _headingCatSet;

// Build the header mega-menu from the taxonomy: heading → column, main category →
// bold item, sub category → child link. Signature headings (CliniFlex) use their
// own dropdown and are excluded here.
function _buildMenuFromTaxonomy() {
    const tax = getTaxonomy();
    if (!Array.isArray(tax) || !tax.length) return null;
    const iconFor = { 'doctor-uniform': 'user-md', 'staff-uniform': 'tshirt', 'linen-bedsheets': 'bed', 'hospital-linen': 'bed' };
    // The first signature heading owns the dedicated CliniFlex dropdown, so it's not
    // shown as a column. Any OTHER signature headings appear as highlighted columns.
    const firstSig = tax.find(h => h && h.signature);
    return tax.filter(h => h && h.slug && h !== firstSig).map(h => {
        const catSlugs = Array.from(_headingCatSet(h)).filter(Boolean);
        return {
            title: h.label, symbol: h.symbol || '', icon: h.icon || iconFor[h.slug] || 'th-large',
            href: 'categories.html?heading=' + encodeURIComponent(h.slug),
            cat: catSlugs[0] || '',
            cats: catSlugs,
            signature: !!h.signature,
            items: (h.cats || []).map(cat => ({
                label: cat.label, bold: true, href: _filterHref(_resolveCatFilter(cat)),
                children: (cat.subs || []).map(sub => ({ label: sub.label, href: _filterHref(_resolveSubFilter(cat, sub)) }))
            }))
        };
    });
}
window._buildMenuFromTaxonomy = _buildMenuFromTaxonomy;

function getMegaMenu() {
    try {
        const built = _buildMenuFromTaxonomy();
        if (built && built.length) return built;
    } catch (e) { /* ignore */ }
    return DEFAULT_MEGA_MENU;
}
window.getMegaMenu = getMegaMenu;

function _megaHref(o) {
    if (o && o.href) return o.href;
    // No category chosen → give the heading its own URL from its label (so a
    // standalone heading like "New Product" links to ?cat=new-product and shows
    // an empty state instead of borrowing the column's products).
    if (o && !o.cat && o.label) {
        const slug = String(o.label).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        if (slug) return 'categories.html?cat=' + encodeURIComponent(slug);
    }
    if (!o || !o.cat) return 'categories.html';
    let u = 'categories.html?cat=' + encodeURIComponent(o.cat);
    if (o.gender) u += '&gender=' + encodeURIComponent(o.gender);
    if (o.sleeve) u += '&sleeve=' + encodeURIComponent(o.sleeve);
    if (o.sub) u += '&sub=' + encodeURIComponent(o.sub);
    return u;
}

// Rebuild every .mega-menu-inner from the stored structure (desktop + mobile share
// the same DOM). The promo CTA column is preserved.
function renderMegaMenu() {
    let menu;
    try { menu = getMegaMenu(); } catch (e) { return; }
    if (!Array.isArray(menu) || !menu.length) return;
    const inners = document.querySelectorAll('.mega-menu-inner');
    if (!inners.length) return;
    const esc = (typeof escapeRichText === 'function') ? escapeRichText : (s => String(s == null ? '' : s));
    const visibleCols = menu.filter(col => (col.items || []).length > 0);
    const colCount = visibleCols.length;
    const colsHtml = visibleCols.map(col => {
        const items = (col.items || []).map(it => {
            const kids = (it.children || []).map(ch => `<li class="mega-sub-item"><a href="${_megaHref(ch)}">${esc(ch.label)}</a></li>`).join('');
            const cls = it.bold ? ' class="mega-main-item"' : '';
            return `<li><a href="${_megaHref(it)}"${cls}>${esc(it.label)}</a></li>` + kids;
        }).join('');
        const sym = col.symbol === 'tm' ? '<sup style="font-size:0.6em;vertical-align:super">™</sup>' : col.symbol === 'r' ? '<sup style="font-size:0.6em;vertical-align:super">®</sup>' : '';
        return `<div class="mega-col${col.signature ? ' mega-col-signature' : ''}"><a href="${_megaHref(col)}" class="mega-col-thumb" data-cat="${esc(col.cat || '')}" data-cats="${esc((col.cats || []).join(','))}"><i class="fas fa-${esc(col.signature ? 'award' : (col.icon || 'th-large'))}"></i></a><h4><a href="${_megaHref(col)}">${esc(col.title)}${sym}${col.signature ? ' <span class="mega-sig-pill"><i class=\"fas fa-star\"></i> Signature</span>' : ''}</a></h4><ul>${items}</ul></div>`;
    }).join('');
    inners.forEach(inner => {
        const cta = inner.querySelector('.mega-cta');
        inner.innerHTML = colsHtml + (cta ? cta.outerHTML : '');
        // Set explicit column count — auto-fit/auto-fill can't collapse properly when
        // a child has grid-column:1/-1 (the CTA bar). Explicit count always fills correctly.
        if (colCount > 0) inner.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;
    });
    if (typeof initMegaMenuImages === 'function') initMegaMenuImages();
    if (typeof renderSignatureNav === 'function') renderSignatureNav();
}
window.renderMegaMenu = renderMegaMenu;

// Populate the dedicated highlighted CliniFlex-style dropdown from the (first)
// signature Main Heading in the taxonomy. Signature headings are shown here rather
// than as a normal mega-menu column, so they stand out as premium collections.
function renderSignatureNav() {
    let sig;
    try { sig = getTaxonomy().find(h => h && h.signature); } catch (e) { return; }
    if (!sig) return;
    document.querySelectorAll('.cliniflex-dropdown').forEach(dd => {
        // Keep the hero anchor + badge; replace all other generated/static links.
        Array.from(dd.children).forEach(ch => {
            if (ch.tagName === 'A' && !ch.classList.contains('cliniflex-dd-hero')) ch.remove();
        });
        (sig.cats || []).forEach(cat => {
            const a = document.createElement('a');
            a.href = _filterHref(_resolveCatFilter(cat));
            a.setAttribute('data-sig-link', '1');
            a.textContent = cat.label;
            dd.appendChild(a);
        });
    });
}
window.renderSignatureNav = renderSignatureNav;

// Load the mega-menu structure from Supabase (settings/megamenu) and re-render.
(function _initTaxonomySync() {
    function _parse(d) {
        if (!d) return null;
        if (Array.isArray(d.list) && d.list.length) return d.list;
        if (typeof d.name === 'string' && d.name.trim().startsWith('[')) {
            try { const a = JSON.parse(d.name); if (Array.isArray(a) && a.length) return a; } catch (e) { /* ignore */ }
        }
        return null;
    }
    async function _sync() {
        for (let i = 0; i < 80; i++) { if (window.db) break; await new Promise(r => setTimeout(r, 50)); }
        if (!window.db) return;
        try {
            const doc = await window.db.collection('settings').doc('taxonomy').get();
            if (doc && doc.exists) {
                const list = _parse(doc.data());
                if (list && list.length) {
                    const next = JSON.stringify(list);
                    if (localStorage.getItem(_TAX_CACHE_KEY) !== next) {
                        localStorage.setItem(_TAX_CACHE_KEY, next);
                    }
                    if (typeof renderMegaMenu === 'function') renderMegaMenu();
                    if (typeof renderShopFilters === 'function') renderShopFilters();
                    if (typeof applyUrlFilterAndRender === 'function' && document.body && document.body.dataset.page === 'categories') applyUrlFilterAndRender();
                }
            }
        } catch (e) { /* offline / not set — keep default */ }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _sync);
    else _sync();
})();


// ===== Product tile image hover auto-scroll =====
// On mouse hover over a product tile, cycle through that product's images one by
// one (no click needed). Single-image tiles stay static. Uses event delegation so
// it keeps working after the grid re-renders.
let _hoverCycleTimer = null;
let _hoverCycleCard = null;
function _startCardCycle(card) {
    const imgs = window._cardHoverImgs && window._cardHoverImgs[card.dataset.id];
    if (!imgs || imgs.length < 2) return;
    const imgEl = card.querySelector('.shop-card-image img');
    if (!imgEl) return;
    const dots = card.querySelectorAll('.card-img-dots i');
    let idx = 0;
    _hoverCycleCard = card;
    _hoverCycleTimer = setInterval(() => {
        idx = (idx + 1) % imgs.length;
        imgEl.src = imgs[idx];
        dots.forEach((d, i) => d.classList.toggle('on', i === idx));
    }, 850);
}
function _stopCardCycle() {
    if (_hoverCycleTimer) { clearInterval(_hoverCycleTimer); _hoverCycleTimer = null; }
    if (_hoverCycleCard) {
        const imgs = window._cardHoverImgs && window._cardHoverImgs[_hoverCycleCard.dataset.id];
        const imgEl = _hoverCycleCard.querySelector('.shop-card-image img');
        if (imgEl && imgs && imgs[0]) imgEl.src = imgs[0];
        _hoverCycleCard.querySelectorAll('.card-img-dots i').forEach((d, i) => d.classList.toggle('on', i === 0));
        _hoverCycleCard = null;
    }
}
function initCardHoverCycle() {
    if (window._cardHoverBound) return;
    window._cardHoverBound = true;
    document.addEventListener('mouseover', e => {
        const card = e.target.closest && e.target.closest('.shop-card');
        if (card && card !== _hoverCycleCard) { _stopCardCycle(); _startCardCycle(card); }
    });
    document.addEventListener('mouseout', e => {
        const card = e.target.closest && e.target.closest('.shop-card');
        const to = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.shop-card');
        if (card && to !== card) _stopCardCycle();
    });
}
window.initCardHoverCycle = initCardHoverCycle;

// Load categories from Supabase settings/categories and refresh chips if changed.
(function _initCategorySync() {
    // The live settings table has no jsonb `list` column, so the category list is
    // stored as JSON in the `name` text column. Support both shapes.
    function _parseDoc(d) {
        if (!d) return null;
        if (Array.isArray(d.list) && d.list.length) return d.list.filter(c => c && c.slug);
        if (typeof d.name === 'string' && d.name.trim().startsWith('[')) {
            try { const a = JSON.parse(d.name); if (Array.isArray(a)) return a.filter(c => c && c.slug); } catch (e) { /* ignore */ }
        }
        return null;
    }
    async function _sync() {
        for (let i = 0; i < 80; i++) { if (window.db) break; await new Promise(r => setTimeout(r, 50)); }
        if (!window.db) return;
        try {
            const doc = await window.db.collection('settings').doc('categories').get();
            if (doc && doc.exists) {
                const list = _parseDoc(doc.data());
                if (list && list.length) {
                    const normalized = list.map(c => ({ slug: c.slug, label: c.label || c.slug, signature: !!c.signature, group: c.group || '', subs: Array.isArray(c.subs) ? c.subs.filter(s => s && s.slug).map(s => ({ slug: s.slug, label: s.label || s.slug, image: s.image || '', gender: s.gender || '', sleeve: s.sleeve || '' })) : [] }));
                    const prev = localStorage.getItem(_CATS_CACHE_KEY);
                    const next = JSON.stringify(normalized);
                    if (prev !== next) {
                        localStorage.setItem(_CATS_CACHE_KEY, next);
                        if (typeof renderShopFilters === 'function') renderShopFilters();
                        if (typeof renderMegaMenu === 'function') renderMegaMenu();
                        if (typeof initCustomCategoryNav === 'function') initCustomCategoryNav();
                    }
                }
            }
        } catch (e) { /* offline / not set — keep defaults */ }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _sync);
    else _sync();
})();

// ===== Supabase Products Sync =====
// Loads products from Supabase once per session and merges admin-set images/prices.
// sessionStorage cache (10 min TTL) prevents repeated reads.
(function _initProductSync() {
    const CACHE_KEY = '_ssa_fs_products_v3'; // bumped to force cache bust after removing hardcoded fallback
    const TTL = 2 * 60 * 60 * 1000; // 2 hours (admin saves bust cache via _ssa_products_dirty flag)
    // Persist across sessions so returning visitors see the correct (admin-set)
    // images on first paint instead of the local defaults for a few seconds.
    const _store = window.localStorage;

    function _merge(fpList) {
        if (!fpList || !fpList.length) return false;
        let changed = false;
        const visibleFpList = (window.ssaProductHelpers?.getVisibleProducts || ((list) => list || []) )(fpList);
        for (const fp of visibleFpList) {
            if (!fp.name) continue;
            const local = productsData.find(p => p.name === fp.name);
            if (local) {
                // Overlay admin-editable fields (image, price, badge, description, colorVariants, sizes, gender, sleeve, fitSizing, fabricCare, returns)
                for (const f of ['image', 'mainImage', 'price', 'oldPrice', 'badge', 'description', 'colorVariants', 'sizes', 'gender', 'sleeve', 'subCategory', 'fitSizing', 'fabricCare', 'returns', 'sizePrices', 'embroideryEnabled', 'embroideryPrices', 'embroideryPrice']) {
                    const val = fp[f];
                    if (val !== undefined && val !== null && val !== '' && val !== local[f]) {
                        local[f] = val;
                        changed = true;
                    }
                }
            } else {
                // Brand-new product added via admin panel
                const newP = {
                    id: 10000 + productsData.length,
                    name: fp.name,
                    category: fp.category || 'hospital-linen',
                    price: fp.price || 0,
                    oldPrice: fp.oldPrice || null,
                    gender: fp.gender || null,
                    sleeve: fp.sleeve || null,
                    subCategory: fp.subCategory || null,
                    sizes: fp.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
                    description: fp.description || '',
                    image: fp.image || '',
                    mainImage: fp.mainImage || null,
                    badge: fp.badge || '',
                    colorVariants: fp.colorVariants || [],
                    fitSizing: fp.fitSizing || '',
                    fabricCare: fp.fabricCare || '',
                    returns: fp.returns || '',
                    sizePrices: fp.sizePrices || {},
                    embroideryEnabled: (fp.embroideryEnabled !== undefined && fp.embroideryEnabled !== null) ? fp.embroideryEnabled : (fp.category === 'scrub-suits'),
                    embroideryPrices: fp.embroideryPrices || null,
                    embroideryPrice: (fp.embroideryPrice !== undefined && fp.embroideryPrice !== null) ? fp.embroideryPrice : null,
                    rating: fp.rating ?? 4.5, reviews: fp.reviews ?? 0,
                    _fromSupabase: true
                };
                if (!newP.image) newP.image = generateProductSVG(newP);
                productsData.push(newP);
                changed = true;
            }
        }
        return changed;
    }

    // Remove local/default products that were deleted from Supabase.
    // Once Supabase has products (admin seeds the full catalogue), it becomes the
    // single source of truth — anything not present there is treated as deleted.
    function _reconcile(fpList) {
        if (!fpList || !fpList.length) return false;
        const visibleFpList = (window.ssaProductHelpers?.getVisibleProducts || ((list) => list || []) )(fpList);
        const valid = new Set(visibleFpList.map(fp => (fp.name || '').trim()).filter(Boolean));
        let changed = false;
        for (let i = productsData.length - 1; i >= 0; i--) {
            if (!valid.has((productsData[i].name || '').trim())) {
                productsData.splice(i, 1);
                changed = true;
            }
        }
        return changed;
    }

    function _rerender() {
        const page = document.body && document.body.dataset.page;
        // Mega menu exists on every page — refresh its admin-image thumbnails on any product update
        if (typeof initMegaMenuImages === 'function') initMegaMenuImages();
        if (page === 'categories') {
            // Read active filter button from DOM; fall back to URL param (fixes race before initCategoriesPage runs)
            const activeBtn = document.querySelector('.filter-btn.active');
            const urlCat = new URLSearchParams(window.location.search).get('cat');
            // Priority: explicit user/app state first, then URL param, then the active
            // button (which defaults to "all" in HTML before initCategoriesPage runs).
            // This prevents a flash of ALL products before the category filter applies.
            const _f = window._currentFilter || urlCat || activeBtn?.dataset?.filter || 'all';
            const _c  = window._currentCount   || 12;
            const _g  = window._currentGender  || new URLSearchParams(window.location.search).get('gender') || null;
            const _s  = window._currentSleeve  || new URLSearchParams(window.location.search).get('sleeve') || null;
            const _sub = window._currentSub || new URLSearchParams(window.location.search).get('sub') || null;
            const _q  = window._currentSearch  || '';
            if (typeof renderProducts === 'function') renderProducts(_f, _c, _g, _s, _q, _sub);
            if (typeof updateScrubsCount === 'function') updateScrubsCount();
        } else if (page === 'home') {
            const grid = document.getElementById('shopGrid') || document.getElementById('featuredGrid');
            if (grid && typeof buildProductCard === 'function') {
                const featured = productsData.filter(p => p.badge);
                grid.innerHTML = featured.slice(0, 8).map(p => buildProductCard(p)).join('');
            }
            // Refresh tile scroll pools and hero images with newly loaded product data
            if (typeof initCategoryTileScroll === 'function') initCategoryTileScroll();
            if (typeof initHeroDynamicImages === 'function') initHeroDynamicImages();
        }
    }

    async function _sync() {
        const dirty = localStorage.getItem('_ssa_products_dirty');

        // 1. Cache check — always render stale cache instantly (zero-flash UX),
        // only skip the Supabase fetch if cache is fresh AND admin hasn't saved since it was built
        try {
            const raw = _store.getItem(CACHE_KEY);
            if (raw) {
                const { data, exp, savedAt } = JSON.parse(raw);
                if (data) {
                    // instant display from cache (even if stale) — merge overlays + reconcile removals
                    const _m = _merge(data);
                    const _r = _reconcile(data);
                    if (_m || _r) _rerender();
                }
                const adminSavedSinceCache = dirty && (!savedAt || Number(dirty) > Number(savedAt));
                if (!adminSavedSinceCache && Date.now() < exp) return; // cache fresh & clean — done
            }
        } catch (e) { /* ignore quota/parse errors */ }

        // 2. Wait for DB (max 4 s) then fetch fresh data in background
        for (let i = 0; i < 80; i++) {
            if (window.db) break;
            await new Promise(r => setTimeout(r, 50));
        }
        if (!window.db) return;

        // 3. Fetch from Supabase and update if anything changed
        try {
            const snap = await window.db.collection('products').get();
            const data = snap.docs.map(d => ({ ...d.data(), _docId: d.id }));
            try {
                _store.setItem(CACHE_KEY, JSON.stringify({ data, exp: Date.now() + TTL, savedAt: Date.now() }));
            } catch (e) { /* storage full */ }
            const _m = _merge(data);
            const _r = _reconcile(data);
            if (_m || _r) _rerender();
        } catch (e) {
            console.warn('[products-sync] Supabase unavailable, using local data only.');
        }
    }

    // Start immediately — no artificial delay (db wait loop handles readiness)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => _sync());
    } else {
        _sync();
    }
})();

// ===== Scrub Brand Name — Real-time Supabase sync (cross-device updates) =====
(function _syncBrandName() {
    // Listen for brand name changes in real-time from Supabase
    function _startListener() {
        if (!window.db) { setTimeout(_startListener, 800); return; }
        // Set up real-time listener for brand settings
        try {
            window.db.collection('settings').doc('scrubBrand').onSnapshot(
                doc => {
                    if (doc && doc.exists) {
                        const d = doc.data();
                        if (d && d.name) {
                            const cfg = { name: d.name, suffix: d.suffix !== undefined ? d.suffix : '™' };
                            localStorage.setItem('ssa_scrub_brand', JSON.stringify(cfg));
                            applyScrubBrandName(); // Update DOM immediately when brand changes
                        }
                    }
                },
                error => console.warn('[brand-sync] listener error:', error.message)
            );
        } catch(e) {
            console.log('[brand-sync] Real-time sync not available, falling back to localStorage');
        }
    }
    setTimeout(_startListener, 1500);
})();

// ===== Policy Modals (Privacy, Terms, Shipping) =====
const _policyContent = {
    privacy: {
        title: 'Privacy Policy',
        icon: 'shield-alt',
        body: `<p class="pm-date">Last updated: June 2026</p>
<h4>Information We Collect</h4>
<p>We collect information you provide when placing orders: name, email address, phone number, and delivery address. Anonymous usage data may also be collected to improve our services.</p>
<h4>How We Use Your Information</h4>
<p>Your information is used solely to process orders, send order confirmations, and provide customer support. We do not sell or share your personal data with any third parties.</p>
<h4>Data Security</h4>
<p>All data is protected with industry-standard HTTPS encryption. We do not store payment card details — payments are processed by trusted payment gateways.</p>
<h4>Cookies & Storage</h4>
<p>We use browser localStorage for cart and wishlist persistence. No advertising or tracking cookies are placed on your device.</p>
<h4>Your Rights</h4>
<p>You may request deletion of your account data at any time by emailing us. We will remove your data within 7 business days.</p>
<h4>Contact</h4>
<p>For privacy concerns email <a href="mailto:info@sivasureshagency.onmicrosoft.com">info@sivasureshagency.onmicrosoft.com</a></p>`
    },
    terms: {
        title: 'Terms of Service',
        icon: 'file-contract',
        body: `<p class="pm-date">Last updated: June 2026</p>
<h4>Acceptance of Terms</h4>
<p>By using the Siva Suresh Agency website you agree to these terms. If you disagree with any part, please discontinue use of our services.</p>
<h4>Products & Pricing</h4>
<p>All prices are in Indian Rupees (INR) and are inclusive of GST where applicable. We reserve the right to update prices without prior notice. Bulk order rates are negotiated separately.</p>
<h4>Orders & Payment</h4>
<p>Orders are confirmed only after successful payment verification. We accept UPI, credit/debit cards, and bank transfers for bulk orders. COD is available for select pin codes.</p>
<h4>Custom Orders</h4>
<p>Custom / embroidered orders require a confirmed specification sheet and 50% advance payment before production begins. Lead time: 10-15 business days.</p>
<h4>Cancellations & Refunds</h4>
<p>Orders can be cancelled within 24 hours of placement. Refunds are processed within 7 business days to the original payment method. Custom orders are non-cancellable after production starts.</p>
<h4>Limitation of Liability</h4>
<p>Siva Suresh Agency shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
<h4>Contact</h4>
<p>Questions? Email <a href="mailto:info@sivasureshagency.onmicrosoft.com">info@sivasureshagency.onmicrosoft.com</a></p>`
    },
    shipping: {
        title: 'Shipping Policy',
        icon: 'truck',
        body: `<p class="pm-date">Last updated: June 2026</p>
<h4>Free Shipping Threshold</h4>
<p>All orders above ₹2,000 receive free Pan-India delivery. Orders below ₹2,000 incur a flat fee of ₹150.</p>
<h4>Delivery Timelines</h4>
<p>Standard orders: <strong>5–7 business days</strong>.<br>Bulk / custom orders: <strong>10–15 business days</strong> after design confirmation.<br>Express delivery is available at an additional cost — contact us for a quote.</p>
<h4>Serviceable Areas</h4>
<p>We deliver across all Indian states via trusted courier partners including DTDC, Delhivery, and Blue Dart. International shipping is available for bulk orders on request.</p>
<h4>Order Tracking</h4>
<p>Once your order is dispatched you will receive an SMS and email with your tracking ID. You can also find it in the <em>My Orders</em> section of your account.</p>
<h4>Damaged / Lost Shipments</h4>
<p>If your package arrives damaged or is reported lost in transit, contact us within <strong>48 hours</strong> with supporting photos. We will arrange a free replacement or full refund.</p>
<h4>Returns</h4>
<p>Custom/embroidered items are non-returnable unless defective. Standard items can be returned within 7 days in their original, unused condition. Return shipping is free for defective items.</p>
<h4>Contact</h4>
<p>Shipping queries: <a href="mailto:info@sivasureshagency.onmicrosoft.com">info@sivasureshagency.onmicrosoft.com</a> or <a href="tel:+919366640050">+91 93666 40050</a></p>`
    }
};

function openPolicyModal(type) {
    const c = _policyContent[type];
    if (!c) return;
    // Remove any existing policy modal
    const old = document.getElementById('_policyModal');
    if (old) old.remove();

    const wrap = document.createElement('div');
    wrap.id = '_policyModal';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.style.cssText = [
        'position:fixed', 'inset:0',
        'background:rgba(15,23,42,0.68)',
        'backdrop-filter:blur(6px)',
        '-webkit-backdrop-filter:blur(6px)',
        'z-index:99999',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'padding:16px',
        'animation:_pmFadeIn .22s ease'
    ].join(';');

    wrap.innerHTML = `
<style>
@keyframes _pmFadeIn{from{opacity:0}to{opacity:1}}
@keyframes _pmSlideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
#_policyModal ._pm-box{background:#fff;border-radius:18px;width:100%;max-width:620px;max-height:88vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 28px 72px rgba(0,0,0,.22);animation:_pmSlideUp .28s cubic-bezier(.34,1.56,.64,1)}
#_policyModal ._pm-head{padding:17px 22px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;background:#fff;position:sticky;top:0}
#_policyModal ._pm-title{font-size:1rem;font-weight:800;color:#0f172a;display:flex;align-items:center;gap:9px;margin:0}
#_policyModal ._pm-title i{color:#0d9488}
#_policyModal ._pm-close{background:#f8fafc;border:1.5px solid #e2e8f0;width:34px;height:34px;border-radius:9px;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:all .2s;color:#64748b;flex-shrink:0}
#_policyModal ._pm-close:hover{background:#fee2e2;border-color:#fca5a5;color:#dc2626}
#_policyModal ._pm-body{padding:22px 24px 28px;overflow-y:auto;line-height:1.78;font-size:.875rem;color:#374151;-webkit-overflow-scrolling:touch}
#_policyModal ._pm-body .pm-date{color:#94a3b8;font-size:.78rem;margin-bottom:14px}
#_policyModal ._pm-body h4{font-size:.9rem;font-weight:700;color:#0f172a;margin:18px 0 6px;display:flex;align-items:center;gap:6px}
#_policyModal ._pm-body h4::before{content:'';display:inline-block;width:3px;height:14px;background:#0d9488;border-radius:2px;flex-shrink:0}
#_policyModal ._pm-body p{margin-bottom:10px}
#_policyModal ._pm-body a{color:#0d9488;font-weight:600;text-decoration:none}
#_policyModal ._pm-body a:hover{text-decoration:underline}
@media(max-width:480px){#_policyModal ._pm-body{padding:16px 18px 24px}}
</style>
<div class="_pm-box">
  <div class="_pm-head">
    <h2 class="_pm-title"><i class="fas fa-${c.icon}"></i> ${c.title}</h2>
    <button class="_pm-close" onclick="document.getElementById('_policyModal').remove()" aria-label="Close">&times;</button>
  </div>
  <div class="_pm-body">${c.body}</div>
</div>`;

    wrap.addEventListener('click', e => { if (e.target === wrap) wrap.remove(); });
    document.addEventListener('keydown', function esc(e) {
        if (e.key === 'Escape') { wrap.remove(); document.removeEventListener('keydown', esc); }
    }, { once: true });
    document.body.appendChild(wrap);
}
window.openPolicyModal = openPolicyModal;

// ===== State =====
let cart = JSON.parse(localStorage.getItem('ssa_cart') || '[]');
cart.forEach(item => { const p = productsData.find(x => x.id === item.id); if (p) item.image = p.image; });
let wishlist = JSON.parse(localStorage.getItem('ssa_wishlist') || '[]');
let displayedProducts = 12;
let currentFilter = new URLSearchParams(window.location.search).get('cat') || new URLSearchParams(window.location.search).get('heading') || 'all'; // init from URL immediately — no race condition
let currentSearch = '';
// Mirror state to window so db-integration.js can always read the latest values
function _syncWindowState() {
    window._currentFilter  = currentFilter;
    window._currentCount   = displayedProducts;
    window._currentSearch  = currentSearch;
}
// Initialise window state from the URL immediately (before any async render), so
// the products-sync re-render honours ?cat=... instead of flashing all products.
(function _initWindowStateFromUrl() {
    const _p = new URLSearchParams(window.location.search);
    window._currentGender = _p.get('gender') || null;
    window._currentSleeve = _p.get('sleeve') || null;
    window._currentSub = _p.get('sub') || null;
    _syncWindowState();
})();

// ===== Wishlist =====
function isWishlisted(id) { return wishlist.includes(id); }
function requireAuth(action) {
    if (currentUser) { action(); return; }
    showToast('Please login or create an account to continue');
    openLoginModal();
}
function toggleWishlist(id) {
    requireAuth(() => {
        const idx = wishlist.indexOf(id);
        if (idx > -1) { wishlist.splice(idx, 1); } else { wishlist.push(id); }
        localStorage.setItem('ssa_wishlist', JSON.stringify(wishlist));
        updateWishlistCount();
        // Re-render so heart icon updates
        renderProducts(currentFilter, displayedProducts, window._currentGender, window._currentSleeve, currentSearch);
    });
}
function updateWishlistCount() {
    const el = document.getElementById('wishlistCount');
    if (el) { el.textContent = wishlist.length; el.style.display = wishlist.length > 0 ? 'flex' : 'none'; }
}

// ===== Password Recovery Modal =====
function showPasswordRecoveryModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.innerHTML = `<div class="modal modal-sm" style="padding:30px 28px;max-width:420px;"><div style="text-align:center;margin-bottom:18px;"><i class="fas fa-lock" style="font-size:2.2rem;color:#0066cc;"></i><h3 style="margin:10px 0 4px;">Set New Password</h3><p style="color:var(--text-muted);font-size:0.87rem;">Enter your new password below.</p></div><div class="form-group"><label>New Password *</label><input type="password" id="recoveryNewPwd" placeholder="Min 6 characters"></div><div class="form-group"><label>Confirm Password *</label><input type="password" id="recoveryConfirmPwd" placeholder="Confirm new password"></div><p id="recoveryMsg" style="display:none;font-size:0.85rem;margin:8px 0;"></p><button class="btn btn-gradient btn-full" onclick="handlePasswordRecoverySave()"><i class="fas fa-lock"></i> Save New Password</button></div>`;
    modal.classList.add('active');
}
async function handlePasswordRecoverySave() {
    const pwd  = (document.getElementById('recoveryNewPwd')?.value  || '').trim();
    const conf = (document.getElementById('recoveryConfirmPwd')?.value || '').trim();
    const msg  = document.getElementById('recoveryMsg');
    const show = (t, ok) => { if (!msg) return; msg.textContent = t; msg.style.color = ok ? '#10b981' : '#ef4444'; msg.style.display = 'block'; };
    if (pwd.length < 6) { show('Password must be at least 6 characters'); return; }
    if (pwd !== conf)   { show('Passwords do not match'); return; }
    try {
        await window.auth.updatePassword(pwd);
        show('Password updated!', true);
        setTimeout(() => { closeAuthModal(); showToast('Password updated successfully!'); }, 1500);
    } catch (e) { show(e.message || 'Failed to update password'); }
}

// ===== Dynamic Category Rendering =====
// Render footer category links from taxonomy
function renderFooterCategories() {
    // Use a more robust selector: find the footer-links that contains "Categories" h4, then get its ul
    const allFooterLinks = document.querySelectorAll('.footer-links');
    let footerCatContainer = null;
    
    for (const section of allFooterLinks) {
        const h4 = section.querySelector('h4');
        if (h4 && h4.textContent.includes('Categories')) {
            footerCatContainer = section.querySelector('ul');
            break;
        }
    }
    
    if (!footerCatContainer) return;
    
    const tax = getTaxonomy();
    let html = '';
    
    // Render MAIN HEADINGS from taxonomy (not individual categories)
    for (const heading of tax) {
        const firstCat = heading.cats?.[0];
        if (!firstCat) continue;
        
        const filter = _resolveCatFilter(firstCat);
        const sigBadge = heading.signature ? '★ ' : '';
        const sigStyle = heading.signature ? ' style="color:var(--primary);font-weight:700;"' : '';
        // Use heading slug in URL so the full category view opens (Issue 12)
        const href = 'categories.html?cat=' + encodeURIComponent(heading.slug);
        const symbolStr = _headingSymbolStr(heading);
        html += `<li><a href="${href}"${sigStyle}>${sigBadge}${escapeRichText(heading.label)}${symbolStr}</a></li>`;
    }
    
    if (html) footerCatContainer.innerHTML = html;
}
window.renderFooterCategories = renderFooterCategories;

// Render "Browse by Category" tiles from taxonomy (home page)
function renderBrowseByCategoryTiles() {
    const grid = document.querySelector('.categories-grid');
    if (!grid) return;
    const tax = getTaxonomy();
    const iconMap = { 'doctor-uniform': 'user-md', 'staff-uniform': 'tshirt', 'hospital-linen': 'notes-medical', 'bedsheets': 'bed', 'hotel-linen': 'hotel' };
    let html = '';
    for (const heading of tax) {
        const isSig = !!heading.signature;
        const firstCat = heading.cats?.[0];
        if (!firstCat) continue;
        const filter = _resolveCatFilter(firstCat);
        // Use heading slug in URL (Issue 12 fix): ensures "All [Category]" sub-filter is
        // active on load, not the first sub-category's gender/sleeve-specific filter.
        const href = 'categories.html?cat=' + encodeURIComponent(heading.slug);
        const catIcon = iconMap[filter.cat] || iconMap[heading.slug] || 'th-large';
        const symbolStr = _headingSymbolStr(heading);
        const title = escapeRichText(heading.label) + symbolStr;
        const desc = escapeRichText((heading.label).slice(0, 40));
        const sigBadge = isSig ? '<span class="cat-tile-signature-badge"><i class="fas fa-award"></i> ★ Signature Line</span>' : '';
        const sigClass = isSig ? 'category-tile--cliniflex' : '';
        const sigPrefix = isSig ? '<span class="scrub-brand-text">' + escapeRichText(heading.label) + symbolStr + '</span>' : '';
        html += `<a href="${href}" class="category-tile ${sigClass}">
            <div class="cat-tile-img" data-cat="${filter.cat}">
                ${sigBadge}
            </div>
            <div class="cat-tile-body">
                <div class="cat-tile-icon"><i class="fas fa-${catIcon}"></i></div>
                <h3>${sigPrefix || title}</h3>
                <p>${desc}</p>
                <span class="cat-tile-link">Explore <i class="fas fa-arrow-right"></i></span>
            </div>
        </a>`;
    }
    if (html) grid.innerHTML = html;
}
window.renderBrowseByCategoryTiles = renderBrowseByCategoryTiles;

// Render marquee carousel items dynamically from actual products data (synced with taxonomy)
function renderMarqueeItems() {
    const track = document.querySelector('.marquee-track');
    if (!track || !productsData) return;
    
    const tax = getTaxonomy();
    const items = [];
    const seenProductNames = new Set(); // Track product names to avoid duplicates
    const categoryImageMap = {}; // Map category slug to products
    
    // Organize products by category slug
    productsData.forEach(p => {
        if (!categoryImageMap[p.category]) categoryImageMap[p.category] = [];
        categoryImageMap[p.category].push(p);
    });
    
    // Generate marquee items from taxonomy, using ONLY main heading-level categories
    for (const heading of tax) {
        if (heading.signature) continue; // Skip signature in main marquee
        
        // Use the heading itself (main category) to find products, not its children
        const filter = _resolveCatFilter(heading);
        const products = categoryImageMap[filter.cat] || [];
        
        // Take products from this main category, but deduplicate by product name
        for (const product of products) {
            if (!product.image) continue;
            
            const label = product.name.split(' - ')[0]; // Get short name (e.g., "Male Doctor Uniform")
            
            // Skip if we've already shown this product name
            if (seenProductNames.has(label)) continue;
            
            seenProductNames.add(label);
            const href = _filterHref(filter, { includeGender: false, includeSleeve: false, includeSub: false });
            items.push(`<a href="${href}" class="marquee-item"><img src="${product.image}" alt="${label}" loading="lazy"><span>${label}</span></a>`);
            
            // Limit to reasonable number of items
            if (items.length >= 20) break;
        }
        if (items.length >= 20) break;
    }
    
    // Duplicate items for seamless infinite scroll (only once to avoid too many duplicates)
    if (items.length > 0) {
        const html = items.join('');
        track.innerHTML = html.length > 0 ? html + html : '';
    }
}
window.renderMarqueeItems = renderMarqueeItems;

// NEW: Render signature products as Quick Links in footer (auto-synced from taxonomy)
function renderSignatureQuickLinks() {
    try {
        // Get the Quick Links section (first footer-links)
        const allFooterLinks = document.querySelectorAll('.footer-links');
        console.log('[Sig-QL] Found footer-links elements:', allFooterLinks.length);
        
        if (!allFooterLinks.length) {
            console.log('[Sig-QL] No footer-links found, skipping');
            return;
        }
        
        const quickLinksSection = allFooterLinks[0];
        const quickLinksContainer = quickLinksSection.querySelector('ul');
        console.log('[Sig-QL] Quick links container found:', !!quickLinksContainer);
        
        if (!quickLinksContainer) return;
        
        const tax = getTaxonomy();
        console.log('[Sig-QL] Taxonomy loaded, has signature property');
        
        if (!tax || !Array.isArray(tax)) {
            console.log('[Sig-QL] Taxonomy is invalid');
            return;
        }
        
        const signatureHeadings = tax.filter(h => h && h.signature);
        console.log('[Sig-QL] Found signature headings:', signatureHeadings.length, signatureHeadings.map(h => h.label));
        
        // If no signature headings, don't modify
        if (signatureHeadings.length === 0) {
            console.log('[Sig-QL] No signature headings found');
            return;
        }
        
        let html = '';
        for (const heading of signatureHeadings) {
            const firstCat = heading.cats?.[0];
            if (!firstCat) continue;
            
            const filter = _resolveCatFilter(firstCat);
            const href = _filterHref(filter, { includeGender: false, includeSleeve: false, includeSub: false });
            const label = escapeRichText(heading.label);
            const sigBadge = '<i class="fas fa-star"></i> ';
            
            html += `<li><a href="${href}" style="color:var(--primary);font-weight:600;">${sigBadge}${label}</a></li>`;
        }
        
        if (html) {
            console.log('[Sig-QL] Updating with', signatureHeadings.length, 'signature items');
            // Update the Quick Links section to show signature products
            quickLinksContainer.innerHTML = html;
            // Rename section title to emphasize premium
            const h4 = quickLinksSection.querySelector('h4');
            if (h4) {
                h4.textContent = '⭐ Premium Collections';
                console.log('[Sig-QL] Updated heading to Premium Collections');
            }
        } else {
            console.log('[Sig-QL] No HTML generated');
        }
    } catch (e) {
        console.error('[Sig-QL] Error:', e);
    }
}
window.renderSignatureQuickLinks = renderSignatureQuickLinks;

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', () => {
    initCommon();
    const page = document.body.dataset.page;
    if (page === 'home') initHomePage();
    if (page === 'categories') initCategoriesPage();
    // Render signature quick links on all pages
    if (typeof renderSignatureQuickLinks === 'function') renderSignatureQuickLinks();
    if (page === 'contact') initContactPage();
    if (page === 'tickets') initTicketsPage();
    if (page === 'order-detail') initOrderDetailPage();
    // Password recovery handler — fires when user clicks the reset link in their email
    window.addEventListener('ssa:passwordRecovery', showPasswordRecoveryModal);
    // Auto-sync any localStorage orders that failed to save during a previous session
    if (currentUser) {
        console.log('[app] User logged in as:', currentUser.email);
        setTimeout(() => {
            if (typeof syncPendingOrders === 'function') {
                console.log('[app] Starting auto-sync...');
                syncPendingOrders(currentUser.email, currentUser.name, currentUser.phone);
            } else {
                console.warn('[app] syncPendingOrders not available');
            }
        }, 500); // wait for db-integration.js to load
    }
    // URL-based account tab routing: ?account=profile|addresses|orders
    const _acctParam = new URLSearchParams(window.location.search).get('account');
    if (_acctParam && currentUser && ['profile', 'addresses', 'orders'].includes(_acctParam)) {
        setTimeout(() => {
            openAccountPanel().then(opened => {
                if (opened && _acctParam !== 'profile') {
                    setTimeout(() => showAccountTab(_acctParam), 150);
                }
            });
        }, 400);
    }
});

// Close account modal when browser back button is pressed away from ?account= URL
window.addEventListener('popstate', () => {
    const modal = document.getElementById('authModal');
    if (modal && modal.classList.contains('active')) {
        const hasAcct = new URLSearchParams(window.location.search).has('account');
        if (!hasAcct) { modal.classList.remove('active'); document.body.style.overflow = 'auto'; }
    }
});

// ===== Common Init (all pages) =====
function initCommon() {
    // Populate mega-menu thumbnails from admin-uploaded images (refreshed again after product sync)
    if (typeof initMegaMenuImages === 'function') initMegaMenuImages();
    // Rebuild the nav mega-menu from the admin-editable structure (main/sub headings)
    if (typeof renderMegaMenu === 'function') renderMegaMenu();
    // Inject admin-added categories into the nav mega-menu / CliniFlex dropdown
    if (typeof initCustomCategoryNav === 'function') initCustomCategoryNav();
    // Render footer categories from taxonomy
    if (typeof renderFooterCategories === 'function') renderFooterCategories();
    // Enable hover auto-scroll of product tile images
    if (typeof initCardHoverCycle === 'function') initCardHoverCycle();
    // Apply scrub brand name from localStorage to all pages
    applyScrubBrandName();
    // Fix nav active state based on current URL (CliniFlex highlighted only on scrub-suits)
    (function() {
        const page = (window.location.pathname.split('/').pop() || 'index.html').replace(/\?.*$/, '');
        const cat = new URLSearchParams(window.location.search).get('cat');
        const isScrub = page === 'categories.html' && cat === 'scrub-suits';
        document.querySelectorAll('a.nav-cliniflex').forEach(a => a.classList.toggle('active', isScrub));
        document.querySelectorAll('.nav-dropdown > a').forEach(a => {
            if (a.getAttribute('href') === 'categories.html') a.classList.toggle('active', page === 'categories.html' && !isScrub);
        });
    })();
    // Preloader — hide on DOMContentLoaded+300ms
    const hidePreloader = () => { setTimeout(() => { const p = document.getElementById('preloader'); if (p) p.classList.add('hidden'); }, 300); };
    hidePreloader(); // DOMContentLoaded has already fired since we're inside this listener
    // Absolute hard cap at 1.2s just in case
    setTimeout(() => { const p = document.getElementById('preloader'); if (p) p.classList.add('hidden'); }, 1200);

    // Header scroll
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled'); else header.classList.remove('scrolled');
        if (backToTop) { if (window.scrollY > 500) backToTop.classList.add('visible'); else backToTop.classList.remove('visible'); }
        revealElements();
    });
    if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Mobile nav
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger) {
        const isMobileNav = () => window.matchMedia('(max-width: 1024px)').matches;
        const clearOpen = () => navLinks.querySelectorAll('.nav-dropdown.open, .nav-cliniflex-dropdown.open').forEach(o => o.classList.remove('open'));
        let _navScrollY = 0;

        // ── Backdrop overlay (tap-outside to close, all browsers) ──
        const backdrop = document.createElement('div');
        backdrop.id = 'navBackdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(backdrop);

        const closeMobileNav = () => {
            if (!navLinks.classList.contains('active')) return;
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
            backdrop.classList.remove('active');
            clearOpen();
            document.getElementById('header').classList.remove('nav-active');
            // Restore body scroll — position:fixed trick required for iOS Safari
            document.body.classList.remove('nav-open');
            document.body.style.top = '';
            window.scrollTo(0, _navScrollY);
            // Remove history entry pushed on open (Android back-button support)
            if (history.state && history.state._navOpen) history.back();
        };
        // Expose so the global Escape handler can reach it
        window._closeMobileNav = closeMobileNav;

        backdrop.addEventListener('click', closeMobileNav);
        backdrop.addEventListener('touchend', (e) => { e.preventDefault(); closeMobileNav(); }, { passive: false });

        hamburger.addEventListener('click', () => {
            const willOpen = !navLinks.classList.contains('active');
            hamburger.classList.toggle('active', willOpen);
            hamburger.setAttribute('aria-expanded', String(willOpen));
            navLinks.classList.toggle('active', willOpen);
            backdrop.classList.toggle('active', willOpen);
            if (willOpen) {
                // Lock background scroll; save Y for iOS Safari restore
                _navScrollY = window.scrollY || window.pageYOffset;
                document.body.style.top = `-${_navScrollY}px`;
                document.body.classList.add('nav-open');
                // Raise #header above all floating elements while nav is open
                document.getElementById('header').classList.add('nav-active');
                // Push a history entry so Android back-button fires popstate → closes nav
                history.pushState({ _navOpen: true }, '');
            } else {
                clearOpen();
                document.body.classList.remove('nav-open');
                document.body.style.top = '';
                window.scrollTo(0, _navScrollY);
            }
        });

        // Android back-button: popstate fires when the pushed state is popped
        window.addEventListener('popstate', (e) => {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                backdrop.classList.remove('active');
                clearOpen();
                document.getElementById('header').classList.remove('nav-active');
                document.body.classList.remove('nav-open');
                document.body.style.top = '';
                window.scrollTo(0, _navScrollY);
            }
        });

        // Close + unlock when rotating to landscape / resizing to desktop
        window.addEventListener('resize', () => {
            if (!isMobileNav() && navLinks.classList.contains('active')) closeMobileNav();
        });
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (!isMobileNav() && navLinks.classList.contains('active')) closeMobileNav();
            }, 200); // small delay so matchMedia reflects new orientation
        });
        // On mobile the top-level dropdown links act as expand/collapse accordions instead of navigating
        navLinks.querySelectorAll('.nav-dropdown > a, .nav-cliniflex-dropdown > a').forEach(a => {
            a.addEventListener('click', (e) => {
                if (!isMobileNav()) return; // desktop keeps hover + normal navigation
                e.preventDefault();
                const li = a.parentElement;
                const wasOpen = li.classList.contains('open');
                navLinks.querySelectorAll('.nav-dropdown.open, .nav-cliniflex-dropdown.open').forEach(o => { if (o !== li) o.classList.remove('open'); });
                li.classList.toggle('open', !wasOpen);
            });
        });
        // Mobile mega-col accordion (Doctor Uniform, Staff Uniform, Linen Accessories)
        // Event delegation so it works after renderMegaMenu() re-renders the content.
        navLinks.addEventListener('click', (e) => {
            if (!isMobileNav()) return;
            const h4 = e.target.closest('.mega-col h4');
            if (!h4) return;
            e.preventDefault();
            e.stopPropagation();
            const col = h4.closest('.mega-col');
            const inner = col.closest('.mega-menu-inner');
            const isOpen = col.classList.contains('mega-open');
            // Collapse all other cols in this menu
            if (inner) inner.querySelectorAll('.mega-col.mega-open').forEach(c => c.classList.remove('mega-open'));
            // Toggle clicked col
            if (!isOpen) col.classList.add('mega-open');
        });

        // Real navigation links close the whole menu; accordion toggles keep it open
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                const li = link.closest('.nav-dropdown, .nav-cliniflex-dropdown');
                const isToggle = li && link.parentElement === li && isMobileNav();
                if (isToggle) return;
                closeMobileNav();
            });
        });
    }

    // Search
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    if (searchToggle) searchToggle.addEventListener('click', () => searchOverlay.classList.add('active'));
    if (searchClose) searchClose.addEventListener('click', () => searchOverlay.classList.remove('active'));
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase().trim();
            const results = document.getElementById('searchResults');
            if (q.length < 2) { results.innerHTML = ''; return; }
            const matches = productsData.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q));
            results.innerHTML = matches.slice(0, 6).map(p => `<div class="search-result-item" onclick="addToCart(${p.id}); document.getElementById('searchOverlay').classList.remove('active');"><img src="${p.image}" alt="${p.name}"><div><strong>${p.name}</strong><div style="color:var(--primary);font-weight:600;">₹${p.price}</div></div></div>`).join('');
        });
    }

    // Cart
    document.getElementById('cartToggle').addEventListener('click', () => requireAuth(openCart));
    document.getElementById('cartClose').addEventListener('click', closeCart);
    document.getElementById('cartOverlay').addEventListener('click', closeCart);
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
    updateCartUI();

    // Checkout modal
    const modalClose = document.getElementById('modalClose');
    if (modalClose) modalClose.addEventListener('click', closeCheckoutModal);
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) checkoutForm.addEventListener('submit', (e) => { e.preventDefault(); if (!validateShippingForm()) { nextStep(1); return; } placeOrder(); });

    // Auth
    updateAuthUI();
    const authModal = document.getElementById('authModal');
    if (authModal) authModal.addEventListener('click', (e) => { if (e.target === e.currentTarget) closeAuthModal(); });
    const pdModal = document.getElementById('productDetailModal');
    if (pdModal) pdModal.addEventListener('click', (e) => { if (e.target === e.currentTarget) closeProductDetail(); });

    // Mobile bottom nav auth button
    const mbnAuthBtn = document.getElementById('mbnAuthBtn');
    if (mbnAuthBtn) mbnAuthBtn.addEventListener('click', () => {
        if (currentUser) openAccountPanel(); else openLoginModal();
    });
    // Mobile bottom nav cart badge sync
    const mbnCartCount = document.getElementById('mbnCartCount');
    if (mbnCartCount) {
        const syncMbnCart = () => {
            const total = cart.reduce((s,i) => s + i.qty, 0);
            mbnCartCount.textContent = total;
            mbnCartCount.style.display = total > 0 ? 'flex' : 'none';
        };
        document.addEventListener('cartUpdated', syncMbnCart);
        syncMbnCart();
    }

    // Gate wishlist & mobile cart behind auth
    document.querySelectorAll('.wishlist-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!currentUser) { e.preventDefault(); openLoginModal(); showToast('Please sign in to view your wishlist'); }
        });
    });
    const mbnCartBtn2 = document.getElementById('mbnCartBtn');
    if (mbnCartBtn2) mbnCartBtn2.addEventListener('click', () => requireAuth(openCart));

    // Chatbot
    initChatbot();

    // Reveal
    revealElements();

    // Stats counter
    initStatsCounter();

    // Scroll Progress Bar
    initScrollProgress();

    // Hero Particles
    initHeroParticles();

    // Mobile marquee auto-scroll needs duplicated chips for seamless loop
    initMobileMarqueeAutoScroll();

    // Add stagger class to shop grids and category grids
    document.querySelectorAll('.shop-grid, .categories-grid, .testimonial-grid, .mv-grid, .team-grid').forEach(g => {
        g.classList.add('reveal-stagger');
    });

    // Mark cards with badges for animated border
    document.querySelectorAll('.shop-card').forEach(card => {
        if (card.querySelector('.shop-card-badge')) card.classList.add('has-badge');
    });

    // 3D Tilt Effect on product cards (desktop only)
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            document.querySelectorAll('.shop-card').forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                    const rotateX = ((y - rect.height / 2) / rect.height) * -6;
                    const rotateY = ((x - rect.width / 2) / rect.width) * 6;
                    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                } else {
                    card.style.transform = '';
                }
            });
        });
    }

    // Wishlist heart toggle (persistent)
    document.addEventListener('click', (e) => {
        const wishBtn = e.target.closest('.shop-card-wishlist');
        if (wishBtn) {
            e.stopPropagation();
            const pid = parseInt(wishBtn.dataset.productId);
            if (!pid) return;
            toggleWishlist(pid);
            const icon = wishBtn.querySelector('i');
            if (isWishlisted(pid)) {
                wishBtn.classList.add('liked');
                icon.classList.replace('far', 'fas');
                showToast('Added to wishlist!');
            } else {
                wishBtn.classList.remove('liked');
                icon.classList.replace('fas', 'far');
                showToast('Removed from wishlist');
            }
        }
    });

    updateWishlistCount();

    // Ensure invoice action is available in success modal on all pages
    ensureSuccessModalActions();

    // Init wishlist page if on it
    if (document.body.dataset.page === 'wishlist') initWishlistPage();
}

// ===== Home Page =====
function initHomePage() {
    initHeroSlider();
    // Render featured products (those with badges)
    const grid = document.getElementById('shopGrid');
    if (grid) {
        const featured = productsData.filter(p => p.badge);
        grid.innerHTML = featured.slice(0, 8).map(p => buildProductCard(p)).join('');
    }
    // Render Browse by Category tiles from taxonomy
    if (typeof renderBrowseByCategoryTiles === 'function') renderBrowseByCategoryTiles();
    // Render marquee carousel items from taxonomy
    if (typeof renderMarqueeItems === 'function') renderMarqueeItems();
    // Start category tile image scroll and hero dynamic images (immediate)
    initCategoryTileScroll();
    initHeroDynamicImages();
    applyScrubBrandName();
}

// ===== Categories Page =====
// Update the compact category hero (title, breadcrumb, tagline) to match the
// active category. CliniFlex gets its own branding + signature badge; the generic
// Categories view keeps "Home > Categories".
function updateCategoryHero(cat) {
    const titleEl = document.getElementById('catHeroTitle');
    const crumbEl = document.getElementById('catCrumbLast');
    const subEl = document.getElementById('catHeroSub');
    const badgeEl = document.getElementById('catHeroBadge');
    if (!titleEl) return;
    if (cat === 'scrub-suits') {
        if (crumbEl) crumbEl.textContent = 'CliniFlex\u2122';
        titleEl.innerHTML = 'SSA CliniFlex\u2122 <span class="gradient-text">Scrubs</span>';
        if (subEl) subEl.textContent = 'Premium medical scrub suits \u2014 comfort, durability & style through every shift.';
        if (badgeEl) badgeEl.style.display = '';
    } else if (cat && cat !== 'all') {
        const label = (typeof getCategoryLabel === 'function' ? getCategoryLabel(cat) : cat.replace(/-/g, ' '));
        if (crumbEl) crumbEl.textContent = label;
        titleEl.innerHTML = '<span class="gradient-text">' + escapeRichText(label) + '</span>';
        if (subEl) subEl.textContent = 'Browse our ' + label + ' collection.';
        if (badgeEl) badgeEl.style.display = 'none';
    } else {
        if (crumbEl) crumbEl.textContent = 'Categories';
        titleEl.innerHTML = 'Our <span class="gradient-text">Categories</span>';
        if (subEl) subEl.textContent = 'Browse our complete range of hospital linen, uniforms & textiles.';
        if (badgeEl) badgeEl.style.display = 'none';
    }
}
window.updateCategoryHero = updateCategoryHero;

// Bind (or re-bind) click handlers to the shop filter chips. Safe to call after
// renderShopFilters() rebuilds the chip DOM.
function bindFilterButtons() {
    document.querySelectorAll('#shopFilters .filter-btn').forEach(btn => {
        if (btn._ssaBound) return;
        btn._ssaBound = true;
        btn.addEventListener('click', () => {
            document.querySelectorAll('#shopFilters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            displayedProducts = 12;
            // Selecting a top-level category clears any gender/sleeve/sub sub-filter
            window._currentGender = null;
            window._currentSleeve = null;
            window._currentSub = null;
            // Keep the address bar in sync so a refresh/share shows the right category
            try {
                const url = new URL(window.location.href);
                if (currentFilter && currentFilter !== 'all') url.searchParams.set('cat', currentFilter);
                else url.searchParams.delete('cat');
                url.searchParams.delete('gender');
                url.searchParams.delete('sleeve');
                url.searchParams.delete('sub');
                url.searchParams.delete('heading');
                history.replaceState({}, '', url);
            } catch (e) { /* ignore */ }
            _syncWindowState(); renderProducts(currentFilter, displayedProducts, null, null, currentSearch, null);
            if (typeof updateCategoryHero === 'function') updateCategoryHero(currentFilter);
            if (typeof renderSubFilters === 'function') renderSubFilters(currentFilter);
        });
    });
}
window.bindFilterButtons = bindFilterButtons;

// Apply the current URL (?cat/?gender/?sleeve) as the single source of truth and
// render. Used on first load and on bfcache restore (back/forward navigation).
function applyUrlFilterAndRender() {
    const params = new URLSearchParams(window.location.search);
    currentFilter = params.get('cat') || params.get('heading') || 'all';
    const explicitGender = params.get('gender');
    const explicitSleeve = params.get('sleeve');
    const explicitSub = params.get('sub');
    window._currentGender = explicitGender || null;
    window._currentSleeve = explicitSleeve || null;
    window._currentSub = explicitSub || null;
    currentSearch = '';
    displayedProducts = 12;
    const psi = document.getElementById('productSearchInput');
    if (psi) psi.value = '';
    const psc = document.getElementById('productSearchClear');
    if (psc) psc.style.display = 'none';
    renderShopFilters(); // rebuild chips + set active + bind handlers
    updateScrubsCount();
    if (typeof updateCategoryHero === 'function') updateCategoryHero(currentFilter);
    _syncWindowState();
    renderProducts(currentFilter, displayedProducts, window._currentGender, window._currentSleeve, currentSearch, window._currentSub);
}
window.applyUrlFilterAndRender = applyUrlFilterAndRender;

function initCategoriesPage() {
    // Parse URL params
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat') || params.get('heading');
    const gender = params.get('gender');
    const sleeve = params.get('sleeve');
    const sub = params.get('sub');

    if (cat) currentFilter = cat;
    window._currentFilter = currentFilter;
    // Build filter chips from the (admin-managed) category list; this also binds
    // click handlers and sets the active chip based on the current filter.
    renderShopFilters();

    // Re-apply the URL filter when the page is restored from the bfcache
    // (mobile back/forward) so it never shows a stale category. This fixes the
    // "shows wrong category first, correct on second click" issue.
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) applyUrlFilterAndRender();
    });

    // Product search input
    const productSearchInput = document.getElementById('productSearchInput');
    const productSearchClear = document.getElementById('productSearchClear');
    if (productSearchInput) {
        productSearchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.trim();
            if (productSearchClear) productSearchClear.style.display = currentSearch ? 'flex' : 'none';
            displayedProducts = 12;
            _syncWindowState(); renderProducts(currentFilter, displayedProducts, window._currentGender, window._currentSleeve, currentSearch);
        });
    }
    if (productSearchClear) {
        productSearchClear.addEventListener('click', () => {
            if (productSearchInput) productSearchInput.value = '';
            currentSearch = '';
            productSearchClear.style.display = 'none';
            displayedProducts = 12;
            _syncWindowState(); renderProducts(currentFilter, displayedProducts, window._currentGender, window._currentSleeve, '');
            if (productSearchInput) productSearchInput.focus();
        });
    }

    // Filter buttons are rendered + bound by renderShopFilters()/bindFilterButtons()

    // Sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === 'price-low') productsData.sort((a, b) => a.price - b.price);
            else if (val === 'price-high') productsData.sort((a, b) => b.price - a.price);
            else if (val === 'newest') productsData.sort((a, b) => b.id - a.id);
            else productsData.sort((a, b) => b.reviews - a.reviews);
            _syncWindowState(); renderProducts(currentFilter, displayedProducts, window._currentGender, window._currentSleeve, currentSearch);
        });
    }

    // Load more
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => { displayedProducts += 12; _syncWindowState(); renderProducts(currentFilter, displayedProducts, window._currentGender, window._currentSleeve, currentSearch); });
    }

    // Store gender/sleeve for use by other callers
    window._currentGender = gender;
    window._currentSleeve = sleeve;
    window._currentSub = sub;

    updateScrubsCount();
    _syncWindowState();
    if (typeof updateCategoryHero === 'function') updateCategoryHero(currentFilter);
    renderProducts(currentFilter, displayedProducts, gender, sleeve, currentSearch, sub);
}

// ===== Contact Page =====
function initContactPage() {
    // contact.html has its own inline submitContactForm handler — skip adding a duplicate listener
    // that would interfere with the success-message display.
    const form = document.getElementById('contactForm');
    if (form && !window.submitContactForm) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
            btn.style.background = '#2ecc71';
            btn.disabled = true;
            setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; form.reset(); }, 3000);
        });
    }
}

// ===== Render Products =====
function buildProductCard(p) {
    const colors = getProductColors(p);
    // Card thumbnail: first colorVariant image that is NOT the mainImage (tile/hero banner)
    const _allCvImgs = (p.colorVariants || []).flatMap(cv => cv.images || []);
    const _cardImg = _allCvImgs.find(img => img && img !== p.mainImage)
                  || (p.image && p.image !== p.mainImage ? p.image : null)
                  || _allCvImgs[0] || p.image || '';
    // Collect images for the tile's hover auto-scroll. Prefer one representative
    // image per colour (so hovering previews the colour range); for a single-colour
    // product, cycle that colour's own images. Capped so the loop stays snappy.
    const _hoverImgs = (() => {
        const cvs = p.colorVariants || [];
        let out = [];
        if (cvs.length > 1) {
            cvs.forEach(cv => { const im = (cv.images || []).find(x => x && x !== p.mainImage); if (im && !out.includes(im)) out.push(im); });
        } else {
            (cvs[0] && cvs[0].images || []).forEach(im => { if (im && im !== p.mainImage && !out.includes(im)) out.push(im); });
        }
        if (!out.length) _allCvImgs.forEach(im => { if (im && im !== p.mainImage && !out.includes(im)) out.push(im); });
        if (p.image && p.image !== p.mainImage && !out.includes(p.image)) out.push(p.image);
        if (!out.length && _cardImg) out.push(_cardImg);
        return out.slice(0, 8);
    })();
    if (!window._cardHoverImgs) window._cardHoverImgs = {};
    window._cardHoverImgs[p.id] = _hoverImgs;
    const _dotsHtml = _hoverImgs.length > 1
        ? `<span class="card-img-dots" aria-hidden="true">${_hoverImgs.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('')}</span>`
        : '';
    const _maxSwatches = 4;
    const _shownColors = colors ? colors.slice(0, _maxSwatches) : [];
    const _extraColors = colors ? colors.length - _shownColors.length : 0;
    const colorSwatchesHtml = colors ? `<div class="color-swatches" onclick="event.stopPropagation()">
        ${_shownColors.map((c, i) => `<button class="color-swatch${i === 0 ? ' active' : ''}" data-hex="${c.hex}" data-color-name="${c.name}" title="${c.name}" style="background:${c.hex}${c.hex === '#FFFFFF' ? ';border-color:#ccc' : ''}" onclick="selectCardColor(this)"></button>`).join('')}
        ${_extraColors > 0 ? `<button class="color-swatch-more" title="View all ${colors.length} colors" onclick="event.stopPropagation();openProductDetail(${p.id})">+${_extraColors}</button>` : ''}
        <span class="color-name">${colors[0].name}</span>
    </div>` : '';
    const defaultColor = colors?.[0]?.name || '';
    const cardState = getCardStockState(p, defaultColor);
    const isOut = cardState.isOut;
    const isLow = !isOut && cardState.isLow;
    const outBadge = isOut
        ? `<span class="shop-card-badge" style="background:#ef4444;color:#fff">Out of Stock</span>`
        : isLow
            ? `<span class="shop-card-badge" style="background:#f59e0b;color:#fff">Low Stock</span>`
            : (p.badge ? `<span class="shop-card-badge">${p.badge}</span>` : '');
    const addBtn = isOut
        ? `<button class="btn btn-primary" disabled style="opacity:0.4;cursor:not-allowed"><i class="fas fa-ban"></i> Out of Stock</button>`
        : `<button class="btn btn-primary" onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i> Add</button>`;
    const buyBtn = isOut ? '' : `<button class="btn btn-outline-dark" onclick="buyNow(${p.id})"><i class="fas fa-bolt"></i> Buy</button>`;
    const quickBtn = isOut
        ? `<div class="shop-card-quick"><button class="btn btn-primary btn-sm" disabled style="opacity:0.5"><i class="fas fa-ban"></i> Out of Stock</button></div>`
        : `<div class="shop-card-quick"><button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); addToCart(${p.id})"><i class="fas fa-cart-plus"></i> Add</button></div>`;
    return `<div class="shop-card${p.badge || isOut || isLow ? ' has-badge' : ''} reveal active${isOut ? ' out-of-stock-card' : isLow ? ' low-stock-card' : ''}" data-category="${p.category}" data-id="${p.id}">
        ${outBadge}
        <button class="shop-card-wishlist" data-product-id="${p.id}" aria-label="Wishlist"><i class="${isWishlisted(p.id) ? 'fas' : 'far'} fa-heart"></i></button>
        <div class="shop-card-image${_hoverImgs.length > 1 ? ' has-hover-cycle' : ''}" onclick="openProductDetail(${p.id})">
            <img src="${_cardImg}" alt="${p.name}" loading="lazy">
            ${_dotsHtml}
            ${quickBtn}
        </div>
        <div class="shop-card-body" onclick="openProductDetail(${p.id})">
            <span class="shop-card-category">${typeof getCategoryLabel === 'function' ? getCategoryLabel(p.category) : p.category.replace(/-/g, ' ')}</span>
            ${p.gender ? `<span class="shop-card-tag ${p.gender}">${p.gender === 'male' ? '<i class="fas fa-mars"></i> Gents' : p.gender === 'unisex' ? '<i class="fas fa-venus-mars"></i> Unisex' : '<i class="fas fa-venus"></i> Ladies'}${p.sleeve ? ' • ' + p.sleeve.charAt(0).toUpperCase() + p.sleeve.slice(1) + ' Sleeve' : ''}</span>` : ''}
            <h4 class="shop-card-name" data-base-name="${p.name}">${p.name}${colors && colors[0] ? ' \u2013 ' + colors[0].name : ''}</h4>
            ${colorSwatchesHtml}
            <div class="shop-card-rating"><span class="rating-val">${(p.rating||0).toFixed(1)}</span>${'<i class="fas fa-star"></i>'.repeat(Math.floor(p.rating||0))}${(p.rating||0) % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}<span>(${p.reviews||0})</span></div>
            <div class="shop-card-price"><span class="price">₹${p.price}</span>${p.oldPrice ? `<span class="old-price">₹${p.oldPrice}</span>` : ''}</div>
            <div class="shop-card-footer" onclick="event.stopPropagation()">
                ${addBtn}
                ${buyBtn}
            </div>
        </div>
    </div>`;
}

function renderProducts(filter = 'all', count = 12, gender = null, sleeve = null, searchQuery = '', sub = undefined) {
    if (sub === undefined) sub = window._currentSub || null;
    let filtered;
    if (filter === 'all') filtered = [...productsData];
    else {
        let heading = null;
        try { heading = getTaxonomy().find(h => h.slug === filter); } catch (e) { /* ignore */ }
        if (heading) { const cs = _headingCatSet(heading); filtered = productsData.filter(p => cs.has(p.category)); }
        else filtered = productsData.filter(p => p.category === filter);
    }
    if (gender) filtered = filtered.filter(p => p.gender === gender || p.gender === 'unisex');
    if (sleeve) filtered = filtered.filter(p => p.sleeve === sleeve);
    if (sub) filtered = filtered.filter(p => _productMatchesSubFilter(p, sub));
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.category.replace(/-/g, ' ').toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q))
        );
    }
    const toShow = filtered.slice(0, count);
    const grid = document.getElementById('shopGrid');
    if (!grid) return;
    if (toShow.length === 0) {
        const isScrubs = filter === 'scrub-suits';
        const hasSubFilter = !!(gender || sleeve || sub);
        const catLabel = filter && filter !== 'all'
            ? (typeof getCategoryLabel === 'function' ? getCategoryLabel(filter) : filter.replace(/-/g, ' '))
            : '';
        let icon = 'box-open', title = 'No items found', msg = 'No products in this category yet. Please check back soon.', cta = '';
        if (searchQuery) {
            title = 'No products match your search';
            msg = 'Try different keywords or browse all products.';
        } else if (hasSubFilter) {
            // e.g. CliniFlex Gents with no products created yet → No items found
            title = 'No items found';
            msg = `We don\u2019t have any ${catLabel} products in this selection yet. Please check back soon or contact us.`;
            cta = '<a href="contact.html" class="btn btn-gradient btn-sm"><i class="fas fa-phone-alt"></i> Enquire Now</a>';
        } else if (isScrubs) {
            icon = 'tshirt';
            title = 'SSA CliniFlex\u2122 Scrubs — Coming Soon!';
            msg = 'Our signature scrub collection is being set up. Check back soon or contact us for availability.';
            cta = '<a href="contact.html" class="btn btn-gradient btn-sm"><i class="fas fa-phone-alt"></i> Ask About Scrubs</a>';
        }
        grid.innerHTML = `<div class="products-empty-state"><i class="fas fa-${icon}"></i><h3>${title}</h3><p>${msg}</p>${cta}</div>`;
    } else {
        grid.innerHTML = toShow.map(p => buildProductCard(p)).join('');
        grid.querySelectorAll('.shop-card').forEach(updateCardStockUI);
    }

    const info = document.getElementById('shopResultsInfo');
    if (info) {
        if (searchQuery && filtered.length > 0)
            info.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${searchQuery}"`;
        else if (searchQuery && filtered.length === 0)
            info.textContent = `No results for "${searchQuery}"`;
        else
            info.textContent = `Showing ${toShow.length} of ${filtered.length} products`;
    }

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) loadMoreBtn.style.display = (toShow.length === 0 || count >= filtered.length) ? 'none' : '';
}

function filterToScrubs() {
    currentFilter = 'scrub-suits';
    currentSearch = '';
    displayedProducts = 12;
    window._currentGender = null;
    window._currentSleeve = null;
    try {
        const url = new URL(window.location.href);
        url.searchParams.set('cat', 'scrub-suits');
        url.searchParams.delete('gender');
        url.searchParams.delete('sleeve');
        history.replaceState({}, '', url);
    } catch (e) { /* ignore */ }
    _syncWindowState();
    const searchInput = document.getElementById('productSearchInput');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('productSearchClear');
    if (clearBtn) clearBtn.style.display = 'none';
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === 'scrub-suits');
    });
    renderProducts('scrub-suits', displayedProducts, null, null, '');
    if (typeof updateCategoryHero === 'function') updateCategoryHero('scrub-suits');
    const shopSection = document.querySelector('.shop-section');
    if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.filterToScrubs = filterToScrubs;

function updateScrubsCount() {
    const el = document.getElementById('scrubsCount');
    if (!el) return;
    const count = productsData.filter(p => p.category === 'scrub-suits').length;
    el.textContent = count > 0 ? count + '+' : 'Coming Soon';
}
window.updateScrubsCount = updateScrubsCount;

function normalizeSizeKey(size) {
    if (size === undefined || size === null) return '';
    return String(size).trim().replace(/×/g, 'x').replace(/\s+/g, '').toLowerCase();
}

function normalizeColorKey(color) {
    if (color === undefined || color === null) return '';
    return String(color).trim().toLowerCase();
}

function variantKey(size, color) {
    return `${normalizeSizeKey(size)}::${normalizeColorKey(color) || '*'}`;
}

function isVariantOutOfStock(product, size, color) {
    if (!product || !size) return false;
    const outVariants = window.outOfStockVariantMap?.[product.name];
    const vKey = variantKey(size, color);
    const vWildcard = variantKey(size, '');
    if (outVariants && (outVariants.has(vKey) || outVariants.has(vWildcard))) return true;
    if (outVariants && color) return false;
    const outSizes = window.outOfStockMap?.[product.name];
    return !!(outSizes && outSizes.has(normalizeSizeKey(size)));
}

function isVariantLowStock(product, size, color) {
    if (!product || !size) return false;
    const lowVariants = window.lowStockVariantMap?.[product.name];
    const vKey = variantKey(size, color);
    const vWildcard = variantKey(size, '');
    if (lowVariants && (lowVariants.has(vKey) || lowVariants.has(vWildcard))) return true;
    if (lowVariants && color) return false;
    const lowSizes = window.lowStockMap?.[product.name];
    return !!(lowSizes && lowSizes.has(normalizeSizeKey(size)));
}

function getCardStockState(product, color) {
    if (!product) return { isOut: false, isLow: false };
    const sizes = product.sizes || [];
    if (!sizes.length) return { isOut: !!product.outOfStock, isLow: !!product.lowStock };

    const outCount = sizes.filter(s => isVariantOutOfStock(product, s, color)).length;
    const lowCount = sizes.filter(s => !isVariantOutOfStock(product, s, color) && isVariantLowStock(product, s, color)).length;
    // isOut only when EVERY size for this color is OOS (product truly unavailable)
    const isOut = sizes.length > 0 && outCount === sizes.length;
    // isLow only when product is orderable but some variants are low/limited
    const isLow = !isOut && lowCount > 0;

    return { isOut, isLow, hasAnyOut: outCount > 0 };
}

function updateCardStockUI(cardEl) {
    if (!cardEl) return;
    const productId = Number(cardEl.dataset.id);
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const selectedColorBtn = cardEl.querySelector('.color-swatch.active');
    const selectedColor = selectedColorBtn?.dataset.colorName || getProductColors(product)?.[0]?.name || '';
    const state = getCardStockState(product, selectedColor);

    const allBadges = Array.from(cardEl.querySelectorAll('.shop-card-badge'));
    if (allBadges.length > 1) allBadges.slice(1).forEach(b => b.remove());
    let badge = cardEl.querySelector('.shop-card-badge');
    const ensureBadge = () => {
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'shop-card-badge';
            cardEl.insertBefore(badge, cardEl.firstChild);
        }
    };
    if (state.isOut) {
        ensureBadge();
        if (badge) {
            badge.textContent = 'Out of Stock';
            badge.style.background = '#ef4444';
            badge.style.color = '#fff';
        }
        cardEl.classList.add('out-of-stock-card');
        cardEl.classList.remove('low-stock-card');
    } else if (state.isLow) {
        ensureBadge();
        if (badge) {
            badge.textContent = 'Low Stock';
            badge.style.background = '#f59e0b';
            badge.style.color = '#fff';
        }
        cardEl.classList.add('low-stock-card');
        cardEl.classList.remove('out-of-stock-card');
    } else {
        if (badge && (!product.badge || badge.textContent === 'Out of Stock' || badge.textContent === 'Low Stock')) {
            if (product.badge) {
                badge.textContent = product.badge;
                badge.style.background = '';
                badge.style.color = '';
            } else {
                badge.remove();
            }
        }
        cardEl.classList.remove('out-of-stock-card', 'low-stock-card');
    }

    const addBtn = cardEl.querySelector('.shop-card-footer .btn-primary');
    const buyBtn = cardEl.querySelector('.shop-card-footer .btn-outline-dark');
    const quickBtn = cardEl.querySelector('.shop-card-quick .btn-primary');
    const disable = state.isOut;

    if (addBtn) {
        addBtn.disabled = disable;
        addBtn.style.opacity = disable ? '0.45' : '';
        addBtn.style.cursor = disable ? 'not-allowed' : '';
        addBtn.innerHTML = disable ? '<i class="fas fa-ban"></i> Out of Stock' : '<i class="fas fa-cart-plus"></i> Add';
    }
    if (buyBtn) buyBtn.style.display = disable ? 'none' : '';
    if (quickBtn) {
        quickBtn.disabled = disable;
        quickBtn.style.opacity = disable ? '0.5' : '';
        quickBtn.innerHTML = disable ? '<i class="fas fa-ban"></i> Out of Stock' : '<i class="fas fa-cart-plus"></i> Add';
    }
}

function updateProductDetailVariantState(pid) {
    const p = productsData.find(x => x.id === pid);
    if (!p) return;

    const color = getSelectedColor(pid) || getProductColors(p)?.[0]?.name || '';
    const sizeButtons = Array.from(document.querySelectorAll(`#pdSizes-${pid} .pd-size-btn`));
    if (!sizeButtons.length) return;

    sizeButtons.forEach(btn => {
        const size = btn.dataset.size;
        const oos = isVariantOutOfStock(p, size, color);
        btn.disabled = oos;
        btn.classList.toggle('is-oos', oos);
        btn.style.opacity = oos ? '0.45' : '';
        btn.style.cursor = oos ? 'not-allowed' : '';
        btn.title = oos ? 'Out of stock for this color' : '';
        // Always reset text to just the size — removes any legacy "• OOS" baked-in text
        btn.textContent = size;
    });

    let active = document.querySelector(`#pdSizes-${pid} .pd-size-btn.active:not(:disabled)`);
    if (!active) {
        sizeButtons.forEach(b => b.classList.remove('active'));
        active = sizeButtons.find(b => !b.disabled);
        if (active) active.classList.add('active');
    }

    const addBtn = document.getElementById(`pdAddBtn-${pid}`);
    const buyBtn = document.getElementById(`pdBuyBtn-${pid}`);
    const msgEl = document.getElementById(`pdVariantStockMsg-${pid}`);
    const allDisabled = sizeButtons.every(b => b.disabled);
    const selectedSize = active?.dataset.size;
    const selectedOut = selectedSize ? isVariantOutOfStock(p, selectedSize, color) : allDisabled;

    const disableActions = allDisabled || selectedOut;
    if (addBtn) addBtn.disabled = disableActions;
    if (buyBtn) buyBtn.disabled = disableActions;
    if (addBtn) addBtn.style.opacity = disableActions ? '0.5' : '';
    if (buyBtn) buyBtn.style.opacity = disableActions ? '0.5' : '';

    if (msgEl) {
        if (allDisabled) {
            msgEl.textContent = 'All sizes are out of stock for this color.';
            msgEl.style.display = 'block';
        } else if (selectedOut) {
            msgEl.textContent = 'Selected size/color is out of stock.';
            msgEl.style.display = 'block';
        } else {
            msgEl.style.display = 'none';
        }
    }
    // Keep the price in sync with the active size (per-size pricing)
    if (typeof updatePdPriceDisplay === 'function') updatePdPriceDisplay(pid);
}

// ===== Cart Functions =====
function addToCart(id) {
    requireAuth(() => {
        const product = productsData.find(p => p.id === id);
        if (!product) return;
        const card = document.querySelector(`.shop-card[data-id="${id}"]`);
        const selectedColor = card?.querySelector('.color-swatch.active')?.dataset.colorName || getProductColors(product)?.[0]?.name || null;
        const colors = getProductColors(product);
        const defaultColor = selectedColor || (colors ? colors[0].name : null);
        const availableSize = (product.sizes || []).find(s => !isVariantOutOfStock(product, s, defaultColor));
        if (!availableSize) { showToast('This variant is currently out of stock!'); return; }
        const existing = cart.find(item => item.id === id);
        if (existing) existing.qty++;
        else cart.push({ ...product, qty: 1, selectedSize: availableSize, selectedColor: defaultColor });
        saveCart(); updateCartUI(); openCart();
        showToast(`${product.name} added to cart!`);
    });
}
function buyNow(id) { requireAuth(() => { addToCart(id); openCheckout(); }); }
function removeFromCart(id) { cart = cart.filter(item => item.id !== id); saveCart(); updateCartUI(); }
function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) { item.qty += delta; if (item.qty <= 0) removeFromCart(id); else { saveCart(); updateCartUI(); } }
}
function saveCart() { localStorage.setItem('ssa_cart', JSON.stringify(cart)); }

const ORDER_SUPPORT_PHONE = '+91 93666 40050';
// WhatsApp replaced with chatbot/contact page

function getSavedAddresses() {
    if (!currentUser || !currentUser.email) return [];
    try { return JSON.parse(localStorage.getItem('ssa_addresses_' + currentUser.email) || '[]'); }
    catch (e) { return []; }
}

function _normalizeAddressRecord(address, index) {
    const street = String(address?.street || address?.address || '').trim();
    const city = String(address?.city || '').trim();
    const pincode = String(address?.pincode || address?.pin || '').trim();
    const state = String(address?.state || 'Tamil Nadu').trim() || 'Tamil Nadu';
    const label = String(address?.label || '').trim() || (index === 0 ? 'Default address' : 'Saved address ' + (index + 1));
    return {
        id: String(address?.id || 'addr-' + index),
        label,
        street,
        city,
        pincode,
        state,
        summary: [street, city, pincode].filter(Boolean).join(', ')
    };
}

function _addressSignature(address) {
    return [address?.street, address?.city, address?.pincode, address?.state]
        .map(v => String(v || '').trim().toLowerCase())
        .join('||');
}

function upsertSavedAddressForCurrentUser(address) {
    if (!currentUser || !currentUser.email) return { saved: false, list: [] };
    const street = String(address?.address || address?.street || '').trim();
    const city = String(address?.city || '').trim();
    const pincode = String(address?.pincode || '').trim();
    const state = String(address?.state || 'Tamil Nadu').trim() || 'Tamil Nadu';
    if (!street || !city || !pincode) return { saved: false, list: getSavedAddresses() };
    const list = getSavedAddresses();
    const next = { street, city, pincode, state };
    const sig = _addressSignature(next);
    const existingIndex = list.findIndex(addr => _addressSignature(addr) === sig);
    if (existingIndex === -1) {
        list.unshift(next);
    } else {
        const [matched] = list.splice(existingIndex, 1);
        list.unshift({ ...matched, ...next });
    }
    localStorage.setItem('ssa_addresses_' + currentUser.email, JSON.stringify(list));
    return { saved: true, list };
}

function fillShippingFormFromAddress(address) {
    if (!address) return;
    const addrEl = document.querySelector('[name="address"]');
    const cityEl = document.querySelector('[name="city"]');
    const pinEl = document.querySelector('[name="pincode"]');
    if (addrEl) addrEl.value = address.street || '';
    if (cityEl) cityEl.value = address.city || '';
    if (pinEl) pinEl.value = address.pincode || '';
}

function renderCheckoutAddressOptions(selectedValue) {
    const wrap = document.getElementById('checkoutAddressPicker');
    const select = document.getElementById('checkoutAddressSelect');
    const hint = document.getElementById('checkoutAddressHint');
    if (!wrap || !select) return;

    const addresses = getSavedAddresses().map(_normalizeAddressRecord);
    if (!currentUser) {
        wrap.style.display = 'none';
        return;
    }

    wrap.style.display = 'block';
    let html = '<option value="new">+ Add new address</option>';
    html += addresses.map((address, index) => `<option value="${index}">${escapeRichText(address.label)} - ${escapeRichText(address.summary || address.state)}</option>`).join('');
    select.innerHTML = html;

    if (selectedValue === undefined || selectedValue === null || selectedValue === '') {
        const currentSig = _addressSignature({
            street: document.querySelector('[name="address"]')?.value || '',
            city: document.querySelector('[name="city"]')?.value || '',
            pincode: document.querySelector('[name="pincode"]')?.value || ''
        });
        const matchedIndex = addresses.findIndex(address => _addressSignature(address) === currentSig);
        selectedValue = matchedIndex >= 0 ? String(matchedIndex) : (addresses.length ? '0' : 'new');
    }

    select.value = selectedValue;
    const active = selectedValue !== 'new' ? addresses[parseInt(selectedValue, 10)] : null;
    hint.textContent = active
        ? 'Using ' + active.label + '. Switch to "+ Add new address" to create a fresh address at checkout.'
        : 'Create a fresh shipping address here. It will be saved to your account after you place the order.';
}

function handleCheckoutAddressSelection(value) {
    const addresses = getSavedAddresses().map(_normalizeAddressRecord);
    const hint = document.getElementById('checkoutAddressHint');
    if (value === 'new') {
        const addrEl = document.querySelector('[name="address"]');
        const cityEl = document.querySelector('[name="city"]');
        const pinEl = document.querySelector('[name="pincode"]');
        if (addrEl) addrEl.value = '';
        if (cityEl) cityEl.value = '';
        if (pinEl) pinEl.value = '';
        if (hint) hint.textContent = 'Create a fresh shipping address here. It will be saved to your account after you place the order.';
        return;
    }
    const address = addresses[parseInt(value, 10)];
    if (!address) return;
    fillShippingFormFromAddress(address);
    if (hint) hint.textContent = 'Loaded ' + address.label + ' for this order.';
}

function ensureCheckoutAddressUI() {
    const addressGroup = document.querySelector('#checkoutForm [name="address"]')?.closest('.form-group');
    if (!addressGroup || document.getElementById('checkoutAddressPicker')) return;
    const picker = document.createElement('div');
    picker.id = 'checkoutAddressPicker';
    picker.className = 'checkout-address-picker';
    picker.innerHTML = `
        <div class="checkout-address-picker-head">
            <div>
                <span class="checkout-address-eyebrow">Saved Addresses</span>
                <h5>Select a saved address or add a new one</h5>
            </div>
            <i class="fas fa-map-marked-alt"></i>
        </div>
        <div class="checkout-address-select-wrap">
            <select id="checkoutAddressSelect" class="checkout-address-select"></select>
        </div>
        <p class="checkout-address-hint" id="checkoutAddressHint"></p>
    `;
    addressGroup.parentNode.insertBefore(picker, addressGroup);
    picker.querySelector('#checkoutAddressSelect').addEventListener('change', (event) => {
        handleCheckoutAddressSelection(event.target.value);
    });
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    if (!cartCount) return;
    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    cartCount.textContent = totalItems;
    if (cart.length === 0) {
        if (cartItems) cartItems.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p><a href="categories.html" class="btn btn-gradient btn-sm">Start Shopping</a></div>';
        if (cartFooter) cartFooter.style.display = 'none';
    } else {
        if (cartItems) cartItems.innerHTML = cart.map(item => `<div class="cart-item"><div class="cart-item-img"><img src="${item.image}" alt="${item.name}"></div><div class="cart-item-info"><h4>${item.name}</h4><span class="item-meta">Size: ${item.selectedSize}${item.selectedColor ? ' | Color: ' + item.selectedColor : ''}</span><div class="item-price">₹${item.price * item.qty}</div><div class="cart-item-qty"><button onclick="updateQty(${item.id},-1)"><i class="fas fa-minus"></i></button><span>${item.qty}</span><button onclick="updateQty(${item.id},1)"><i class="fas fa-plus"></i></button></div></div><button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button></div>`).join('');
        if (cartFooter) cartFooter.style.display = 'block';
        if (cartTotal) cartTotal.textContent = `₹${totalPrice.toLocaleString()}`;
    }
}

function openCart() { document.getElementById('cartDrawer').classList.add('open'); document.getElementById('cartOverlay').classList.add('open'); }
function closeCart() { document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('open'); }
function closeCheckoutModal() { document.getElementById('checkoutModal').classList.remove('active'); document.body.style.overflow = 'auto'; }

// ===== Checkout =====
function openCheckout() {
    closeCart();
    document.body.style.overflow = 'hidden';
    document.getElementById('checkoutModal').classList.add('active');
    nextStep(1);
    ensureCheckoutAddressUI();
    // Pre-fill contact fields from logged-in user (readonly)
    if (currentUser) {
        const phoneEl = document.querySelector('[name="cphone"]');
        const emailEl = document.querySelector('[name="cemail"]');
        const fnEl   = document.querySelector('[name="firstname"]');
        const lnEl   = document.querySelector('[name="lastname"]');
        if (phoneEl && currentUser.phone) { phoneEl.value = currentUser.phone; phoneEl.readOnly = true; phoneEl.style.background = '#f1f5f9'; phoneEl.style.color = '#64748b'; }
        if (emailEl && currentUser.email) { emailEl.value = currentUser.email; emailEl.readOnly = true; emailEl.style.background = '#f1f5f9'; emailEl.style.color = '#64748b'; }
        // Pre-fill name if available
        const nameParts = (currentUser.name || '').split(' ');
        if (fnEl && !fnEl.value) fnEl.value = nameParts[0] || '';
        if (lnEl && !lnEl.value) lnEl.value = nameParts.slice(1).join(' ') || '';
        const addresses = getSavedAddresses();
        if (addresses.length > 0 && !document.querySelector('[name="address"]')?.value.trim()) {
            fillShippingFormFromAddress(_normalizeAddressRecord(addresses[0], 0));
        }
        renderCheckoutAddressOptions();
    } else {
        renderCheckoutAddressOptions('new');
    }
}
function nextStep(step) {
    if ((step === 2 || step === 3) && !validateShippingForm()) return;
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.checkout-steps .step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    document.querySelectorAll('.checkout-steps .step').forEach(s => { if (parseInt(s.dataset.step) <= step) s.classList.add('active'); });
    if (step === 3) renderOrderSummary();
}
function validateShippingForm() {
    const fields = [{name:'firstname',label:'First Name'},{name:'lastname',label:'Last Name'},{name:'cphone',label:'Phone'},{name:'cemail',label:'Email'},{name:'address',label:'Address'},{name:'city',label:'City'},{name:'pincode',label:'PIN Code'}];
    let valid = true;
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('.form-group.has-error').forEach(el => el.classList.remove('has-error'));
    fields.forEach(f => {
        const input = document.querySelector(`[name="${f.name}"]`); if (!input) return;
        if (!input.value.trim()) { valid = false; const g = input.closest('.form-group'); g.classList.add('has-error'); const e = document.createElement('span'); e.className = 'field-error'; e.textContent = `Please fill ${f.label}`; g.appendChild(e); }
    });
    const email = document.querySelector('[name="cemail"]');
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { valid = false; const g = email.closest('.form-group'); if (!g.classList.contains('has-error')) { g.classList.add('has-error'); const e = document.createElement('span'); e.className = 'field-error'; e.textContent = 'Invalid email'; g.appendChild(e); } }
    if (!valid) showToast('Please fill all required fields');
    return valid;
}
function renderOrderSummary() {
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('orderSummary').innerHTML = `${cart.map(i => `<div class="os-item"><span>${i.name} x${i.qty}</span><span>₹${i.price*i.qty}</span></div>`).join('')}<div class="os-item"><span>Shipping</span><span>${total > 2000 ? 'FREE' : '₹150'}</span></div><div class="os-total"><span>Total</span><span>₹${(total > 2000 ? total : total + 150).toLocaleString()}</span></div>`;
    // Always Pay Online via Razorpay
    const placeBtn = document.querySelector('#step3 button[type="submit"]');
    if (placeBtn) placeBtn.innerHTML = '<i class="fas fa-lock"></i> Proceed to Pay';
}
function closeSuccessModal() { document.getElementById('successModal').classList.remove('active'); }

// ===== Product Detail =====
let pdQuantity = 1;

function _pdGetImages(p, colorName) {
    if (p.colorVariants && p.colorVariants.length) {
        const cv = colorName ? p.colorVariants.find(c => c.name === colorName) : p.colorVariants[0];
        if (cv && cv.images && cv.images.length) return cv.images;
        if (cv) return p.image ? [p.image] : [];
    }
    return p.image ? [p.image] : [];
}

function openProductDetail(id) {
    const p = productsData.find(x => x.id === id); if (!p) return;
    const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    const colors = getProductColors(p);

    // Auto-select first color that has at least one available size
    let defaultColorObj = colors ? colors[0] : null;
    if (colors) {
        const good = colors.find(c => (p.sizes || []).some(s => !isVariantOutOfStock(p, s, c.name)));
        if (good) defaultColorObj = good;
    }
    const defaultColor = defaultColorObj ? defaultColorObj.name : null;
    const firstAvailableSize = (p.sizes || []).find(s => !isVariantOutOfStock(p, s, defaultColor));

    // Image gallery
    const initImages = _pdGetImages(p, defaultColor);
    window._lbImages = initImages;
    window._lbIndex = 0;
    const mainImg = initImages[0] || '';
    const thumbsHtml = initImages.length > 1 ? `<div class="pd-thumbnails" id="pdThumbs-${p.id}">${initImages.map((img,i) => `<button class="pd-thumb${i===0?' active':''}" onclick="selectPdImage(this,'${img.replace(/'/g,"\\'")}',${ p.id})" style="background-image:url('${img.replace(/'/g,"\\'")}')"></button>`).join('')}</div>` : `<div class="pd-thumbnails" id="pdThumbs-${p.id}" style="display:none"></div>`;

    // Color swatches
    const colorSection = colors ? `<div class="pd-color-section"><h4>Select Color</h4><div class="pd-color-swatches">${colors.map(c => { const isDef = c.name === defaultColorObj?.name; const allOos = (p.sizes||[]).every(s => isVariantOutOfStock(p,s,c.name)); return `<button class="pd-color-swatch${isDef?' active':''}${allOos?' swatch-oos':''}" data-hex="${c.hex}" data-color-name="${c.name}" title="${c.name}${allOos?' (Out of Stock)':''}" style="background:${c.hex}${c.hex==='#FFFFFF'?';border-color:#ccc':''}" onclick="selectDetailColor(this,${p.id})"></button>`; }).join('')}</div><span class="pd-color-name">${defaultColorObj?.name||''}</span></div>` : '';

    // Embroidery section (admin-configurable per type; body hidden until "Add Embroidery")
    const embEnabled = isEmbEnabled(p);
    const embPrices = getEmbPrices(p);
    const _embTag = (t) => embPrices[t] === 0
        ? '<small class="emb-type-price emb-type-free">FREE</small>'
        : `<small class="emb-type-price">+\u20b9${embPrices[t]}</small>`;
    const _embVals = [embPrices['TEXT'], embPrices['LOGO'], embPrices['TEXT & LOGO']];
    const _embMin = Math.min(..._embVals);
    const embAllFree = _embVals.every(v => v === 0);
    const embToggleBadge = _embMin === 0
        ? '<span class="emb-badge emb-free"><i class="fas fa-gift"></i> ' + (embAllFree ? 'FREE' : 'FREE option') + '</span>'
        : `<span class="emb-badge">from +\u20b9${_embMin}</span>`;
    const embHtml = embEnabled ? `<div class="emb-section${_embMin === 0 ? ' emb-section-free' : ''}" id="embSec-${p.id}"><div class="emb-toggle" onclick="toggleEmbroidery(${p.id})"><span><i class="fas fa-pen-nib"></i> Add Embroidery ${embToggleBadge}</span><i class="fas fa-chevron-down emb-chevron" id="embChev-${p.id}"></i></div><div class="emb-body" id="embBody-${p.id}" style="display:none"><div class="emb-field"><label>Embroidery Type *</label><div class="emb-type-row"><button type="button" class="emb-type-btn active" data-type="TEXT" data-emb-price="${embPrices['TEXT']}" onclick="selectEmbType(this,${p.id})">TEXT ${_embTag('TEXT')}</button><button type="button" class="emb-type-btn" data-type="LOGO" data-emb-price="${embPrices['LOGO']}" onclick="selectEmbType(this,${p.id})">LOGO ${_embTag('LOGO')}</button><button type="button" class="emb-type-btn" data-type="TEXT &amp; LOGO" data-emb-price="${embPrices['TEXT & LOGO']}" onclick="selectEmbType(this,${p.id})">TEXT &amp; LOGO ${_embTag('TEXT & LOGO')}</button></div></div><div class="emb-text-fields" id="embTF-${p.id}"><div class="emb-row2"><div class="emb-field"><label>Line 1 *</label><div class="emb-inp-wrap"><input type="text" id="embL1-${p.id}" maxlength="100" placeholder="Enter Line 1" oninput="updateEmbCount(this,'embC1-${p.id}')"><span id="embC1-${p.id}" class="emb-char-count">0/100</span></div></div><div class="emb-field"><label>Line 2</label><div class="emb-inp-wrap"><input type="text" id="embL2-${p.id}" maxlength="100" placeholder="Enter Line 2" oninput="updateEmbCount(this,'embC2-${p.id}')"><span id="embC2-${p.id}" class="emb-char-count">0/100</span></div></div></div><div class="emb-field"><label>Line 3</label><div class="emb-inp-wrap"><input type="text" id="embL3-${p.id}" maxlength="100" placeholder="Enter Line 3" oninput="updateEmbCount(this,'embC3-${p.id}')"><span id="embC3-${p.id}" class="emb-char-count">0/100</span></div></div><div class="emb-row2"><div class="emb-field"><label>Text Position *</label><select id="embPos-${p.id}"><option value="">Select Position</option><option>Left Chest</option><option>Right Chest</option><option>Back Center</option><option>Left Sleeve</option><option>Right Sleeve</option></select></div><div class="emb-field"><label>Text Color</label><div class="emb-colors"><button type="button" class="emb-col active" style="background:#fff;border:2px solid #ccc" data-c="White" onclick="selectEmbColor(this)" title="White"></button><button type="button" class="emb-col" style="background:#000" data-c="Black" onclick="selectEmbColor(this)" title="Black"></button><button type="button" class="emb-col" style="background:#1A237E" data-c="Navy" onclick="selectEmbColor(this)" title="Navy"></button><button type="button" class="emb-col" style="background:#F9A825" data-c="Yellow" onclick="selectEmbColor(this)" title="Yellow"></button><button type="button" class="emb-col" style="background:#C62828" data-c="Red" onclick="selectEmbColor(this)" title="Red"></button><button type="button" class="emb-col" style="background:#E65100" data-c="Orange" onclick="selectEmbColor(this)" title="Orange"></button><button type="button" class="emb-col" style="background:#1B5E20" data-c="Green" onclick="selectEmbColor(this)" title="Green"></button></div></div></div><div class="emb-field"><label>Font Style</label><div class="emb-fonts"><button type="button" class="emb-font active" style="font-family:cursive;font-size:1rem" data-f="Cursive" onclick="selectEmbFont(this)">Cursive</button><button type="button" class="emb-font" style="font-family:Georgia,serif;font-size:0.9rem" data-f="Serif" onclick="selectEmbFont(this)">Serif</button><button type="button" class="emb-font" style="font-family:sans-serif;font-weight:900;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase" data-f="Block" onclick="selectEmbFont(this)">Block</button></div></div></div><div class="emb-logo-fields" id="embLogoF-${p.id}" style="display:none"><div class="emb-field"><label>Upload Logo *</label><input type="file" id="embLogoFile-${p.id}" accept="image/*" onchange="previewEmbLogo(this,'${p.id}')"><div id="embLogoPreview-${p.id}" class="emb-logo-preview" style="display:none"><img id="embLogoImg-${p.id}" src="" alt="Logo preview" style="max-width:100px;max-height:80px;object-fit:contain;border-radius:6px;margin-top:6px;"><span class="emb-logo-filename" id="embLogoName-${p.id}"></span></div><p class="emb-logo-note"><i class="fas fa-info-circle"></i> Accepted: PNG, JPG, SVG (max 2MB)</p></div><div class="emb-field"><label>Logo Position *</label><select id="embLogoPos-${p.id}"><option value="">Select Position</option><option>Left Chest</option><option>Right Chest</option><option>Back Center</option><option>Left Sleeve</option><option>Right Sleeve</option></select></div></div></div></div>` : '';

    const modal = document.getElementById('productDetailModal');
    const accordionHtml = (p.fitSizing || p.fabricCare || p.returns) ? `<div class="pd-accordion">${p.fitSizing ? `<div class="pd-accordion-item"><button class="pd-accordion-header" onclick="togglePdAccordion(this)"><span>Details &amp; Fit</span><i class="fas fa-plus"></i></button><div class="pd-accordion-body">${renderRichText(p.fitSizing)}</div></div>` : ''}${p.fabricCare ? `<div class="pd-accordion-item"><button class="pd-accordion-header" onclick="togglePdAccordion(this)"><span>Fabric &amp; Care</span><i class="fas fa-plus"></i></button><div class="pd-accordion-body">${renderRichText(p.fabricCare)}</div></div>` : ''}${p.returns ? `<div class="pd-accordion-item"><button class="pd-accordion-header" onclick="togglePdAccordion(this)"><span>Return &amp; Exchange</span><i class="fas fa-plus"></i></button><div class="pd-accordion-body">${renderRichText(p.returns)}</div></div>` : ''}</div>` : '';
    modal.innerHTML = `<div class="modal product-detail-modal"><button class="modal-close pd-close" onclick="closeProductDetail()"><i class="fas fa-times"></i></button><div class="pd-grid"><div class="pd-image-gallery">${thumbsHtml}<div class="pd-main-img" id="pdMainWrap-${p.id}" onclick="openImageLightbox('pdMainImg-${p.id}')">${mainImg ? `<img id="pdMainImg-${p.id}" src="${mainImg}" alt="${p.name}">` : `<div class="pd-no-img"><i class="fas fa-tshirt"></i></div>`}<button class="pd-expand-btn" onclick="event.stopPropagation();openImageLightbox('pdMainImg-${p.id}')" aria-label="Expand"><i class="fas fa-expand-alt"></i></button>${p.badge?`<span class="pd-badge">${p.badge}</span>`:''}</div></div><div class="pd-info"><span class="pd-category">${typeof getCategoryLabel === 'function' ? getCategoryLabel(p.category) : p.category.replace(/-/g,' ')}</span><h2 class="pd-title" id="pdTitle-${p.id}">${p.name}${defaultColor ? `<span class="pd-title-color"> — ${defaultColor}</span>` : ''}</h2><div class="pd-rating"><span class="rating-val">${(p.rating||0).toFixed(1)}</span>${'<i class="fas fa-star"></i>'.repeat(Math.floor(p.rating||0))}${(p.rating||0)%1?'<i class="fas fa-star-half-alt"></i>':''}<span>(${p.reviews||0} reviews)</span></div><div class="pd-price"><span class="pd-current-price" id="pdCurPrice-${p.id}">\u20b9${p.price}</span><span class="pd-old-price" id="pdOldPrice-${p.id}"${p.oldPrice?'':' style="display:none"'}>\u20b9${p.oldPrice||''}</span><span class="pd-discount" id="pdDiscount-${p.id}"${p.oldPrice?'':' style="display:none"'}>${discount}% OFF</span><span class="pd-emb-note" id="pdEmbNote-${p.id}" style="display:none"></span></div><div class="pd-description">${renderRichText(p.description)}</div>${colorSection}<div class="pd-size-section"><h4>Select Size</h4><div class="pd-sizes" id="pdSizes-${p.id}">${p.sizes.map((s,i)=>{ const oos=isVariantOutOfStock(p,s,defaultColor); const active=firstAvailableSize?(s===firstAvailableSize):(!oos&&i===0); return `<button class="pd-size-btn${active?' active':''}${oos?' is-oos':''}" data-size="${s.replace(/"/g,'&quot;')}" ${oos?'disabled title="Out of stock for this color"':''} onclick="selectSize(this,${p.id})">${s}</button>`; }).join('')}</div><p id="pdVariantStockMsg-${p.id}" style="display:none;color:#dc2626;font-size:0.85rem;margin-top:8px;"></p></div>${embHtml}<div class="pd-qty-section"><h4>Quantity</h4><div class="pd-qty"><button onclick="changePdQty(-1)"><i class="fas fa-minus"></i></button><span id="pdQty">1</span><button onclick="changePdQty(1)"><i class="fas fa-plus"></i></button></div></div><div class="pd-actions"><button id="pdAddBtn-${p.id}" class="btn btn-primary btn-lg" onclick="addToCartFromDetail(${p.id})"><i class="fas fa-cart-plus"></i> Add to Cart</button><button id="pdBuyBtn-${p.id}" class="btn btn-outline-dark btn-lg" onclick="buyNowFromDetail(${p.id})"><i class="fas fa-bolt"></i> Buy Now</button></div><div class="pd-features"><div class="pd-feature"><i class="fas fa-truck"></i> Free delivery above \u20b92000</div><div class="pd-feature"><i class="fas fa-undo"></i> 7-day returns</div><div class="pd-feature"><i class="fas fa-shield-alt"></i> Quality guaranteed</div></div>${accordionHtml}</div></div></div>`;
    modal.classList.add('active'); pdQuantity = 1;
    document.body.classList.add('modal-open'); // lock background scroll (mobile fix)
    modal.scrollTop = 0;
    updateProductDetailVariantState(p.id);
}
function changePdQty(d) { pdQuantity = Math.max(1, pdQuantity + d); const el = document.getElementById('pdQty'); if (el) el.textContent = pdQuantity; }
function togglePdAccordion(btn) {
    const item = btn.parentElement;
    const body = item.querySelector('.pd-accordion-body');
    const icon = btn.querySelector('i');
    const isOpen = item.classList.toggle('open');
    if (body) { body.style.maxHeight = isOpen ? body.scrollHeight + 'px' : '0'; }
    if (icon) { icon.className = isOpen ? 'fas fa-minus' : 'fas fa-plus'; }
}
window.togglePdAccordion = togglePdAccordion;
function selectSize(btn, pid) {
    if (btn.disabled) return;
    btn.parentElement.querySelectorAll('.pd-size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateProductDetailVariantState(pid);
    if (typeof updatePdPriceDisplay === 'function') updatePdPriceDisplay(pid);
}
function getSelectedSize(pid) { const c = document.getElementById(`pdSizes-${pid}`); if (!c) return null; const a = c.querySelector('.pd-size-btn.active'); return a ? a.dataset.size : null; }
function getSelectedColor(pid) { const c = document.querySelector('.pd-color-swatch.active'); return c ? c.dataset.colorName : null; }
function addToCartFromDetail(id) {
    requireAuth(() => {
        const size = getSelectedSize(id); const color = getSelectedColor(id); const p = productsData.find(x => x.id === id);
        if (!p) return;
        if (size && isVariantOutOfStock(p, size, color)) { showToast(`${size}${color ? ' / ' + color : ''} is out of stock!`); return; }
        if (p.outOfStock) { showToast('This product is currently out of stock!'); return; }
        const emb = getEmbroideryData(id);
        const base = typeof getSizePrice === 'function' ? getSizePrice(p, size) : { price: p.price };
        const effectivePrice = base.price + (emb ? emb.price : 0);
        const existing = cart.find(i => i.id === id && i.selectedSize === size && i.selectedColor === color && !i.embroidery);
        if (existing && !emb) { existing.qty += pdQuantity; } else { cart.push({ ...p, price: effectivePrice, qty: pdQuantity, selectedSize: size, selectedColor: color || getProductColors(p)?.[0]?.name || null, embroidery: emb || null }); }
        saveCart(); updateCartUI();
        const embMsg = emb ? ` + Embroidery` : '';
        showToast(`${p.name} (${size}${color ? ', ' + color : ''}${embMsg}) added!`);
        closeProductDetail(); pdQuantity = 1;
    });
}
function buyNowFromDetail(id) { requireAuth(() => { addToCartFromDetail(id); openCheckout(); }); }
function closeProductDetail() { document.getElementById('productDetailModal').classList.remove('active'); document.body.classList.remove('modal-open'); pdQuantity = 1; }

// ===== Auth System =====
let currentUser = JSON.parse(localStorage.getItem('ssa_user') || 'null');
function updateAuthUI() {
    const btn = document.getElementById('authBtn'); if (!btn) return;
    if (currentUser) { btn.innerHTML = '<i class="fas fa-user-circle"></i>'; btn.title = currentUser.name; btn.onclick = openAccountPanel; }
    else { btn.innerHTML = '<i class="fas fa-user"></i>'; btn.title = 'Login'; btn.onclick = openLoginModal; }
    // Refresh contact form login notice if on contact page
    if (window.prefillContactFromLogin) window.prefillContactFromLogin();
}
function openLoginModal() {
    const modal = document.getElementById('authModal');
    modal.innerHTML = `
<div class="modal auth-modal auth-split">
  <div class="auth-panel-left">
    <div class="auth-logo">
      <img src="images/Images/SSA Logo.png" alt="SSA Logo" width="44">
      <div class="auth-logo-text">
        <span class="auth-logo-name">Siva Suresh</span>
        <span class="auth-logo-sub">Agency</span>
      </div>
    </div>
    <p class="auth-left-tagline">Premium hospital linen &amp; medical uniforms trusted by 500+ healthcare institutions.</p>
    <div class="auth-left-trust">
      <div class="auth-trust-row"><i class="fas fa-hospital"></i> 500+ Hospitals Trust Us</div>
      <div class="auth-trust-row"><i class="fas fa-award"></i> 15+ Years Experience</div>
      <div class="auth-trust-row"><i class="fas fa-truck"></i> Free Delivery on Bulk</div>
      <div class="auth-trust-row"><i class="fas fa-palette"></i> Custom Colors &amp; Sizes</div>
    </div>
    <div class="auth-left-img">
      <img src="images/Images/Male Full Sleeve.jpg" alt="Products">
    </div>
  </div>
  <div class="auth-panel-right">
    <button class="modal-close" onclick="closeAuthModal()" style="position:absolute;top:12px;right:12px;"><i class="fas fa-times"></i></button>
    <div class="auth-tabs" style="margin-bottom:18px;">
      <button class="auth-tab active" onclick="switchAuthTab('login')">Sign In</button>
      <button class="auth-tab" onclick="switchAuthTab('register')">Create Account</button>
    </div>
    <div class="auth-form" id="loginForm">
      <h3 style="margin-bottom:4px;">Welcome Back</h3>
      <p class="auth-subtitle" style="margin-bottom:16px;">Sign in to manage orders &amp; account</p>
      <div class="form-group">
        <label>Email, Phone or Customer ID</label>
        <input type="text" id="loginEmail" placeholder="Email, phone or SSA-XXXXXX">
        <span class="field-error" id="loginEmailError" style="display:none;"></span>
      </div>
      <div class="form-group">
        <label>Password</label>
        <div style="position:relative;">
          <input type="password" id="loginPassword" placeholder="Enter your password" style="padding-right:38px;">
          <button type="button" onclick="togglePwdVis('loginPassword',this)" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:0.85rem;"><i class="fas fa-eye"></i></button>
        </div>
        <span class="field-error" id="loginPasswordError" style="display:none;"></span>
      </div>
            <div style="text-align:right;margin-top:-2px;margin-bottom:10px;">
                <a onclick="openForgotPasswordForm()" style="font-size:0.83rem;color:var(--primary);cursor:pointer;">Forgot password?</a>
            </div>
      <button class="btn btn-gradient btn-full" style="margin-top:4px;" onclick="handleLogin()"><i class="fas fa-sign-in-alt"></i> Sign In</button>
      <p class="auth-switch">New here? <a onclick="switchAuthTab('register')">Create account</a></p>
    </div>
    <div class="auth-form" id="registerForm" style="display:none;">
      <h3 style="margin-bottom:4px;">Create Account</h3>
      <p class="auth-subtitle" style="margin-bottom:16px;">Register to start ordering online</p>
      <div class="form-row">
        <div class="form-group"><label>First Name *</label><input type="text" id="regFirstName" placeholder="First name"><span class="field-error" id="regFirstNameError" style="display:none;"></span></div>
        <div class="form-group"><label>Last Name *</label><input type="text" id="regLastName" placeholder="Last name"><span class="field-error" id="regLastNameError" style="display:none;"></span></div>
      </div>
      <div class="form-group"><label>Email *</label><input type="email" id="regEmail" placeholder="Email address"><span class="field-error" id="regEmailError" style="display:none;"></span></div>
      <div class="form-group"><label>Phone *</label><input type="tel" id="regPhone" placeholder="Mobile number"><span class="field-error" id="regPhoneError" style="display:none;"></span></div>
      <div class="form-row">
        <div class="form-group"><label>Password *</label><input type="password" id="regPassword" placeholder="Min 6 characters"><span class="field-error" id="regPasswordError" style="display:none;"></span></div>
        <div class="form-group"><label>Confirm *</label><input type="password" id="regConfirmPassword" placeholder="Confirm password"><span class="field-error" id="regConfirmPasswordError" style="display:none;"></span></div>
      </div>
      <button class="btn btn-gradient btn-full" style="margin-top:4px;" onclick="handleRegister()"><i class="fas fa-user-plus"></i> Create Account</button>
      <p class="auth-switch">Already have an account? <a onclick="switchAuthTab('login')">Sign in</a></p>
    </div>
        <div class="auth-form" id="forgotForm" style="display:none;">
            <h3 style="margin-bottom:4px;">Reset Password</h3>
            <p class="auth-subtitle" style="margin-bottom:16px;">Enter your registered email to receive a 6-digit OTP</p>
            <!-- Step 1: Enter email -->
            <div id="fpStep1">
                <div class="form-group"><label>Registered Email</label><input type="email" id="fpEmail" placeholder="Email address"></div>
                <p id="fpMsg" style="display:none;font-size:0.82rem;margin-bottom:8px;"></p>
                <button class="btn btn-gradient btn-full" style="margin-top:4px;" onclick="handleForgotSendOtp()"><i class="fas fa-paper-plane"></i> Send OTP</button>
            </div>
            <!-- Step 2: Enter OTP + new password -->
            <div id="fpStep2" style="display:none;">
                <p style="font-size:0.82rem;color:var(--primary);margin-bottom:12px;"><i class="fas fa-info-circle"></i> OTP sent to your email. Check your inbox.</p>
                <div class="form-group"><label>6-Digit OTP</label><input type="text" id="fpOtp" placeholder="Enter OTP" maxlength="6" style="letter-spacing:4px;font-size:1.1rem;text-align:center;"></div>
                <div class="form-group"><label>New Password</label><input type="password" id="fpNewPwd" placeholder="New password (min 6 chars)"></div>
                <div class="form-group"><label>Confirm Password</label><input type="password" id="fpConfirmPwd" placeholder="Confirm new password"></div>
                <p id="fpMsg2" style="display:none;font-size:0.82rem;margin-bottom:8px;"></p>
                <button class="btn btn-gradient btn-full" style="margin-top:4px;" onclick="handleForgotVerifyOtp()"><i class="fas fa-check"></i> Verify & Reset</button>
                <p style="font-size:0.78rem;color:var(--text-muted);margin-top:8px;text-align:center;">OTP expires in 10 minutes. <a onclick="handleForgotSendOtp()" style="color:var(--primary);cursor:pointer;">Resend</a></p>
            </div>
            <p class="auth-switch">Remembered password? <a onclick="backToLoginFromForgot()">Back to sign in</a></p>
        </div>
  </div>
</div>`;
    modal.classList.add('active');
    setTimeout(() => { const el = document.getElementById('loginEmail'); if (el) el.focus(); }, 100);
}
function togglePwdVis(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') { input.type = 'text'; btn.innerHTML = '<i class="fas fa-eye-slash"></i>'; }
    else { input.type = 'password'; btn.innerHTML = '<i class="fas fa-eye"></i>'; }
}
function switchAuthTab(tab) {
    const forgot = document.getElementById('forgotForm');
    if (forgot) forgot.style.display = 'none';
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    if (tab === 'login') { document.getElementById('loginForm').style.display = 'block'; document.getElementById('registerForm').style.display = 'none'; document.querySelectorAll('.auth-tab')[0].classList.add('active'); }
    else { document.getElementById('loginForm').style.display = 'none'; document.getElementById('registerForm').style.display = 'block'; document.querySelectorAll('.auth-tab')[1].classList.add('active'); }
}
function openForgotPasswordForm() {
    const tabs = document.querySelector('.auth-tabs');
    if (tabs) tabs.style.display = 'none';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('forgotForm').style.display = 'block';
    const msg = document.getElementById('fpMsg');
    if (msg) msg.style.display = 'none';
}
function backToLoginFromForgot() {
    const tabs = document.querySelector('.auth-tabs');
    if (tabs) tabs.style.display = 'flex';
    switchAuthTab('login');
}
// ── Forgot Password OTP flow ──────────────────────────────────
let _fpOtpStore = null; // { code, email, expires }

async function handleForgotSendOtp() {
    const email = document.getElementById('fpEmail')?.value.trim();
    const msg = document.getElementById('fpMsg');
    const btn = document.querySelector('#fpStep1 button.btn.btn-gradient');
    const showMsg = (text, ok) => { if(msg){ msg.textContent = text; msg.style.color = ok===true?'#10b981':ok===false?'#ef4444':'#0ea5e9'; msg.style.display='block'; } };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showMsg('Please enter a valid email address', false); return; }

    // Check email exists (local fallback)
    const users = JSON.parse(localStorage.getItem('ssa_users') || '[]');
    const localUser = users.find(u => (u.email||'').toLowerCase() === email.toLowerCase());

    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending OTP...'; }
    showMsg('Sending OTP...', null);

    // Generate a 6-digit OTP stored in sessionStorage (for Supabase-based flow)
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    _fpOtpStore = { code: otp, email: email.toLowerCase(), expires: Date.now() + 10 * 60 * 1000 };

    // Send OTP via Supabase magic link / or via Power Automate webhook
    let sent = false;

    // Try Supabase OTP email
    if (window.auth && typeof window.auth.signInWithOtp === 'function') {
        try {
            await window.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
            sent = true;
            // Supabase sends a magic link; tell user to check email for the link
            showMsg('Check your email for a reset link from Supabase Auth.', true);
        } catch(e) { console.warn('[otp] supabase OTP failed', e.message); }
    }

    // Fallback: send OTP via Power Automate webhook (if configured)
    if (!sent && window.SSA_COMM) {
        const cfg = window.SSA_COMM.getConfig ? await window.SSA_COMM.getConfig() : {};
        if (cfg.ticketStatusWebhook) {
            await fetch(cfg.ticketStatusWebhook, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
                type: 'otp_email', toEmail: email, otp,
                emailSubject: 'Your SSA Password Reset OTP',
                emailBody: `Your OTP to reset your Siva Suresh Agency password is:\n\n${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.`
            })}).catch(()=>{});
            sent = true;
        }
    }

    // Fallback: Use Supabase reset email
    if (!sent && window.auth && typeof window.auth.sendPasswordResetEmail === 'function') {
        try {
            await window.auth.sendPasswordResetEmail(email);
            sent = true;
            showMsg('Password reset link sent to your email. Check inbox/spam.', true);
            if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send OTP'; }
            return;
        } catch(e) { console.warn('[forgot] email reset failed', e.message); }
    }

    if (!sent) {
        // Show OTP locally (dev/fallback mode - visible to user in dev)
        console.info('[OTP] Dev mode OTP:', otp);
        showMsg('OTP sent! (If you don\'t receive it, check with admin)', true);
    } else if (!window.auth?.signInWithOtp) {
        showMsg('OTP sent to ' + email + '! Check your inbox.', true);
    }

    // Show step 2
    document.getElementById('fpStep1').style.display = 'none';
    document.getElementById('fpStep2').style.display = 'block';
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send OTP'; }
}

async function handleForgotVerifyOtp() {
    const otp = document.getElementById('fpOtp')?.value.trim();
    const newPwd = document.getElementById('fpNewPwd')?.value;
    const confirmPwd = document.getElementById('fpConfirmPwd')?.value;
    const msg2 = document.getElementById('fpMsg2');
    const showMsg = (text, ok) => { if(msg2){ msg2.textContent=text; msg2.style.color=ok===true?'#10b981':ok===false?'#ef4444':'#0ea5e9'; msg2.style.display='block'; } };

    if (!otp || otp.length !== 6) { showMsg('Enter the 6-digit OTP', false); return; }
    if (!newPwd || newPwd.length < 6) { showMsg('Password must be at least 6 characters', false); return; }
    if (newPwd !== confirmPwd) { showMsg('Passwords do not match', false); return; }

    if (!_fpOtpStore || _fpOtpStore.code !== otp) { showMsg('Invalid or expired OTP', false); return; }
    if (Date.now() > _fpOtpStore.expires) { showMsg('OTP has expired. Please request a new one.', false); return; }

    const email = _fpOtpStore.email;

    // Update password in local store
    const users = JSON.parse(localStorage.getItem('ssa_users') || '[]');
    const idx = users.findIndex(u => (u.email||'').toLowerCase() === email);
    if (idx !== -1) { users[idx].password = newPwd; localStorage.setItem('ssa_users', JSON.stringify(users)); }

    // Update in Supabase Auth
    if (window.auth && typeof window.auth.updateUser === 'function') {
        try { await window.auth.updateUser({ password: newPwd }); } catch(e) { console.warn('[forgot] Supabase updateUser failed:', e.message); }
    }

    _fpOtpStore = null;
    showMsg('Password reset successfully! You can now sign in.', true);
    setTimeout(() => backToLoginFromForgot(), 2000);
}

function handleForgotPasswordReset() { handleForgotSendOtp(); } // backward compat

function _upsertLocalUserProfile(profile) {
    const users = JSON.parse(localStorage.getItem('ssa_users') || '[]');
    const idx = users.findIndex(u => u.email === profile.email);
    const row = {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email,
        phone: profile.phone || '',
        password: profile.password || users[idx]?.password || '',
        createdAt: users[idx]?.createdAt || new Date().toISOString()
    };
    if (idx === -1) users.push(row);
    else users[idx] = { ...users[idx], ...row };
    localStorage.setItem('ssa_users', JSON.stringify(users));
}

async function handleLogin() {
    const emailInput = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    document.getElementById('loginEmailError').style.display = 'none';
    document.getElementById('loginPasswordError').style.display = 'none';
    if (!emailInput) { document.getElementById('loginEmailError').textContent = 'Required'; document.getElementById('loginEmailError').style.display = 'block'; return; }
    if (!password) { document.getElementById('loginPasswordError').textContent = 'Required'; document.getElementById('loginPasswordError').style.display = 'block'; return; }

    // Support login via Customer ID (SSA-XXXXXXXX format)
    let email = emailInput;
    if (/^SSA-[A-Z0-9]+$/i.test(emailInput)) {
        const users = JSON.parse(localStorage.getItem('ssa_users') || '[]');
        const byId = users.find(u => u.customerId && u.customerId.toLowerCase() === emailInput.toLowerCase());
        if (byId) { email = byId.email; }
        else { document.getElementById('loginEmailError').textContent = 'Customer ID not found'; document.getElementById('loginEmailError').style.display = 'block'; return; }
    }

    // Primary path: backend auth (email only)
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && window.auth && typeof window.auth.signInWithEmailAndPassword === 'function') {
        try {
            const r = await window.auth.signInWithEmailAndPassword(email, password);
            const u = r?.user || r?.data?.user || null;
            const md = u?.user_metadata || {};
            const firstName = md.firstName || (md.name ? String(md.name).split(' ')[0] : 'User');
            const lastName = md.lastName || '';
            const phone = md.phone || '';
            // Restore or generate customer ID — priority: localStorage → Supabase → deterministic hash
            const users = JSON.parse(localStorage.getItem('ssa_users') || '[]');
            const localRec = users.find(ur => ur.email === (u?.email || email));
            let customerId = localRec?.customerId;
            if (!customerId && window.db) {
                try {
                    const docId = (u?.email || email).replace(/[^a-zA-Z0-9]/g, '_');
                    const snap = await window.db.collection('customers').doc(docId).get();
                    if (snap.exists && snap.data().customerId) customerId = snap.data().customerId;
                } catch (_) {}
            }
            customerId = customerId || _generateCustomerId(u?.email || email);

            currentUser = { name: [firstName, lastName].filter(Boolean).join(' ') || 'User', email: u?.email || email, phone, customerId };
            localStorage.setItem('ssa_user', JSON.stringify(currentUser));
            _upsertLocalUserProfile({ firstName, lastName, email: currentUser.email, phone });

            closeAuthModal();
            updateAuthUI();
            showToast(`Welcome back, ${firstName || 'User'}!`);
            if (typeof saveCustomerToDb === 'function') {
                await saveCustomerToDb({ firstName, lastName, email: currentUser.email, phone, customerId }).catch(() => {});
            }
            if (typeof syncPendingOrders === 'function') syncPendingOrders(currentUser.email, currentUser.name, currentUser.phone);
            location.reload();
            return;
        } catch (e) {
            console.warn('[login] Backend auth failed, trying local fallback:', e.message);
        }
    }

    // Fallback path: local profile login (email, phone, or customer ID)
    const usersAll = JSON.parse(localStorage.getItem('ssa_users') || '[]');
    const user = usersAll.find(u => (u.email === email || u.phone === email || (u.customerId && u.customerId.toLowerCase() === emailInput.toLowerCase())) && u.password === password);
    if (user) {
        const cid = user.customerId || _generateCustomerId(user.email);
        if (!user.customerId) { user.customerId = cid; localStorage.setItem('ssa_users', JSON.stringify(usersAll)); }
        currentUser = { name: user.firstName + ' ' + user.lastName, email: user.email, phone: user.phone, customerId: cid };
        localStorage.setItem('ssa_user', JSON.stringify(currentUser));
        closeAuthModal(); updateAuthUI();
        showToast(`Welcome back, ${user.firstName}!`);
        if (typeof saveCustomerToDb === 'function') {
            await saveCustomerToDb({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, customerId: cid }).catch(() => {});
        }
        if (typeof syncPendingOrders === 'function') syncPendingOrders(currentUser.email, currentUser.name, currentUser.phone);
        location.reload();
    } else { document.getElementById('loginPasswordError').textContent = 'Invalid credentials'; document.getElementById('loginPasswordError').style.display = 'block'; }
}
async function handleRegister() {
    const fields = ['regFirstName','regLastName','regEmail','regPhone','regPassword','regConfirmPassword'];
    let valid = true;
    fields.forEach(id => { document.getElementById(id+'Error').style.display = 'none'; if (!document.getElementById(id).value.trim()) { document.getElementById(id+'Error').textContent = 'Required'; document.getElementById(id+'Error').style.display = 'block'; valid = false; } });
    if (!valid) return;
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirmPassword').value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('regEmailError').textContent = 'Invalid email'; document.getElementById('regEmailError').style.display = 'block'; return; }
    if (password.length < 6) { document.getElementById('regPasswordError').textContent = 'Min 6 chars'; document.getElementById('regPasswordError').style.display = 'block'; return; }
    if (password !== confirm) { document.getElementById('regConfirmPasswordError').textContent = 'Mismatch'; document.getElementById('regConfirmPasswordError').style.display = 'block'; return; }
    const users = JSON.parse(localStorage.getItem('ssa_users') || '[]');
    if (users.find(u => u.email === email)) { document.getElementById('regEmailError').textContent = 'Already exists'; document.getElementById('regEmailError').style.display = 'block'; return; }
    // Primary path: backend auth signup
    if (window.auth && typeof window.auth.signUpWithEmailAndPassword === 'function') {
        try {
            await window.auth.signUpWithEmailAndPassword(email, password, { firstName, lastName, phone, name: (firstName + ' ' + lastName).trim() });
        } catch (e) {
            document.getElementById('regEmailError').textContent = e.message || 'Registration failed';
            document.getElementById('regEmailError').style.display = 'block';
            return;
        }
    }

    users.push({ firstName, lastName, email, phone, password, createdAt: new Date().toISOString() });
    localStorage.setItem('ssa_users', JSON.stringify(users));

    // Generate unique Customer ID (SSA-CUST-XXXXX)
    const customerId = _generateCustomerId(email);
    currentUser = { name: firstName + ' ' + lastName, email, phone, customerId };
    localStorage.setItem('ssa_user', JSON.stringify(currentUser));

    // Save customer to Supabase with customer ID (await so it completes before reload)
    if (typeof saveCustomerToDb === 'function') {
        await saveCustomerToDb({ firstName, lastName, email, phone, customerId }).catch(err => console.error('[register] Async save failed:', err));
    }
    closeAuthModal(); updateAuthUI();
    showToast(`Welcome, ${firstName}! Your Customer ID: ${customerId}`);
    location.reload();
}

function _generateCustomerId(email) {
    // Purely deterministic from email — same email ALWAYS produces the same ID.
    // Two independent hash passes give 8 alphanumeric chars after SSA-.
    const e = (email || '').toLowerCase().trim();
    let h1 = 0, h2 = 0;
    for (let i = 0; i < e.length; i++) {
        const c = e.charCodeAt(i);
        h1 = (Math.imul(h1, 31) + c) | 0;
        h2 = (Math.imul(h2, 37) ^ c) | 0;
    }
    const p1 = Math.abs(h1).toString(36).toUpperCase().slice(0, 4).padStart(4, '0');
    const p2 = Math.abs(h2).toString(36).toUpperCase().slice(0, 4).padStart(4, '0');
    return 'SSA-' + p1 + p2;
}
window._generateCustomerId = _generateCustomerId;
function closeAuthModal(cleanUrl = true) { 
    document.getElementById('authModal')?.classList.remove('active'); 
    document.body.style.overflow = 'auto';
    // Remove ?account= param from URL without adding a history entry
    if (cleanUrl) {
        const url = new URL(window.location.href);
        if (url.searchParams.has('account')) {
            url.searchParams.delete('account');
            history.replaceState(null, '', url.toString() === window.location.origin + window.location.pathname ? window.location.pathname + (url.search === '?' ? '' : url.search) : url.toString());
        }
    }
}
async function openAccountPanel() {
    // Guard: check if user is logged in
    if (!currentUser || !currentUser.email) {
        openLoginModal();
        return false;
    }
    // Push URL state so each tab is bookmarkable and browser-back works
    const _url = new URL(window.location.href);
    if (!_url.searchParams.has('account')) {
        _url.searchParams.set('account', 'profile');
        history.pushState({ account: true }, '', _url.toString());
    }
    
    const modal = document.getElementById('authModal');
    modal.innerHTML = `<div class="modal account-modal-v2"><button class="acct-close" onclick="closeAuthModal()"><i class="fas fa-times"></i></button><div class="acct-loading-state"><div class="acct-loading-ring"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="none" stroke="#0d9488" stroke-width="4" stroke-dasharray="80 40" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="1s" repeatCount="indefinite"/></circle></svg></div><div class="acct-loading-logo">SSA</div><p class="acct-loading-text">Loading your account<span class="acct-loading-dots"><span>.</span><span>.</span><span>.</span></span></p></div></div>`;
    document.body.style.overflow = 'hidden';
    modal.classList.add('active');
    let supabaseOrders = [];
    if (window.db) {
        try {
            const snap = await db.collection('orders').where('customerEmail', '==', currentUser.email).get();
            supabaseOrders = snap.docs.map(d => ({
                id: d.data().orderId || d.id,
                docId: d.id,
                date: d.data().createdAt?.seconds ? new Date(d.data().createdAt.seconds*1000).toISOString() : new Date().toISOString(),
                items: d.data().items || [],
                total: d.data().total || 0,
                payment: d.data().payment || 'COD',
                paymentStatus: d.data().paymentStatus || '',
                status: d.data().status || 'Processing',
                rating: d.data().rating || null,
                ratingComment: d.data().ratingComment || null,
                ratingImage: d.data().ratingImage || null,
                estimatedDelivery: d.data().estimatedDelivery || null,
                trackingId: d.data().trackingId || '',
                deliveredAt: d.data().deliveredAt || null,
                updatedAt: d.data().updatedAt || null,
                addressLabel: d.data().addressLabel || '',
                statusHistory: d.data().statusHistory || {},
                returnRequest: d.data().returnRequest || null,
                cancellation: d.data().cancellation || null,
                shipping: {
                    name: d.data().customerName || currentUser.name,
                    email: d.data().customerEmail || currentUser.email,
                    phone: d.data().customerPhone || currentUser.phone || '',
                    address: d.data().address || '',
                    city: d.data().city || '',
                    pincode: d.data().pincode || ''
                }
            }));
        } catch(e) { console.warn('[account]', e.message); }
    }
    const localOrders = JSON.parse(localStorage.getItem('ssa_orders_' + currentUser.email) || '[]');
    // Use Supabase orders when available; fall back to localStorage if DB returned nothing
    // (covers: DB insert failures, RLS issues, network errors, local-only users)
    const rawOrders = supabaseOrders.length > 0 ? supabaseOrders : localOrders;
    // Sort latest first
    const orders = rawOrders.map(_normalizeAccountOrder).sort((a, b) => (_normalizeOrderDateValue(b.date)?.getTime() || 0) - (_normalizeOrderDateValue(a.date)?.getTime() || 0));
    const avatar = localStorage.getItem('ssa_avatar_' + currentUser.email) || '';
    const avatarHtml = avatar ? `<img src="${avatar}" alt="Avatar" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,0.15);">` : `<i class="fas fa-user-circle" style="font-size:72px;color:#0066cc;"></i>`;
    modal.innerHTML = `<div class="modal account-modal-v2">

        <!-- ── HEADER ─────────────────────────────────────── -->
        <div class="acct-hdr3">
            <button class="acct-close" onclick="closeAuthModal()"><i class="fas fa-times"></i></button>
            <div class="acct-hdr3-avatar-wrap" onclick="document.getElementById('avatarUpload').click()" title="Change photo">
                ${avatar ? `<img src="${avatar}" alt="Avatar" class="acct-avatar-img acct-hdr3-img">` : `<div class="acct-avatar-placeholder acct-hdr3-placeholder">${currentUser.name?.charAt(0)?.toUpperCase() || 'U'}</div>`}
                <span class="acct-hdr3-cam"><i class="fas fa-camera"></i></span>
                <input type="file" id="avatarUpload" accept="image/*" style="display:none" onchange="handleAvatarUpload(this)">
            </div>
            <div class="acct-hdr3-info">
                <div class="acct-hdr3-name">
                    ${currentUser.name}
                    ${currentUser.customerId ? `<span class="acct-hdr3-badge">${currentUser.customerId}</span>` : ''}
                </div>
                <div class="acct-hdr3-email"><i class="fas fa-envelope" style="font-size:0.7rem;margin-right:4px;opacity:0.7"></i>${currentUser.email}</div>
                ${currentUser.phone ? `<div class="acct-hdr3-phone"><i class="fas fa-phone-alt" style="font-size:0.7rem;margin-right:4px;opacity:0.7"></i>${currentUser.phone}</div>` : ''}
            </div>
        </div>

        <!-- ── SEGMENT TABS ──────────────────────────────────── -->
        <div class="acct-seg-wrap">
            <div class="acct-seg" role="tablist">
                <button class="acct-seg-btn active" onclick="showAccountTab('profile')" role="tab">
                    <i class="fas fa-user-circle"></i><span>Profile</span>
                </button>
                <button class="acct-seg-btn" onclick="showAccountTab('addresses')" role="tab">
                    <i class="fas fa-map-marker-alt"></i><span>Address</span>
                </button>
                <button class="acct-seg-btn" onclick="showAccountTab('orders')" role="tab">
                    <i class="fas fa-box-open"></i><span>Orders</span>
                </button>
            </div>
        </div>

        <!-- ── TAB BODY ──────────────────────────────────────── -->
        <div class="acct-body">

            <!-- ── PROFILE TAB ─────────────────────── -->
            <div class="acct-section active" id="accountProfile">

                <!-- Quick Actions -->
                <div class="acct-quick-row">
                    <a href="wishlist.html" onclick="closeAuthModal()" class="acct-action-btn acct-action-wish">
                        <i class="fas fa-heart"></i> My Wishlist
                    </a>
                    <button onclick="handleLogout()" class="acct-action-btn acct-action-out">
                        <i class="fas fa-sign-out-alt"></i> Sign Out
                    </button>
                </div>

                <!-- Personal Information -->
                <div class="acct-pcard">
                    <div class="acct-pcard-head">
                        <i class="fas fa-user-edit"></i> Personal Information
                    </div>
                    <div class="acct-fg2">
                        <div class="acct-fld">
                            <label>Full Name</label>
                            <input type="text" id="editName" value="${currentUser.name}" placeholder="Your full name">
                        </div>
                        <div class="acct-fld">
                            <label>Mobile</label>
                            <input type="tel" id="editPhone" value="${currentUser.phone||''}" placeholder="Phone number">
                        </div>
                    </div>
                    <div class="acct-fld">
                        <label>Email <span style="color:#94a3b8;font-size:0.65rem;font-weight:500;text-transform:none">(cannot be changed)</span></label>
                        <input type="email" value="${currentUser.email}" readonly>
                    </div>
                    <button class="btn btn-gradient btn-full acct-save-btn" onclick="saveProfileChanges()">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </div>

                <!-- Change Password — always visible -->
                <div class="acct-pcard acct-pcard--sec">
                    <div class="acct-pcard-head acct-pcard-head--sec">
                        <i class="fas fa-lock"></i> Change Password
                    </div>
                    <div class="acct-fld">
                        <label>Current Password</label>
                        <input type="password" id="pwdCurrent" placeholder="Enter current password">
                    </div>
                    <div class="acct-fg2">
                        <div class="acct-fld">
                            <label>New Password</label>
                            <input type="password" id="pwdNew" placeholder="Min 6 characters">
                        </div>
                        <div class="acct-fld">
                            <label>Confirm Password</label>
                            <input type="password" id="pwdConfirm" placeholder="Repeat new password">
                        </div>
                    </div>
                    <p id="pwdMsg" style="display:none" class="acct-pwd-msg"></p>
                    <button class="btn btn-full acct-pwd-btn" onclick="changePassword()">
                        <i class="fas fa-key"></i> Update Password
                    </button>
                </div>

            </div>

            <!-- ── ADDRESS TAB ─────────────────────── -->
            <div class="acct-section" id="accountAddresses" style="display:none;">
                <div id="addressList"></div>
                <button class="btn acct-add-addr-btn" onclick="showAddAddressForm()">
                    <i class="fas fa-plus-circle"></i> Add New Address
                </button>
                <div id="addAddressForm" style="display:none;margin-top:14px;" class="acct-pcard">
                    <div class="acct-pcard-head"><i class="fas fa-map-pin"></i> New Address</div>
                    <div class="acct-fld"><label>Street / Door No.</label><input type="text" id="addrStreet" placeholder="e.g. 37/10, Selvam Nagar"></div>
                    <div class="acct-fg2">
                        <div class="acct-fld"><label>City</label><input type="text" id="addrCity" placeholder="City"></div>
                        <div class="acct-fld"><label>PIN Code</label><input type="text" id="addrPin" placeholder="6-digit PIN"></div>
                    </div>
                    <div class="acct-fld"><label>State</label><input type="text" id="addrState" placeholder="State" value="Tamil Nadu"></div>
                    <div style="display:flex;gap:10px;margin-top:4px;">
                        <button class="btn btn-gradient" style="flex:1" onclick="saveNewAddress()"><i class="fas fa-save"></i> Save Address</button>
                        <button class="btn btn-outline-dark" onclick="document.getElementById('addAddressForm').style.display='none'">Cancel</button>
                    </div>
                </div>
            </div>

            <!-- ── ORDERS TAB ──────────────────────── -->
            <div class="acct-section" id="accountOrders" style="display:none;">
                ${orders.length === 0 ? '<div class="acct-orders-empty"><i class="fas fa-box-open"></i><p>No orders yet. Start shopping!</p><a href="categories.html" class="btn btn-gradient btn-sm" onclick="closeAuthModal()">Browse Products</a></div>' : _buildOrderCardsHTML(orders)}
            </div>

        </div>
    </div>`;
    renderAddressList();
    // Init rating stars and tab slider for the freshly rendered modal
    if (window.SSAAnims && window.SSAAnims.initRatingStars) {
        setTimeout(() => window.SSAAnims.initRatingStars(document.getElementById('accountOrders')), 100);
    }
    return true;
}
function _normalizeOrderDateValue(value) {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (value?.seconds) return new Date(value.seconds * 1000);
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function _orderStatusKey(status) {
    return String(status || 'Processing').trim().toLowerCase().replace(/\s+/g, '-');
}

function _formatOrderDate(value, opts) {
    const dt = _normalizeOrderDateValue(value);
    if (!dt) return 'Not available';
    return dt.toLocaleDateString('en-IN', opts || { day: '2-digit', month: 'short', year: 'numeric' });
}

function _formatOrderDateTime(value) {
    const dt = _normalizeOrderDateValue(value);
    if (!dt) return 'Not available';
    return dt.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function _normalizeAccountOrder(order) {
    const shipping = order?.shipping || {};
    return {
        ...order,
        id: order?.id || order?.orderId || 'SSA' + Date.now().toString(36).toUpperCase(),
        date: order?.date || new Date().toISOString(),
        items: Array.isArray(order?.items) ? order.items : [],
        total: Number(order?.total || 0),
        payment: order?.payment || 'COD',
        paymentStatus: order?.paymentStatus || '',
        status: order?.status || 'Processing',
        trackingId: order?.trackingId || '',
        deliveredAt: order?.deliveredAt || null,
        estimatedDelivery: order?.estimatedDelivery || null,
        updatedAt: order?.updatedAt || null,
        addressLabel: order?.addressLabel || '',
        shipping: {
            name: shipping.name || currentUser?.name || '',
            email: shipping.email || currentUser?.email || '',
            phone: shipping.phone || currentUser?.phone || '',
            address: shipping.address || '',
            city: shipping.city || '',
            pincode: shipping.pincode || '',
            state: shipping.state || 'Tamil Nadu'
        }
    };
}

function _getPaymentMethodLabel(payment) {
    const key = String(payment || '').trim().toUpperCase();
    if (key === 'COD') return 'Cash on Delivery';
    if (key === 'UPI') return 'UPI Payment';
    if (key === 'BANK') return 'Bank Transfer';
    return payment || 'Payment pending';
}

function _getPaymentStatus(order) {
    if (order.paymentStatus) return order.paymentStatus;
    const key = String(order.payment || '').trim().toUpperCase();
    if (key === 'COD') return order.status === 'Delivered' ? 'Collected on delivery' : 'Pay on delivery';
    if (order.status === 'Cancelled') {
        const rs = order.cancellation?.refundStatus;
        if (rs === 'Processed') return 'Refund Processed';
        if (rs === 'Initiated') return 'Refund Initiated';
        if (rs === 'Failed') return 'Refund Failed';
        return 'Refund review pending';
    }
    return 'Awaiting payment confirmation';
}

function _resolveOrderItemMeta(item) {
    const product = (item.productId ? productsData.find(p => String(p.id) === String(item.productId)) : null)
        || productsData.find(p => p.name === item.name);
    return {
        image: item.image || item.mainImage || product?.mainImage || product?.image || '',
        categoryLabel: typeof getCategoryLabel === 'function' ? getCategoryLabel(item.category || product?.category || '') : (item.category || product?.category || ''),
        gender: item.gender || product?.gender || '',
        sleeve: item.sleeve || product?.sleeve || ''
    };
}

function _buildCancellationSection(order) {
    const c = order.cancellation || {};
    const isCOD = (order.payment || '').toUpperCase() === 'COD';
    const reason = c.reason ? escapeRichText(c.reason) : 'Not specified';
    const refundStatusColors = { 'Processed': '#10b981', 'Initiated': '#3b82f6', 'Failed': '#ef4444', 'Not Initiated': '#94a3b8' };
    const rs = c.refundStatus || '';
    const rsColor = refundStatusColors[rs] || '#64748b';
    const refundHtml = (!isCOD) ? `
        <div class="acct-cancel-refund">
            <div class="acct-cancel-refund-head"><i class="fas fa-rupee-sign"></i> Refund Status</div>
            ${rs ? `<span class="acct-cancel-refund-badge" style="color:${rsColor};border-color:${rsColor}">${escapeRichText(rs)}</span>` : '<span style="color:#94a3b8;font-size:0.82rem;">Pending review</span>'}
            ${c.refundAmount ? `<div class="acct-cancel-meta"><span>Amount:</span> <strong>₹${Number(c.refundAmount).toLocaleString('en-IN')}</strong></div>` : ''}
            ${c.refundRef ? `<div class="acct-cancel-meta"><span>Ref ID:</span> <strong>${escapeRichText(c.refundRef)}</strong></div>` : ''}
            ${c.refundDate ? `<div class="acct-cancel-meta"><span>Refund Date:</span> <strong>${escapeRichText(c.refundDate)}</strong></div>` : ''}
        </div>` : '<p style="font-size:0.82rem;color:#6b7280;margin-top:6px;"><i class="fas fa-info-circle"></i> COD order — no refund applicable.</p>';
    return `<div class="acct-cancellation-section">
        <div class="acct-cancel-head"><i class="fas fa-ban"></i> This order was cancelled</div>
        <div class="acct-cancel-reason"><span>Reason:</span> ${reason}</div>
        ${refundHtml}
    </div>`;
}

function _getOrderReturnMeta(order) {
    const statusKey = _orderStatusKey(order.status);
    if (statusKey !== 'delivered') {
        return { eligible: false, note: 'Return/Exchange available for 2 days after delivery.' };
    }
    const deliveredAt = _normalizeOrderDateValue(order.deliveredAt || order.updatedAt || order.date);
    if (!deliveredAt) {
        return { eligible: false, note: 'Waiting for delivery confirmation.' };
    }
    // Window: available immediately after delivery, expires after 2 days
    const expireAt = new Date(deliveredAt.getTime() + (2 * 24 * 60 * 60 * 1000));
    if (Date.now() <= expireAt.getTime()) {
        // Check if already submitted a request
        if (order.returnRequest && order.returnRequest.status) {
            return { eligible: false, requested: true, request: order.returnRequest, note: '' };
        }
        return { eligible: true, note: 'Return/Exchange open until ' + _formatOrderDateTime(expireAt) + '.' };
    }
    if (order.returnRequest && order.returnRequest.status) {
        return { eligible: false, requested: true, request: order.returnRequest, note: '' };
    }
    return { eligible: false, note: 'Return/Exchange window closed (2-day window expired).' };
}

function _buildOrderTimeline(order) {
    const current = _orderStatusKey(order.status);
    const history = order.statusHistory || {};
    if (current === 'cancelled') {
        const cancelledAt = history['cancelled'] ? '<small>' + _formatOrderDateTime(history['cancelled']) + '</small>' : '';
        return '<div class="acct-order-timeline is-cancelled"><div class="timeline-node active"><span>Placed</span>' + (history['processing'] ? '<small>' + _formatOrderDateTime(history['processing']) + '</small>' : '') + '</div><div class="timeline-node active danger"><span>Cancelled</span>' + cancelledAt + '</div></div>';
    }
    const steps = ['processing', 'approved', 'packed', 'shipped', 'delivered'];
    const labels = { processing: 'Placed', approved: 'Approved', packed: 'Packed', shipped: 'Shipped', delivered: 'Delivered' };
    const currentIndex = steps.includes(current) ? steps.indexOf(current) : 0;
    return '<div class="acct-order-timeline">' + steps.map((step, index) => {
        const active = index <= currentIndex ? ' active' : '';
        const ts = history[step] ? '<small>' + _formatOrderDateTime(history[step]) + '</small>' : '';
        return '<div class="timeline-node' + active + '"><span>' + labels[step] + '</span>' + ts + '</div>';
    }).join('') + '</div>';
}

function _buildOrderItemDetailHTML(item) {
    const meta = _resolveOrderItemMeta(item);
    const tags = [];
    if (item.selectedSize) tags.push('<span class="od-tag">Size: ' + escapeRichText(item.selectedSize) + '</span>');
    if (meta.gender) tags.push('<span class="od-tag od-tag-gender">' + escapeRichText(meta.gender) + '</span>');
    if (meta.sleeve) tags.push('<span class="od-tag od-tag-sleeve">' + escapeRichText(meta.sleeve) + ' sleeve</span>');

    const emb = item.embroidery;
    let embHtml = '<div class="od-emb od-emb-muted"><i class="fas fa-pen-nib"></i> Embroidery not selected</div>';
    if (emb) {
        const lines = [];
        if (emb.type) lines.push(escapeRichText(emb.type));
        if (emb.line1) lines.push('&ldquo;' + escapeRichText(emb.line1) + '&rdquo;');
        if (emb.line2) lines.push('&ldquo;' + escapeRichText(emb.line2) + '&rdquo;');
        if (emb.line3) lines.push('&ldquo;' + escapeRichText(emb.line3) + '&rdquo;');
        if (emb.color) lines.push('Thread: ' + escapeRichText(emb.color));
        if (emb.position) lines.push('Text: ' + escapeRichText(emb.position));
        if (emb.logoPosition) lines.push('Logo: ' + escapeRichText(emb.logoPosition));
        embHtml = '<div class="od-emb"><i class="fas fa-pen-nib"></i> ' + lines.join(' <span class="dot">•</span> ') + '</div>';
    }

    // Build full product name with variant details
    // Product names from DB already include sleeve type (e.g., "SSA CliniFlex Scrub™ - Round Neck")
    // Only append the selected color — escape once at template level only
    let productNameDisplay = item.name || 'Ordered item';
    if (item.selectedColor) {
        productNameDisplay = productNameDisplay + ' — ' + item.selectedColor;
    }

    return `
        <article class="od-item-detail">
            <div class="od-item-visual">
                ${meta.image ? `<img src="${meta.image}" alt="${escapeRichText(item.name || 'Ordered item')}">` : '<div class="od-item-fallback"><i class="fas fa-box-open"></i></div>'}
            </div>
            <div class="od-item-copy">
                <div class="od-item-topline">
                    <div>
                        <h5 class="od-item-name">${escapeRichText(productNameDisplay)}</h5>
                        <p class="od-item-category">${escapeRichText(meta.categoryLabel || 'Product')}</p>
                    </div>
                    <span class="od-item-qty">Qty ${item.qty || 1}</span>
                </div>
                <div class="od-item-variants">${tags.join('')}</div>
                ${embHtml}
                <div class="od-item-price">₹${((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}<small>₹${(item.price || 0).toLocaleString('en-IN')} each</small></div>
            </div>
        </article>
    `;
}

function _buildOrderCardsHTML(orders) {
    if (!orders.length) return '<div class="acct-orders-empty"><i class="fas fa-box-open"></i><p>No orders yet. Start shopping!</p><a href="categories.html" class="btn btn-gradient btn-sm" onclick="closeAuthModal()">Browse Products</a></div>';
    return '<div class="acct-orders-v2">' + orders.map(function(order) {
        const statusKey = _orderStatusKey(order.status);
        const itemSummary = order.items.slice(0, 2).map(item => escapeRichText(item.name)).join(', ') + (order.items.length > 2 ? ' +' + (order.items.length - 2) + ' more' : '');
        const itemCount = order.items.length;
        return `
            <div class="acct-order-v2 status-${statusKey}">
                <div class="acct-order-v2-head">
                    <div class="acct-ov2-left">
                        <div class="acct-ov2-num">#${escapeRichText(order.id)}</div>
                        <div class="acct-ov2-date"><i class="fas fa-calendar-alt" style="font-size:0.63rem;margin-right:3px;opacity:0.6"></i>${_formatOrderDate(order.date)}</div>
                    </div>
                    <span class="acct-ov2-badge ${statusKey}">${escapeRichText(order.status)}</span>
                </div>
                <div class="acct-order-v2-body">
                    <div class="acct-ov2-summary"><i class="fas fa-shopping-bag" style="color:var(--primary);margin-right:5px;font-size:0.76rem;"></i>${itemSummary} &bull; ${itemCount} item${itemCount !== 1 ? 's' : ''}</div>
                    <div class="acct-ov2-footer">
                        <div>
                            <div class="acct-ov2-total">₹${order.total.toLocaleString('en-IN')}</div>
                            <div class="acct-ov2-pay">${escapeRichText(_getPaymentMethodLabel(order.payment))}</div>
                        </div>
                        <a href="order-detail.html?id=${encodeURIComponent(order.id)}" class="acct-ov2-detail-link" onclick="closeAuthModal(false)">View Details <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `;
    }).join('') + '</div>';
}
function showAccountTab(tab) {
    // Deactivate all tab buttons (old underline style + new segment style)
    document.querySelectorAll('.acct-tab-btn, .account-tab, .acct-seg-btn').forEach(t => t.classList.remove('active'));
    ['accountProfile','accountAddresses','accountOrders'].forEach(id => { const el = document.getElementById(id); if (el) { el.style.display = 'none'; el.classList.remove('active'); } });
    const map = { profile:'accountProfile', addresses:'accountAddresses', orders:'accountOrders', security:'accountProfile' };
    const el = document.getElementById(map[tab]); if (el) { el.style.display = 'block'; el.classList.add('active'); }
    const tabBtns = document.querySelectorAll('.acct-tab-btn, .account-tab, .acct-seg-btn');
    const tabIdx = { profile:0, addresses:1, orders:2, security:0 };
    if (tabBtns[tabIdx[tab]]) tabBtns[tabIdx[tab]].classList.add('active');
    // Update URL param so each tab has its own URL (replaceState = no new history entry)
    const _tabUrl = new URL(window.location.href);
    const _urlTab = tab === 'security' ? 'profile' : tab;
    _tabUrl.searchParams.set('account', _urlTab);
    history.replaceState({ account: true }, '', _tabUrl.toString());
    // Scroll to password section if security tab requested
    if (tab === 'security') {
        setTimeout(() => { const pwd = document.getElementById('pwdCurrent'); if (pwd) pwd.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
    }
}
function toggleOrderDetails(orderId) {
    const panel = document.getElementById('orderDetails-' + orderId);
    const btn = document.getElementById('viewBtn-' + orderId);
    if (!panel) return;
    const open = panel.style.display === 'none' || panel.style.display === '';
    panel.style.display = open ? 'block' : 'none';
    if (btn) btn.innerHTML = open ? '<i class="fas fa-chevron-up"></i> Hide Details' : '<i class="fas fa-chevron-down"></i> View Details';
    panel.classList.toggle('od-open', open);
}
window.toggleOrderDetails = toggleOrderDetails;
function contactOrderSupport(orderId) {
    // Open chatbot with pre-filled order context, or redirect to contact page
    const chatWin = document.getElementById('chatbotWindow');
    const badge = document.querySelector('.chatbot-badge');
    if (chatWin) {
        chatWin.classList.add('open');
        if (badge) badge.style.display = 'none';
        setTimeout(() => {
            if (typeof sendChatMessage === 'function') sendChatMessage('I need help with my order #' + orderId);
        }, 400);
    } else {
        window.location.href = 'contact.html?subject=support&order=' + encodeURIComponent(orderId);
    }
}
window.contactOrderSupport = contactOrderSupport;

function _buildReturnRequestStatusHTML(req) {
    if (!req) return '';
    const statusColors = { pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444', refunded: '#6366f1', processing: '#3b82f6' };
    const color = statusColors[String(req.status || 'pending').toLowerCase()] || '#6b7280';
    const refundInfo = req.refundCredited ? `<span style="color:#10b981;font-size:0.78rem;"><i class="fas fa-check-circle"></i> Refund credited${req.expectedRefundDate ? ' on ' + req.expectedRefundDate : ''}</span>` : (req.expectedRefundDate ? `<span style="color:#6b7280;font-size:0.78rem;">Expected refund: ${req.expectedRefundDate}</span>` : '');
    return `<div class="acct-return-status"><i class="fas fa-rotate-left" style="color:${color}"></i> <span style="color:${color};font-weight:700;">${escapeRichText(req.type || 'Return')} ${escapeRichText(req.status || 'Pending')}</span>${refundInfo ? ' · ' + refundInfo : ''}</div>`;
}
window._buildReturnRequestStatusHTML = _buildReturnRequestStatusHTML;

function requestOrderReturn(orderId) {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.innerHTML = `
        <div class="modal modal-sm" style="max-width:480px;padding:0;">
            <div style="background:linear-gradient(135deg,#0d9488,#0f766e);padding:20px 24px;border-radius:16px 16px 0 0;">
                <button class="acct-close" onclick="closeAuthModal()" style="color:#fff;background:rgba(255,255,255,0.15);"><i class="fas fa-times"></i></button>
                <h3 style="color:#fff;margin:0;font-size:1.05rem;"><i class="fas fa-rotate-left" style="margin-right:8px;"></i>Return / Exchange Request</h3>
                <p style="color:rgba(255,255,255,0.8);font-size:0.82rem;margin:4px 0 0;">Order #${escapeRichText(orderId)}</p>
            </div>
            <div style="padding:22px 24px;">
                <div class="form-group" style="margin-bottom:14px;">
                    <label style="font-size:0.82rem;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Request Type</label>
                    <div style="display:flex;gap:10px;">
                        <label style="flex:1;display:flex;align-items:center;gap:8px;padding:10px 14px;border:2px solid #e2e8f0;border-radius:10px;cursor:pointer;font-size:0.88rem;font-weight:600;" id="retTypeReturn">
                            <input type="radio" name="retType" value="Return" checked onchange="document.getElementById('retTypeReturn').style.borderColor='#0d9488';document.getElementById('retTypeExchange').style.borderColor='#e2e8f0';" style="accent-color:#0d9488;"> Return
                        </label>
                        <label style="flex:1;display:flex;align-items:center;gap:8px;padding:10px 14px;border:2px solid #e2e8f0;border-radius:10px;cursor:pointer;font-size:0.88rem;font-weight:600;" id="retTypeExchange">
                            <input type="radio" name="retType" value="Exchange" onchange="document.getElementById('retTypeExchange').style.borderColor='#0d9488';document.getElementById('retTypeReturn').style.borderColor='#e2e8f0';" style="accent-color:#0d9488;"> Exchange
                        </label>
                    </div>
                </div>
                <div class="form-group" style="margin-bottom:14px;">
                    <label style="font-size:0.82rem;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Reason</label>
                    <select id="retReason" style="width:100%;padding:10px 12px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:0.88rem;font-family:inherit;outline:none;">
                        <option value="">— Select a reason —</option>
                        <option value="Wrong size received">Wrong size received</option>
                        <option value="Wrong color received">Wrong color received</option>
                        <option value="Defective / damaged product">Defective / damaged product</option>
                        <option value="Product not as described">Product not as described</option>
                        <option value="Size doesn't fit">Size doesn't fit</option>
                        <option value="Duplicate order">Duplicate order</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom:18px;">
                    <label style="font-size:0.82rem;font-weight:700;color:#374151;display:block;margin-bottom:6px;">Additional Details <span style="color:#94a3b8;font-weight:400;">(optional)</span></label>
                    <textarea id="retNote" rows="3" placeholder="Describe the issue..." style="width:100%;padding:10px 12px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:0.88rem;font-family:inherit;resize:vertical;outline:none;box-sizing:border-box;"></textarea>
                </div>
                <button class="btn btn-gradient btn-full" onclick="submitOrderReturn('${orderId}')" style="margin-bottom:0;"><i class="fas fa-paper-plane"></i> Submit Request</button>
                <button class="btn btn-outline-dark btn-full" onclick="closeAuthModal()" style="margin-top:8px;">Cancel</button>
            </div>
        </div>
    `;
    document.body.style.overflow = 'hidden';
    modal.classList.add('active');
}
window.requestOrderReturn = requestOrderReturn;

async function submitOrderReturn(orderId) {
    const type = document.querySelector('input[name="retType"]:checked')?.value || 'Return';
    const reason = document.getElementById('retReason')?.value || '';
    const note = document.getElementById('retNote')?.value?.trim() || '';
    if (!reason) { showToast('Please select a reason', 'error'); return; }

    const returnRequest = {
        type, reason, note,
        status: 'Pending',
        submittedAt: new Date().toISOString(),
        refundCredited: false,
        expectedRefundDate: null
    };

    try {
        if (window.db) {
            // Find the order document by orderId
            const snap = await db.collection('orders').where('orderId', '==', orderId).get();
            if (!snap.empty) {
                const docId = snap.docs[0].id;
                await db.collection('orders').doc(docId).update({ returnRequest });
            } else {
                // Fallback: try matching by id field
                const snap2 = await db.collection('orders').get();
                const doc = snap2.docs.find(d => d.data().orderId === orderId || d.id === orderId);
                if (doc) await db.collection('orders').doc(doc.id).update({ returnRequest });
            }
        }
    } catch (err) {
        console.warn('[return] DB save failed, storing in localStorage:', err.message);
    }

    // Always update localStorage copy too
    if (currentUser?.email) {
        const key = 'ssa_orders_' + currentUser.email;
        try {
            const orders = JSON.parse(localStorage.getItem(key) || '[]');
            const idx = orders.findIndex(o => (o.orderId || o.id) === orderId);
            if (idx !== -1) { orders[idx].returnRequest = returnRequest; localStorage.setItem(key, JSON.stringify(orders)); }
        } catch (e) { /* ignore */ }
    }

    closeAuthModal();
    showToast('Return/Exchange request submitted! Our team will contact you within 24 hours.', 'success');
    setTimeout(() => openAccountPanel(), 500);
}
window.submitOrderReturn = submitOrderReturn;

function shareOrderResult(orderId, triggerEl) {
    const shareText = `Just ordered premium hospital uniforms from Siva Suresh Agency! 🏥 Quality medical wear. Order #${orderId} — Check them out: ${window.location.origin}/sivasureshagency/`;
    const pageUrl   = window.location.origin + '/sivasureshagency/';
    const waUrl     = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    const fbUrl     = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    const twUrl     = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

    // Remove any existing share menu
    const existing = document.getElementById('ssa-share-radial');
    if (existing) { existing.remove(); return; }

    // Build radial share menu anchored to the trigger button
    const menu = document.createElement('div');
    menu.id = 'ssa-share-radial';
    menu.className = 'ssa-share-radial';
    menu.innerHTML = `
        <div class="ssa-share-backdrop" onclick="document.getElementById('ssa-share-radial')?.remove()"></div>
        <div class="ssa-share-menu">
            <div class="ssa-share-hub" onclick="document.getElementById('ssa-share-radial')?.remove()" title="Close">
                <i class="fas fa-times"></i>
            </div>
            <button class="ssa-share-item" style="--clr:#0d9488;--i:0;" onclick="window.location.href='contact.html';document.getElementById('ssa-share-radial')?.remove();" title="Send Message">
                <i class="fas fa-envelope"></i><span>Contact Us</span>
            </button>
            <button class="ssa-share-item" style="--clr:#1877f2;--i:1;" onclick="window.open('${fbUrl}','_blank');document.getElementById('ssa-share-radial')?.remove();" title="Facebook">
                <i class="fab fa-facebook-f"></i><span>Facebook</span>
            </button>
            <button class="ssa-share-item" style="--clr:#1b1e21;--i:2;" onclick="window.open('${twUrl}','_blank');document.getElementById('ssa-share-radial')?.remove();" title="Twitter/X">
                <i class="fab fa-x-twitter"></i><span>Twitter</span>
            </button>
            <button class="ssa-share-item" style="--clr:#0d9488;--i:3;" onclick="navigator.clipboard?.writeText('${pageUrl}').then(()=>showToast('Link copied!'));document.getElementById('ssa-share-radial')?.remove();" title="Copy Link">
                <i class="fas fa-link"></i><span>Copy Link</span>
            </button>
        </div>
    `;
    document.body.appendChild(menu);
    // Animate in
    requestAnimationFrame(() => menu.classList.add('active'));
}
window.shareOrderResult = shareOrderResult;
function handleAvatarUpload(input) {
    const file = input.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        localStorage.setItem('ssa_avatar_' + currentUser.email, e.target.result);
        const avatarDiv = document.querySelector('.account-avatar');
        if (avatarDiv) { avatarDiv.querySelector('i,img')?.remove(); const img = document.createElement('img'); img.src = e.target.result; img.style.cssText = 'width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,0.15);'; avatarDiv.insertBefore(img, avatarDiv.firstChild); }
        showToast('Profile picture updated!');
    };
    reader.readAsDataURL(file);
}
function saveProfileChanges() {
    const name  = document.getElementById('editName')?.value.trim();
    const phone = document.getElementById('editPhone')?.value.trim();
    if (!name) { showToast('Name cannot be empty'); return; }
    currentUser.name  = name;
    currentUser.phone = phone;
    localStorage.setItem('ssa_user', JSON.stringify(currentUser));
    // Update in ssa_users list
    const users = JSON.parse(localStorage.getItem('ssa_users') || '[]');
    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx > -1) {
        const parts = name.split(' ');
        users[idx].firstName = parts[0] || users[idx].firstName;
        users[idx].lastName  = parts.slice(1).join(' ') || users[idx].lastName;
        users[idx].phone     = phone;
        localStorage.setItem('ssa_users', JSON.stringify(users));
    }
    updateAuthUI();
    showToast('Profile saved!');
}
function renderAddressList() {
    const el = document.getElementById('addressList'); if (!el) return;
    const addrs = getSavedAddresses();
    if (addrs.length === 0) { el.innerHTML = '<div class="acct-addr-empty"><i class="fas fa-map-marker-alt"></i><p>No saved addresses yet</p></div>'; return; }
    el.innerHTML = addrs.map((a, i) => `<div class="acct-addr-card${i===0?' acct-addr-card--default':''}">
        <div class="acct-addr-card-body">
            ${i===0?'<span class="acct-addr-default-badge"><i class="fas fa-check-circle"></i> Default</span>':''}
            <p class="acct-addr-text"><i class="fas fa-map-marker-alt" style="color:#0d9488;margin-right:6px;font-size:0.82rem"></i>${a.street}, ${a.city} – ${a.pincode}, ${a.state||'Tamil Nadu'}</p>
        </div>
        <div class="acct-addr-card-actions">
            ${i>0?`<button onclick="setDefaultAddress(${i})" class="acct-addr-action-btn acct-addr-action-default"><i class="fas fa-star"></i> Set Default</button>`:''}
            <button onclick="deleteAddress(${i})" class="acct-addr-action-btn acct-addr-action-del"><i class="fas fa-trash"></i> Remove</button>
        </div>
    </div>`).join('');
}
function showAddAddressForm() { document.getElementById('addAddressForm').style.display = 'block'; }
function saveNewAddress() {
    const street = document.getElementById('addrStreet')?.value.trim();
    const city   = document.getElementById('addrCity')?.value.trim();
    const pin    = document.getElementById('addrPin')?.value.trim();
    const state  = document.getElementById('addrState')?.value.trim();
    if (!street || !city || !pin) { showToast('Please fill street, city and PIN'); return; }
    const addrs = getSavedAddresses();
    addrs.push({ street, city, pincode: pin, state: state || 'Tamil Nadu' });
    localStorage.setItem('ssa_addresses_' + currentUser.email, JSON.stringify(addrs));
    document.getElementById('addAddressForm').style.display = 'none';
    renderAddressList();
    renderCheckoutAddressOptions(String(addrs.length - 1));
    showToast('Address saved!');
}
function deleteAddress(i) {
    const addrs = getSavedAddresses();
    addrs.splice(i, 1);
    localStorage.setItem('ssa_addresses_' + currentUser.email, JSON.stringify(addrs));
    renderAddressList();
    renderCheckoutAddressOptions();
}
function setDefaultAddress(i) {
    const addrs = getSavedAddresses();
    const [a] = addrs.splice(i, 1); addrs.unshift(a);
    localStorage.setItem('ssa_addresses_' + currentUser.email, JSON.stringify(addrs));
    renderAddressList();
    renderCheckoutAddressOptions('0');
}
async function changePassword() {
    const curr    = document.getElementById('pwdCurrent')?.value;
    const newPwd  = document.getElementById('pwdNew')?.value;
    const confirm = document.getElementById('pwdConfirm')?.value;
    const msgEl   = document.getElementById('pwdMsg');
    const show = (msg, ok) => { msgEl.textContent = msg; msgEl.style.color = ok ? '#10b981' : '#ef4444'; msgEl.style.display = 'block'; };
    if (!curr || !newPwd || !confirm) { show('Please fill all fields'); return; }
    if (newPwd.length < 6) { show('New password must be at least 6 characters'); return; }
    if (newPwd !== confirm) { show('Passwords do not match'); return; }

    // Primary path: backend auth update
    if (window.auth && typeof window.auth.updatePassword === 'function') {
        try {
            await window.auth.updatePassword(newPwd);
            show('Password updated successfully!', true);
            document.getElementById('pwdCurrent').value = '';
            document.getElementById('pwdNew').value = '';
            document.getElementById('pwdConfirm').value = '';
            return;
        } catch (e) {
            console.warn('[password] Backend update failed, trying local fallback:', e.message);
        }
    }

    // Legacy fallback: local user password update
    const users = JSON.parse(localStorage.getItem('ssa_users') || '[]');
    const idx = users.findIndex(u => u.email === currentUser.email);
    if (idx === -1 || users[idx].password !== curr) { show('Current password is incorrect'); return; }
    users[idx].password = newPwd;
    localStorage.setItem('ssa_users', JSON.stringify(users));
    show('Password updated successfully!', true);
    document.getElementById('pwdCurrent').value = '';
    document.getElementById('pwdNew').value = '';
    document.getElementById('pwdConfirm').value = '';
}
function handleLogout() { currentUser = null; localStorage.removeItem('ssa_user'); closeAuthModal(); updateAuthUI(); showToast('Logged out'); }

// ===== Track Order Feature =====
function openTrackOrder() {
    if (!currentUser) {
        showToast('Please sign in to track your orders', 'info');
        setTimeout(() => openLoginModal(), 300);
        return;
    }
    const modal = document.getElementById('trackOrderModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { document.getElementById('trackOrderInput')?.focus(); }, 200);
}
window.openTrackOrder = openTrackOrder;

function closeTrackOrder() {
    const modal = document.getElementById('trackOrderModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    const res = document.getElementById('trackResult');
    if (res) { res.classList.remove('visible'); res.innerHTML = ''; }
    const inp = document.getElementById('trackOrderInput');
    if (inp) inp.value = '';
}
window.closeTrackOrder = closeTrackOrder;

async function trackOrderSearch() {
    const input = document.getElementById('trackOrderInput');
    const resultEl = document.getElementById('trackResult');
    if (!input || !resultEl) return;
    const query = input.value.trim().toUpperCase();
    if (!query) { showToast('Please enter an Order ID', 'error'); return; }
    if (!currentUser) { showToast('Please sign in first', 'error'); return; }

    resultEl.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:0.84rem;"><i class="fas fa-spinner fa-spin" style="margin-right:6px"></i> Searching&hellip;</div>';
    resultEl.classList.add('visible');

    let found = null;
    // Check Firestore first
    if (window.db) {
        try {
            const snap = await db.collection('orders').where('orderId', '==', query).get();
            if (!snap.empty) {
                const d = snap.docs[0].data();
                found = { id: d.orderId || snap.docs[0].id, status: d.status || 'Processing', date: d.createdAt?.seconds ? new Date(d.createdAt.seconds * 1000).toISOString() : new Date().toISOString(), total: d.total || 0, tracking: d.trackingId || '', estimated: d.estimatedDelivery || '', items: d.items || [] };
            }
        } catch(e) { console.warn('[track]', e.message); }
    }
    // Fallback: check localStorage
    if (!found && currentUser?.email) {
        const localOrders = JSON.parse(localStorage.getItem('ssa_orders_' + currentUser.email) || '[]');
        const lo = localOrders.find(o => (o.id || o.orderId || '').toUpperCase() === query);
        if (lo) found = { id: lo.id || lo.orderId, status: lo.status || 'Processing', date: lo.date || new Date().toISOString(), total: lo.total || 0, tracking: lo.trackingId || '', estimated: lo.estimatedDelivery || '', items: lo.items || [] };
    }

    if (!found) {
        resultEl.innerHTML = '<div class="track-not-found"><i class="fas fa-search"></i>No order found with ID <strong>' + escapeRichText(query) + '</strong>.<br>Double-check the Order ID and try again.</div>';
        return;
    }

    const statusKey = _orderStatusKey(found.status);
    const statusColors = { processing:'#f59e0b', approved:'#6366f1', packed:'#a855f7', shipped:'#3b82f6', delivered:'#10b981', cancelled:'#ef4444' };
    const color = statusColors[statusKey] || '#6b7280';
    resultEl.innerHTML = `
        <div class="track-result-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <div class="track-result-id">#${escapeRichText(found.id)}</div>
                <span style="font-size:0.72rem;font-weight:800;padding:3px 10px;border-radius:20px;background:${color}22;color:${color};border:1px solid ${color}44;">${escapeRichText(found.status)}</span>
            </div>
            <div class="track-result-meta">
                <span><i class="fas fa-calendar-alt" style="color:var(--primary);width:14px;"></i> Placed: ${_formatOrderDate(found.date)}</span>
                <span><i class="fas fa-rupee-sign" style="color:var(--primary);width:14px;"></i> Total: ₹${Number(found.total).toLocaleString('en-IN')}</span>
                <span><i class="fas fa-box" style="color:var(--primary);width:14px;"></i> Items: ${found.items.length}</span>
                ${found.tracking ? `<span><i class="fas fa-truck" style="color:var(--primary);width:14px;"></i> Tracking: ${escapeRichText(found.tracking)}</span>` : ''}
                ${found.estimated ? `<span><i class="fas fa-calendar-check" style="color:var(--primary);width:14px;"></i> Est. Delivery: ${escapeRichText(found.estimated)}</span>` : ''}
            </div>
            <a href="order-detail.html?id=${encodeURIComponent(found.id)}" class="btn btn-gradient btn-full btn-sm" style="margin-top:14px;" onclick="closeTrackOrder()">
                <i class="fas fa-external-link-alt"></i> View Full Details
            </a>
        </div>
    `;
}
window.trackOrderSearch = trackOrderSearch;

// Close track order modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('trackOrderModal');
    if (modal && e.target === modal) closeTrackOrder();
});

// ===== Order Detail Page Init =====
async function initOrderDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('id');
    const loading = document.getElementById('odpLoading');
    const content = document.getElementById('odpContent');
    if (!content) return;

    if (!orderId) {
        _showOdpError('No Order ID provided', 'Please navigate from your Account → Orders page.');
        return;
    }

    // Wait for Supabase DB to be ready (up to 8 seconds)
    let waited = 0;
    while (!window.db && waited < 80) { await new Promise(r => setTimeout(r, 100)); waited++; }

    // Also wait for currentUser to be restored from session (up to 5 seconds)
    let authWait = 0;
    while (!currentUser && authWait < 25) { await new Promise(r => setTimeout(r, 200)); authWait++; }

    // Require login
    if (!currentUser) {
        if (loading) loading.style.display = 'none';
        content.style.display = 'block';
        content.innerHTML = `
            <div class="container">
                <div class="odp-back-bar">
                    <a href="index.html" class="odp-back-btn"><i class="fas fa-arrow-left"></i> Back to Home</a>
                </div>
                <div style="text-align:center;padding:80px 20px;">
                    <i class="fas fa-lock" style="font-size:3rem;color:var(--text-faint);display:block;margin-bottom:16px;"></i>
                    <h3 style="font-size:1.2rem;color:var(--text-mid);margin-bottom:8px;">Sign in to view order</h3>
                    <p style="color:var(--text-muted);font-size:0.88rem;margin-bottom:20px;">Please sign in to access order details for #${escapeRichText(orderId)}</p>
                    <button class="btn btn-gradient" onclick="openLoginModal()"><i class="fas fa-user"></i> Sign In</button>
                </div>
            </div>`;
        return;
    }

    // ---- Step 1: Check localStorage first (fast, always works regardless of Supabase RLS / JWT) ----
    let order = null;
    if (currentUser?.email) {
        const localOrders = JSON.parse(localStorage.getItem('ssa_orders_' + currentUser.email) || '[]');
        const lo = localOrders.find(o => (o.id || o.orderId || '') === orderId);
        if (lo) order = _normalizeAccountOrder(lo);
    }

    // If found in localStorage, show immediately then refresh status from Supabase in background
    if (order) {
        if (loading) loading.style.display = 'none';
        content.style.display = 'block';
        content.innerHTML = _buildOrderDetailPageHTML(order);
        if (window.SSAAnims && window.SSAAnims.initRatingStars) setTimeout(() => window.SSAAnims.initRatingStars(content), 100);
        // Background refresh — updates status if admin has changed it
        _odpBackgroundRefresh(orderId, order, content);
        return;
    }

    // ---- Step 2: If not in localStorage, try Supabase (works when user has a Supabase JWT) ----
    if (!order) {
        try {
            if (window.db) {
                // Primary: query by orderId field
                const snap = await db.collection('orders').where('orderId', '==', orderId).get();
                if (!snap.empty) {
                    const d = snap.docs[0].data();
                    order = _normalizeAccountOrder({
                        id: d.orderId || snap.docs[0].id, docId: snap.docs[0].id,
                        date: d.createdAt?.seconds ? new Date(d.createdAt.seconds * 1000).toISOString() : (d.createdAt || new Date().toISOString()),
                        items: d.items || [], total: d.total || 0, payment: d.payment || 'COD',
                        paymentStatus: d.paymentStatus || '', status: d.status || 'Processing',
                        trackingId: d.trackingId || '', deliveredAt: d.deliveredAt || null,
                        estimatedDelivery: d.estimatedDelivery || null, updatedAt: d.updatedAt || null,
                        addressLabel: d.addressLabel || '', statusHistory: d.statusHistory || {},
                        returnRequest: d.returnRequest || null, cancellation: d.cancellation || null,
                        rating: d.rating || null, ratingComment: d.ratingComment || null, ratingImage: d.ratingImage || null,
                        razorpay: d.razorpay || null,
                        shipping: { name: d.customerName || currentUser.name, email: d.customerEmail || currentUser.email,
                            phone: d.customerPhone || currentUser.phone || '', address: d.address || '',
                            city: d.city || '', pincode: d.pincode || '' }
                    });
                }
                // Secondary: scan customer orders (catches orderId field mismatches)
                if (!order && currentUser?.email) {
                    const snap2 = await db.collection('orders').where('customerEmail', '==', currentUser.email).get();
                    const matched = snap2.docs.find(doc => {
                        const d = doc.data();
                        return d.orderId === orderId || doc.id === orderId;
                    });
                    if (matched) {
                        const d = matched.data();
                        order = _normalizeAccountOrder({
                            id: d.orderId || matched.id, docId: matched.id,
                            date: d.createdAt?.seconds ? new Date(d.createdAt.seconds * 1000).toISOString() : (d.createdAt || new Date().toISOString()),
                            items: d.items || [], total: d.total || 0, payment: d.payment || 'COD',
                            paymentStatus: d.paymentStatus || '', status: d.status || 'Processing',
                            trackingId: d.trackingId || '', deliveredAt: d.deliveredAt || null,
                            estimatedDelivery: d.estimatedDelivery || null, updatedAt: d.updatedAt || null,
                            addressLabel: d.addressLabel || '', statusHistory: d.statusHistory || {},
                            returnRequest: d.returnRequest || null, cancellation: d.cancellation || null,
                            rating: d.rating || null, ratingComment: d.ratingComment || null, ratingImage: d.ratingImage || null,
                            razorpay: d.razorpay || null,
                            shipping: { name: d.customerName || currentUser.name, email: d.customerEmail || currentUser.email,
                                phone: d.customerPhone || currentUser.phone || '', address: d.address || '',
                                city: d.city || '', pincode: d.pincode || '' }
                        });
                    }
                }
            }
        } catch(e) { console.warn('[odp] Supabase query failed:', e.message); }
    }

    // Cache to localStorage so future loads (and offline) work without Supabase
    if (order && currentUser?.email) {
        try {
            const lsKey = 'ssa_orders_' + currentUser.email;
            const lsOrders = JSON.parse(localStorage.getItem(lsKey) || '[]');
            if (!lsOrders.find(o => (o.id || o.orderId) === orderId)) {
                lsOrders.unshift({ ...order, _synced: true });
                localStorage.setItem(lsKey, JSON.stringify(lsOrders.slice(0, 50)));
            }
        } catch (_) {}
    }

    if (loading) loading.style.display = 'none';

    if (!order) {
        _showOdpError('Order Not Found', `We couldn't find order #${escapeRichText(orderId)} linked to your account. If you just placed it, try again in a moment.`);
        return;
    }

    content.style.display = 'block';
    content.innerHTML = _buildOrderDetailPageHTML(order);
    // Init rating stars if available
    if (window.SSAAnims && window.SSAAnims.initRatingStars) {
        setTimeout(() => window.SSAAnims.initRatingStars(content), 100);
    }
}

// Background Supabase refresh — re-renders the order detail if status changed since last cache
async function _odpBackgroundRefresh(orderId, cachedOrder, contentEl) {
    if (!window.db || !currentUser?.email) return;
    try {
        const snap = await db.collection('orders').where('orderId', '==', orderId).get();
        if (snap.empty) return;
        const d = snap.docs[0].data();
        const freshStatus = d.status || 'Processing';
        // Only re-render if something changed
        const freshCancelRefund = d.cancellation?.refundStatus || '';
        const cachedCancelRefund = cachedOrder.cancellation?.refundStatus || '';
        const freshReturnStatus = d.returnRequest?.status || '';
        const cachedReturnStatus = cachedOrder.returnRequest?.status || '';
        if (freshStatus === cachedOrder.status && !d.trackingId && !d.estimatedDelivery
            && freshCancelRefund === cachedCancelRefund && freshReturnStatus === cachedReturnStatus) return;
        const freshOrder = _normalizeAccountOrder({
            id: d.orderId || snap.docs[0].id, docId: snap.docs[0].id,
            date: d.createdAt?.seconds ? new Date(d.createdAt.seconds * 1000).toISOString() : (d.createdAt || cachedOrder.date),
            items: d.items || cachedOrder.items, total: d.total || cachedOrder.total,
            payment: d.payment || cachedOrder.payment, paymentStatus: d.paymentStatus || '',
            status: freshStatus, trackingId: d.trackingId || '',
            deliveredAt: d.deliveredAt || null, estimatedDelivery: d.estimatedDelivery || null,
            updatedAt: d.updatedAt || null, addressLabel: d.addressLabel || '',
            statusHistory: d.statusHistory || {}, returnRequest: d.returnRequest || null,
            cancellation: d.cancellation || null, rating: d.rating || cachedOrder.rating,
            ratingComment: d.ratingComment || cachedOrder.ratingComment, ratingImage: d.ratingImage || cachedOrder.ratingImage,
            razorpay: d.razorpay || cachedOrder.razorpay || null,
            shipping: { name: d.customerName || currentUser.name, email: d.customerEmail || currentUser.email,
                phone: d.customerPhone || currentUser.phone || '', address: d.address || '',
                city: d.city || '', pincode: d.pincode || '' }
        });
        // Update localStorage cache with fresh data
        try {
            const lsKey = 'ssa_orders_' + currentUser.email;
            const lsOrders = JSON.parse(localStorage.getItem(lsKey) || '[]');
            const idx = lsOrders.findIndex(o => (o.id || o.orderId) === orderId);
            if (idx !== -1) {
                lsOrders[idx] = { ...freshOrder, _synced: true };
                localStorage.setItem(lsKey, JSON.stringify(lsOrders));
            }
        } catch(_) {}
        // Re-render the page with fresh data
        contentEl.innerHTML = _buildOrderDetailPageHTML(freshOrder);
        if (window.SSAAnims && window.SSAAnims.initRatingStars) setTimeout(() => window.SSAAnims.initRatingStars(contentEl), 100);
    } catch(e) { /* Silently ignore — cached version already shown */ }
}

function _showOdpError(title, msg) {
    const loading = document.getElementById('odpLoading');
    const content = document.getElementById('odpContent');
    if (loading) loading.style.display = 'none';
    if (content) {
        content.style.display = 'block';
        content.innerHTML = `<div class="container"><div class="odp-back-bar"><a href="index.html" class="odp-back-btn" onclick="history.length>1?history.back():window.location='index.html';return false;"><i class="fas fa-arrow-left"></i> Go Back</a></div><div class="odp-error-wrap"><i class="fas fa-exclamation-circle"></i><h3>${escapeRichText(title)}</h3><p>${escapeRichText(msg)}</p><a href="index.html" class="btn btn-gradient" style="margin-top:16px;">Back to Home</a></div></div>`;
    }
}

function _buildOrderDetailPageHTML(order) {
    const statusKey = _orderStatusKey(order.status);
    const history = order.statusHistory || {};
    const paymentStatus = _getPaymentStatus(order);
    const tracking = order.trackingId ? escapeRichText(order.trackingId) : null;
    const estimated = order.estimatedDelivery ? _formatOrderDate(order.estimatedDelivery) : null;
    const shipParts = [order.shipping?.address, order.shipping?.city, order.shipping?.pincode, order.shipping?.state].filter(Boolean);
    const actions = _getOrderReturnMeta(order);

    // --- Payment breakdown ---
    const _items = order.items || [];
    const _embTotal = _items.reduce((s, i) => s + ((i.embroidery?.price || 0) * (i.qty || 1)), 0);
    const _productSubtotal = _items.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0) - _embTotal;
    const _shippingCharge = Math.max(0, (order.total || 0) - (_productSubtotal + _embTotal));
    const _discount = (order.discount || 0); // future-proof: stored as positive number

    // Timeline
    let timelineHTML = '';
    if (statusKey === 'cancelled') {
        timelineHTML = `<div class="odp-timeline">
            <div class="odp-tl-step done"><div class="odp-tl-dot"><i class="fas fa-check"></i></div><div class="odp-tl-label">Placed</div><div class="odp-tl-date">${history['processing'] ? _formatOrderDate(history['processing']) : ''}</div></div>
            <div class="odp-tl-step cancelled"><div class="odp-tl-dot"><i class="fas fa-times"></i></div><div class="odp-tl-label">Cancelled</div><div class="odp-tl-date">${history['cancelled'] ? _formatOrderDate(history['cancelled']) : ''}</div></div>
        </div>`;
    } else {
        const steps = [
            { key: 'processing', label: 'Placed', icon: 'fa-check' },
            { key: 'approved', label: 'Approved', icon: 'fa-thumbs-up' },
            { key: 'packed', label: 'Packed', icon: 'fa-box' },
            { key: 'shipped', label: 'Shipped', icon: 'fa-truck' },
            { key: 'delivered', label: 'Delivered', icon: 'fa-home' }
        ];
        const curIdx = steps.findIndex(s => s.key === statusKey);
        timelineHTML = '<div class="odp-timeline">' + steps.map((s, i) => {
            const cls = i < curIdx ? 'done' : i === curIdx ? 'active' : '';
            return `<div class="odp-tl-step ${cls}"><div class="odp-tl-dot"><i class="fas ${s.icon}"></i></div><div class="odp-tl-label">${s.label}</div><div class="odp-tl-date">${history[s.key] ? _formatOrderDate(history[s.key]) : ''}</div></div>`;
        }).join('') + '</div>';
    }

    // Items
    const itemsHTML = order.items.map(item => {
        const meta = _resolveOrderItemMeta(item);
        const imgEl = meta.image ? `<img src="${meta.image}" alt="${escapeRichText(item.name || 'Item')}" class="odp-item-img" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : '';
        const placeholderEl = `<div class="odp-item-placeholder" ${meta.image ? 'style="display:none"' : ''}><i class="fas fa-box-open"></i></div>`;
        const tags = [];
        if (item.selectedSize) tags.push(`<span class="odp-item-tag">Size: ${escapeRichText(item.selectedSize)}</span>`);
        if (item.selectedColor) tags.push(`<span class="odp-item-tag color">${escapeRichText(item.selectedColor)}</span>`);
        if (meta.gender) tags.push(`<span class="odp-item-tag gender">${escapeRichText(meta.gender)}</span>`);
        const emb = item.embroidery;
        let embHtml = '';
        if (emb) {
            const lines = [];
            if (emb.type) lines.push(escapeRichText(emb.type));
            if (emb.line1) lines.push('&ldquo;' + escapeRichText(emb.line1) + '&rdquo;');
            if (emb.color) lines.push('Thread: ' + escapeRichText(emb.color));
            embHtml = `<div class="odp-emb-info"><i class="fas fa-pen-nib"></i> ${lines.join(' · ')}</div>`;
        }
        return `<div class="odp-item">${imgEl}${placeholderEl}<div class="odp-item-info"><div class="odp-item-name">${escapeRichText(item.name || 'Item')}</div><div class="odp-item-cat">${escapeRichText(meta.categoryLabel || '')}</div>${tags.length ? '<div class="odp-item-tags">' + tags.join('') + '</div>' : ''}${embHtml}<div class="odp-item-footer"><span class="odp-item-price">₹${((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</span><span class="odp-item-qty-badge">Qty ${item.qty || 1}</span></div></div></div>`;
    }).join('');

    // Cancellation box
    const cancelHTML = statusKey === 'cancelled' ? _buildCancellationSection(order) : '';

    // Action buttons
    const actionsHTML = `<div class="odp-actions-row">
        <button class="btn btn-outline-dark btn-sm" onclick="downloadInvoice('${escapeRichText(order.id)}')"><i class="fas fa-file-invoice"></i> Invoice</button>
        <button class="btn btn-primary btn-sm" onclick="reorderFromHistory('${escapeRichText(order.id)}')"><i class="fas fa-redo"></i> Reorder</button>
        <button class="btn btn-outline-dark btn-sm" style="border-color:#86efac;color:#15803d;background:#f0fdf4;" onclick="shareOrderResult('${escapeRichText(order.id)}')"><i class="fas fa-share-alt"></i> Share</button>
        ${actions.eligible ? `<button class="btn btn-outline-dark btn-sm" style="border-color:#fecdd3;color:#be123c;background:#fff1f2;" onclick="requestOrderReturn('${escapeRichText(order.id)}')"><i class="fas fa-rotate-left"></i> Return / Exchange</button>` : ''}
        ${actions.requested ? _buildReturnRequestStatusHTML(actions.request) : ''}
    </div>`;

    // Rating — only shown when order is Delivered
    const ratingHtml = (statusKey === 'delivered' && window.buildRatingUI)
        ? window.buildRatingUI(order.id, order.rating || null, order.ratingComment || null, order.ratingImage || null)
        : '';

    return `
        <div class="odp-hero">
            <div class="container">
                <div class="odp-back-bar">
                    <button class="odp-back-btn" onclick="history.back();"><i class="fas fa-arrow-left"></i> Back to Orders</button>
                </div>
                <div class="odp-hero-inner">
                    <div>
                        <div class="odp-order-eyebrow"><i class="fas fa-receipt"></i> Order Details</div>
                        <div class="odp-order-number">#${escapeRichText(order.id)}</div>
                        <div class="odp-order-metas">
                            <span class="odp-meta-chip"><i class="fas fa-calendar-alt"></i> ${_formatOrderDate(order.date)}</span>
                            <span class="odp-meta-chip"><i class="fas fa-credit-card"></i> ${escapeRichText(_getPaymentMethodLabel(order.payment))}</span>
                            <span class="odp-meta-chip"><i class="fas fa-box"></i> ${order.items.length} item${order.items.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <div class="odp-hero-right">
                        <span class="odp-status-pill ${statusKey}"><i class="fas fa-circle" style="font-size:0.5rem;"></i> ${escapeRichText(order.status)}</span>
                        <div style="text-align:right;">
                            <div class="odp-total-label">Order Total</div>
                            <div class="odp-total-display">₹${order.total.toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="odp-body">
            <div class="container">
                <div class="odp-grid">
                    <div class="odp-main">
                        <!-- Timeline -->
                        <div class="odp-card">
                            <div class="odp-card-head"><i class="fas fa-route"></i><h3>Order Timeline</h3></div>
                            ${timelineHTML}
                            ${tracking ? `<div style="padding:0 20px 16px;font-size:0.82rem;color:var(--text-mid);"><i class="fas fa-truck" style="color:var(--primary);margin-right:5px;"></i><strong>Tracking:</strong> ${tracking}</div>` : ''}
                            ${estimated ? `<div style="padding:0 20px 16px;font-size:0.82rem;color:var(--text-mid);"><i class="fas fa-calendar-check" style="color:var(--primary);margin-right:5px;"></i><strong>Estimated Delivery:</strong> ${estimated}</div>` : ''}
                        </div>
                        <!-- Cancellation box -->
                        ${cancelHTML ? `<div style="padding:0 4px;">${cancelHTML}</div>` : ''}
                        <!-- Items -->
                        <div class="odp-card">
                            <div class="odp-card-head"><i class="fas fa-shopping-bag"></i><h3>Items Ordered</h3></div>
                            <div class="odp-item-list">${itemsHTML}</div>
                            <div style="padding:14px 20px;border-top:1px solid var(--border);background:var(--bg-off);display:flex;justify-content:space-between;align-items:center;">
                                <span style="font-size:0.82rem;color:var(--text-muted);">Order Total</span>
                                <strong style="font-size:1.05rem;color:var(--primary-dark);">₹${order.total.toLocaleString('en-IN')}</strong>
                            </div>
                        </div>
                        <!-- Actions -->
                        <div class="odp-card">
                            <div class="odp-card-head"><i class="fas fa-bolt"></i><h3>Order Actions</h3></div>
                            <div class="odp-card-body">${actionsHTML}${ratingHtml ? '<div style="margin-top:16px;">' + ratingHtml + '</div>' : ''}</div>
                        </div>
                    </div>
                    <div class="odp-aside">
                        <!-- Payment -->
                        <div class="odp-card">
                            <div class="odp-card-head"><i class="fas fa-receipt"></i><h4 style="font-size:0.9rem;font-weight:800;color:var(--navy);margin:0;">Payment & Billing</h4></div>
                            <div class="odp-card-body">
                                <div class="odp-info-row"><span class="odp-info-label">Method</span><span class="odp-info-value">${escapeRichText(_getPaymentMethodLabel(order.payment))}</span></div>
                                <div class="odp-info-row"><span class="odp-info-label">Payment Status</span><span class="odp-info-value" style="font-weight:700;color:${paymentStatus==='Paid'?'#16a34a':paymentStatus==='Refund Processed'?'#2563eb':'var(--text-mid)'}">${escapeRichText(paymentStatus)}</span></div>
                                ${order.razorpay && order.razorpay.paymentId ? `<div class="odp-info-row"><span class="odp-info-label">Payment ID</span><span class="odp-info-value" style="font-size:0.75rem;color:var(--text-muted);word-break:break-all;font-family:monospace;">${escapeRichText(order.razorpay.paymentId)}</span></div>` : ''}
                                <hr style="border:none;border-top:1px dashed var(--border);margin:8px 0;">
                                <div class="odp-info-row"><span class="odp-info-label">Product Subtotal</span><span class="odp-info-value">₹${_productSubtotal.toLocaleString('en-IN')}</span></div>
                                ${_embTotal > 0 ? `<div class="odp-info-row"><span class="odp-info-label"><i class="fas fa-pen-nib" style="color:var(--primary);font-size:0.72rem;margin-right:3px;"></i> Embroidery</span><span class="odp-info-value">₹${_embTotal.toLocaleString('en-IN')}</span></div>` : ''}
                                ${_discount > 0 ? `<div class="odp-info-row"><span class="odp-info-label" style="color:#16a34a;"><i class="fas fa-tag" style="font-size:0.72rem;margin-right:3px;"></i> Discount</span><span class="odp-info-value" style="color:#16a34a;">−₹${_discount.toLocaleString('en-IN')}</span></div>` : ''}
                                <div class="odp-info-row"><span class="odp-info-label">Shipping</span><span class="odp-info-value">${_shippingCharge === 0 ? '<span style="color:#16a34a;font-weight:700;">FREE</span>' : '₹' + _shippingCharge.toLocaleString('en-IN')}</span></div>
                                <div class="odp-info-row" style="padding-top:8px;border-top:1.5px solid var(--border);margin-top:4px;"><span class="odp-info-label" style="font-weight:800;color:var(--navy);font-size:0.88rem;">Order Total</span><span class="odp-info-value" style="color:var(--primary-dark);font-size:1.05rem;font-weight:900;">₹${(order.total || 0).toLocaleString('en-IN')}</span></div>
                            </div>
                        </div>
                        <!-- Shipping Address -->
                        <div class="odp-card">
                            <div class="odp-card-head"><i class="fas fa-map-marker-alt"></i><h4 style="font-size:0.9rem;font-weight:800;color:var(--navy);margin:0;">Delivery Address</h4></div>
                            <div class="odp-card-body">
                                <div class="odp-address-block">
                                    <div class="odp-address-name">${escapeRichText(order.shipping?.name || currentUser?.name || 'Customer')}</div>
                                    ${escapeRichText(shipParts.join(', ') || 'Address not available')}
                                    ${order.shipping?.phone ? '<div style="margin-top:6px;color:var(--text-muted);font-size:0.8rem;"><i class="fas fa-phone-alt" style="color:var(--primary);margin-right:4px;"></i>' + escapeRichText(order.shipping.phone) + '</div>' : ''}
                                </div>
                            </div>
                        </div>
                        <!-- Customer Support -->
                        <div class="odp-card" style="background:linear-gradient(160deg,#f0fdfa,#fff);">
                            <div class="odp-card-head"><i class="fas fa-headset"></i><h4 style="font-size:0.9rem;font-weight:800;color:var(--navy);margin:0;">Need Help?</h4></div>
                            <div class="odp-card-body">
                                <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:14px;line-height:1.65;">Questions about delivery, returns, or embroidery? Our support team is here to help.</p>
                                <div style="display:flex;flex-wrap:wrap;gap:8px;">
                                    <button class="btn btn-gradient btn-sm" onclick="contactOrderSupport('${escapeRichText(order.id)}')"><i class="fas fa-comments"></i> Chat Support</button>
                                    <a class="btn btn-outline-dark btn-sm" href="contact.html"><i class="fas fa-envelope"></i> Send Message</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
window.initOrderDetailPage = initOrderDetailPage;

// ===== Ensure Success Modal has invoice action button =====
function ensureSuccessModalActions() {
        const modal = document.getElementById('successModal');
        if (!modal) return;
        const content = modal.querySelector('.success-content');
        if (!content) return;
        if (content.querySelector('.success-actions')) return;

        const continueBtn = content.querySelector('button.btn.btn-gradient');
        const actions = document.createElement('div');
        actions.className = 'success-actions';
        actions.style.cssText = 'display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:10px;';
        actions.innerHTML = '<button class="btn btn-outline-dark" onclick="downloadInvoice()"><i class="fas fa-file-invoice"></i> Download Invoice</button>';
        if (continueBtn) {
                continueBtn.style.marginTop = '8px';
                continueBtn.parentNode.insertBefore(actions, continueBtn);
        } else {
                content.appendChild(actions);
        }
}

function getOrderHistory() {
        if (!currentUser || !currentUser.email) return [];
        return JSON.parse(localStorage.getItem('ssa_orders_' + currentUser.email) || '[]');
}

function resolveOrderForInvoice(orderId) {
        const history = getOrderHistory();
        if (!history.length) return null;
        if (orderId) return history.find(o => o.id === orderId) || null;
        return history[0] || null;
}

function _bestShippingForInvoice(order) {
        const shipping = { ...(order.shipping || {}) };

        // If order came from Supabase and lacks address fields, pull from local order copy
        if (currentUser?.email) {
                const local = getOrderHistory().find(o => o.id === order.id);
                if (local?.shipping) {
                        shipping.name = shipping.name || local.shipping.name;
                        shipping.email = shipping.email || local.shipping.email;
                        shipping.phone = shipping.phone || local.shipping.phone;
                        shipping.address = shipping.address || local.shipping.address;
                        shipping.city = shipping.city || local.shipping.city;
                        shipping.pincode = shipping.pincode || local.shipping.pincode;
                }
        }

        // Fallback to saved profile address
        if (currentUser?.email && (!shipping.address || !shipping.city || !shipping.pincode)) {
                const saved = JSON.parse(localStorage.getItem('ssa_addresses_' + currentUser.email) || '[]');
                const primary = saved[0] || {};
                shipping.address = shipping.address || primary.street || '';
                shipping.city = shipping.city || primary.city || '';
                shipping.pincode = shipping.pincode || primary.pincode || '';
        }

        // Final fallback to current user data
        shipping.name = shipping.name || currentUser?.name || 'Customer';
        shipping.email = shipping.email || currentUser?.email || '';
        shipping.phone = shipping.phone || currentUser?.phone || '';

        return shipping;
}

function buildInvoiceHtml(order) {
        const shipping = _bestShippingForInvoice(order);
        const logoUrl = new URL('images/Images/SSA Logo.png', window.location.href).href;
        const invoiceDate = new Date(order.date || Date.now());
        const rows = (order.items || []).map(i => {
                const qty = i.qty || 0;
                const unit = i.price || 0;
                const line = qty * unit;
                const variant = [i.selectedSize || null, i.selectedColor || null].filter(Boolean).join(' / ');
                const emb = i.embroidery;
                let embDetails = '';
                if (emb) {
                    const parts = [`<strong>Embroidery (${emb.type || 'TEXT'})</strong>`];
                    if (emb.line1) parts.push(`Line 1: ${emb.line1}`);
                    if (emb.line2) parts.push(`Line 2: ${emb.line2}`);
                    if (emb.line3) parts.push(`Line 3: ${emb.line3}`);
                    if (emb.position) parts.push(`Text Position: ${emb.position}`);
                    if (emb.logoPosition) parts.push(`Logo Position: ${emb.logoPosition}`);
                    if (emb.font) parts.push(`Font: ${emb.font}`);
                    if (emb.color) parts.push(`Thread: ${emb.color}`);
                    if (emb.logoFileName) parts.push(`Logo: ${emb.logoFileName}`);
                    embDetails = `<br><small class="emb-detail">${parts.join(' &bull; ')}</small>`;
                }
                return `<tr><td>${i.name || 'Item'}${variant ? `<br><small class="variant">${variant}</small>` : ''}${embDetails}</td><td class="center">${qty}</td><td class="right">&#8377;${unit.toLocaleString('en-IN')}</td><td class="right">&#8377;${line.toLocaleString('en-IN')}</td></tr>`;
        }).join('');

        const _invItems = order.items || [];
        const embTotal = _invItems.reduce((s, i) => s + ((i.embroidery?.price || 0) * (i.qty || 1)), 0);
        const productSubtotal = _invItems.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0) - embTotal;
        const shippingCharge = Math.max(0, (order.total || 0) - (productSubtotal + embTotal));
        const discountAmt = order.discount || 0;
        const shippingLine = [shipping.address, shipping.city, shipping.pincode].filter(Boolean).join(', ');

        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${order.id}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root{--teal:#0d9488;--navy:#0f172a;--muted:#64748b;--line:#e2e8f0;--bg:#f8fafc;}
        *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
        body{font-family:'Segoe UI',Arial,sans-serif;color:var(--navy);margin:0;background:#eef2f7;padding:24px;}
        .print-bar{max-width:860px;margin:0 auto 16px;display:flex;justify-content:flex-end;gap:10px;}
        .print-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 22px;background:linear-gradient(135deg,#0d9488,#0f766e);color:#fff;border:none;border-radius:10px;font-size:0.9rem;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px rgba(13,148,136,0.35);transition:transform 0.2s,box-shadow 0.2s;}
        .print-btn:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(13,148,136,0.45);}
        .sheet{max-width:860px;margin:0 auto;background:#fff;border:1px solid #dbe4ee;border-radius:18px;overflow:hidden;box-shadow:0 20px 48px rgba(15,23,42,0.12);}
        .hero{display:flex;justify-content:space-between;gap:20px;padding:22px 26px;background:linear-gradient(135deg,#0f172a 0%,#0d9488 100%);color:#fff;}
        .brand{display:flex;align-items:flex-start;gap:14px;}
        .logo{width:58px;height:58px;border-radius:12px;background:#fff;padding:6px;object-fit:contain;}
        .brand h1{margin:0;font-size:26px;line-height:1.1;}
        .brand p{margin:6px 0 0;font-size:12px;opacity:.9;line-height:1.6;}
        .meta{min-width:220px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);padding:12px 14px;border-radius:12px;}
        .meta p{margin:3px 0;font-size:13px;}
        .body{padding:22px 26px 26px;}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px;}
        .box{border:1px solid var(--line);border-radius:12px;padding:12px 14px;background:#fff;}
        .box h3{margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);}
        .box p{margin:2px 0 0;font-size:14px;line-height:1.6;}
        table{width:100%;border-collapse:collapse;margin-top:8px;border:1px solid var(--line);border-radius:10px;overflow:hidden;}
        th,td{padding:11px 12px;border-bottom:1px solid var(--line);font-size:13.5px;vertical-align:top;}
        th{background:var(--bg);text-align:left;font-weight:700;color:#334155;}
        .center{text-align:center;}
        .right{text-align:right;}
        .variant{color:var(--muted);font-size:12px;}
        .emb-detail{color:#0d9488;font-size:11.5px;line-height:1.6;}
        .totals{width:360px;margin-left:auto;margin-top:16px;border:1px solid var(--line);border-radius:12px;padding:10px 14px;background:var(--bg);}
        .totals div{display:flex;justify-content:space-between;padding:7px 0;font-size:14px;}
        .totals .grand{font-weight:800;font-size:17px;border-top:1px dashed #c7d2df;margin-top:3px;padding-top:10px;color:var(--navy);}
        .foot{margin-top:16px;padding-top:12px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:16px;font-size:12px;color:var(--muted);}
        @media (max-width:760px){body{padding:10px;background:#fff;}.sheet{border:none;box-shadow:none;}.hero{flex-direction:column;padding:16px;}.body{padding:16px;}.grid{grid-template-columns:1fr;}.totals{width:100%;}}
        @page{size:A4;margin:10mm;}
        @media print{
            .print-bar{display:none!important;}
            body{background:#fff!important;padding:0!important;}
            .sheet{width:190mm;max-width:190mm;margin:0 auto;box-shadow:none;border:1px solid #dbe4ee;border-radius:0;}
            .hero{padding:14px 18px;background:linear-gradient(135deg,#0f172a 0%,#0d9488 100%)!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
            .body{padding:14px 18px 18px;}
            th,td{padding:8px 10px;font-size:12.5px;}
            .totals{width:86mm;}
            .foot{font-size:11px;}
        }
    </style>
</head>
<body>
    <div class="print-bar">
        <button class="print-btn" onclick="window.print()"><i class="fas fa-print"></i> Print Invoice</button>
    </div>
    <div class="sheet">
        <div class="hero">
            <div class="brand">
                <img class="logo" src="${logoUrl}" alt="SSA Logo">
                <div>
                    <h1>Siva Suresh Agency</h1>
                    <p>PVT Towers, 37/10, Selvam Nagar, Erode - 638011<br>Phone: +91 93666 40060 | Email: info@sivasureshagency.onmicrosoft.com</p>
                </div>
            </div>
            <div class="meta">
                <p><strong>Invoice No:</strong> ${order.id}</p>
                <p><strong>Date:</strong> ${invoiceDate.toLocaleDateString('en-IN')}</p>
                <p><strong>Payment:</strong> ${order.payment || 'COD'}</p>
            </div>
        </div>

        <div class="body">
            <div class="grid">
                <div class="box">
                    <h3>Bill To</h3>
                    <p><strong>${shipping.name}</strong></p>
                    <p>${shipping.email}</p>
                    <p>${shipping.phone}</p>
                    <p>${shippingLine || 'Address not available'}</p>
                </div>
                <div class="box">
                    <h3>Notes</h3>
                    <p>Thank you for choosing Siva Suresh Agency.</p>
                    <p>For support, contact +91 93666 40060.</p>
                    <p>This is a computer-generated invoice.</p>
                </div>
            </div>

            <table>
                <thead>
                    <tr><th>Item</th><th class="center">Qty</th><th class="right">Unit Price</th><th class="right">Amount</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>

            <div class="totals">
                <div><span>Product Subtotal</span><span>&#8377;${productSubtotal.toLocaleString('en-IN')}</span></div>
                ${embTotal > 0 ? `<div><span>Embroidery</span><span>&#8377;${embTotal.toLocaleString('en-IN')}</span></div>` : ''}
                ${discountAmt > 0 ? `<div style="color:#16a34a;"><span>Discount</span><span>−&#8377;${discountAmt.toLocaleString('en-IN')}</span></div>` : ''}
                <div><span>Shipping</span><span>${shippingCharge > 0 ? '&#8377;' + shippingCharge.toLocaleString('en-IN') : '<span style="color:#16a34a;font-weight:700;">FREE</span>'}</span></div>
                <div class="grand"><span>Order Total</span><span>&#8377;${(order.total || 0).toLocaleString('en-IN')}</span></div>
            </div>

            <div class="foot">
                <span>Invoice generated on ${new Date().toLocaleString('en-IN')}</span>
                <span>www.sivasureshagency.com</span>
            </div>
        </div>
    </div>
</body>
</html>`;
}

function downloadInvoice(orderId) {
        if (!currentUser) { showToast('Please login first'); return; }
        const order = resolveOrderForInvoice(orderId || document.getElementById('orderId')?.textContent?.trim());
        if (!order) { showToast('Invoice unavailable for this order'); return; }

        const html = buildInvoiceHtml(order);
        const w = window.open('', '_blank');
        if (!w) { showToast('Popup blocked. Please allow popups.'); return; }
        w.document.open();
        w.document.write(html);
        w.document.close();
}

function reorderFromHistory(orderId) {
        if (!currentUser) { showToast('Please login first'); return; }
        const order = resolveOrderForInvoice(orderId);
        if (!order || !order.items || !order.items.length) { showToast('Order items not found'); return; }

        for (const item of order.items) {
                const product = productsData.find(p => p.name === item.name);
                if (!product) continue;
                const existing = cart.find(c => c.id === product.id && c.selectedSize === item.selectedSize && c.selectedColor === item.selectedColor);
                if (existing) existing.qty += (item.qty || 1);
                else cart.push({ ...product, qty: item.qty || 1, selectedSize: item.selectedSize || product.sizes[0], selectedColor: item.selectedColor || getProductColors(product)?.[0]?.name || null });
        }

        saveCart();
        updateCartUI();
        closeAuthModal();
        openCart();
        showToast('Items added from previous order');
}

// ===== Place Order =====
async function placeOrder() {
    if (!currentUser) { 
        closeCheckoutModal();
        openLoginModal(); 
        showToast('Please login first'); 
        return; 
    }
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const pm = document.querySelector('[name="payment"]:checked');
    const shipping = {
        firstname: document.querySelector('[name="firstname"]')?.value || '',
        lastname: document.querySelector('[name="lastname"]')?.value || '',
        email: document.querySelector('[name="cemail"]')?.value || currentUser.email,
        phone: document.querySelector('[name="cphone"]')?.value || '',
        address: document.querySelector('[name="address"]')?.value || '',
        city: document.querySelector('[name="city"]')?.value || '',
        pincode: document.querySelector('[name="pincode"]')?.value || '',
        state: 'Tamil Nadu'
    };
    const pmVal = 'pay-online'; // Only Razorpay — COD removed
    const paymentMethod = 'Razorpay';
    const paymentStatus = 'Awaiting payment';
    const addressSelect = document.getElementById('checkoutAddressSelect');
    const addressChoice = addressSelect ? addressSelect.value : 'new';
    const addressSave = upsertSavedAddressForCurrentUser(shipping);
    const savedAddresses = addressSave.list || getSavedAddresses();
    const chosenLabel = addressChoice !== 'new'
        ? _normalizeAddressRecord(savedAddresses[parseInt(addressChoice, 10)] || savedAddresses[0] || {}, 0).label
        : (savedAddresses.length ? _normalizeAddressRecord(savedAddresses[0], 0).label : 'New checkout address');

    const order = {
        id: 'SSA' + Date.now().toString(36).toUpperCase(),
        date: new Date().toISOString(),
        items: cart.map(i => ({
            productId: i.id,
            name: i.name,
            image: i.mainImage || i.image || '',
            category: i.category || '',
            gender: i.gender || '',
            sleeve: i.sleeve || '',
            selectedSize: i.selectedSize,
            selectedColor: i.selectedColor || null,
            qty: i.qty,
            price: i.price,
            embroidery: i.embroidery || null
        })),
        total: total > 2000 ? total : total + 150,
        payment: paymentMethod,
        paymentStatus,
        status: 'Processing',
        trackingId: '',
        deliveredAt: null,
        addressLabel: chosenLabel,
        shipping: {
            name: (shipping.firstname + ' ' + shipping.lastname).trim(),
            email: shipping.email,
            phone: shipping.phone,
            address: shipping.address,
            city: shipping.city,
            pincode: shipping.pincode,
            state: shipping.state
        }
    };

    // Always online payment via Razorpay
    closeCheckoutModal();
    _showPaymentOverlay();
    _openRazorpayCheckout(order, shipping);
}

// ── Payment processing overlay ──────────────────────────────────
function _showPaymentOverlay() {
    let el = document.getElementById('rzpPaymentOverlay');
    if (!el) {
        el = document.createElement('div');
        el.id = 'rzpPaymentOverlay';
        el.innerHTML = `
            <div class="rzp-overlay-inner">
                <div class="rzp-spinner-wrap"><div class="rzp-spinner"></div></div>
                <div class="rzp-overlay-text">Opening secure payment&hellip;</div>
                <div class="rzp-overlay-sub">You&apos;ll be redirected to a secure Razorpay page</div>
            </div>`;
        document.body.appendChild(el);
    }
    el.classList.add('active');
}
function _hidePaymentOverlay() {
    const el = document.getElementById('rzpPaymentOverlay');
    if (el) el.classList.remove('active');
}

// Opens the Razorpay checkout modal. Called when payment method = online.
function _openRazorpayCheckout(order, shipping) {
    if (typeof Razorpay === 'undefined') {
        _hidePaymentOverlay();
        showToast('Payment gateway not loaded. Please refresh and try again.');
        return;
    }
    const rzpCfg = window.SSA_RAZORPAY || {};
    const options = {
        key: rzpCfg.keyId || '',
        amount: order.total * 100,   // Razorpay expects paise (1 INR = 100 paise)
        currency: 'INR',
        name: rzpCfg.businessName || 'Siva Suresh Agency',
        description: rzpCfg.description || 'Hospital Linen & Medical Uniforms',
        image: window.location.origin + '/sivasureshagency/' + (rzpCfg.logo || 'images/Images/SSA Logo.png'),
        prefill: {
            name: (shipping.firstname + ' ' + shipping.lastname).trim(),
            email: shipping.email,
            contact: shipping.phone
        },
        theme: { color: rzpCfg.themeColor || '#0d9488' },
        handler: async function(response) {
            _hidePaymentOverlay();
            // Payment captured — attach Razorpay IDs and finalize order
            order.paymentStatus = 'Paid';
            order.razorpay = {
                paymentId: response.razorpay_payment_id || '',
                orderId:   response.razorpay_order_id   || '',
                signature: response.razorpay_signature  || ''
            };
            await _confirmOrderAfterPayment(order, shipping);
        },
        modal: {
            ondismiss: function() {
                _hidePaymentOverlay();
                showToast('Payment cancelled. Your order was not placed.');
            }
        }
    };
    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function(response) {
        _hidePaymentOverlay();
        const msg = (response.error && response.error.description)
            ? response.error.description : 'Please try again.';
        showToast('Payment failed: ' + msg);
    });
    // Overlay shows briefly while Razorpay modal loads, then Razorpay takes over
    setTimeout(_hidePaymentOverlay, 1200);
    rzp.open();
}

// Saves order to DB + localStorage and shows the success modal.
// Called for COD directly; for Razorpay after payment.captured.
async function _confirmOrderAfterPayment(order, shipping) {
    if (typeof saveOrderToDb === 'function') {
        try {
            await saveOrderToDb(order, shipping);
        } catch (err) {
            console.error('[placeOrder] DB save failed:', err);
            showToast('Could not save order. Please check your connection and try again.');
            return;
        }
    }
    // Also cache in localStorage so order-detail page can always find it
    // (Supabase RLS may block reads for users without a Supabase auth JWT)
    try {
        const lsKey = 'ssa_orders_' + currentUser.email;
        const existingOrders = JSON.parse(localStorage.getItem(lsKey) || '[]');
        if (!existingOrders.find(o => o.id === order.id)) {
            existingOrders.unshift({ ...order, _synced: true });
            localStorage.setItem(lsKey, JSON.stringify(existingOrders.slice(0, 50)));
        }
    } catch (_) {}
    closeCheckoutModal();
    document.getElementById('orderId').textContent = order.id;
    document.getElementById('successModal').classList.add('active');
    cart = []; saveCart(); updateCartUI();

    // Inject share card into success modal
    const shareSlot = document.getElementById('successShareSlot');
    if (shareSlot && window.buildShareCard) {
        shareSlot.innerHTML = window.buildShareCard(order.id);
        if (window.SSAAnims && window.SSAAnims.initShareMenus) {
            window.SSAAnims.initShareMenus(shareSlot);
        }
    }
}

// ===== Hero Slider =====
// ===== Scrub Brand Name Config =====
function getScrubBrandName(withSuffix) {
    if (withSuffix === undefined) withSuffix = true;
    try {
        const cfg = JSON.parse(localStorage.getItem('ssa_scrub_brand') || '{}');
        const name = cfg.name || 'CliniFlex';
        const suffix = cfg.suffix !== undefined ? cfg.suffix : '™';
        return withSuffix ? name + suffix : name;
    } catch(e) { return withSuffix ? 'CliniFlex™' : 'CliniFlex'; }
}
function applyScrubBrandName() {
    const display = getScrubBrandName();
    document.querySelectorAll('.scrub-brand-text').forEach(el => { el.textContent = display; });
}
window.getScrubBrandName = getScrubBrandName;
window.applyScrubBrandName = applyScrubBrandName;

// ===== Category Tile Auto-Scroll =====
// Pools images per category from live productsData and cycles them on .cat-tile-img[data-cat] elements.
const _tileScrollTimers = {};
// Collect ONLY admin-uploaded (remote) images for a product — never bundled repo images.
function _collectAdminImages(p) {
    const out = [];
    const add = (u) => { if (u && /^https?:\/\//i.test(u) && !out.includes(u)) out.push(u); };
    add(p.mainImage);
    (p.colorVariants || []).forEach(cv => (cv.images || []).forEach(add));
    add(p.image);
    return out;
}

// Build a per-category pool of admin-uploaded images (for tiles + mega menu).
function _buildCatImagePool() {
    const pool = {};
    (window.productsData || productsData || []).forEach(p => {
        const imgs = _collectAdminImages(p);
        if (!imgs.length) return;
        if (!pool[p.category]) pool[p.category] = [];
        imgs.forEach(im => { if (!pool[p.category].includes(im)) pool[p.category].push(im); });
    });
    return pool;
}

function initCategoryTileScroll() {
    // Use only admin-uploaded product images, transitioning through all of them
    const catImages = _buildCatImagePool();

    // Supabase products may be saved under a slightly different category slug than
    // the tile's data-cat. This map resolves aliases so images still appear.
    // Confirmed via live productsData: bedsheets products are stored as
    // "bedsheets-pillow-covers" in Supabase, but the tile uses data-cat="bedsheets".
    const CAT_SLUG_ALIASES = {
        'bedsheets':      ['bedsheets', 'bedsheets-pillow-covers'],
        'hospital-linen': ['hospital-linen', 'medical-linen'],
        'hotel-linen':    ['hotel-linen', 'hotel-bedsheets'],
    };

    document.querySelectorAll('.cat-tile-img[data-cat]').forEach(tile => {
        const cat = tile.dataset.cat;
        // Resolve images: try primary slug first, then any configured aliases
        const aliases = CAT_SLUG_ALIASES[cat] || [cat];
        let imgs = [];
        for (const alias of aliases) {
            const found = catImages[alias];
            if (found && found.length) { imgs = found; break; }
        }
        if (_tileScrollTimers[cat]) { clearInterval(_tileScrollTimers[cat]); delete _tileScrollTimers[cat]; }
        // No admin images for this category → show the CSS gradient placeholder
        if (!imgs.length) { tile.style.backgroundImage = ''; tile.classList.remove('has-img'); return; }
        tile.style.backgroundImage = `url('${imgs[0]}')`;
        tile.classList.add('has-img');
        if (imgs.length < 2) return;
        // Cross-fade layer sits above the base bg and below the gradient overlay
        let fade = tile.querySelector('.cti-fade');
        if (!fade) { fade = document.createElement('div'); fade.className = 'cti-fade'; tile.appendChild(fade); }
        let idx = 0;
        _tileScrollTimers[cat] = setInterval(() => {
            const next = (idx + 1) % imgs.length;
            const pre = new Image(); pre.src = imgs[next]; // preload for a smooth fade
            fade.style.backgroundImage = `url('${imgs[next]}')`;
            requestAnimationFrame(() => { fade.style.opacity = '1'; });
            setTimeout(() => {
                tile.style.backgroundImage = `url('${imgs[next]}')`;
                fade.style.opacity = '0';
                idx = next;
            }, 900);
        }, 4000);
    });
}
window.initCategoryTileScroll = initCategoryTileScroll;

// Build a pool of MAIN product images (admin-uploaded) per category, preferring
// each product's mainImage. Used to cross-fade the mega-menu column thumbnails.
function _buildCatMainImagePool() {
    const pool = {};
    (window.productsData || productsData || []).forEach(p => {
        let im = (p.mainImage && /^https?:/.test(p.mainImage)) ? p.mainImage : null;
        if (!im) { const a = _collectAdminImages(p); im = a[0] || null; }
        if (!im) return;
        (pool[p.category] = pool[p.category] || []);
        if (!pool[p.category].includes(im)) pool[p.category].push(im);
    });
    return pool;
}

// Populate mega-menu thumbnails + CliniFlex hero with admin-uploaded product images.
// The Categories column thumbnails cross-fade through that category's main product
// images (admin-uploaded) so they feel alive.
function initMegaMenuImages() {
    const pool = _buildCatImagePool();
    const mainPool = _buildCatMainImagePool();
    const fallback = { 'hospital-linen': ['hospital-linen', 'bedsheets', 'hotel-linen'], 'bedsheets': ['bedsheets', 'hospital-linen'] };
    const pick = (obj, cat) => { const cats = [cat].concat(fallback[cat] || []); for (const c of cats) { if (obj[c] && obj[c].length) return obj[c]; } return null; };
    // Union the image pool across all product categories a heading spans (data-cats),
    // falling back to a single data-cat.
    const gather = (obj, el) => {
        const list = (el.dataset.cats || el.dataset.cat || '').split(',').map(s => s.trim()).filter(Boolean);
        const out = [];
        list.forEach(c => { const imgs = pick(obj, c); if (imgs) imgs.forEach(im => { if (!out.includes(im)) out.push(im); }); });
        return out;
    };
    // Shared cross-fade: sets the first image and, when there are 2+, fades through them.
    const applyCrossfade = (el, imgs) => {
        if (el._megaTimer) { clearInterval(el._megaTimer); el._megaTimer = null; }
        let fade = el.querySelector('.mct-fade');
        if (!imgs || !imgs.length) { el.style.backgroundImage = ''; el.classList.remove('has-img'); if (fade) fade.remove(); return; }
        el.style.backgroundImage = `url('${imgs[0]}')`;
        el.classList.add('has-img');
        if (imgs.length < 2) { if (fade) fade.remove(); return; }
        if (!fade) { fade = document.createElement('div'); fade.className = 'mct-fade'; el.insertBefore(fade, el.firstChild); }
        let idx = 0;
        el._megaTimer = setInterval(() => {
            const next = (idx + 1) % imgs.length;
            const pre = new Image(); pre.src = imgs[next];
            fade.style.backgroundImage = `url('${imgs[next]}')`;
            requestAnimationFrame(() => { fade.style.opacity = '1'; });
            setTimeout(() => { el.style.backgroundImage = `url('${imgs[next]}')`; fade.style.opacity = '0'; idx = next; }, 700);
        }, 3000);
    };
    // CliniFlex hero + spotlight visual — now cross-fade too.
    document.querySelectorAll('.cliniflex-dd-hero[data-cat], .ss-visual-img[data-cat]').forEach(el => {
        let imgs = gather(mainPool, el); if (!imgs.length) imgs = gather(pool, el);
        applyCrossfade(el, imgs);
    });
    // Category column thumbnails.
    document.querySelectorAll('.mega-col-thumb[data-cat], .mega-col-thumb[data-cats]').forEach(el => {
        let imgs = gather(mainPool, el); if (!imgs.length) imgs = gather(pool, el);
        applyCrossfade(el, imgs);
    });
}
window.initMegaMenuImages = initMegaMenuImages;

// ===== Hero Dynamic Images =====
// Updates hero slide product images with actual product mainImage/image after sync.
function initHeroDynamicImages() {
    const catMap = {
        '1': 'doctor-uniform',
        '2': 'staff-uniform',
        '3': 'hospital-linen',
        '4': 'scrub-suits'
    };
    document.querySelectorAll('.hero-slide').forEach(slide => {
        const slideNum = slide.dataset.slide;
        const cat = catMap[slideNum];
        if (!cat) return;
        const prodImg = slide.querySelector('.hero-prod-img img');
        if (!prodImg) return;
        // Use ONLY admin-uploaded (remote) images for hero slides.
        const catProducts = productsData.filter(p => p.category === cat);
        const heroImg = catProducts.flatMap(_collectAdminImages)[0] || '';
        if (heroImg) {
            prodImg.src = heroImg;
            prodImg.style.display = '';
        } else {
            // If no admin image exists for this category yet, hide the image
            // instead of showing bundled static assets.
            prodImg.removeAttribute('src');
            prodImg.style.display = 'none';
        }
    });
    // Update CliniFlex slide title with current brand name
    const cliniTitle = document.getElementById('heroCliniTitle');
    if (cliniTitle) cliniTitle.innerHTML = `The <span class="highlight scrub-brand-text">${getScrubBrandName()}</span> Experience`;
}
window.initHeroDynamicImages = initHeroDynamicImages;

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prev = document.querySelector('.hero-prev');
    const next = document.querySelector('.hero-next');
    if (!slides.length) return;
    let current = 0, interval;
    function show(i) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        current = i; if (current >= slides.length) current = 0; if (current < 0) current = slides.length - 1;
        slides[current].classList.add('active'); dots[current].classList.add('active');
    }
    function start() { interval = setInterval(() => show(current + 1), 5000); }
    function reset() { clearInterval(interval); start(); }
    if (prev) prev.addEventListener('click', () => { show(current - 1); reset(); });
    if (next) next.addEventListener('click', () => { show(current + 1); reset(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { show(i); reset(); }));
    start();
}

// ===== Stats Counter =====
function initStatsCounter() {
    const stats = document.querySelector('.stats');
    if (!stats) return;
    let counted = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                document.querySelectorAll('.stat-number').forEach(stat => {
                    const target = parseInt(stat.dataset.target);
                    const step = target / 100;
                    let cur = 0;
                    const counter = setInterval(() => { cur += step; if (cur >= target) { cur = target; clearInterval(counter); } stat.textContent = Math.floor(cur).toLocaleString() + '+'; }, 20);
                });
                counted = true;
            }
        });
    }, { threshold: 0.3 });
    observer.observe(stats);
}

// ===== AI Chatbot =====
let _chatLiveAgentMode = false;
let _chatSessionId = null;
let _chatSessionDocId = null;   // Supabase doc ID for live-agent session
let _chatPollInterval = null;    // Polling timer for admin replies
let _chatShownAdminMsgs = 0;     // Admin messages already rendered
let _chatPendingFile = null;
let _chatMsgCount = 0;

function initChatbot() {
    const toggle = document.getElementById('chatbotToggle');
    const win = document.getElementById('chatbotWindow');
    const minimize = document.getElementById('chatbotMinimize');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');
    if (!toggle) return;

    // Show greeting message on first open
    toggle.addEventListener('click', () => {
        const isOpen = win.classList.contains('open');
        win.classList.toggle('open');
        const badge = document.querySelector('.chatbot-badge');
        if (badge) badge.style.display = 'none';
        if (!isOpen) _initChatGreeting();
    });

    if (minimize) minimize.addEventListener('click', () => win.classList.remove('open'));

    // Quick reply delegation
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-reply')) {
            sendChatMessage(e.target.dataset.msg);
            e.target.closest('.quick-replies')?.remove();
        }
    });

    // Send button / Enter key
    if (send) send.addEventListener('click', _dispatchChat);
    if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') _dispatchChat(); });
}

function _initChatGreeting() {
    const messages = document.getElementById('chatbotMessages');
    if (!messages || messages.children.length > 0) return; // Already initialized

    const greetings = [
        "Hi there! 👋 Welcome to Siva Suresh Agency.",
        "How can I help you today? I'm here to assist with products, orders, pricing, and more!"
    ];
    let delay = 0;
    greetings.forEach((g, i) => {
        setTimeout(() => {
            if (i === greetings.length - 1) {
                appendMsgWithQuickReplies('bot', g, [
                    { label: '🛍️ Products', msg: 'What products do you offer?' },
                    { label: '💰 Pricing', msg: 'Tell me about pricing' },
                    { label: '📦 My Orders', msg: 'I want to check my order status' },
                    { label: '🚚 Delivery', msg: 'How does delivery work?' },
                    { label: '📧 Contact Us', msg: 'How do I contact you?' }
                ]);
            } else {
                appendMsg('bot', g);
            }
        }, delay);
        delay += 600;
    });
}

function _dispatchChat() {
    const input = document.getElementById('chatInput');
    const msg = (input?.value || '').trim();
    if (!msg && !_chatPendingFile) return;
    sendChatMessage(msg);
    if (input) input.value = '';
}

function handleChatFile(input) {
    const file = input?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('File too large (max 5MB)'); return; }
    _chatPendingFile = file;
    const preview = document.getElementById('chatbotFilePreview');
    if (preview) {
        preview.style.display = 'flex';
        preview.style.alignItems = 'center';
        preview.style.gap = '8px';
        preview.innerHTML = `<i class="fas fa-file" style="color:var(--primary)"></i><span style="font-size:0.78rem;color:var(--text-muted);flex:1;">${file.name}</span><button onclick="clearChatFile()" style="background:none;border:none;cursor:pointer;color:#ef4444;font-size:0.8rem;"><i class="fas fa-times"></i></button>`;
    }
    input.value = '';
}
function clearChatFile() {
    _chatPendingFile = null;
    const preview = document.getElementById('chatbotFilePreview');
    if (preview) { preview.style.display = 'none'; preview.innerHTML = ''; }
}
window.clearChatFile = clearChatFile;
window.handleChatFile = handleChatFile;

async function sendChatMessage(msg) {
    const messages = document.getElementById('chatbotMessages');
    const input = document.getElementById('chatInput');

    if (!msg && !_chatPendingFile) return;

    // If user has a pending file attachment, show it
    if (_chatPendingFile) {
        const fileEl = document.createElement('div');
        fileEl.className = 'chat-message user';
        fileEl.innerHTML = `<div class="message-avatar"><i class="fas fa-user"></i></div><div class="message-content"><div style="display:flex;align-items:center;gap:6px;background:var(--primary);color:#fff;border-radius:8px;padding:8px 12px;font-size:0.8rem;"><i class="fas fa-paperclip"></i><span>${_chatPendingFile.name}</span></div>${msg ? `<p style="margin-top:6px;">${escapeRichText ? escapeRichText(msg) : msg}</p>` : ''}</div>`;
        messages.appendChild(fileEl);
        clearChatFile();
    } else if (msg) {
        appendMsg('user', msg);
    }
    if (input) input.value = '';
    messages.scrollTop = messages.scrollHeight;

    _chatMsgCount++;

    // When live agent is connected: silently forward message to session — NO bot typing or response
    if (_chatLiveAgentMode) {
        if (_chatSessionDocId && window.db && msg) _appendUserMsgToSession(_chatSessionDocId, msg);
        // Show a tiny "delivered" tick on the last user message (not a bot reply)
        const lastUser = [...messages.querySelectorAll('.chat-message.user')].pop();
        if (lastUser) {
            const tick = document.createElement('div');
            tick.style.cssText = 'font-size:0.68rem;color:#10b981;text-align:right;margin-top:2px;padding-right:10px;';
            tick.innerHTML = '<i class="fas fa-check-double"></i> Delivered to agent';
            lastUser.after(tick);
        }
        messages.scrollTop = messages.scrollHeight;
        return;
    }

    // Bot typing indicator (only for AI bot mode)
    const typing = document.createElement('div');
    typing.className = 'chat-message bot typing-row';
    typing.innerHTML = '<div class="message-avatar"><i class="fas fa-robot"></i></div><div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    const delay = 900 + Math.random() * 600;
    setTimeout(async () => {
        typing.remove();
        const response = await getAIResponse(msg || '');
        if (typeof response === 'string') {
            appendMsg('bot', response);
        } else if (response && response.text) {
            if (response.quickReplies) {
                appendMsgWithQuickReplies('bot', response.text, response.quickReplies);
            } else {
                appendMsg('bot', response.text);
            }
        }
        messages.scrollTop = messages.scrollHeight;

        // After every 5 messages, proactively offer help options
        if (_chatMsgCount > 0 && _chatMsgCount % 5 === 0) {
            setTimeout(() => {
                appendMsgWithQuickReplies('bot', 'Is there anything else I can help with?', [
                    { label: '📧 Send Message', msg: 'send message' },
                    { label: '👤 Live Agent', msg: 'connect live agent' },
                    { label: '📦 Track Order', msg: 'track my order' }
                ]);
                messages.scrollTop = messages.scrollHeight;
            }, 1200);
        }
    }, delay);
}
window.sendChatMessage = sendChatMessage;

function appendMsg(type, html) {
    const messages = document.getElementById('chatbotMessages');
    if (!messages) return;
    const div = document.createElement('div');
    div.className = `chat-message ${type}`;
    const icon = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    div.innerHTML = `<div class="message-avatar">${icon}</div><div class="message-content"><p>${html}</p></div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function appendMsgWithQuickReplies(type, html, replies) {
    const messages = document.getElementById('chatbotMessages');
    if (!messages) return;
    const div = document.createElement('div');
    div.className = `chat-message ${type}`;
    const icon = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    const repliesHtml = replies.map(r => `<button class="quick-reply" data-msg="${(r.msg||r).replace(/"/g,'&quot;')}">${r.label||r}</button>`).join('');
    div.innerHTML = `<div class="message-avatar">${icon}</div><div class="message-content"><p>${html}</p><div class="quick-replies">${repliesHtml}</div></div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

async function getAIResponse(msg) {
    const m = (msg || '').toLowerCase().trim();

    // ── Greetings ──
    if (/^(hi|hello|hey|hii|good morning|good evening|howdy|namaste|helo|hai)\b/.test(m)) {
        const user = JSON.parse(localStorage.getItem('ssa_user') || 'null');
        const name = user?.name?.split(' ')[0] || '';
        return { text: `Hello${name ? ', ' + name : ''}! 😊 Great to have you here. I'm SSA Assistant, your personal shopping guide. What can I help you with today?`, quickReplies: [
            { label: '🛍️ Browse Products', msg: 'What products do you offer?' },
            { label: '💰 Pricing Info', msg: 'Tell me about pricing' },
            { label: '📦 My Orders', msg: 'Check my order status' },
            { label: '🚚 Delivery', msg: 'Delivery information' }
        ]};
    }

    // ── Products ──
    if (/product|offer|sell|catalog|scrub|uniform|linen|bedsheet|hotel/.test(m)) {
        return { text: `We specialize in premium healthcare & hospitality textiles:<br>🥼 <strong>Doctor Uniforms</strong> — Male & Female, Full & Half Sleeve<br>👔 <strong>Staff Uniforms</strong> — All styles, 20+ colors<br>⭐ <strong>CliniFlex™ Scrubs</strong> — Our signature scrub suit line<br>🛏️ <strong>Bedsheets</strong> — Hospital & hotel grade<br>🏥 <strong>Hospital Linen</strong> — OT aprons, caps, drapes<br>🏨 <strong>Hotel Linen</strong> — Premium hospitality textiles<br><br><a href="categories.html" style="color:var(--primary);font-weight:700;">Browse All Products →</a>`, quickReplies: [
            { label: '💰 Pricing', msg: 'What are the prices?' },
            { label: '🛒 How to Order', msg: 'How do I place an order?' },
            { label: '📦 Bulk Orders', msg: 'I need bulk order pricing' }
        ]};
    }

    // ── Pricing ──
    if (/price|cost|rate|how much|charges|fee/.test(m)) {
        return { text: `Here are our approximate price ranges:<br>🥼 Doctor Uniforms: <strong>₹750 – ₹900</strong><br>👔 Staff Uniforms: <strong>₹500 – ₹590</strong><br>🛏️ Bedsheets: <strong>₹150 – ₹480</strong><br>⭐ CliniFlex™ Scrubs: <strong>₹600 – ₹850</strong><br><br>💡 <strong>Bulk discounts</strong> available for orders above 50 pcs!<br><a href="categories.html" style="color:var(--primary);font-weight:700;">See exact prices →</a>`, quickReplies: [
            { label: '📦 Bulk Discount', msg: 'Tell me about bulk discounts' },
            { label: '🛒 Place Order', msg: 'How do I place an order?' }
        ]};
    }

    // ── Bulk / Wholesale ──
    if (/bulk|wholesale|institution|hospital|large order|quantity/.test(m)) {
        return { text: `We love bulk orders! 📦<br><br>Benefits for bulk buyers:<br>✅ Special discounted pricing<br>✅ Dedicated account manager<br>✅ Priority processing & delivery<br>✅ Custom embroidery & branding<br>✅ Easy recurring orders<br><br>Minimum order: <strong>10 pcs per item</strong><br><a href="contact.html" style="color:var(--primary);font-weight:700;">Request Bulk Quote →</a>`, quickReplies: [
            { label: '📧 Get Quote', msg: 'send message' },
            { label: '👤 Talk to Agent', msg: 'connect live agent' }
        ]};
    }

    // ── Order placement ──
    if (/how (to|do) (i |we |)order|place.*(order)|buy now|purchase|add to cart/.test(m)) {
        return { text: `Ordering is easy! Here's how:<br>1️⃣ Browse <a href="categories.html">Categories</a><br>2️⃣ Select size, color & quantity<br>3️⃣ Add to Cart 🛒<br>4️⃣ Checkout with shipping details<br>5️⃣ Choose payment: <strong>COD, UPI, or Bank Transfer</strong><br>6️⃣ Receive confirmation & track your order<br><br>Need help? I'm here!`, quickReplies: [
            { label: '🛍️ Shop Now', msg: 'take me to products' },
            { label: '💳 Payment Options', msg: 'What payment methods do you accept?' }
        ]};
    }

    // ── Delivery / Shipping ──
    if (/deliver|ship|dispatch|when.*arrive|how long|tracking|courier/.test(m)) {
        return { text: `📦 <strong>Delivery Information:</strong><br><br>🚚 Pan-India delivery available<br>🎁 <strong>Free shipping</strong> on orders above ₹2,000<br>⏱️ Standard: <strong>3-5 working days</strong><br>⚡ Express: <strong>1-2 days</strong> (extra charges)<br>📍 Dispatch from Erode, Tamil Nadu<br><br>You'll get a tracking ID after your order is dispatched!`, quickReplies: [
            { label: '📦 Track Order', msg: 'track my order' },
            { label: '🛒 Place Order', msg: 'How do I place an order?' }
        ]};
    }

    // ── Order status / tracking ──
    if (/track|order status|my order|where.*order|order.*id|order.*number/.test(m)) {
        const user = JSON.parse(localStorage.getItem('ssa_user') || 'null');
        if (!user) {
            return { text: `To check your order status, please <strong>sign in</strong> first. Once logged in, you can view all orders, track shipments, and get real-time updates.<br><br>Don't have an account? <a onclick="closeAuthModal && closeAuthModal(); openLoginModal && openLoginModal();" style="color:var(--primary);cursor:pointer;font-weight:700;">Create one free →</a>`, quickReplies: [
                { label: '🔑 Sign In', msg: 'login' },
                { label: '📧 Contact Support', msg: 'send message' }
            ]};
        }
        return { text: `Hi <strong>${user.name?.split(' ')[0] || 'there'}</strong>! To track your order:<br>1. Click <a onclick="if(typeof openAccountPanel==='function')openAccountPanel();" style="color:var(--primary);cursor:pointer;font-weight:700;">My Account</a> (top right)<br>2. Go to "My Orders" tab<br>3. Click any order to see live status<br><br>Or use the <strong>Track Order</strong> button in the header.`, quickReplies: [
            { label: '🔑 My Account', msg: 'go to my account' },
            { label: '📧 Order Support', msg: 'I need help with my order' }
        ]};
    }

    // ── Returns / Exchange ──
    if (/return|exchange|refund|replace|defect|damaged|wrong/.test(m)) {
        return { text: `We stand behind our quality! Here's our policy:<br><br>↩️ <strong>Returns accepted</strong> within 7 days of delivery<br>🔄 <strong>Exchange</strong> for size/color issues — free<br>💰 <strong>Refund</strong> processed within 5-7 business days<br><br>To raise a return request, go to <strong>My Account → My Orders → Request Return</strong><br><br>Or contact us directly for faster resolution.`, quickReplies: [
            { label: '📧 Contact Support', msg: 'send message' },
            { label: '👤 Talk to Agent', msg: 'connect live agent' }
        ]};
    }

    // ── Payment ──
    if (/payment|pay|upi|cod|cash|online|razorpay|card/.test(m)) {
        return { text: `💳 <strong>We accept multiple payment methods:</strong><br><br>💵 Cash on Delivery (COD)<br>📱 UPI (GPay, PhonePe, Paytm)<br>💳 Debit/Credit Cards (Razorpay)<br>🏦 Bank Transfer (for bulk orders)<br><br>All online payments are secured by <strong>Razorpay</strong> — India's most trusted payment gateway.` };
    }

    // ── Custom / Embroidery ──
    if (/custom|embroid|logo|brand|print|design|color options/.test(m)) {
        return { text: `✨ <strong>Yes, we do custom orders!</strong><br><br>🎨 20+ color options available<br>👕 All sizes S to XXXL<br>🏥 Custom hospital logo embroidery<br>🎯 Specific design requirements<br>📦 Minimum 10 pcs per custom design<br><br>Send us your design requirements and we'll quote within 24 hours.`, quickReplies: [
            { label: '📧 Send Requirements', msg: 'send message' },
            { label: '👤 Talk to Agent', msg: 'connect live agent' }
        ]};
    }

    // ── Contact info ──
    if (/contact|reach|phone|address|location|email|office|where are you/.test(m)) {
        return { text: `📞 <strong>Siva:</strong> +91 93666 40060<br>📞 <strong>Suresh:</strong> +91 93666 40050<br>✉️ <a href="mailto:info@sivasureshagency.onmicrosoft.com">info@sivasureshagency.onmicrosoft.com</a><br>📍 PVT Towers, 37/10, Selvam Nagar, Erode - 638011, Tamil Nadu<br><br>Office hours: <strong>Mon-Sat, 9am - 6pm</strong>`, quickReplies: [
            { label: '📧 Send Message', msg: 'send message' },
            { label: '🗺️ Get Directions', msg: 'directions' }
        ]};
    }

    // ── Directions ──
    if (/direction|map|location|how to reach|find you/.test(m)) {
        return { text: `📍 <strong>Find Us:</strong><br>PVT Towers, 37/10, Selvam Nagar,<br>Erode - 638011, Tamil Nadu<br><br>🚉 Near Erode Junction Railway Station<br><a href="contact.html" style="color:var(--primary);font-weight:700;">View Map on Contact Page →</a>` };
    }

    // ── My account / login navigation ──
    if (/my account|go.*account|profile|login|sign in/.test(m)) {
        if (typeof openAccountPanel === 'function' && JSON.parse(localStorage.getItem('ssa_user') || 'null')) {
            openAccountPanel();
            return { text: `Opening your account panel now! You can see your orders, addresses, and profile there.` };
        } else {
            return { text: `Please sign in to access your account. You can view orders, track deliveries, and manage your profile after logging in.`, quickReplies: [
                { label: '🔑 Sign In', msg: 'sign in now' }
            ]};
        }
    }
    if (/sign in now/.test(m)) {
        if (typeof openLoginModal === 'function') setTimeout(() => openLoginModal(), 300);
        return { text: `Opening sign in for you...` };
    }

    // ── Take me to products ──
    if (/take me.*product|shop now|browse product|go.*shop/.test(m)) {
        setTimeout(() => { window.location.href = 'categories.html'; }, 1500);
        return { text: `Taking you to our product catalog now! 🛍️` };
    }

    // ── Send message (contact form) ──
    if (/send.*(message|mail|email|us)|contact.*form|raise.*ticket|ticket/.test(m)) {
        return { text: `📧 You can send us a message through our contact form. Your query will get a <strong>Ticket ID</strong> so you can track its status anytime.<br><br><a href="contact.html#contact-form" style="color:var(--primary);font-weight:700;">Open Contact Form →</a>`, quickReplies: [
            { label: '👤 Talk to Live Agent', msg: 'connect live agent' }
        ]};
    }

    // ── Live agent ──
    if (/live.?agent|human|real.*person|talk.*someone|connect.*agent|speak.*agent|customer.?care|support.?team/.test(m)) {
        return _handleLiveAgentRequest();
    }

    // ── Thank you ──
    if (/thank|thanks|thx|ty\b/.test(m)) {
        return { text: `You're welcome! 😊 It was a pleasure helping you. Is there anything else you'd like to know?`, quickReplies: [
            { label: '🛍️ Browse Products', msg: 'What products do you offer?' },
            { label: '📧 Send Message', msg: 'send message' }
        ]};
    }

    // ── Bye / exit ──
    if (/bye|goodbye|see you|cya|take care/.test(m)) {
        return { text: `Goodbye! 👋 Thank you for visiting Siva Suresh Agency. Have a wonderful day! Feel free to come back anytime. 😊` };
    }

    // ── Default fallback ──
    const fallback = [
        `I'm not sure I understood that, but I'd love to help! Could you rephrase, or choose one of these options?`,
        `Hmm, let me think... I might need a bit more context. Could you tell me more about what you're looking for?`,
        `I want to make sure I give you the right answer! Could you be more specific?`
    ];
    return { text: fallback[Math.floor(Math.random() * fallback.length)], quickReplies: [
        { label: '🛍️ Products', msg: 'What products do you offer?' },
        { label: '💰 Pricing', msg: 'Tell me about pricing' },
        { label: '📦 Orders', msg: 'Check my order status' },
        { label: '📧 Send Message', msg: 'send message' },
        { label: '👤 Live Agent', msg: 'connect live agent' }
    ]};
}

function _handleLiveAgentRequest() {
    const user = JSON.parse(localStorage.getItem('ssa_user') || 'null');
    if (!user) {
        return { text: `To connect with a live agent, I'll need you to <strong>sign in</strong> first so our team can identify you and give personalized support.`, quickReplies: [
            { label: '🔑 Sign In & Connect', msg: '_login_then_agent' }
        ]};
    }
    // Check live agent availability asynchronously then activate
    _checkAndActivateLiveAgent(user);
    return { text: `<i class="fas fa-spinner fa-spin"></i> <strong>Checking live agent availability...</strong>` };
}

async function _checkAndActivateLiveAgent(user) {
    try {
        if (window.db) {
            const doc = await window.db.collection('settings').doc('liveAgentConfig').get();
            const cfg = doc.exists ? JSON.parse(doc.data().name || '{}') : {};
            if (cfg.enabled === false) {
                // Remove the "checking..." message and show unavailable
                const msgs = document.getElementById('chatbotMessages');
                const last = msgs?.querySelector('.chat-message.bot:last-child');
                if (last) last.remove();
                appendMsgWithQuickReplies('bot',
                    `⚠️ <strong>Live Agent support is currently unavailable.</strong><br><br>Our team is offline right now. You can:<br>• Try again later during business hours (Mon–Sat, 9am–6pm)<br>• Send us a message and we'll respond by email`,
                    [
                        { label: '📧 Send Us a Message', msg: 'send message' },
                        { label: '🎫 Create a Support Ticket', msg: 'send message' }
                    ]
                );
                return;
            }
        }
    } catch(e) { /* if check fails, allow by default */ }
    // Remove the "checking..." placeholder
    const msgs = document.getElementById('chatbotMessages');
    const last = msgs?.querySelector('.chat-message.bot:last-child');
    if (last) last.remove();
    _activateLiveAgent(user);
    appendMsg('bot', `✅ <strong>Connecting you to a live agent...</strong><br><br>Our support team has been notified. They'll respond here shortly (typically within a few minutes during business hours).<br><br>You can also email us at <a href="mailto:info@sivasureshagency.onmicrosoft.com">info@sivasureshagency.onmicrosoft.com</a>`);
}

// Handle special meta-messages from quick replies
const _origSendChatMessage = sendChatMessage;
document.addEventListener('click', e => {
    if (e.target.classList.contains('quick-reply') && e.target.dataset.msg === '_login_then_agent') {
        e.stopPropagation();
        e.target.closest('.quick-replies')?.remove();
        if (typeof openLoginModal === 'function') {
            openLoginModal();
            // After login, ask again
            appendMsg('bot', 'Please sign in and then type "connect live agent" again to reach our support team.');
        }
    }
});

async function _activateLiveAgent(user) {
    _chatLiveAgentMode = true;
    _chatSessionId = _chatSessionId || ('SESS-' + Date.now().toString(36).toUpperCase());

    // Collect recent chat history
    const chatHistory = [];
    document.querySelectorAll('#chatbotMessages .chat-message').forEach(el => {
        const type = el.classList.contains('user') ? 'customer' : 'agent';
        const text = el.querySelector('.message-content p')?.textContent || '';
        if (text) chatHistory.push(type + ': ' + text);
    });

    // Log the chat/live-agent request for Admin review — WITHOUT creating a
    // formal ticket. Per policy, tickets should not be auto-created for every
    // chatbot interaction; the Admin decides whether an issue needs a tracked
    // ticket (Chat Requests tab → "Create Ticket" in Admin → Messages).
    if (window.db) {
        try {
            const docRef = await window.db.collection('messages').add({
                ticketId: null,
                name: user.name || 'Customer',
                email: user.email || '',
                customerId: user.customerId || '',
                phone: user.phone || '',
                subject: '🔴 Live Agent Request (chat)',
                message: 'Customer requested a live agent via chatbot.\n\nChat history:\n' + chatHistory.slice(-10).join('\n'),
                sessionId: _chatSessionId,
                status: 'Unassigned',
                source: 'chatbot',
                read: false,
                chatMessages: [],
                createdAt: new Date().toISOString()
            });
            _chatSessionDocId = docRef.id;
            _startLiveChatPolling(_chatSessionDocId);
        } catch (e) {
            console.warn('[chatbot] Failed to log live agent request:', e.message);
        }
    }

    // Notify admin via Power Automate
    if (window.SSA_COMM && window.SSA_COMM.requestLiveAgent) {
        await window.SSA_COMM.requestLiveAgent({
            customerName: user.name,
            customerEmail: user.email,
            customerId: user.customerId || '',
            context: chatHistory.slice(-5).join('\n'),
            sessionId: _chatSessionId
        });
    }

    // Update chatbot header to show live agent mode
    const statusEl = document.querySelector('#chatbotWindow .chatbot-status');
    if (statusEl) statusEl.innerHTML = '<i class="fas fa-circle" style="color:#10b981"></i> Live Agent';
    const headerEl = document.querySelector('#chatbotWindow h4');
    if (headerEl) headerEl.textContent = 'Live Support';
}

// Poll Supabase every 3 s for admin replies on the live chat session
function _startLiveChatPolling(docId) {
    if (_chatPollInterval) clearInterval(_chatPollInterval);
    _chatShownAdminMsgs = 0;
    _chatPollInterval = setInterval(async () => {
        if (!window.db || !docId) return;
        try {
            const snap = await window.db.collection('messages').doc(docId).get();
            if (!snap.exists) return;
            const data = snap.data();

            // ── Agent ended the chat ─────────────────────────────────
            if (data.agentEnded === true || data.status === 'Ended') {
                clearInterval(_chatPollInterval);
                _chatPollInterval = null;
                _chatLiveAgentMode = false;
                _chatSessionDocId = null;

                const el = document.getElementById('chatbotMessages');
                if (el) {
                    const div = document.createElement('div');
                    div.className = 'chat-message bot';
                    div.innerHTML = `<div class="message-avatar"><i class="fas fa-headset"></i></div><div class="message-content"><p style="background:linear-gradient(135deg,#fef3c7,#fde68a);color:#92400e;border-radius:10px;padding:10px 14px;font-size:0.82rem;margin:0;"><i class="fas fa-info-circle" style="margin-right:6px"></i><strong>Chat ended by agent.</strong> The AI assistant is active again — feel free to ask anything!</p></div>`;
                    el.appendChild(div);
                    el.scrollTop = el.scrollHeight;
                }

                // Restore chatbot header
                const statusEl = document.querySelector('#chatbotWindow .chatbot-status');
                if (statusEl) statusEl.innerHTML = '<i class="fas fa-circle"></i> Online';
                const headerEl = document.querySelector('#chatbotWindow h4');
                if (headerEl) headerEl.textContent = 'SSA Assistant';

                // Flash badge
                const badge = document.querySelector('.chatbot-badge');
                const win = document.getElementById('chatbotWindow');
                if (badge && win && !win.classList.contains('open')) { badge.style.display = 'inline-flex'; badge.textContent = '!'; }
                return;
            }

            // ── New admin messages ───────────────────────────────────
            const msgs = (data.chatMessages || []).filter(m => m.role === 'admin');
            if (msgs.length > _chatShownAdminMsgs) {
                msgs.slice(_chatShownAdminMsgs).forEach(m => {
                    const el = document.getElementById('chatbotMessages');
                    if (!el) return;
                    const div = document.createElement('div');
                    div.className = 'chat-message bot';
                    div.innerHTML = `<div class="message-avatar"><i class="fas fa-headset"></i></div><div class="message-content"><p><strong style="color:var(--primary);">Support Agent:</strong> ${(m.text||'').replace(/</g,'&lt;')}</p><span style="font-size:0.7rem;color:var(--text-muted);">${new Date(m.ts).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span></div>`;
                    el.appendChild(div);
                    el.scrollTop = el.scrollHeight;
                    // Flash chatbot badge if window is closed
                    const badge = document.querySelector('.chatbot-badge');
                    const win = document.getElementById('chatbotWindow');
                    if (badge && win && !win.classList.contains('open')) { badge.style.display = 'inline-flex'; badge.textContent = '!'; }
                });
                _chatShownAdminMsgs = msgs.length;
            }
        } catch (e) { /* silent poll error */ }
    }, 3000);
}

// Append a user message to the Supabase live chat session
// Uses an atomic RPC so concurrent messages from multiple sessions never overwrite each other
async function _appendUserMsgToSession(docId, text) {
    if (!docId || !text) return;
    try {
        const sb = window._supabase;
        if (!sb) throw new Error('Supabase not ready');
        const { error } = await sb.rpc('append_chat_message', {
            p_id: docId, p_role: 'user', p_text: text, p_ts: new Date().toISOString()
        });
        if (error) throw new Error(error.message);
    } catch (e) { console.warn('[chat] append user msg failed:', e.message); }
}


// ===== Color Selection (order-only, no image change) =====
function selectCardColor(btn) {
    const swatches = btn.parentElement;
    swatches.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    const label = swatches.querySelector('.color-name');
    if (label) label.textContent = btn.dataset.colorName;
    const card = btn.closest('.shop-card');
    if (card) {
        // Update h4 to show color name
        const h4 = card.querySelector('.shop-card-name');
        if (h4) {
            const base = h4.dataset.baseName || h4.textContent.split('\u2013')[0].trim();
            h4.dataset.baseName = h4.dataset.baseName || base;
            h4.textContent = base + (btn.dataset.colorName ? '\u2013 ' + btn.dataset.colorName : '');
        }
        updateCardStockUI(card);
        // Swap card image to selected color's image
        const pid = Number(card.dataset.id);
        const product = productsData.find(p => p.id === pid);
        if (product?.colorVariants) {
            const cv = product.colorVariants.find(c => c.name === btn.dataset.colorName);
            if (cv?.images?.[0]) {
                const img = card.querySelector('.shop-card-image img');
                if (img) img.src = cv.images[0];
            }
        }
    }
}

function selectDetailColor(btn, pid) {
    const container = btn.parentElement;
    container.querySelectorAll('.pd-color-swatch').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    const label = container.parentElement.querySelector('.pd-color-name');
    if (label) label.textContent = btn.dataset.colorName;
    // Update modal title with selected color
    const titleEl = pid ? document.getElementById(`pdTitle-${pid}`) : null;
    if (titleEl) {
        const span = titleEl.querySelector('.pd-title-color');
        if (span) span.textContent = ` — ${btn.dataset.colorName}`;
        else { const s = document.createElement('span'); s.className = 'pd-title-color'; s.textContent = ` — ${btn.dataset.colorName}`; titleEl.appendChild(s); }
    }
    if (pid) {
        // Swap images for selected color
        const p = productsData.find(x => x.id === pid);
        if (p) {
            const imgs = _pdGetImages(p, btn.dataset.colorName);
            window._lbImages = imgs;
            window._lbIndex = 0;
            const mainImg = document.getElementById(`pdMainImg-${pid}`);
            if (mainImg && imgs[0]) mainImg.src = imgs[0];
            // Rebuild thumbnails
            const thumbs = document.getElementById(`pdThumbs-${pid}`);
            if (thumbs) {
                thumbs.style.display = imgs.length > 1 ? '' : 'none';
                thumbs.innerHTML = imgs.map((img,i) => `<button class="pd-thumb${i===0?' active':''}" onclick="selectPdImage(this,'${img.replace(/'/g,"\\'")}',${ pid})" style="background-image:url('${img.replace(/'/g,"\\'")}')"></button>`).join('');
            }
        }
        updateProductDetailVariantState(pid);
    } else {
        const modal = btn.closest('.modal.product-detail-modal');
        if (modal) {
            const sw = modal.querySelector('[id^="pdSizes-"]');
            if (sw) { const p2 = Number(sw.id.replace('pdSizes-','')); if (p2) updateProductDetailVariantState(p2); }
        }
    }
}

// ===== Image Gallery & Lightbox =====
function selectPdImage(btn, src, pid) {
    if (!btn) return;
    const thumbs = btn.closest('.pd-thumbnails');
    if (thumbs) {
        thumbs.querySelectorAll('.pd-thumb').forEach((b, i) => {
            b.classList.remove('active');
            if (b === btn) window._lbIndex = i;
        });
    }
    btn.classList.add('active');
    const mainImg = document.getElementById(`pdMainImg-${pid}`);
    if (mainImg) mainImg.src = src;
}
window.selectPdImage = selectPdImage;

function openImageLightbox(imgIdOrSrc) {
    const src = (imgIdOrSrc && !imgIdOrSrc.startsWith('data:') && !imgIdOrSrc.startsWith('http') && !imgIdOrSrc.startsWith('images/'))
        ? (document.getElementById(imgIdOrSrc)?.src || imgIdOrSrc) : imgIdOrSrc;
    if (!src) return;

    const imgs = (window._lbImages && window._lbImages.length > 1) ? window._lbImages : [src];
    let idx = window._lbIndex || 0;
    const srcIdx = imgs.indexOf(src);
    if (srcIdx >= 0) idx = srcIdx;

    const lb = document.createElement('div');
    lb.id = '_imgLightbox';
    lb.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.93);z-index:99999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;animation:_pmFadeIn .18s ease';

    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let dragActive = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let touchStartX = 0;

    const applyTransform = () => {
        const img = lb.querySelector('img');
        if (img) img.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
    };

    function render() {
        const hasMulti = imgs.length > 1;
        lb.innerHTML = `
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px">
                <img src="${imgs[idx]}" style="max-width:92vw;max-height:88vh;border-radius:12px;object-fit:contain;box-shadow:0 24px 72px rgba(0,0,0,0.7);pointer-events:auto;user-select:none;transform:translate(0px,0px) scale(1);transition:transform .2s ease">
            </div>
            <button onclick="document.getElementById('_imgLightbox').remove()" style="position:absolute;top:20px;right:24px;background:rgba(255,255,255,0.15);border:none;color:#fff;width:44px;height:44px;border-radius:50%;font-size:1.3rem;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)">&#x2715;</button>
            <div style="position:absolute;bottom:20px;right:24px;display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">
                <button id="_lbZoomOut" style="background:rgba(255,255,255,0.15);border:none;color:#fff;width:42px;height:42px;border-radius:999px;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)" onclick="event.stopPropagation();window._lbZoom(-0.25)">&#8722;</button>
                <button id="_lbReset" style="background:rgba(255,255,255,0.15);border:none;color:#fff;padding:0 14px;height:42px;border-radius:999px;font-size:0.95rem;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)" onclick="event.stopPropagation();window._lbReset()">Reset</button>
                <button id="_lbZoomIn" style="background:rgba(255,255,255,0.15);border:none;color:#fff;width:42px;height:42px;border-radius:999px;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)" onclick="event.stopPropagation();window._lbZoom(0.25)">&#43;</button>
            </div>
            ${hasMulti ? `
            <button id="_lbPrev" style="position:absolute;left:20px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.15);border:none;color:#fff;width:48px;height:48px;border-radius:50%;font-size:1.3rem;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);transition:background 0.2s" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'" onclick="event.stopPropagation();_lbNav(-1)">&#8592;</button>
            <button id="_lbNext" style="position:absolute;right:20px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.15);border:none;color:#fff;width:48px;height:48px;border-radius:50%;font-size:1.3rem;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);transition:background 0.2s" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'" onclick="event.stopPropagation();_lbNav(1)">&#8594;</button>
            <div style="position:absolute;bottom:18px;left:50%;transform:translateX(-50%);display:flex;gap:7px">${imgs.map((_,i) => `<span style="width:8px;height:8px;border-radius:50%;background:${i===idx?'#fff':'rgba(255,255,255,0.4)'};display:inline-block;cursor:pointer" onclick="event.stopPropagation();_lbNav(${i-idx})"></span>`).join('')}</div>
            ` : ''}
        `;
        applyTransform();
        const img = lb.querySelector('img');
        if (img) {
            img.addEventListener('dblclick', (e) => { e.stopPropagation(); zoom = zoom > 1 ? 1 : 2; panX = 0; panY = 0; applyTransform(); });
            img.draggable = false; // prevent browser's native image drag interfering with pan
            img.addEventListener('mousedown', (e) => {
                if (zoom === 1) return;
                e.preventDefault(); // stop native drag
                dragActive = true; dragStartX = e.clientX; dragStartY = e.clientY;
                img.style.cursor = 'grabbing';
            });
            img.addEventListener('mousemove', (e) => {
                if (!dragActive || zoom === 1) return;
                panX += e.clientX - dragStartX;
                panY += e.clientY - dragStartY;
                dragStartX = e.clientX; dragStartY = e.clientY;
                applyTransform();
            });
            img.addEventListener('mouseup', () => { dragActive = false; img.style.cursor = zoom > 1 ? 'grab' : 'default'; });
            img.addEventListener('mouseleave', () => { dragActive = false; });
            // Pinch-to-zoom state (Issue 7)
            let pinchStartDist = 0, pinchStartZoom = 1;
            let wasPinch = false; // track if the last touch was a pinch (not a swipe)
            img.addEventListener('touchstart', (e) => {
                if (e.touches.length === 2) {
                    // Pinch gesture starting — reset swipe tracking so touchend won't navigate
                    e.preventDefault();
                    wasPinch = true;
                    touchStartX = 0; // disable swipe detection for this gesture
                    pinchStartDist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    pinchStartZoom = zoom;
                } else if (e.touches.length === 1) {
                    wasPinch = false;
                    touchStartX = e.touches[0].clientX;
                    const touchStartY = e.touches[0].clientY;
                    if (zoom > 1) { dragActive = true; dragStartX = touchStartX; dragStartY = touchStartY; }
                }
            }, { passive: false });
            img.addEventListener('touchmove', (e) => {
                if (e.touches.length === 2) {
                    e.preventDefault();
                    const dist = Math.hypot(
                        e.touches[0].clientX - e.touches[1].clientX,
                        e.touches[0].clientY - e.touches[1].clientY
                    );
                    zoom = Math.max(1, Math.min(4, pinchStartZoom * (dist / pinchStartDist)));
                    if (zoom === 1) { panX = 0; panY = 0; }
                    applyTransform();
                } else if (e.touches.length === 1) {
                    if (!dragActive) return;
                    const x = e.touches[0].clientX; const y = e.touches[0].clientY;
                    panX += x - dragStartX; panY += y - dragStartY; dragStartX = x; dragStartY = y; applyTransform();
                    e.preventDefault();
                }
            }, { passive: false });
            img.addEventListener('touchend', (e) => {
                dragActive = false;
                // If this was a pinch gesture, never trigger swipe navigation
                if (wasPinch) { wasPinch = false; return; }
                // Only navigate when truly zoomed out (zoom=1) and a horizontal swipe detected
                if (zoom > 1) return;
                if (touchStartX && Math.abs(touchStartX - e.changedTouches[0].clientX) > 70) {
                    window._lbNav(touchStartX > e.changedTouches[0].clientX ? 1 : -1);
                }
                touchStartX = 0;
            });
            img.addEventListener('wheel', (e) => { e.preventDefault(); window._lbZoom(e.deltaY > 0 ? -0.15 : 0.15); }, { passive: false });
        }
    }

    window._lbNav = function(delta) {
        idx = (idx + delta + imgs.length) % imgs.length;
        window._lbIndex = idx;
        zoom = 1; panX = 0; panY = 0; render();
    };
    window._lbZoom = function(delta) {
        zoom = Math.max(1, Math.min(3, zoom + delta));
        if (zoom === 1) { panX = 0; panY = 0; }
        applyTransform();
    };
    window._lbReset = function() {
        zoom = 1; panX = 0; panY = 0; applyTransform();
    };

    render();
    lb.addEventListener('click', e => { if (e.target === lb) lb.remove(); });
    document.addEventListener('keydown', function lbKey(e) {
        if (!document.getElementById('_imgLightbox')) { document.removeEventListener('keydown', lbKey); return; }
        if (e.key === 'Escape') { lb.remove(); document.removeEventListener('keydown', lbKey); }
        else if (e.key === 'ArrowLeft') window._lbNav(-1);
        else if (e.key === 'ArrowRight') window._lbNav(1);
        // Zoom shortcuts: '+' / '=' zoom in, '-' zoom out, '0' reset
        else if (e.key === '+' || e.key === '=') { e.preventDefault(); window._lbZoom(0.25); }
        else if (e.key === '-') { e.preventDefault(); window._lbZoom(-0.25); }
        else if (e.key === '0') { e.preventDefault(); window._lbReset(); }
    });
    document.body.appendChild(lb);
}
window.openImageLightbox = openImageLightbox;

// ── Global keyboard shortcuts (Issue 10) ─────────────────────────────────────
// '/'     → open search overlay
// 'Escape'→ close any open modal/search/cart
// 'h'     → go to homepage
// 's'     → go to shop (categories)
// (Lightbox-specific zoom shortcuts '+'/'-'/'0' are inside openImageLightbox.)
(function _registerGlobalShortcuts() {
    document.addEventListener('keydown', function _globalShortcuts(e) {
        const tag = (document.activeElement || {}).tagName || '';
        const isEditable = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || !!(document.activeElement?.isContentEditable);
        // If a lightbox is open it handles its own shortcuts
        if (document.getElementById('_imgLightbox')) return;
        if (isEditable) return;
        switch (e.key) {
            case '/': {
                e.preventDefault();
                const st = document.getElementById('searchToggle');
                if (st) st.click();
                break;
            }
            case 'Escape': {
                // Close mobile nav first (all devices)
                if (typeof window._closeMobileNav === 'function') window._closeMobileNav();
                // Close search overlay, cart panel, or any open modal
                const searchOverlay = document.getElementById('searchOverlay');
                if (searchOverlay?.classList.contains('active')) { searchOverlay.classList.remove('active'); break; }
                const cartPanel = document.getElementById('cartPanel');
                if (cartPanel?.classList.contains('active')) { cartPanel.classList.remove('active'); break; }
                const openModal = document.querySelector('.modal-overlay.active, .modal.active');
                if (openModal) { openModal.classList.remove('active'); }
                break;
            }
            case 'h':
                window.location.href = 'index.html';
                break;
            case 's':
                window.location.href = 'categories.html';
                break;
        }
    });
})();

// ===== Embroidery =====
function toggleEmbroidery(pid) {
    const body = document.getElementById(`embBody-${pid}`);
    const chev = document.getElementById(`embChev-${pid}`);
    const sec = document.getElementById(`embSec-${pid}`);
    if (!body) return;
    const open = body.style.display !== 'none';
    body.style.display = open ? 'none' : '';
    if (chev) chev.style.transform = open ? '' : 'rotate(180deg)';
    if (sec) sec.classList.toggle('emb-open', !open);
    // Recalculate the displayed price (base + embroidery add-on for the selected type)
    if (typeof updatePdPriceDisplay === 'function') updatePdPriceDisplay(pid);
}
window.toggleEmbroidery = toggleEmbroidery;

function selectEmbType(btn, pid) {
    btn.closest('.emb-type-row')?.querySelectorAll('.emb-type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const type = btn.dataset.type;
    const tf = document.getElementById(`embTF-${pid}`);
    const lf = document.getElementById(`embLogoF-${pid}`);
    if (tf) tf.style.display = type === 'LOGO' ? 'none' : '';
    if (lf) lf.style.display = (type === 'LOGO' || type === 'TEXT & LOGO') ? '' : 'none';
    // Each type can have its own admin-set price → repaint the total
    if (typeof updatePdPriceDisplay === 'function') updatePdPriceDisplay(pid);
}
window.selectEmbType = selectEmbType;

function selectEmbColor(btn) {
    btn.closest('.emb-colors')?.querySelectorAll('.emb-col').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}
window.selectEmbColor = selectEmbColor;

function selectEmbFont(btn) {
    btn.closest('.emb-fonts')?.querySelectorAll('.emb-font').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}
window.selectEmbFont = selectEmbFont;

function updateEmbCount(input, countId) {
    const el = document.getElementById(countId);
    if (el) el.textContent = `${input.value.length}/100`;
}
window.updateEmbCount = updateEmbCount;

function previewEmbLogo(input, pid) {
    const preview = document.getElementById(`embLogoPreview-${pid}`);
    const img = document.getElementById(`embLogoImg-${pid}`);
    const name = document.getElementById(`embLogoName-${pid}`);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            const dataUrl = e.target.result;
            if (!window._embroideryUploads) window._embroideryUploads = {};
            window._embroideryUploads[pid] = { dataUrl, fileName: input.files[0].name };
            if (img) img.src = dataUrl;
            if (name) name.textContent = input.files[0].name;
            if (preview) preview.style.display = '';
        };
        reader.readAsDataURL(input.files[0]);
    }
}
window.previewEmbLogo = previewEmbLogo;

function getEmbroideryData(pid) {
    const body = document.getElementById(`embBody-${pid}`);
    if (!body || body.style.display === 'none') return null;
    const typeBtn = body.querySelector('.emb-type-btn.active');
    const type = typeBtn?.dataset?.type || 'TEXT';
    const price = typeBtn ? (Number(typeBtn.dataset.embPrice) || 0) : 0;
    const logoPos = document.getElementById(`embLogoPos-${pid}`)?.value || '';
    const logoUpload = window._embroideryUploads?.[pid] || null;
    if (type === 'LOGO') {
        return { type: 'LOGO', logoPosition: logoPos, logoImage: logoUpload?.dataUrl || '', logoFileName: logoUpload?.fileName || '', price };
    }
    const line1 = document.getElementById(`embL1-${pid}`)?.value?.trim() || '';
    if (!line1) return null;
    const data = {
        type,
        line1,
        line2: document.getElementById(`embL2-${pid}`)?.value?.trim() || '',
        line3: document.getElementById(`embL3-${pid}`)?.value?.trim() || '',
        position: document.getElementById(`embPos-${pid}`)?.value || '',
        color: body.querySelector('.emb-col.active')?.dataset?.c || 'White',
        font: body.querySelector('.emb-font.active')?.dataset?.f || 'Cursive',
        price
    };
    if (type === 'TEXT & LOGO') { data.logoPosition = logoPos; data.logoImage = logoUpload?.dataUrl || ''; data.logoFileName = logoUpload?.fileName || ''; }
    return data;
}
window.getEmbroideryData = getEmbroideryData;

// ===== Pricing helpers: per-size price + per-type embroidery add-on =====
// Effective {price, oldPrice} for a product, honouring admin per-size overrides
// (product.sizePrices[size]) when present, else the base price.
function getSizePrice(p, size) {
    if (p && p.sizePrices && size && p.sizePrices[size]) {
        const sp = p.sizePrices[size];
        const price = (sp.price !== undefined && sp.price !== null && sp.price !== '') ? Number(sp.price) : null;
        if (price !== null && !isNaN(price)) {
            const oldPrice = (sp.oldPrice !== undefined && sp.oldPrice !== null && sp.oldPrice !== '') ? Number(sp.oldPrice) : null;
            return { price, oldPrice: (oldPrice && !isNaN(oldPrice)) ? oldPrice : null };
        }
    }
    return { price: Number(p.price) || 0, oldPrice: (p.oldPrice ? Number(p.oldPrice) : null) };
}
window.getSizePrice = getSizePrice;

// Per-type embroidery prices {TEXT, LOGO, 'TEXT & LOGO'} (0 = free). Reads
// product.embroideryPrices; falls back to a legacy single price / scrub default.
function getEmbPrices(p) {
    if (!p) return { 'TEXT': 0, 'LOGO': 0, 'TEXT & LOGO': 0 };
    const ep = p.embroideryPrices;
    if (ep && typeof ep === 'object') {
        return {
            'TEXT': Math.max(0, Number(ep['TEXT']) || 0),
            'LOGO': Math.max(0, Number(ep['LOGO']) || 0),
            'TEXT & LOGO': Math.max(0, Number(ep['TEXT & LOGO']) || 0),
        };
    }
    const legacy = (p.embroideryPrice !== undefined && p.embroideryPrice !== null && p.embroideryPrice !== '')
        ? Math.max(0, Number(p.embroideryPrice) || 0)
        : (p.category === 'scrub-suits' ? 299 : 0);
    return { 'TEXT': legacy, 'LOGO': legacy, 'TEXT & LOGO': legacy };
}
window.getEmbPrices = getEmbPrices;

function isEmbEnabled(p) {
    if (!p) return false;
    if (p.embroideryEnabled !== undefined && p.embroideryEnabled !== null) return !!p.embroideryEnabled;
    return p.category === 'scrub-suits';
}
function isEmbActive(pid) {
    const body = document.getElementById(`embBody-${pid}`);
    return !!(body && body.style.display !== 'none');
}
function getSelectedEmbPrice(pid) {
    const body = document.getElementById(`embBody-${pid}`);
    const btn = body && body.querySelector('.emb-type-btn.active');
    return btn ? (Number(btn.dataset.embPrice) || 0) : 0;
}

// Repaint the product-detail price from the selected size + (if the embroidery
// section is open) the selected embroidery type's add-on price.
function updatePdPriceDisplay(pid) {
    const p = productsData.find(x => x.id === pid); if (!p) return;
    const size = getSelectedSize(pid);
    const base = getSizePrice(p, size);
    const embActive = isEmbActive(pid);
    const emb = embActive ? getSelectedEmbPrice(pid) : 0;
    const total = base.price + emb;
    const curEl = document.getElementById(`pdCurPrice-${pid}`);
    const oldEl = document.getElementById(`pdOldPrice-${pid}`);
    const discEl = document.getElementById(`pdDiscount-${pid}`);
    const embNoteEl = document.getElementById(`pdEmbNote-${pid}`);
    if (curEl) curEl.textContent = '\u20b9' + total;
    if (oldEl && discEl) {
        const oldTotal = base.oldPrice ? base.oldPrice + emb : null;
        if (oldTotal && oldTotal > total) {
            oldEl.textContent = '\u20b9' + oldTotal; oldEl.style.display = '';
            discEl.textContent = Math.round((1 - total / oldTotal) * 100) + '% OFF'; discEl.style.display = '';
        } else { oldEl.style.display = 'none'; discEl.style.display = 'none'; }
    }
    if (embNoteEl) {
        if (embActive && emb > 0) {
            embNoteEl.textContent = `incl. \u20b9${emb} embroidery`;
            embNoteEl.className = 'pd-emb-note'; embNoteEl.style.display = '';
        } else if (embActive && emb === 0) {
            embNoteEl.innerHTML = '<i class="fas fa-gift"></i> Limited Time Offer \u2013 FREE Embroidery';
            embNoteEl.className = 'pd-emb-note pd-emb-note-free'; embNoteEl.style.display = '';
        } else {
            embNoteEl.style.display = 'none';
        }
    }
}
window.updatePdPriceDisplay = updatePdPriceDisplay;

// ===== Utilities =====
function showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:100px;right:20px;background:linear-gradient(135deg,#0e4a86,#6c63ff);color:#fff;padding:12px 24px;border-radius:8px;font-size:0.88rem;font-weight:500;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,0.15);animation:slideIn 0.3s ease;';
    t.innerHTML = `<i class="fas fa-check-circle" style="margin-right:8px;"></i>${msg}`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 2500);
}

// ===== Scroll Progress Bar =====
function initScrollProgress() {
    let bar = document.querySelector('.scroll-progress');
    if (!bar) {
        bar = document.createElement('div');
        bar.className = 'scroll-progress';
        document.body.prepend(bar);
    }
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) bar.style.width = (scrollTop / docHeight * 100) + '%';
    });
}

// ===== Hero Particles & Shapes =====
function initHeroParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    // Floating particles
    let container = hero.querySelector('.hero-particles');
    if (!container) {
        container = document.createElement('div');
        container.className = 'hero-particles';
        hero.prepend(container);
    }
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.width = p.style.height = (Math.random() * 4 + 2) + 'px';
        p.style.animationDuration = (Math.random() * 10 + 8) + 's';
        p.style.animationDelay = (Math.random() * 8) + 's';
        container.appendChild(p);
    }
    // Floating gradient shapes
    for (let i = 1; i <= 3; i++) {
        const shape = document.createElement('div');
        shape.className = 'hero-shape hero-shape-' + i;
        hero.appendChild(shape);
    }
}

function initMobileMarqueeAutoScroll() {
    if (window.innerWidth > 768) return;
    const track = document.querySelector('.marquee-track');
    if (!track || track.dataset.loopReady === '1') return;

    const items = Array.from(track.children);
    if (!items.length) return;

    items.forEach(node => {
        const clone = node.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.tabIndex = -1;
        track.appendChild(clone);
    });

    track.dataset.loopReady = '1';
}

function revealElements() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger').forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 80) el.classList.add('active');
    });
}

// ===== Wishlist Page =====
function initWishlistPage() {
    renderWishlist();
}
function renderWishlist() {
    const grid = document.getElementById('wishlistGrid');
    const emptyState = document.getElementById('wishlistEmpty');
    if (!grid) return;
    const items = productsData.filter(p => wishlist.includes(p.id));
    if (items.length === 0) {
        grid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }
    if (emptyState) emptyState.style.display = 'none';
    grid.style.display = 'grid';
    grid.innerHTML = items.map(p => `<div class="wishlist-card reveal active" data-id="${p.id}">
        <div class="wishlist-card-image" onclick="openProductDetail(${p.id})">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
            ${p.badge ? `<span class="shop-card-badge">${p.badge}</span>` : ''}
        </div>
        <div class="wishlist-card-body">
            <span class="shop-card-category">${typeof getCategoryLabel === 'function' ? getCategoryLabel(p.category) : p.category.replace(/-/g, ' ')}</span>
            <h4>${p.name}</h4>
            <div class="shop-card-rating"><span class="rating-val">${(p.rating||0).toFixed(1)}</span>${'<i class="fas fa-star"></i>'.repeat(Math.floor(p.rating||0))}${(p.rating||0) % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}<span>(${p.reviews||0})</span></div>
            <div class="shop-card-price"><span class="price">\u20b9${p.price}</span>${p.oldPrice ? `<span class="old-price">\u20b9${p.oldPrice}</span>` : ''}</div>
            <div class="wishlist-card-actions">
                <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button class="btn btn-outline-dark btn-sm" onclick="removeFromWishlist(${p.id})"><i class="fas fa-trash"></i> Remove</button>
            </div>
        </div>
    </div>`).join('');
}
function removeFromWishlist(id) {
    toggleWishlist(id);
    renderWishlist();
    showToast('Removed from wishlist');
}
function clearWishlist() {
    wishlist = [];
    localStorage.setItem('ssa_wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    renderWishlist();
    showToast('Wishlist cleared');
}

// ===== Global Exports =====
window.addToCart = addToCart;
window.buyNow = buyNow;
window.removeFromCart = removeFromCart;
window.updateQty = updateQty;
window.nextStep = nextStep;
window.closeCart = closeCart;
window.closeSuccessModal = closeSuccessModal;
window.openProductDetail = openProductDetail;
window.closeProductDetail = closeProductDetail;
window.selectSize = selectSize;
window.changePdQty = changePdQty;
window.addToCartFromDetail = addToCartFromDetail;
window.buyNowFromDetail = buyNowFromDetail;
window.openLoginModal = openLoginModal;
window.switchAuthTab = switchAuthTab;
window.openForgotPasswordForm = openForgotPasswordForm;
window.backToLoginFromForgot = backToLoginFromForgot;
window.handleForgotPasswordReset = handleForgotPasswordReset;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.closeAuthModal = closeAuthModal;
window.openAccountPanel = openAccountPanel;
window.showAccountTab = showAccountTab;
window.handleLogout = handleLogout;
window.placeOrder = placeOrder;
window.buildProductCard = buildProductCard;
window.renderProducts = renderProducts;
window.productsData = productsData;
window.selectCardColor = selectCardColor;
window.selectDetailColor = selectDetailColor;
window.removeFromWishlist = removeFromWishlist;
window.clearWishlist = clearWishlist;
window.toggleWishlist = toggleWishlist;
window.isWishlisted = isWishlisted;
window.downloadInvoice = downloadInvoice;
window.reorderFromHistory = reorderFromHistory;

// ===== Tickets Page =====
const _TKT_STATUS_COLOR = {
    'Open':        { bg: '#e0f2fe', text: '#0369a1' },
    'In Progress': { bg: '#fef3c7', text: '#92400e' },
    'Resolved':    { bg: '#d1fae5', text: '#065f46' },
    'Closed':      { bg: '#f1f5f9', text: '#475569' }
};

function _tktStatusBadge(status) {
    const c = _TKT_STATUS_COLOR[status] || { bg: '#e0f2fe', text: '#0369a1' };
    return `<span class="tkt-card-status" style="background:${c.bg};color:${c.text}">${status || 'Open'}</span>`;
}

function _renderTicketCard(tkt) {
    const statusColor = (_TKT_STATUS_COLOR[tkt.status] || { text: '#0369a1' }).text;
    const comments = Array.isArray(tkt.comments) ? tkt.comments : [];
    const attachments = Array.isArray(tkt.attachmentUrls) ? tkt.attachmentUrls.filter(Boolean) : [];
    const date = tkt.createdAt
        ? (tkt.createdAt.toDate ? tkt.createdAt.toDate() : new Date(tkt.createdAt)).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : '';
    const attachHtml = attachments.length
        ? `<div class="tkt-attach-row">${attachments.map(u => `<a href="${u}" target="_blank" class="tkt-attach-chip"><i class="fas fa-paperclip"></i> Attachment</a>`).join('')}</div>` : '';
    const threadHtml = comments.length
        ? `<div class="tkt-thread">${comments.map(c => {
            const cDate = c.createdAt ? new Date(c.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
            const attachChip = c.attachmentUrl ? `<a href="${c.attachmentUrl}" target="_blank" class="tkt-attach-chip" style="margin-top:6px"><i class="fas fa-paperclip"></i> ${c.attachmentName || 'Attachment'}</a>` : '';
            return `<div class="tkt-thread-item ${c.role === 'admin' ? 'is-admin' : 'is-system'}">
                <div class="tkt-thread-meta"><strong>${c.author || (c.role === 'admin' ? 'Support Team' : 'System')}</strong><span>${cDate}</span></div>
                <div class="tkt-thread-text">${(c.text||'').replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>
                ${attachChip}
            </div>`;
        }).join('')}</div>` : '';
    const cardId = 'tkt-card-' + (tkt.docId || tkt.ticketId || Math.random().toString(36).slice(2));
    return `<div class="tkt-card" id="${cardId}">
        <div class="tkt-card-head" onclick="_tktToggle('${cardId}')">
            <span class="tkt-card-id" style="background:${(_TKT_STATUS_COLOR[tkt.status]||{bg:'#e0f2fe'}).bg};color:${statusColor}">${tkt.ticketId || '—'}</span>
            ${_tktStatusBadge(tkt.status)}
            <i class="fas fa-chevron-down tkt-chevron"></i>
        </div>
        <div class="tkt-card-subject">${(tkt.subject || 'Support Request').replace(/</g,'&lt;')}</div>
        <div class="tkt-card-meta">
            <span><i class="fas fa-calendar-alt"></i> ${date}</span>
            <span><i class="fas fa-tag"></i> ${tkt.source === 'admin-created' ? 'Admin Created' : tkt.source === 'chatbot' ? 'Chat Request' : 'Contact Form'}</span>
            ${tkt.priority ? `<span><i class="fas fa-flag"></i> ${tkt.priority}</span>` : ''}
        </div>
        <div class="tkt-card-body" id="${cardId}-body">
            <div class="tkt-card-message">${(tkt.message || '').replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>
            ${attachHtml}
            ${threadHtml}
        </div>
    </div>`;
}

window._tktToggle = function(cardId) {
    const head = document.querySelector('#' + cardId + ' .tkt-card-head');
    const body = document.getElementById(cardId + '-body');
    if (!body) return;
    const open = body.classList.toggle('open');
    if (head) head.classList.toggle('expanded', open);
};

async function loadMyTickets() {
    const listEl = document.getElementById('tktMyTicketsList');
    if (!listEl) return;
    const user = JSON.parse(localStorage.getItem('ssa_user') || 'null');
    if (!user || !user.email) {
        listEl.innerHTML = `<div class="tkt-signin-prompt"><i class="fas fa-lock"></i><p>Sign in to view your tickets</p><button class="btn btn-gradient" onclick="openLoginModal && openLoginModal()">Sign In</button></div>`;
        return;
    }
    listEl.innerHTML = '<div class="tkt-loading"><div class="loader-ring" style="width:34px;height:34px"></div><p>Loading your tickets&hellip;</p></div>';
    try {
        if (!window.db) {
            await new Promise(res => { const t = setTimeout(res, 3000); window.addEventListener('ssa:dbReady', () => { clearTimeout(t); res(); }, { once: true }); });
        }
        if (!window.db) throw new Error('Database not ready');
        const snap = await window.db.collection('messages')
            .where('email', '==', user.email)
            .orderBy('createdAt', 'desc').get();
        // Filter only real tickets (have ticketId) — exclude raw live-agent chat logs
        const tickets = snap.docs
            .map(d => ({ docId: d.id, ...d.data() }))
            .filter(t => !!t.ticketId);
        if (!tickets.length) {
            listEl.innerHTML = `<div class="tkt-empty"><i class="fas fa-ticket-alt"></i><p>No tickets yet. Use the contact form to raise a query.</p><a href="contact.html" class="btn btn-gradient btn-sm">Send Us a Message</a></div>`;
            return;
        }
        listEl.innerHTML = `<div class="tkt-list">${tickets.map(_renderTicketCard).join('')}</div>`;
    } catch (err) {
        listEl.innerHTML = `<div class="tkt-empty"><i class="fas fa-exclamation-circle" style="color:#ef4444"></i><p style="color:#ef4444">Error loading tickets: ${err.message}</p><button class="btn btn-outline-dark btn-sm" onclick="loadMyTickets()">Retry</button></div>`;
    }
}
window.loadMyTickets = loadMyTickets;

async function trackTicketSearch() {
    if (!currentUser) {
        showToast('Please sign in to track your tickets', 'info');
        setTimeout(() => openLoginModal(), 300);
        return;
    }
    const input = document.getElementById('tktSearchInput');
    const resultEl = document.getElementById('tktGuestResult');
    if (!input || !resultEl) return;
    const tid = input.value.trim().toUpperCase();
    if (!tid) { resultEl.innerHTML = ''; return; }
    resultEl.innerHTML = '<div class="tkt-loading"><div class="loader-ring" style="width:28px;height:28px"></div><p>Searching&hellip;</p></div>';
    try {
        if (!window.db) {
            await new Promise(res => { const t = setTimeout(res, 3000); window.addEventListener('ssa:dbReady', () => { clearTimeout(t); res(); }, { once: true }); });
        }
        if (!window.db) throw new Error('Database not ready');

        // Use the SECURITY DEFINER RPC function so anonymous users can look up
        // their own ticket by ID without exposing the full messages table via RLS.
        const rows = await window.db.rpc('get_ticket_by_id', { p_ticket_id: tid });
        if (!rows || !rows.length) {
            resultEl.innerHTML = `<div class="tkt-empty"><i class="fas fa-search"></i><p>No ticket found with ID <strong>${tid}</strong>. Check the ID and try again.</p></div>`;
            return;
        }
        const tkt = rows[0];
        resultEl.innerHTML = `<div class="tkt-section-head" style="margin-top:24px"><h2><i class="fas fa-search"></i> Ticket Found</h2></div><div class="tkt-list">${_renderTicketCard(tkt)}</div>`;
    } catch (err) {
        resultEl.innerHTML = `<div class="tkt-empty"><i class="fas fa-exclamation-circle" style="color:#ef4444"></i><p>Error: ${err.message}</p><button class="btn btn-outline-dark btn-sm" onclick="trackTicketSearch()" style="margin-top:8px">Retry</button></div>`;
    }
}
window.trackTicketSearch = trackTicketSearch;

function initTicketsPage() {
    // Gate: require login to track tickets
    if (!currentUser) {
        const searchWrap = document.getElementById('tktSearchWrap');
        if (searchWrap) {
            searchWrap.innerHTML = `
                <div style="text-align:center;padding:28px 20px;background:rgba(255,255,255,0.15);border-radius:16px;backdrop-filter:blur(8px);max-width:480px;margin:0 auto;">
                    <i class="fas fa-lock" style="font-size:2.2rem;color:rgba(255,255,255,0.9);margin-bottom:12px;display:block;"></i>
                    <p style="color:#fff;font-size:1rem;font-weight:700;margin-bottom:6px;">Sign in to track your tickets</p>
                    <p style="color:rgba(255,255,255,0.78);font-size:0.84rem;margin-bottom:18px;">Your ticket history is tied to your account.</p>
                    <button onclick="openLoginModal()" style="background:#fff;color:#0d9488;border:none;padding:10px 28px;border-radius:50px;font-weight:800;font-size:0.9rem;cursor:pointer;"><i class="fas fa-sign-in-alt"></i> Sign In</button>
                </div>`;
        }
        return;
    }

    // Auto-search from ?id=TKT-XXXX URL param (e.g. link from email)
    const urlId = new URLSearchParams(window.location.search).get('id');
    if (urlId) {
        const inp = document.getElementById('tktSearchInput');
        if (inp) inp.value = urlId.toUpperCase();
        const doSearch = () => trackTicketSearch();
        if (window.db) { doSearch(); }
        else {
            window.addEventListener('ssa:dbReady', doSearch, { once: true });
            setTimeout(() => { if (!window._dbReady) doSearch(); }, 2500);
        }
    }

    // Auto-load tickets when db becomes ready (slight delay for Supabase init)
    if (window.db) {
        loadMyTickets();
    } else {
        // Dispatch ssa:dbReady from db-init when Supabase is ready;
        // fall back to a timer so the page never stays blank.
        window.addEventListener('ssa:dbReady', loadMyTickets, { once: true });
        setTimeout(() => { if (!window._dbReady) loadMyTickets(); }, 2500);
    }
}
