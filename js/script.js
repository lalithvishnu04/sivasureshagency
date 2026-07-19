/**
 * SIVA SURESH AGENCY  —  E-Commerce Frontend (v67)
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

const productsData = [
    // ── Doctor Uniform > Male Doctor Uniform ──
    { id: 1, name: "Male Doctor Uniform - Full Sleeve", category: "doctor-uniform", gender: "male", sleeve: "full", price: 850, oldPrice: 1100, rating: 4.8, reviews: 124, badge: "Bestseller", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Premium full-sleeve doctor uniform for men. High-quality wrinkle-resistant cotton blend for all-day comfort.", image: "" },
    { id: 2, name: "Male Doctor Uniform - Half Sleeve", category: "doctor-uniform", gender: "male", sleeve: "half", price: 750, oldPrice: 950, rating: 4.7, reviews: 89, badge: "", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Comfortable half-sleeve doctor uniform for men, ideal for warm climates and long shifts.", image: "" },
    // ── Doctor Uniform > Female Doctor Uniform ──
    { id: 3, name: "Female Doctor Uniform - Full Sleeve", category: "doctor-uniform", gender: "female", sleeve: "full", price: 900, oldPrice: 1200, rating: 4.9, reviews: 67, badge: "New", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Elegant full-sleeve doctor uniform for women with feminine tailoring and professional finish.", image: "" },
    { id: 4, name: "Female Doctor Uniform - Half Sleeve", category: "doctor-uniform", gender: "female", sleeve: "half", price: 800, oldPrice: 1050, rating: 4.8, reviews: 56, badge: "", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Ladies half-sleeve doctor uniform with modern fit and breathable fabric.", image: "" },
    // ── Staff Uniform > Male Staff Uniform ──
    { id: 5, name: "Male Staff Uniform - Beige Style", category: "staff-uniform", gender: "male", sleeve: "half", price: 550, oldPrice: 720, rating: 4.6, reviews: 145, badge: "", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Professional beige style staff uniform for men. Durable and comfortable for daily use.", image: "" },
    { id: 6, name: "Male Staff Uniform - Blue Style", category: "staff-uniform", gender: "male", sleeve: "half", price: 550, oldPrice: 720, rating: 4.5, reviews: 132, badge: "Popular", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Smart blue style staff uniform for men. Ideal for hospital and institutional use.", image: "" },
    { id: 7, name: "Male Staff Uniform - Brown Style", category: "staff-uniform", gender: "male", sleeve: "half", price: 560, oldPrice: 730, rating: 4.5, reviews: 98, badge: "", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Durable brown style staff uniform for men with reinforced stitching.", image: "" },
    { id: 8, name: "Male Staff Uniform - Gray Style", category: "staff-uniform", gender: "male", sleeve: "half", price: 540, oldPrice: 710, rating: 4.6, reviews: 87, badge: "", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Comfortable gray style staff uniform for men. Wrinkle-resistant fabric.", image: "" },
    { id: 9, name: "Male Ward Boy Uniform - Blue", category: "staff-uniform", gender: "male", sleeve: "half", price: 500, oldPrice: 650, rating: 4.4, reviews: 87, badge: "", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Blue ward boy uniform designed for daily hospital duties.", image: "" },
    { id: 10, name: "Male Ward Boy Uniform - Gray", category: "staff-uniform", gender: "male", sleeve: "half", price: 500, oldPrice: 650, rating: 4.3, reviews: 76, badge: "", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Gray ward boy uniform for comfort during demanding shifts.", image: "" },
    { id: 11, name: "Male Ward Boy Uniform - Green", category: "staff-uniform", gender: "male", sleeve: "half", price: 500, oldPrice: 650, rating: 4.4, reviews: 82, badge: "", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Green ward boy uniform. Durable and easy to maintain.", image: "" },
    // ── Staff Uniform > Female Staff Uniform ──
    { id: 12, name: "Female Staff Uniform - Blue Style", category: "staff-uniform", gender: "female", sleeve: "half", price: 580, oldPrice: 750, rating: 4.7, reviews: 178, badge: "Bestseller", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Professional blue style staff uniform for women. Elegant and comfortable.", image: "" },
    { id: 13, name: "Female Staff Uniform - Blue Style 02", category: "staff-uniform", gender: "female", sleeve: "half", price: 580, oldPrice: 750, rating: 4.6, reviews: 112, badge: "", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Elegant blue style staff uniform variant for women with modern cut.", image: "" },
    { id: 14, name: "Female Staff Uniform - Dark Pink", category: "staff-uniform", gender: "female", sleeve: "half", price: 590, oldPrice: 760, rating: 4.8, reviews: 156, badge: "New", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Stylish dark pink staff uniform for women. Vibrant and professional.", image: "" },
    { id: 15, name: "Female Staff Uniform - Green Color", category: "staff-uniform", gender: "female", sleeve: "half", price: 570, oldPrice: 740, rating: 4.5, reviews: 98, badge: "", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Fresh green color staff uniform for women. Comfortable for all-day wear.", image: "" },
    { id: 16, name: "Female Staff Uniform - Pink Style", category: "staff-uniform", gender: "female", sleeve: "half", price: 580, oldPrice: 750, rating: 4.7, reviews: 134, badge: "Popular", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Classic pink style staff uniform for women with flattering fit.", image: "" },
    { id: 17, name: "Female Staff Uniform - Pink Style 02", category: "staff-uniform", gender: "female", sleeve: "half", price: 580, oldPrice: 750, rating: 4.6, reviews: 89, badge: "", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Pink style staff uniform variant for women. Soft and durable fabric.", image: "" },
    { id: 18, name: "Female Staff Uniform - Red Style", category: "staff-uniform", gender: "female", sleeve: "half", price: 590, oldPrice: 760, rating: 4.8, reviews: 143, badge: "Premium", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Elegant red style staff uniform for women. Premium quality fabric.", image: "" },
    // ── Bedsheets ──
    { id: 19, name: "Bedsheet - Striped Blue & White", category: "bedsheets", price: 350, oldPrice: 450, rating: 4.3, reviews: 234, badge: "", sizes: ["60x90","60x100","90x100"], description: "Hospital-grade striped bedsheet in blue and white.", image: "" },
    { id: 20, name: "Bedsheet - Checked Blue", category: "bedsheets", price: 320, oldPrice: 420, rating: 4.5, reviews: 189, badge: "", sizes: ["60x90","60x100","90x100"], description: "Blue checked pattern hospital bedsheet." },
    { id: 21, name: "Pillow Cover - Light Blue Set", category: "bedsheets", price: 150, oldPrice: 200, rating: 4.2, reviews: 76, badge: "", sizes: ["Standard","Large"], description: "Set of 2 light blue pillow covers with zipper closure." },
    // ── Hospital Linen ──
    { id: 22, name: "Hospital Towel - OT Grade", category: "hospital-linen", price: 220, oldPrice: 300, rating: 4.4, reviews: 112, badge: "", sizes: ["36x1m","36x1.25m","60x2m"], description: "High-absorbency OT towel ideal for surgical procedures.", image: "" },
    { id: 23, name: "Surgical Cap & Mask Set", category: "hospital-linen", price: 120, oldPrice: 160, rating: 4.6, reviews: 267, badge: "Popular", sizes: ["Standard","Large"], description: "Reusable surgical cap and mask set.", image: "" },
    { id: 24, name: "Surgeon Apron - Ladies", category: "hospital-linen", gender: "female", sleeve: "half", price: 450, oldPrice: 580, rating: 4.8, reviews: 43, badge: "", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Ladies surgeon apron with side-tie wrap-around design.", image: "" },
    { id: 25, name: "Patient Gown - Cotton", category: "hospital-linen", price: 380, oldPrice: 480, rating: 4.3, reviews: 98, badge: "", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Comfortable cotton patient gown." },
    { id: 26, name: "Surgeon Apron - Gents", category: "hospital-linen", gender: "male", sleeve: "full", price: 520, oldPrice: 680, rating: 4.9, reviews: 34, badge: "Premium", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Heavy-duty surgeon apron for men with full-sleeve design.", image: "" },
    // ── Hotel Linen ──
    { id: 27, name: "Hotel Bedsheet - Premium White", category: "hotel-linen", price: 480, oldPrice: 620, rating: 4.9, reviews: 78, badge: "Premium", sizes: ["Single","Double","King"], description: "Premium white hotel bedsheet with 300 thread count." },
    { id: 28, name: "Hotel Towel - Big 60x2m", category: "hotel-linen", price: 350, oldPrice: 450, rating: 4.5, reviews: 134, badge: "", sizes: ["Standard","Large","Bath Sheet"], description: "Large hotel bath towel with excellent absorbency." },
    // ── New Hospital Linen ──
    { id: 29, name: "Abdominal Sheet 9x9", category: "hospital-linen", price: 280, oldPrice: 380, rating: 4.5, reviews: 89, badge: "New", sizes: ["9x9","Standard"], description: "Surgical abdominal sheet with center hole for OT procedures. High-grade sterile fabric.", image: "" },
    { id: 30, name: "Surgical Eye Pad", category: "hospital-linen", price: 95, oldPrice: 130, rating: 4.4, reviews: 156, badge: "", sizes: ["Standard"], description: "Reusable surgical eye pad with secure tie straps for post-operative care.", image: "" },
    { id: 31, name: "Female Surgeon Apron - Green", category: "hospital-linen", gender: "female", sleeve: "full", price: 480, oldPrice: 620, rating: 4.7, reviews: 52, badge: "New", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Full green surgeon apron for women, includes matching cap and mask.", image: "" },
    { id: 32, name: "OT Nighty - Patient Wear", category: "hospital-linen", gender: "female", price: 340, oldPrice: 450, rating: 4.6, reviews: 78, badge: "", sizes: ["S","M","L","XL","XXL","XXXL"], description: "Comfortable OT nighty for patients with front button closure.", image: "" },
    // ── New Bedsheets ──
    { id: 33, name: "Bedspread & Pillow Cover Set - Striped", category: "bedsheets", price: 420, oldPrice: 550, rating: 4.5, reviews: 67, badge: "New", sizes: ["Single","Double","King"], description: "Premium striped bedspread with matching pillow cover set. Durable hospital-grade fabric.", image: "" },
];
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
        'abdominal': ['abdominal'],
        'ot-accessories': ['ot accessories', 'ot cap', 'ot nighty', 'eye pad', 'surgical cap', 'head cap'],
        'patient-wear': ['patient gown', 'ot nighty', 'patient wear'],
        'surgeon-aprons': ['surgeon apron', 'apron']
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
    if (!row) { row = document.createElement('div'); row.id = 'shopSubFilters'; row.className = 'shop-subfilters'; bar.insertAdjacentElement('afterend', row); }
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
        { slug: 'hospital-linen', label: 'Hospital Linen', image: '', map: { cat: 'hospital-linen' }, subs: [
            { slug: 'surgeon-aprons', label: 'Surgeon Aprons', image: '', map: { cat: 'hospital-linen', sub: 'surgeon-aprons' } },
            { slug: 'ot-accessories', label: 'OT Accessories', image: '', map: { cat: 'hospital-linen', sub: 'ot-accessories' } },
            { slug: 'patient-wear', label: 'Patient Wear', image: '', map: { cat: 'hospital-linen', sub: 'patient-wear' } },
        ] },
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
                // Use STORED taxonomy as the primary source — preserves admin's order,
                // labels, and structure. Only enrich with DEFAULT data for known slugs
                // (fills in missing map/icon/subs that may not be stored yet).
                return t.map(storedH => {
                    if (!storedH || !storedH.slug) return null;
                    const defH = DEFAULT_TAXONOMY.find(d => d.slug === storedH.slug);
                    const storedCats = Array.isArray(storedH.cats) ? storedH.cats : [];
                    const cats = storedCats.length
                        ? storedCats.map(storedC => {
                            if (!storedC || !storedC.slug) return null;
                            const defC = defH && (defH.cats || []).find(c => c.slug === storedC.slug);
                            const storedSubs = Array.isArray(storedC.subs) ? storedC.subs : [];
                            const subs = storedSubs.length
                                ? storedSubs.map(storedS => {
                                    if (!storedS || !storedS.slug) return null;
                                    const defS = defC && (defC.subs || []).find(s => s.slug === storedS.slug);
                                    return defS ? { ...defS, ...storedS } : storedS;
                                }).filter(Boolean)
                                : (defC ? (defC.subs || []) : []);
                            return defC ? { ...defC, ...storedC, subs } : { ...storedC, subs };
                        }).filter(Boolean)
                        : (defH ? (defH.cats || []) : []);
                    return defH ? { ...defH, ...storedH, cats } : { ...storedH, cats };
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
            const kids = (it.children || []).map(ch => `<li><a href="${_megaHref(ch)}">${esc(ch.label)}</a></li>`).join('');
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
    const CACHE_KEY = '_ssa_fs_products_v2';
    const TTL = 10 * 60 * 1000; // 10 minutes
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
                    rating: 4.5, reviews: 0,
                    _fromFirestore: true
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
<p>For privacy concerns email <a href="mailto:sivasureshagency@gmail.com">sivasureshagency@gmail.com</a></p>`
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
<p>Questions? Email <a href="mailto:sivasureshagency@gmail.com">sivasureshagency@gmail.com</a></p>`
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
<p>Shipping queries: <a href="mailto:sivasureshagency@gmail.com">sivasureshagency@gmail.com</a> or <a href="tel:+919366640050">+91 93666 40050</a></p>`
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
// Mirror state to window so the Firestore IIFE can always read the latest values
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
        }, 500); // reduced from 2000ms to let firebase-db.js module load
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
    // Preloader — hide on DOMContentLoaded+300ms (don't wait for Firebase SDKs)
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
        const closeMobileNav = () => { hamburger.classList.remove('active'); navLinks.classList.remove('active'); clearOpen(); };
        hamburger.addEventListener('click', () => {
            const willOpen = !navLinks.classList.contains('active');
            hamburger.classList.toggle('active', willOpen);
            navLinks.classList.toggle('active', willOpen);
            if (!willOpen) clearOpen();
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
    if (modalClose) modalClose.addEventListener('click', () => document.getElementById('checkoutModal').classList.remove('active'));
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
    const form = document.getElementById('contactForm');
    if (form) {
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
            <div class="shop-card-rating">${'<i class="fas fa-star"></i>'.repeat(Math.floor(p.rating))}${p.rating % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}<span>(${p.reviews})</span></div>
            <div class="shop-card-price"><span class="price">₹${p.price}</span><span class="old-price">₹${p.oldPrice}</span></div>
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
        cartItems.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p><a href="categories.html" class="btn btn-gradient btn-sm">Start Shopping</a></div>';
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `<div class="cart-item"><div class="cart-item-img"><img src="${item.image}" alt="${item.name}"></div><div class="cart-item-info"><h4>${item.name}</h4><span class="item-meta">Size: ${item.selectedSize}${item.selectedColor ? ' | Color: ' + item.selectedColor : ''}</span><div class="item-price">₹${item.price * item.qty}</div><div class="cart-item-qty"><button onclick="updateQty(${item.id},-1)"><i class="fas fa-minus"></i></button><span>${item.qty}</span><button onclick="updateQty(${item.id},1)"><i class="fas fa-plus"></i></button></div></div><button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button></div>`).join('');
        cartFooter.style.display = 'block';
        cartTotal.textContent = `₹${totalPrice.toLocaleString()}`;
    }
}

function openCart() { document.getElementById('cartDrawer').classList.add('open'); document.getElementById('cartOverlay').classList.add('open'); }
function closeCart() { document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('open'); }

// ===== Checkout =====
function openCheckout() {
    closeCart();
    document.getElementById('checkoutModal').classList.add('active');
    nextStep(1);
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
        // Pre-fill saved address if available
        const addrs = JSON.parse(localStorage.getItem('ssa_addresses_' + currentUser.email) || '[]');
        if (addrs.length > 0) {
            const a = addrs[0];
            const addrEl = document.querySelector('[name="address"]');
            const cityEl = document.querySelector('[name="city"]');
            const pinEl  = document.querySelector('[name="pincode"]');
            if (addrEl && !addrEl.value) addrEl.value = a.street || '';
            if (cityEl && !cityEl.value) cityEl.value = a.city || '';
            if (pinEl  && !pinEl.value)  pinEl.value  = a.pincode || '';
        }
    }
}
function nextStep(step) {
    if (step === 2 && !validateShippingForm()) return;
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
    const embHtml = embEnabled ? `<div class="emb-section${_embMin === 0 ? ' emb-section-free' : ''}" id="embSec-${p.id}"><div class="emb-toggle" onclick="toggleEmbroidery(${p.id})"><span><i class="fas fa-pen-nib"></i> Add Embroidery ${embToggleBadge}</span><i class="fas fa-chevron-down emb-chevron" id="embChev-${p.id}"></i></div><div class="emb-body" id="embBody-${p.id}" style="display:none"><div class="emb-field"><label>Embroidery Type *</label><div class="emb-type-row"><button type="button" class="emb-type-btn active" data-type="TEXT" data-emb-price="${embPrices['TEXT']}" onclick="selectEmbType(this,${p.id})">TEXT ${_embTag('TEXT')}</button><button type="button" class="emb-type-btn" data-type="LOGO" data-emb-price="${embPrices['LOGO']}" onclick="selectEmbType(this,${p.id})">LOGO ${_embTag('LOGO')}</button><button type="button" class="emb-type-btn" data-type="TEXT &amp; LOGO" data-emb-price="${embPrices['TEXT & LOGO']}" onclick="selectEmbType(this,${p.id})">TEXT &amp; LOGO ${_embTag('TEXT & LOGO')}</button></div></div><div class="emb-text-fields" id="embTF-${p.id}"><div class="emb-row2"><div class="emb-field"><label>Line 1 *</label><div class="emb-inp-wrap"><input type="text" id="embL1-${p.id}" maxlength="100" placeholder="Enter Line 1" oninput="updateEmbCount(this,'embC1-${p.id}')"><span id="embC1-${p.id}" class="emb-char-count">0/100</span></div></div><div class="emb-field"><label>Line 2</label><div class="emb-inp-wrap"><input type="text" id="embL2-${p.id}" maxlength="100" placeholder="Enter Line 2" oninput="updateEmbCount(this,'embC2-${p.id}')"><span id="embC2-${p.id}" class="emb-char-count">0/100</span></div></div></div><div class="emb-field"><label>Line 3</label><div class="emb-inp-wrap"><input type="text" id="embL3-${p.id}" maxlength="100" placeholder="Enter Line 3" oninput="updateEmbCount(this,'embC3-${p.id}')"><span id="embC3-${p.id}" class="emb-char-count">0/100</span></div></div><div class="emb-row2"><div class="emb-field"><label>Text Position *</label><select id="embPos-${p.id}"><option value="">Select Position</option><option>Left Chest</option><option>Right Chest</option><option>Back Center</option><option>Left Sleeve</option><option>Right Sleeve</option></select></div><div class="emb-field"><label>Text Color</label><div class="emb-colors"><button type="button" class="emb-col active" style="background:#fff;border:2px solid #ccc" data-c="White" onclick="selectEmbColor(this)" title="White"></button><button type="button" class="emb-col" style="background:#000" data-c="Black" onclick="selectEmbColor(this)" title="Black"></button><button type="button" class="emb-col" style="background:#1A237E" data-c="Navy" onclick="selectEmbColor(this)" title="Navy"></button><button type="button" class="emb-col" style="background:#F9A825" data-c="Yellow" onclick="selectEmbColor(this)" title="Yellow"></button><button type="button" class="emb-col" style="background:#C62828" data-c="Red" onclick="selectEmbColor(this)" title="Red"></button><button type="button" class="emb-col" style="background:#E65100" data-c="Orange" onclick="selectEmbColor(this)" title="Orange"></button><button type="button" class="emb-col" style="background:#1B5E20" data-c="Green" onclick="selectEmbColor(this)" title="Green"></button></div></div></div><div class="emb-field"><label>Font Style</label><div class="emb-fonts"><button type="button" class="emb-font active" style="font-family:cursive;font-size:1rem" data-f="Cursive" onclick="selectEmbFont(this)">Sample</button><button type="button" class="emb-font" style="font-family:Georgia,serif;font-size:0.9rem" data-f="Serif" onclick="selectEmbFont(this)">Sample</button><button type="button" class="emb-font" style="font-family:sans-serif;font-weight:900;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase" data-f="Block" onclick="selectEmbFont(this)">SAMPLE</button></div></div></div><div class="emb-logo-fields" id="embLogoF-${p.id}" style="display:none"><div class="emb-field"><label>Upload Logo *</label><input type="file" id="embLogoFile-${p.id}" accept="image/*" onchange="previewEmbLogo(this,'${p.id}')"><div id="embLogoPreview-${p.id}" class="emb-logo-preview" style="display:none"><img id="embLogoImg-${p.id}" src="" alt="Logo preview" style="max-width:100px;max-height:80px;object-fit:contain;border-radius:6px;margin-top:6px;"><span class="emb-logo-filename" id="embLogoName-${p.id}"></span></div><p class="emb-logo-note"><i class="fas fa-info-circle"></i> Accepted: PNG, JPG, SVG (max 2MB)</p></div><div class="emb-field"><label>Logo Position *</label><select id="embLogoPos-${p.id}"><option value="">Select Position</option><option>Left Chest</option><option>Right Chest</option><option>Back Center</option><option>Left Sleeve</option><option>Right Sleeve</option></select></div></div></div></div>` : '';

    const modal = document.getElementById('productDetailModal');
    const accordionHtml = (p.fitSizing || p.fabricCare || p.returns) ? `<div class="pd-accordion">${p.fitSizing ? `<div class="pd-accordion-item"><button class="pd-accordion-header" onclick="togglePdAccordion(this)"><span>Details &amp; Fit</span><i class="fas fa-plus"></i></button><div class="pd-accordion-body">${renderRichText(p.fitSizing)}</div></div>` : ''}${p.fabricCare ? `<div class="pd-accordion-item"><button class="pd-accordion-header" onclick="togglePdAccordion(this)"><span>Fabric &amp; Care</span><i class="fas fa-plus"></i></button><div class="pd-accordion-body">${renderRichText(p.fabricCare)}</div></div>` : ''}${p.returns ? `<div class="pd-accordion-item"><button class="pd-accordion-header" onclick="togglePdAccordion(this)"><span>Return &amp; Exchange</span><i class="fas fa-plus"></i></button><div class="pd-accordion-body">${renderRichText(p.returns)}</div></div>` : ''}</div>` : '';
    modal.innerHTML = `<div class="modal product-detail-modal"><button class="modal-close pd-close" onclick="closeProductDetail()"><i class="fas fa-times"></i></button><div class="pd-grid"><div class="pd-image-gallery">${thumbsHtml}<div class="pd-main-img" id="pdMainWrap-${p.id}" onclick="openImageLightbox('pdMainImg-${p.id}')">${mainImg ? `<img id="pdMainImg-${p.id}" src="${mainImg}" alt="${p.name}">` : `<div class="pd-no-img"><i class="fas fa-tshirt"></i></div>`}<button class="pd-expand-btn" onclick="event.stopPropagation();openImageLightbox('pdMainImg-${p.id}')" aria-label="Expand"><i class="fas fa-expand-alt"></i></button>${p.badge?`<span class="pd-badge">${p.badge}</span>`:''}</div></div><div class="pd-info"><span class="pd-category">${typeof getCategoryLabel === 'function' ? getCategoryLabel(p.category) : p.category.replace(/-/g,' ')}</span><h2 class="pd-title" id="pdTitle-${p.id}">${p.name}${defaultColor ? `<span class="pd-title-color"> — ${defaultColor}</span>` : ''}</h2><div class="pd-rating">${'<i class="fas fa-star"></i>'.repeat(Math.floor(p.rating))}<span>(${p.reviews} reviews)</span></div><div class="pd-price"><span class="pd-current-price" id="pdCurPrice-${p.id}">\u20b9${p.price}</span><span class="pd-old-price" id="pdOldPrice-${p.id}"${p.oldPrice?'':' style="display:none"'}>\u20b9${p.oldPrice||''}</span><span class="pd-discount" id="pdDiscount-${p.id}"${p.oldPrice?'':' style="display:none"'}>${discount}% OFF</span><span class="pd-emb-note" id="pdEmbNote-${p.id}" style="display:none"></span></div><div class="pd-description">${renderRichText(p.description)}</div>${colorSection}<div class="pd-size-section"><h4>Select Size</h4><div class="pd-sizes" id="pdSizes-${p.id}">${p.sizes.map((s,i)=>{ const oos=isVariantOutOfStock(p,s,defaultColor); const active=firstAvailableSize?(s===firstAvailableSize):(!oos&&i===0); return `<button class="pd-size-btn${active?' active':''}${oos?' is-oos':''}" data-size="${s.replace(/"/g,'&quot;')}" ${oos?'disabled title="Out of stock for this color"':''} onclick="selectSize(this,${p.id})">${s}</button>`; }).join('')}</div><p id="pdVariantStockMsg-${p.id}" style="display:none;color:#dc2626;font-size:0.85rem;margin-top:8px;"></p></div>${embHtml}<div class="pd-qty-section"><h4>Quantity</h4><div class="pd-qty"><button onclick="changePdQty(-1)"><i class="fas fa-minus"></i></button><span id="pdQty">1</span><button onclick="changePdQty(1)"><i class="fas fa-plus"></i></button></div></div><div class="pd-actions"><button id="pdAddBtn-${p.id}" class="btn btn-primary btn-lg" onclick="addToCartFromDetail(${p.id})"><i class="fas fa-cart-plus"></i> Add to Cart</button><button id="pdBuyBtn-${p.id}" class="btn btn-outline-dark btn-lg" onclick="buyNowFromDetail(${p.id})"><i class="fas fa-bolt"></i> Buy Now</button></div><div class="pd-features"><div class="pd-feature"><i class="fas fa-truck"></i> Free delivery above \u20b92000</div><div class="pd-feature"><i class="fas fa-undo"></i> 7-day returns</div><div class="pd-feature"><i class="fas fa-shield-alt"></i> Quality guaranteed</div></div>${accordionHtml}</div></div></div>`;
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
        <label>Email or Phone</label>
        <input type="text" id="loginEmail" placeholder="Enter your email or phone">
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
            <p class="auth-subtitle" style="margin-bottom:16px;">Verify with email and phone to receive reset link</p>
            <div class="form-group"><label>Email</label><input type="email" id="fpEmail" placeholder="Registered email"></div>
            <div class="form-group"><label>Phone</label><input type="tel" id="fpPhone" placeholder="Registered phone"></div>
            <p id="fpMsg" style="display:none;font-size:0.82rem;margin-bottom:8px;"></p>
            <button class="btn btn-gradient btn-full" style="margin-top:4px;" onclick="handleForgotPasswordReset()"><i class="fas fa-paper-plane"></i> Send Reset Link</button>
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
async function handleForgotPasswordReset() {
    const email = document.getElementById('fpEmail')?.value.trim();
    const phone = document.getElementById('fpPhone')?.value.trim();
    const msg = document.getElementById('fpMsg');
    const sendBtn = document.querySelector('#forgotForm button.btn.btn-gradient');
    if (!msg) return;
    const show = (text, ok) => {
        msg.textContent = text;
        msg.style.color = ok === null ? '#0ea5e9' : ok ? '#10b981' : '#ef4444';
        msg.style.display = 'block';
    };

    if (!email || !phone) { show('Please enter email and phone number'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { show('Please enter a valid email'); return; }

    // Verify phone against known profile data before sending reset link.
    const users = JSON.parse(localStorage.getItem('ssa_users') || '[]');
    const localUser = users.find(u => (u.email || '').toLowerCase() === email.toLowerCase());
    if (localUser && String(localUser.phone || '').trim() !== String(phone).trim()) {
        show('Phone number does not match this account');
        return;
    }

    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }
    show('Sending reset link...', null);

    // Secure flow: send reset link by email via auth provider.
    if (window.auth && typeof window.auth.sendPasswordResetEmail === 'function') {
        try {
            await window.auth.sendPasswordResetEmail(email);
            show('Password reset link sent to your email. Please check inbox/spam.', true);
            return;
        } catch (e) {
            console.warn('[forgot] Email reset failed:', e.message);
            show('Unable to send reset email: ' + (e?.message || 'Unknown error'));
            return;
        } finally {
            if (sendBtn) {
                sendBtn.disabled = false;
                sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
            }
        }
    }
    if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
    }
    show('Reset email is temporarily unavailable. Please contact support.');
}

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
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    document.getElementById('loginEmailError').style.display = 'none';
    document.getElementById('loginPasswordError').style.display = 'none';
    if (!email) { document.getElementById('loginEmailError').textContent = 'Required'; document.getElementById('loginEmailError').style.display = 'block'; return; }
    if (!password) { document.getElementById('loginPasswordError').textContent = 'Required'; document.getElementById('loginPasswordError').style.display = 'block'; return; }

    // Primary path: backend auth (email only)
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && window.auth && typeof window.auth.signInWithEmailAndPassword === 'function') {
        try {
            const r = await window.auth.signInWithEmailAndPassword(email, password);
            const u = r?.user || r?.data?.user || null;
            const md = u?.user_metadata || {};
            const firstName = md.firstName || (md.name ? String(md.name).split(' ')[0] : 'User');
            const lastName = md.lastName || '';
            const phone = md.phone || '';

            currentUser = { name: [firstName, lastName].filter(Boolean).join(' ') || 'User', email: u?.email || email, phone };
            localStorage.setItem('ssa_user', JSON.stringify(currentUser));
            _upsertLocalUserProfile({ firstName, lastName, email: currentUser.email, phone });

            closeAuthModal();
            updateAuthUI();
            showToast(`Welcome back, ${firstName || 'User'}!`);
            if (typeof syncPendingOrders === 'function') syncPendingOrders(currentUser.email, currentUser.name, currentUser.phone);
            return;
        } catch (e) {
            console.warn('[login] Backend auth failed, trying local fallback:', e.message);
        }
    }

    // Fallback path: local profile login
    const users = JSON.parse(localStorage.getItem('ssa_users') || '[]');
    const user = users.find(u => (u.email === email || u.phone === email) && u.password === password);
    if (user) { currentUser = { name: user.firstName + ' ' + user.lastName, email: user.email, phone: user.phone }; localStorage.setItem('ssa_user', JSON.stringify(currentUser)); closeAuthModal(); updateAuthUI(); showToast(`Welcome back, ${user.firstName}!`); if (typeof syncPendingOrders === 'function') syncPendingOrders(currentUser.email, currentUser.name, currentUser.phone); }
    else { document.getElementById('loginPasswordError').textContent = 'Invalid credentials'; document.getElementById('loginPasswordError').style.display = 'block'; }
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
    currentUser = { name: firstName + ' ' + lastName, email, phone };
    localStorage.setItem('ssa_user', JSON.stringify(currentUser));
    // Save customer to Firebase (async but we continue immediately)
    console.log('[register] Saving customer to Firestore...');
    if (typeof saveCustomerToFirebase === 'function') {
        saveCustomerToFirebase({ firstName, lastName, email, phone })
            .catch(err => console.error('[register] Async save failed:', err));
    }
    closeAuthModal(); updateAuthUI(); showToast(`Welcome, ${firstName}!`);
}
function closeAuthModal() { document.getElementById('authModal').classList.remove('active'); }
async function openAccountPanel() {
    const modal = document.getElementById('authModal');
    modal.innerHTML = `<div class="modal account-modal-v2"><button class="acct-close" onclick="closeAuthModal()"><i class="fas fa-times"></i></button><div style="text-align:center;padding:50px 30px;"><div class="loader"><div class="loader-ring"></div><span class="loader-text">SSA</span></div><p style="margin-top:14px;color:var(--text-muted);font-size:0.88rem;">Loading your account...</p></div></div>`;
    modal.classList.add('active');
    let firestoreOrders = [];
    if (window.fireDb) {
        try {
            if (window.auth) { try { await window.auth.signInAnonymously(); } catch(e) {} }
            const snap = await fireDb.collection('orders').where('customerEmail', '==', currentUser.email).get();
            firestoreOrders = snap.docs.map(d => ({
                id: d.data().orderId,
                date: d.data().createdAt?.seconds ? new Date(d.data().createdAt.seconds*1000).toISOString() : new Date().toISOString(),
                items: d.data().items || [],
                total: d.data().total || 0,
                payment: d.data().payment || 'COD',
                status: d.data().status || 'Processing',
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
    // For authenticated Supabase users trust the database; do not fall back to stale localStorage
    const isAuthenticatedUser = !!(window.getCurrentUser && window.getCurrentUser());
    const orders = (firestoreOrders.length > 0 || isAuthenticatedUser) ? firestoreOrders : localOrders;
    const avatar = localStorage.getItem('ssa_avatar_' + currentUser.email) || '';
    const avatarHtml = avatar ? `<img src="${avatar}" alt="Avatar" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,0.15);">` : `<i class="fas fa-user-circle" style="font-size:72px;color:#0066cc;"></i>`;
    modal.innerHTML = `<div class="modal account-modal-v2">
        <div class="acct-top">
            <div class="acct-top-inner">
                <div class="acct-avatar-wrap" onclick="document.getElementById('avatarUpload').click()">
                    ${avatar ? `<img src="${avatar}" alt="Avatar" class="acct-avatar-img">` : `<div class="acct-avatar-placeholder"><i class="fas fa-user"></i></div>`}
                    <span class="acct-avatar-edit"><i class="fas fa-camera"></i></span>
                    <input type="file" id="avatarUpload" accept="image/*" style="display:none" onchange="handleAvatarUpload(this)">
                </div>
                <div class="acct-user-info">
                    <h4>${currentUser.name}</h4>
                    <p>${currentUser.email}</p>
                    ${currentUser.phone ? `<span class="acct-phone"><i class="fas fa-phone-alt"></i> ${currentUser.phone}</span>` : ''}
                </div>
            </div>
            <button class="acct-close" onclick="closeAuthModal()"><i class="fas fa-times"></i></button>
        </div>
        <div class="acct-tabs-bar">
            <button class="acct-tab-btn active" onclick="showAccountTab('orders')"><i class="fas fa-box-open"></i> Orders</button>
            <button class="acct-tab-btn" onclick="showAccountTab('profile')"><i class="fas fa-user-edit"></i> Profile</button>
            <button class="acct-tab-btn" onclick="showAccountTab('addresses')"><i class="fas fa-map-marker-alt"></i> Address</button>
            <button class="acct-tab-btn" onclick="showAccountTab('security')"><i class="fas fa-lock"></i> Password</button>
        </div>
        <div class="acct-body">
            <div class="acct-section active" id="accountOrders">
                ${orders.length === 0 ? '<div class="empty-orders"><i class="fas fa-box-open"></i><p>No orders yet. Start shopping!</p><a href="categories.html" class="btn btn-gradient btn-sm" onclick="closeAuthModal()">Browse Products</a></div>' :
                    orders.map(o => `<div class="acct-order-card">
                        <div class="acct-order-head">
                            <div><span class="acct-order-id">#${o.id}</span><span class="acct-order-date">${new Date(o.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span></div>
                            <span class="acct-order-status ${(o.status || 'processing').toLowerCase()}">${o.status}</span>
                        </div>
                        <div class="acct-order-items">${o.items.map(i => `<div class="acct-order-row"><span>${i.name} &times;${i.qty}</span><span>&#8377;${i.price*i.qty}</span></div>`).join('')}</div>
                        <div class="acct-order-foot">
                            <span class="acct-order-total">Total: &#8377;${o.total.toLocaleString('en-IN')}</span>
                            <span class="acct-order-pay"><i class="fas fa-credit-card"></i> ${o.payment}</span>
                        </div>
                        <div style="display:flex;gap:8px;padding:0 14px 12px;">
                            <button class="btn btn-outline-dark btn-sm" style="flex:1;justify-content:center;" onclick="downloadInvoice('${o.id}')"><i class="fas fa-file-invoice"></i> Invoice</button>
                            <button class="btn btn-primary btn-sm" style="flex:1;justify-content:center;" onclick="reorderFromHistory('${o.id}')"><i class="fas fa-redo"></i> Reorder</button>
                        </div>
                    </div>`).join('')}
            </div>
            <div class="acct-section" id="accountProfile" style="display:none;">
                <div class="profile-edit-form">
                    <div class="form-group"><span class="acct-field-label">Full Name</span><input type="text" id="editName" value="${currentUser.name}" placeholder="Your full name"></div>
                    <div class="form-group"><span class="acct-field-label">Mobile Phone</span><input type="tel" id="editPhone" value="${currentUser.phone||''}" placeholder="Phone number"></div>
                    <div class="form-group"><span class="acct-field-label">Email <small style="color:#94a3b8;font-size:0.7rem;">(cannot change)</small></span><input type="email" value="${currentUser.email}" readonly style="background:#f1f5f9;color:#64748b;cursor:not-allowed;"></div>
                    <button class="btn btn-gradient btn-full" onclick="saveProfileChanges()"><i class="fas fa-save"></i> Save Changes</button>
                </div>
            </div>
            <div class="acct-section" id="accountAddresses" style="display:none;">
                <div id="addressList"></div>
                <button class="btn btn-outline-dark btn-full" style="margin-top:8px" onclick="showAddAddressForm()"><i class="fas fa-plus"></i> Add New Address</button>
                <div id="addAddressForm" style="display:none;margin-top:12px;">
                    <div class="form-group"><label>Street / Door No.</label><input type="text" id="addrStreet" placeholder="Street address"></div>
                    <div class="form-row"><div class="form-group"><label>City</label><input type="text" id="addrCity" placeholder="City"></div><div class="form-group"><label>PIN Code</label><input type="text" id="addrPin" placeholder="PIN"></div></div>
                    <div class="form-group"><label>State</label><input type="text" id="addrState" placeholder="State" value="Tamil Nadu"></div>
                    <div class="form-row"><button class="btn btn-gradient" onclick="saveNewAddress()"><i class="fas fa-save"></i> Save</button><button class="btn btn-outline-dark" onclick="document.getElementById('addAddressForm').style.display='none'">Cancel</button></div>
                </div>
            </div>
            <div class="acct-section" id="accountSecurity" style="display:none;">
                <div class="profile-edit-form">
                    <div class="form-group"><label>Current Password</label><input type="password" id="pwdCurrent" placeholder="Current password"></div>
                    <div class="form-group"><label>New Password</label><input type="password" id="pwdNew" placeholder="New password (min 6 chars)"></div>
                    <div class="form-group"><label>Confirm New Password</label><input type="password" id="pwdConfirm" placeholder="Confirm new password"></div>
                    <p id="pwdMsg" style="display:none;font-size:0.82rem;margin-bottom:8px;"></p>
                    <button class="btn btn-gradient btn-full" onclick="changePassword()"><i class="fas fa-key"></i> Update Password</button>
                </div>
            </div>
        </div>
        <div class="acct-footer">
            <a href="wishlist.html" class="btn btn-outline-dark" style="flex:1;justify-content:center;" onclick="closeAuthModal()"><i class="fas fa-heart"></i> Wishlist</a>
            <button class="btn btn-outline-dark" style="flex:1;justify-content:center;color:var(--red);" onclick="handleLogout()"><i class="fas fa-sign-out-alt"></i> Sign Out</button>
        </div>
    </div>`;
    renderAddressList();
}
function showAccountTab(tab) {
    document.querySelectorAll('.acct-tab-btn, .account-tab').forEach(t => t.classList.remove('active'));
    ['accountOrders','accountProfile','accountAddresses','accountSecurity'].forEach(id => { const el = document.getElementById(id); if (el) { el.style.display = 'none'; el.classList.remove('active'); } });
    const map = { orders:'accountOrders', profile:'accountProfile', addresses:'accountAddresses', security:'accountSecurity' };
    const el = document.getElementById(map[tab]); if (el) el.style.display = 'block';
    const tabBtns = document.querySelectorAll('.acct-tab-btn, .account-tab');
    const tabIdx = { orders:0, profile:1, addresses:2, security:3 };
    if (tabBtns[tabIdx[tab]]) tabBtns[tabIdx[tab]].classList.add('active');
}
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
    const addrs = JSON.parse(localStorage.getItem('ssa_addresses_' + currentUser.email) || '[]');
    if (addrs.length === 0) { el.innerHTML = '<p style="color:#94a3b8;font-size:0.85rem;text-align:center;padding:10px 0">No saved addresses yet</p>'; return; }
    el.innerHTML = addrs.map((a, i) => `<div class="addr-card" style="border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;margin-bottom:8px;position:relative;">
        ${i===0?'<span style="font-size:0.7rem;font-weight:700;color:#0066cc;margin-bottom:4px;display:block">DEFAULT</span>':''}
        <p style="margin:0;font-size:0.88rem;line-height:1.6">${a.street}, ${a.city} – ${a.pincode}, ${a.state||'Tamil Nadu'}</p>
        <button onclick="deleteAddress(${i})" style="position:absolute;top:8px;right:8px;background:none;border:none;cursor:pointer;color:#ef4444;font-size:0.78rem;padding:2px 6px;"><i class="fas fa-trash"></i></button>
        ${i>0?`<button onclick="setDefaultAddress(${i})" style="font-size:0.72rem;color:#0066cc;background:none;border:none;cursor:pointer;margin-top:4px;padding:0">Set as default</button>`:''}
    </div>`).join('');
}
function showAddAddressForm() { document.getElementById('addAddressForm').style.display = 'block'; }
function saveNewAddress() {
    const street = document.getElementById('addrStreet')?.value.trim();
    const city   = document.getElementById('addrCity')?.value.trim();
    const pin    = document.getElementById('addrPin')?.value.trim();
    const state  = document.getElementById('addrState')?.value.trim();
    if (!street || !city || !pin) { showToast('Please fill street, city and PIN'); return; }
    const addrs = JSON.parse(localStorage.getItem('ssa_addresses_' + currentUser.email) || '[]');
    addrs.push({ street, city, pincode: pin, state: state || 'Tamil Nadu' });
    localStorage.setItem('ssa_addresses_' + currentUser.email, JSON.stringify(addrs));
    document.getElementById('addAddressForm').style.display = 'none';
    renderAddressList();
    showToast('Address saved!');
}
function deleteAddress(i) {
    const addrs = JSON.parse(localStorage.getItem('ssa_addresses_' + currentUser.email) || '[]');
    addrs.splice(i, 1);
    localStorage.setItem('ssa_addresses_' + currentUser.email, JSON.stringify(addrs));
    renderAddressList();
}
function setDefaultAddress(i) {
    const addrs = JSON.parse(localStorage.getItem('ssa_addresses_' + currentUser.email) || '[]');
    const [a] = addrs.splice(i, 1); addrs.unshift(a);
    localStorage.setItem('ssa_addresses_' + currentUser.email, JSON.stringify(addrs));
    renderAddressList();
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

        // If order came from Firestore and lacks address fields, pull from local order copy
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
        const dueDate = new Date(invoiceDate.getTime() + (2 * 24 * 60 * 60 * 1000));
        const rows = (order.items || []).map(i => {
                const qty = i.qty || 0;
                const unit = i.price || 0;
                const line = qty * unit;
                const variant = [i.selectedSize || null, i.selectedColor || null].filter(Boolean).join(' / ');
                return `<tr><td>${i.name || 'Item'}${variant ? `<br><small class="variant">${variant}</small>` : ''}</td><td class="center">${qty}</td><td class="right">&#8377;${unit.toLocaleString('en-IN')}</td><td class="right">&#8377;${line.toLocaleString('en-IN')}</td></tr>`;
        }).join('');

        const subtotal = (order.items || []).reduce((s, i) => s + ((i.qty || 0) * (i.price || 0)), 0);
        const shippingCharge = Math.max(0, (order.total || 0) - subtotal);
        const shippingLine = [shipping.address, shipping.city, shipping.pincode].filter(Boolean).join(', ');

        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${order.id}</title>
    <style>
        :root{--teal:#0d9488;--navy:#0f172a;--muted:#64748b;--line:#e2e8f0;--bg:#f8fafc;}
        *{box-sizing:border-box;}
        *{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
        body{font-family:'Segoe UI',Arial,sans-serif;color:var(--navy);margin:0;background:#eef2f7;padding:24px;}
        .sheet{max-width:860px;margin:0 auto;background:#fff;border:1px solid #dbe4ee;border-radius:18px;overflow:hidden;box-shadow:0 20px 48px rgba(15,23,42,0.12);}
        .hero{display:flex;justify-content:space-between;gap:20px;padding:22px 26px;background:linear-gradient(135deg,#0f172a 0%,#0d9488 100%);color:#fff;}
        .brand{display:flex;align-items:flex-start;gap:14px;}
        .logo{width:58px;height:58px;border-radius:12px;background:#fff;padding:6px;object-fit:contain;}
        .brand h1{margin:0;font-size:26px;line-height:1.1;}
        .brand p{margin:6px 0 0;font-size:12px;opacity:.9;line-height:1.6;}
        .meta{min-width:245px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);padding:12px 14px;border-radius:12px;}
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
        .totals{width:360px;margin-left:auto;margin-top:16px;border:1px solid var(--line);border-radius:12px;padding:10px 14px;background:var(--bg);}
        .totals div{display:flex;justify-content:space-between;padding:7px 0;font-size:14px;}
        .totals .grand{font-weight:800;font-size:17px;border-top:1px dashed #c7d2df;margin-top:3px;padding-top:10px;color:var(--navy);}
        .foot{margin-top:16px;padding-top:12px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:16px;font-size:12px;color:var(--muted);}
        .chip{display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:700;background:#d1fae5;color:#065f46;}
        @media (max-width:760px){
            body{padding:10px;background:#fff;}
            .sheet{border:none;box-shadow:none;}
            .hero{flex-direction:column;padding:16px;}
            .body{padding:16px;}
            .grid{grid-template-columns:1fr;}
            .totals{width:100%;}
        }
        @page { size: A4; margin: 10mm; }
        @media print {
            body{background:#fff !important;padding:0 !important;}
            .sheet{width:190mm;max-width:190mm;margin:0 auto;box-shadow:none;border:1px solid #dbe4ee;border-radius:0;}
            .hero{padding:14px 18px;}
            .body{padding:14px 18px 18px;}
            th,td{padding:8px 10px;font-size:12.5px;}
            .totals{width:86mm;}
            .foot{font-size:11px;}
        }
    </style>
</head>
<body>
    <div class="sheet">
        <div class="hero">
            <div class="brand">
                <img class="logo" src="${logoUrl}" alt="SSA Logo">
                <div>
                    <h1>Siva Suresh Agency</h1>
                    <p>PVT Towers, 37/10, Selvam Nagar, Erode - 638011<br>Phone: +91 93666 40060 | Email: sivasureshagency@gmail.com</p>
                </div>
            </div>
            <div class="meta">
                <p><strong>Invoice No:</strong> ${order.id}</p>
                <p><strong>Date:</strong> ${invoiceDate.toLocaleDateString('en-IN')}</p>
                <p><strong>Due Date:</strong> ${dueDate.toLocaleDateString('en-IN')}</p>
                <p><strong>Payment:</strong> ${order.payment || 'COD'}</p>
                <p><strong>Status:</strong> <span class="chip">${order.status || 'Processing'}</span></p>
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
                <div><span>Subtotal</span><span>&#8377;${subtotal.toLocaleString('en-IN')}</span></div>
                <div><span>Shipping</span><span>&#8377;${shippingCharge.toLocaleString('en-IN')}</span></div>
                <div class="grand"><span>Total</span><span>&#8377;${(order.total || 0).toLocaleString('en-IN')}</span></div>
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
        setTimeout(() => w.print(), 300);
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
function placeOrder() {
    if (!currentUser) { document.getElementById('checkoutModal').classList.remove('active'); openLoginModal(); showToast('Please login first'); return; }
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const pm = document.querySelector('[name="payment"]:checked');
    const shipping = {
        firstname: document.querySelector('[name="firstname"]')?.value || '',
        lastname: document.querySelector('[name="lastname"]')?.value || '',
        email: document.querySelector('[name="cemail"]')?.value || currentUser.email,
        phone: document.querySelector('[name="cphone"]')?.value || '',
        address: document.querySelector('[name="address"]')?.value || '',
        city: document.querySelector('[name="city"]')?.value || '',
        pincode: document.querySelector('[name="pincode"]')?.value || ''
    };

    const order = {
        id: 'SSA' + Date.now().toString(36).toUpperCase(),
        date: new Date().toISOString(),
        items: cart.map(i => ({ name: i.name, selectedSize: i.selectedSize, selectedColor: i.selectedColor || null, qty: i.qty, price: i.price, embroidery: i.embroidery || null })),
        total: total > 2000 ? total : total + 150,
        payment: pm ? pm.value.toUpperCase() : 'COD',
        status: 'Processing',
        shipping: {
            name: (shipping.firstname + ' ' + shipping.lastname).trim(),
            email: shipping.email,
            phone: shipping.phone,
            address: shipping.address,
            city: shipping.city,
            pincode: shipping.pincode
        }
    };
    const key = 'ssa_orders_' + currentUser.email;
    const orders = JSON.parse(localStorage.getItem(key) || '[]');
    orders.unshift(order); localStorage.setItem(key, JSON.stringify(orders));
    // Save to Firebase
    if (typeof saveOrderToFirebase === 'function') saveOrderToFirebase(order, shipping);
    document.getElementById('checkoutModal').classList.remove('active');
    document.getElementById('orderId').textContent = order.id;
    document.getElementById('successModal').classList.add('active');
    cart = []; saveCart(); updateCartUI();
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

    document.querySelectorAll('.cat-tile-img[data-cat]').forEach(tile => {
        const cat = tile.dataset.cat;
        const imgs = catImages[cat];
        if (_tileScrollTimers[cat]) { clearInterval(_tileScrollTimers[cat]); delete _tileScrollTimers[cat]; }
        // No admin images for this category → show the CSS gradient placeholder
        if (!imgs || !imgs.length) { tile.style.backgroundImage = ''; tile.classList.remove('has-img'); return; }
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

// ===== Chatbot =====
function initChatbot() {
    const toggle = document.getElementById('chatbotToggle');
    const win = document.getElementById('chatbotWindow');
    const minimize = document.getElementById('chatbotMinimize');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');
    if (!toggle) return;
    toggle.addEventListener('click', () => { win.classList.toggle('open'); document.querySelector('.chatbot-badge').style.display = 'none'; });
    minimize.addEventListener('click', () => win.classList.remove('open'));
    document.addEventListener('click', (e) => { if (e.target.classList.contains('quick-reply')) sendChatMessage(e.target.dataset.msg); });
    send.addEventListener('click', () => { const m = input.value.trim(); if (m) sendChatMessage(m); });
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') { const m = input.value.trim(); if (m) sendChatMessage(m); } });
}
function sendChatMessage(msg) {
    const messages = document.getElementById('chatbotMessages');
    const input = document.getElementById('chatInput');
    appendMsg('user', msg); input.value = '';
    const typing = document.createElement('div'); typing.className = 'chat-message bot';
    typing.innerHTML = '<div class="message-avatar"><i class="fas fa-robot"></i></div><div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>';
    messages.appendChild(typing); messages.scrollTop = messages.scrollHeight;
    setTimeout(() => { typing.remove(); appendMsg('bot', getAIResponse(msg)); }, 1000);
}
function appendMsg(type, text) {
    const messages = document.getElementById('chatbotMessages');
    const div = document.createElement('div'); div.className = `chat-message ${type}`;
    const icon = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    div.innerHTML = `<div class="message-avatar">${icon}</div><div class="message-content"><p>${text}</p></div>`;
    messages.appendChild(div); messages.scrollTop = messages.scrollHeight;
}
function getAIResponse(msg) {
    const m = msg.toLowerCase();
    if (m.includes('product') || m.includes('offer') || m.includes('sell')) return 'We offer: 🥼 Doctor Uniforms (Male & Female, Full & Half Sleeve), 👔 Staff Uniforms (Multiple Styles), 🛏️ Bedsheets, 🏥 Hospital Linen, 🏨 Hotel Linen. <a href="categories.html">Browse All →</a>';
    if (m.includes('price') || m.includes('cost')) return 'Price ranges: Doctor Uniforms ₹750-₹900, Staff Uniforms ₹500-₹590, Bedsheets ₹150-₹480. Bulk discounts available!';
    if (m.includes('order') || m.includes('buy') || m.includes('how to')) return 'Easy! 1️⃣ Browse <a href="categories.html">Categories</a> 2️⃣ Add to Cart 3️⃣ Checkout 4️⃣ Choose payment (COD/UPI/Bank) 5️⃣ Done!';
    if (m.includes('deliver') || m.includes('ship')) return '📦 We deliver all-India! Free shipping above ₹2000. Standard: 3-5 days. Express available.';
    if (m.includes('contact') || m.includes('phone') || m.includes('call')) return '📞 Siva: +91 93666 40060 | Suresh: +91 93666 40050<br>✉️ sivasureshagency@gmail.com<br>📍 Erode, Tamil Nadu';
    if (m.includes('bulk') || m.includes('wholesale')) return '📦 Bulk orders: Special pricing, dedicated account manager, recurring orders. Call +91 93666 40060 or <a href="contact.html">contact us</a>';
    if (m.includes('hi') || m.includes('hello')) return 'Hello! 😊 How can I help? Ask about products, pricing, delivery, or orders!';
    if (m.includes('thank')) return "You're welcome! 😊 Happy shopping!";
    return 'I can help with products, pricing, ordering, delivery & contact info. Try "What products do you offer?" or call +91 93666 40060.';
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
            <div class="shop-card-rating">${'<i class="fas fa-star"></i>'.repeat(Math.floor(p.rating))}${p.rating % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}<span>(${p.reviews})</span></div>
            <div class="shop-card-price"><span class="price">\u20b9${p.price}</span><span class="old-price">\u20b9${p.oldPrice}</span></div>
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
