// ===== SVG Avatar Generator - Detailed 3D Cartoon Style =====
function generateProductSVG(product) {
    const category = product.category;
    const gender = product.gender || 'male';
    const sleeve = product.sleeve || 'full';
    
    // Background gradients per category
    const bgGradients = {
        'doctor-coats': ['#e8f4fd', '#d4e8f7'],
        'scrub-suits': ['#e8f8f0', '#d0f0e0'],
        'hospital-uniforms': ['#eae4f7', '#ddd4f0'],
        'hospital-linen': ['#f0f8ff', '#e0f0ff'],
        'bedsheets': ['#fff0f0', '#ffe8e8'],
        'hotel-linen': ['#fff8e8', '#fff0d0']
    };
    const bg = bgGradients[category] || bgGradients['doctor-coats'];
    
    // Skin tones
    const skinTones = ['#f5cba7', '#d4a574', '#8d5524', '#f8d9b0'];
    const skinTone = skinTones[product.id % skinTones.length];
    const skinShadow = skinTone === '#f5cba7' ? '#e8b98a' : 
                       skinTone === '#d4a574' ? '#b8885c' :
                       skinTone === '#8d5524' ? '#6b3a12' : '#e0c090';
    
    // Hair styles based on gender
    let hairSVG = '';
    const hairColors = ['#4a3728', '#1a1a2e', '#8b4513', '#2c1810'];
    const hairColor = hairColors[product.id % hairColors.length];
    
    if (gender === 'female') {
        // Longer hair with volume
        hairSVG = `
        <ellipse cx="150" cy="72" rx="32" ry="35" fill="${hairColor}"/>
        <path d="M120 72 Q120 45 150 40 Q180 45 180 72 Q180 55 170 50 Q150 42 130 50 Q120 55 120 72" fill="${hairColor}"/>
        <path d="M122 80 Q118 100 120 115 Q122 120 125 115 Q127 100 126 85 Z" fill="${hairColor}"/>
        <path d="M178 80 Q182 100 180 115 Q178 120 175 115 Q173 100 174 85 Z" fill="${hairColor}"/>`;
    } else {
        // Short styled hair
        hairSVG = `
        <ellipse cx="150" cy="68" rx="28" ry="28" fill="${hairColor}"/>
        <path d="M124 70 Q124 48 150 42 Q176 48 176 70 Q176 55 165 48 Q150 40 135 48 Q124 55 124 70" fill="${hairColor}"/>
        <path d="M130 55 Q140 45 155 44 Q170 45 175 55" fill="${hairColor}" opacity="0.8"/>`;
    }
    
    // Face
    let faceSVG = `
    <ellipse cx="150" cy="82" rx="24" ry="28" fill="${skinTone}"/>
    <ellipse cx="150" cy="85" rx="22" ry="25" fill="${skinTone}"/>
    <!-- Ears -->
    <ellipse cx="127" cy="82" rx="5" ry="7" fill="${skinTone}"/>
    <ellipse cx="173" cy="82" rx="5" ry="7" fill="${skinTone}"/>
    <ellipse cx="127" cy="82" rx="3" ry="5" fill="${skinShadow}"/>
    <ellipse cx="173" cy="82" rx="3" ry="5" fill="${skinShadow}"/>`;
    
    // Eyes
    let eyesSVG = '';
    if (gender === 'female' && product.id % 3 === 0) {
        // With glasses
        eyesSVG = `
        <rect x="134" y="76" width="14" height="11" rx="5" fill="none" stroke="#333" stroke-width="1.5"/>
        <rect x="152" y="76" width="14" height="11" rx="5" fill="none" stroke="#333" stroke-width="1.5"/>
        <line x1="148" y1="81" x2="152" y2="81" stroke="#333" stroke-width="1.5"/>
        <circle cx="141" cy="81" r="4" fill="#fff"/>
        <circle cx="159" cy="81" r="4" fill="#fff"/>
        <circle cx="141" cy="81" r="2.5" fill="#4a2c1a"/>
        <circle cx="159" cy="81" r="2.5" fill="#4a2c1a"/>
        <circle cx="140" cy="80" r="1" fill="#fff"/>
        <circle cx="158" cy="80" r="1" fill="#fff"/>`;
    } else {
        eyesSVG = `
        <ellipse cx="141" cy="80" rx="5" ry="5.5" fill="#fff"/>
        <ellipse cx="159" cy="80" rx="5" ry="5.5" fill="#fff"/>
        <circle cx="141" cy="81" r="3" fill="#3d2314"/>
        <circle cx="159" cy="81" r="3" fill="#3d2314"/>
        <circle cx="140" cy="79.5" r="1.2" fill="#fff"/>
        <circle cx="158" cy="79.5" r="1.2" fill="#fff"/>
        <!-- Eyebrows -->
        <path d="M136 74 Q141 72 146 74" fill="none" stroke="${hairColor}" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M154 74 Q159 72 164 74" fill="none" stroke="${hairColor}" stroke-width="1.8" stroke-linecap="round"/>`;
    }
    
    // Nose and mouth
    let noseMouthSVG = `
    <path d="M148 87 Q150 90 152 87" fill="none" stroke="${skinShadow}" stroke-width="1" stroke-linecap="round"/>
    <path d="M143 96 Q150 101 157 96" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round"/>
    <path d="M145 95 Q150 97 155 95" fill="#e74c3c" opacity="0.4"/>`;
    
    // Neck
    let neckSVG = `<rect x="143" y="105" width="14" height="12" rx="2" fill="${skinTone}"/>`;
    
    // Body/Clothing
    let bodySVG = '';
    let coatColor = '#ffffff';
    let coatShadow = '#e8e8e8';
    
    if (category === 'doctor-coats') {
        coatColor = '#ffffff';
        coatShadow = '#e0e7ed';
        const sleeveEnd = sleeve === 'half' ? 155 : 200;
        bodySVG = `
        <!-- Body/Torso -->
        <path d="M125 117 Q125 115 130 113 L143 113 L157 113 L170 113 Q175 115 175 117 L180 200 Q180 210 170 210 L130 210 Q120 210 120 200 Z" fill="${coatColor}" stroke="${coatShadow}" stroke-width="0.5"/>
        <!-- Collar -->
        <path d="M140 113 L145 125 L150 118 L155 125 L160 113" fill="${coatColor}" stroke="${coatShadow}" stroke-width="1"/>
        <path d="M140 113 L143 113 L145 125 Z" fill="#e8f0f8"/>
        <path d="M157 113 L160 113 L155 125 Z" fill="#e8f0f8"/>
        <!-- Inner shirt -->
        <path d="M145 125 L150 118 L155 125 L155 145 L145 145 Z" fill="#dce8f4"/>
        <!-- Buttons -->
        <circle cx="150" cy="140" r="2.5" fill="${coatShadow}" stroke="#ccc" stroke-width="0.5"/>
        <circle cx="150" cy="155" r="2.5" fill="${coatShadow}" stroke="#ccc" stroke-width="0.5"/>
        <circle cx="150" cy="170" r="2.5" fill="${coatShadow}" stroke="#ccc" stroke-width="0.5"/>
        <!-- Pocket -->
        <rect x="130" y="135" width="14" height="2" rx="1" fill="${coatShadow}"/>
        <rect x="156" y="135" width="14" height="2" rx="1" fill="${coatShadow}"/>
        <rect x="132" y="160" width="12" height="16" rx="2" fill="none" stroke="${coatShadow}" stroke-width="1"/>
        <rect x="156" y="160" width="12" height="16" rx="2" fill="none" stroke="${coatShadow}" stroke-width="1"/>
        <!-- Sleeves -->
        <path d="M125 117 L110 125 Q105 130 107 ${sleeveEnd > 180 ? '180' : '155'} L115 ${sleeveEnd > 180 ? '182' : '157'} Q118 ${sleeveEnd > 180 ? '180' : '155'} 120 150 L125 130 Z" fill="${coatColor}" stroke="${coatShadow}" stroke-width="0.5"/>
        <path d="M175 117 L190 125 Q195 130 193 ${sleeveEnd > 180 ? '180' : '155'} L185 ${sleeveEnd > 180 ? '182' : '157'} Q182 ${sleeveEnd > 180 ? '180' : '155'} 180 150 L175 130 Z" fill="${coatColor}" stroke="${coatShadow}" stroke-width="0.5"/>
        <!-- Hands -->
        <ellipse cx="111" cy="${sleeveEnd > 180 ? '186' : '160'}" rx="6" ry="7" fill="${skinTone}"/>
        <ellipse cx="189" cy="${sleeveEnd > 180 ? '186' : '160'}" rx="6" ry="7" fill="${skinTone}"/>
        <!-- Stethoscope -->
        <path d="M145 120 Q140 130 138 150 Q136 165 140 170" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round"/>
        <circle cx="140" cy="172" r="4" fill="#666" stroke="#444" stroke-width="1"/>
        <circle cx="140" cy="172" r="2" fill="#888"/>
        <path d="M155 120 Q158 125 160 130" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round"/>`;
    } else if (category === 'scrub-suits') {
        const scrubColors = ['#1a5276', '#1e8449', '#6c3483', '#922b21'];
        coatColor = scrubColors[product.id % scrubColors.length];
        coatShadow = coatColor + '99';
        bodySVG = `
        <!-- Scrub Top -->
        <path d="M127 117 Q127 115 132 113 L168 113 Q173 115 173 117 L175 175 Q175 178 172 178 L128 178 Q125 178 125 175 Z" fill="${coatColor}"/>
        <!-- V-Neck -->
        <path d="M142 113 L150 130 L158 113" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
        <path d="M142 113 L150 128 L158 113 Z" fill="rgba(0,0,0,0.08)"/>
        <!-- Sleeves -->
        <path d="M127 117 L108 127 Q104 130 106 155 L114 157 Q116 155 118 145 L127 130 Z" fill="${coatColor}"/>
        <path d="M173 117 L192 127 Q196 130 194 155 L186 157 Q184 155 182 145 L173 130 Z" fill="${coatColor}"/>
        <!-- Hands -->
        <ellipse cx="110" cy="160" rx="6" ry="7" fill="${skinTone}"/>
        <ellipse cx="190" cy="160" rx="6" ry="7" fill="${skinTone}"/>
        <!-- Pants -->
        <path d="M128 178 L126 210 L142 210 L148 185 L152 185 L158 210 L174 210 L172 178 Z" fill="${coatColor}" opacity="0.85"/>
        <!-- Pocket line -->
        <rect x="133" y="145" width="10" height="1.5" rx="0.5" fill="rgba(255,255,255,0.3)"/>`;
    } else if (category === 'hospital-uniforms') {
        const uniformColors = ['#2980b9', '#8e44ad', '#27ae60', '#16a085'];
        coatColor = uniformColors[product.id % uniformColors.length];
        bodySVG = `
        <!-- Uniform Top -->
        <path d="M128 117 Q128 115 133 113 L167 113 Q172 115 172 117 L174 ${gender === 'female' ? '190' : '175'} Q174 ${gender === 'female' ? '193' : '178'} 171 ${gender === 'female' ? '193' : '178'} L129 ${gender === 'female' ? '193' : '178'} Q126 ${gender === 'female' ? '193' : '178'} 126 ${gender === 'female' ? '190' : '175'} Z" fill="${coatColor}"/>
        <!-- Collar -->
        <path d="M140 113 L144 120 L150 115 L156 120 L160 113" fill="${coatColor}" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
        <!-- Sleeves -->
        <path d="M128 117 L110 127 Q106 130 108 155 L116 157 Q118 155 120 145 L128 130 Z" fill="${coatColor}"/>
        <path d="M172 117 L190 127 Q194 130 192 155 L184 157 Q182 155 180 145 L172 130 Z" fill="${coatColor}"/>
        <!-- Hands -->
        <ellipse cx="112" cy="160" rx="6" ry="7" fill="${skinTone}"/>
        <ellipse cx="188" cy="160" rx="6" ry="7" fill="${skinTone}"/>
        ${gender === 'female' ? 
        `<!-- Skirt -->
        <path d="M126 193 L122 250 L178 250 L174 193 Z" fill="${coatColor}" opacity="0.85"/>
        <path d="M150 193 L150 250" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="1"/>` :
        `<!-- Pants -->
        <path d="M126 178 L124 250 L142 250 L148 185 L152 185 L158 250 L176 250 L174 178 Z" fill="#2c3e50"/>`}
        <!-- Name badge -->
        <rect x="155" y="125" width="12" height="8" rx="2" fill="rgba(255,255,255,0.8)"/>
        <rect x="157" y="128" width="8" height="1" fill="${coatColor}" opacity="0.5"/>
        <rect x="157" y="130" width="6" height="1" fill="${coatColor}" opacity="0.3"/>`;
    } else if (category === 'bedsheets') {
        // No person - show folded linens
        bodySVG = `
        <!-- Folded bedsheet -->
        <rect x="95" y="100" width="110" height="80" rx="8" fill="#f8e8e8" stroke="#e0c8c8" stroke-width="1"/>
        <rect x="100" y="105" width="100" height="70" rx="6" fill="#fff5f5"/>
        <path d="M100 125 L200 125" stroke="#f0d0d0" stroke-width="0.5"/>
        <path d="M100 145 L200 145" stroke="#f0d0d0" stroke-width="0.5"/>
        <path d="M100 165 L200 165" stroke="#f0d0d0" stroke-width="0.5"/>
        <!-- Stripe pattern -->
        <rect x="110" y="108" width="4" height="64" fill="#ffb3b3" opacity="0.4"/>
        <rect x="125" y="108" width="4" height="64" fill="#ffb3b3" opacity="0.4"/>
        <rect x="140" y="108" width="4" height="64" fill="#ffb3b3" opacity="0.4"/>
        <rect x="155" y="108" width="4" height="64" fill="#ffb3b3" opacity="0.4"/>
        <rect x="170" y="108" width="4" height="64" fill="#ffb3b3" opacity="0.4"/>
        <rect x="185" y="108" width="4" height="64" fill="#ffb3b3" opacity="0.4"/>
        <!-- Pillow -->
        <ellipse cx="150" cy="210" rx="40" ry="20" fill="#e8f4ff" stroke="#c8dced" stroke-width="1"/>
        <ellipse cx="150" cy="208" rx="35" ry="16" fill="#f0f8ff"/>`;
        faceSVG = ''; eyesSVG = ''; noseMouthSVG = ''; neckSVG = ''; hairSVG = '';
    } else if (category === 'hospital-linen') {
        // Surgical drape/towel
        bodySVG = `
        <rect x="100" y="80" width="100" height="130" rx="5" fill="#e8f8f0" stroke="#b8e0d0" stroke-width="1.5"/>
        <rect x="108" y="88" width="84" height="114" rx="3" fill="#f0fff8"/>
        <!-- Cross/medical symbol -->
        <rect x="140" y="110" width="20" height="60" rx="3" fill="#48cae4" opacity="0.3"/>
        <rect x="125" y="130" width="50" height="20" rx="3" fill="#48cae4" opacity="0.3"/>
        <!-- Fold lines -->
        <path d="M108 120 L192 120" stroke="#d0e8d8" stroke-width="0.5" stroke-dasharray="4,2"/>
        <path d="M108 160 L192 160" stroke="#d0e8d8" stroke-width="0.5" stroke-dasharray="4,2"/>
        <!-- Label -->
        <rect x="125" y="195" width="50" height="12" rx="3" fill="#fff" stroke="#48cae4" stroke-width="0.5"/>
        <text x="150" y="204" font-family="Arial" font-size="7" fill="#48cae4" text-anchor="middle">STERILE</text>`;
        faceSVG = ''; eyesSVG = ''; noseMouthSVG = ''; neckSVG = ''; hairSVG = '';
    } else {
        // Hotel linen
        bodySVG = `
        <rect x="95" y="85" width="110" height="75" rx="6" fill="#fffff0" stroke="#e8dcc0" stroke-width="1.5"/>
        <rect x="100" y="90" width="100" height="65" rx="4" fill="#fffdf5"/>
        <!-- Decorative border -->
        <rect x="105" y="95" width="90" height="55" rx="2" fill="none" stroke="#f0e0a0" stroke-width="0.8"/>
        <rect x="108" y="98" width="84" height="49" rx="1" fill="none" stroke="#f0e0a0" stroke-width="0.3"/>
        <!-- Towel roll -->
        <ellipse cx="150" cy="200" rx="30" ry="18" fill="#fffcf0" stroke="#e8dcc0" stroke-width="1"/>
        <ellipse cx="150" cy="198" rx="27" ry="15" fill="#fffff5"/>
        <path d="M123 198 Q150 190 177 198" fill="none" stroke="#f0e0a0" stroke-width="0.5"/>
        <path d="M126 202 Q150 195 174 202" fill="none" stroke="#f0e0a0" stroke-width="0.5"/>
        <!-- Star rating indicator -->
        <text x="150" y="125" font-family="Arial" font-size="10" fill="#c89f30" text-anchor="middle">★★★★★</text>`;
        faceSVG = ''; eyesSVG = ''; noseMouthSVG = ''; neckSVG = ''; hairSVG = '';
    }
    
    // Thumbs up for some products
    let thumbsUp = '';
    if (product.id % 5 === 0 && (category === 'doctor-coats' || category === 'hospital-uniforms')) {
        thumbsUp = `
        <g transform="translate(185, 145) rotate(-10)">
            <path d="M0 0 Q-2 -8 2 -12 Q5 -14 7 -10 L8 -5 L12 -5 L12 5 L-2 5 Z" fill="${skinTone}" stroke="${skinShadow}" stroke-width="0.5"/>
        </g>`;
    }

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 260">
    <defs>
        <linearGradient id="bg${product.id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${bg[0]}"/>
            <stop offset="100%" style="stop-color:${bg[1]}"/>
        </linearGradient>
        <filter id="shadow${product.id}">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1"/>
        </filter>
    </defs>
    <rect width="300" height="260" fill="url(#bg${product.id})" rx="12"/>
    <g filter="url(#shadow${product.id})">
        ${bodySVG}
        ${neckSVG}
        ${faceSVG}
        ${eyesSVG}
        ${noseMouthSVG}
        ${hairSVG}
        ${thumbsUp}
    </g>
    </svg>`;
    
    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
}

// ===== Product Data (E-commerce Catalog) =====
const productsData = [
    { id: 1, name: "Doctor Coat - Full Sleeve (Gents)", category: "doctor-coats", gender: "male", sleeve: "full", price: 850, oldPrice: 1100, rating: 4.8, reviews: 124, badge: "Bestseller", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Premium full-sleeve doctor coat for men. High-quality wrinkle-resistant cotton blend with professional collar, chest pocket, and two side pockets. Perfect for doctors and medical consultants." },
    { id: 2, name: "Doctor Coat - Half Sleeve (Gents)", category: "doctor-coats", gender: "male", sleeve: "half", price: 750, oldPrice: 950, rating: 4.7, reviews: 89, badge: "", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Comfortable half-sleeve doctor coat for men, ideal for warm climates. Made from breathable premium cotton with a modern fit." },
    { id: 3, name: "Doctor Coat - Full Sleeve (Ladies)", category: "doctor-coats", gender: "female", sleeve: "full", price: 900, oldPrice: 1200, rating: 4.9, reviews: 67, badge: "New", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Elegant full-sleeve doctor coat for women. Premium cotton with feminine tailoring, chest and waist pockets, and reinforced stitching." },
    { id: 4, name: "Doctor Coat - Half Sleeve (Ladies)", category: "doctor-coats", gender: "female", sleeve: "half", price: 800, oldPrice: 1050, rating: 4.8, reviews: 56, badge: "", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Ladies half-sleeve doctor coat with modern fit. Breathable fabric perfect for warm hospital environments. Professional yet comfortable." },
    { id: 5, name: "Lab Coat - Premium (Gents)", category: "doctor-coats", gender: "male", sleeve: "full", price: 920, oldPrice: 1250, rating: 4.9, reviews: 78, badge: "Premium", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Men's premium lab coat crafted from 100% combed cotton. Extra-long design with snap buttons, multiple pockets, and reinforced stitching." },
    { id: 6, name: "Scrub Suit - V Neck Navy (Gents)", category: "scrub-suits", gender: "male", sleeve: "half", price: 650, oldPrice: 850, rating: 4.6, reviews: 203, badge: "Popular", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Professional V-neck scrub suit for men in navy blue. Soft, durable fabric that withstands frequent washing. Comfortable fit for long shifts." },
    { id: 7, name: "Scrub Suit - V Neck (Ladies)", category: "scrub-suits", gender: "female", sleeve: "half", price: 650, oldPrice: 850, rating: 4.7, reviews: 178, badge: "", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Ladies V-neck scrub suit with flattering fit. Available in navy blue, designed for comfort during long surgical procedures." },
    { id: 8, name: "Scrub Suit - Round Neck Green", category: "scrub-suits", gender: "male", sleeve: "half", price: 650, oldPrice: 800, rating: 4.5, reviews: 156, badge: "", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Classic round neck OT scrub suit in surgical green. Breathable fabric with elastic waist pants. Perfect for operation theatre use." },
    { id: 9, name: "Scrub Suit - Maroon (Ladies)", category: "scrub-suits", gender: "female", sleeve: "half", price: 680, oldPrice: 880, rating: 4.7, reviews: 98, badge: "", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Elegant maroon scrub suit for ladies with modern cut. Anti-microbial treated fabric that resists stains." },
    { id: 10, name: "Hospital Uniform - Nurse (Ladies)", category: "hospital-uniforms", gender: "female", sleeve: "half", price: 550, oldPrice: 720, rating: 4.8, reviews: 312, badge: "Bestseller", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Professional nurse uniform in institutional blue for women. Designed for comfort during long duty hours with flattering fit." },
    { id: 11, name: "Hospital Uniform - Ward Boy (Gents)", category: "hospital-uniforms", gender: "male", sleeve: "half", price: 500, oldPrice: 650, rating: 4.4, reviews: 87, badge: "", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Durable ward boy uniform for men designed for daily hospital use. Heavy-duty cotton blend that withstands industrial washing." },
    { id: 12, name: "Hospital Uniform - Office Staff (Gents)", category: "hospital-uniforms", gender: "male", sleeve: "full", price: 600, oldPrice: 780, rating: 4.6, reviews: 145, badge: "", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Smart office staff uniform for men combining professional appearance with comfort. Multiple color combinations available." },
    { id: 13, name: "Hospital Uniform - Office Staff (Ladies)", category: "hospital-uniforms", gender: "female", sleeve: "full", price: 620, oldPrice: 800, rating: 4.7, reviews: 112, badge: "", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Professional office staff uniform for women. Elegant design suitable for front desk and administrative roles." },
    { id: 14, name: "OT Nighty - Green (Ladies)", category: "hospital-uniforms", gender: "female", sleeve: "half", price: 420, oldPrice: 550, rating: 4.5, reviews: 67, badge: "", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "OT nighty in surgical green for ladies. Full-length with short sleeves and back-tie closure. Easy to don and remove." },
    { id: 15, name: "Bedsheet - Candy Striped Pink", category: "bedsheets", price: 350, oldPrice: 450, rating: 4.3, reviews: 234, badge: "", sizes: ["60x90", "60x100", "90x100"], description: "Hospital-grade candy striped bedsheet in pink. Durable cotton that retains color after repeated washing." },
    { id: 16, name: "Bedsheet - Checked Blue", category: "bedsheets", price: 320, oldPrice: 420, rating: 4.5, reviews: 189, badge: "", sizes: ["60x90", "60x100", "90x100"], description: "Blue checked pattern hospital bedsheet. Soft yet durable with reinforced edges." },
    { id: 17, name: "Pillow Cover - Light Blue Set", category: "bedsheets", price: 150, oldPrice: 200, rating: 4.2, reviews: 76, badge: "", sizes: ["Standard", "Large"], description: "Set of 2 light blue pillow covers made from smooth cotton with zipper closure." },
    { id: 18, name: "OT Towel 36\" x 1m", category: "hospital-linen", price: 220, oldPrice: 300, rating: 4.4, reviews: 112, badge: "", sizes: ["36x1m", "36x1.25m", "60x2m"], description: "High-absorbency OT towel ideal for surgical procedures. 100% cotton, lint-free construction, autoclave safe." },
    { id: 19, name: "Surgical Cap & Mask Set", category: "hospital-linen", price: 120, oldPrice: 160, rating: 4.6, reviews: 267, badge: "Popular", sizes: ["Standard", "Large"], description: "Reusable surgical cap and mask set. Breathable cotton with adjustable ties. Can be autoclaved multiple times." },
    { id: 20, name: "Surgeon Apron - Ladies", category: "hospital-linen", gender: "female", sleeve: "half", price: 450, oldPrice: 580, rating: 4.8, reviews: 43, badge: "", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Ladies surgeon apron with wrap-around design. Fluid-resistant fabric with comfortable back ties." },
    { id: 21, name: "Patient Gown - Cotton", category: "hospital-linen", price: 380, oldPrice: 480, rating: 4.3, reviews: 98, badge: "", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Comfortable cotton patient gown with back-open design and tie closures." },
    { id: 22, name: "Hotel Bedsheet - Premium White", category: "hotel-linen", price: 480, oldPrice: 620, rating: 4.9, reviews: 78, badge: "Premium", sizes: ["Single", "Double", "King"], description: "Premium white hotel bedsheet with 300 thread count. Luxuriously soft for upscale hotels." },
    { id: 23, name: "Hotel Towel - Big 60x2m", category: "hotel-linen", price: 350, oldPrice: 450, rating: 4.5, reviews: 134, badge: "", sizes: ["Standard", "Large", "Bath Sheet"], description: "Large hotel bath towel with excellent absorbency. Soft, plush feel with reinforced edges." },
    { id: 24, name: "Orthopedic Surgeon Apron (Gents)", category: "hospital-linen", gender: "male", sleeve: "full", price: 520, oldPrice: 680, rating: 4.9, reviews: 34, badge: "Premium", sizes: ["S", "M", "L", "XL", "XXL", "XXXL"], description: "Heavy-duty orthopedic surgeon apron with full-front protection. Fluid-resistant with comfortable neck strap." },
];

// Generate images for products
productsData.forEach(p => { p.image = generateProductSVG(p); });

// ===== State =====
let cart = JSON.parse(localStorage.getItem('ssa_cart') || '[]');
// Sync cart images with current product data
cart.forEach(item => {
    const product = productsData.find(p => p.id === item.id);
    if (product) item.image = product.image;
});
let displayedProducts = 8;
let currentFilter = 'all';

// ===== DOM Elements =====
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const preloader = document.getElementById('preloader');
const backToTop = document.getElementById('backToTop');
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.hero-prev');
const nextBtn = document.querySelector('.hero-next');
const shopGrid = document.getElementById('shopGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartFooter = document.getElementById('cartFooter');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const searchOverlay = document.getElementById('searchOverlay');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotMessages = document.getElementById('chatbotMessages');

// ===== Preloader =====
window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 800);
});

// ===== Header Scroll =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    if (window.scrollY > 500) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
    revealElements();
});

// ===== Mobile Nav =====
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Active Nav =====
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
    const scrollY = window.scrollY + 150;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
            });
        }
    });
}
window.addEventListener('scroll', updateActiveNav);

// ===== Hero Slider =====
let currentSlide = 0;
let slideInterval;
function showSlide(index) {
    heroSlides.forEach(s => s.classList.remove('active'));
    heroDots.forEach(d => d.classList.remove('active'));
    currentSlide = index;
    if (currentSlide >= heroSlides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = heroSlides.length - 1;
    heroSlides[currentSlide].classList.add('active');
    heroDots[currentSlide].classList.add('active');
}
function startSlideShow() { slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000); }
function resetSlideShow() { clearInterval(slideInterval); startSlideShow(); }
prevBtn.addEventListener('click', () => { showSlide(currentSlide - 1); resetSlideShow(); });
nextBtn.addEventListener('click', () => { showSlide(currentSlide + 1); resetSlideShow(); });
heroDots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); resetSlideShow(); }));
startSlideShow();

// ===== Stats Counter =====
let statsCounted = false;
const statsSection = document.querySelector('.stats');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
            document.querySelectorAll('.stat-number').forEach(stat => {
                const target = parseInt(stat.dataset.target);
                const step = target / 120;
                let current = 0;
                const counter = setInterval(() => {
                    current += step;
                    if (current >= target) { current = target; clearInterval(counter); }
                    stat.textContent = Math.floor(current).toLocaleString() + '+';
                }, 16);
            });
            statsCounted = true;
        }
    });
}, { threshold: 0.5 });
statsObserver.observe(statsSection);

// ===== Shop - Render Products =====
function renderProducts(filter = 'all', count = 8) {
    const filtered = filter === 'all' ? productsData : productsData.filter(p => p.category === filter);
    const toShow = filtered.slice(0, count);
    shopGrid.innerHTML = toShow.map(p => `
        <div class="shop-card reveal active" data-category="${p.category}" data-id="${p.id}">
            ${p.badge ? `<span class="shop-card-badge">${p.badge}</span>` : ''}
            <button class="shop-card-wishlist" aria-label="Wishlist"><i class="far fa-heart"></i></button>
            <div class="shop-card-image" onclick="openProductDetail(${p.id})">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <div class="shop-card-quick">
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); addToCart(${p.id})"><i class="fas fa-cart-plus"></i> Add</button>
                </div>
            </div>
            <div class="shop-card-body" onclick="openProductDetail(${p.id})">
                <span class="shop-card-category">${p.category.replace(/-/g, ' ')}</span>
                ${p.gender ? `<span class="shop-card-tag ${p.gender}">${p.gender === 'male' ? '<i class="fas fa-mars"></i> Gents' : '<i class="fas fa-venus"></i> Ladies'}${p.sleeve ? ' • ' + p.sleeve.charAt(0).toUpperCase() + p.sleeve.slice(1) + ' Sleeve' : ''}</span>` : ''}
                <h4>${p.name}</h4>
                <div class="shop-card-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(Math.floor(p.rating))}${p.rating % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    <span>(${p.reviews})</span>
                </div>
                <div class="shop-card-price">
                    <span class="price">₹${p.price}</span>
                    <span class="old-price">₹${p.oldPrice}</span>
                </div>
                <div class="shop-card-footer" onclick="event.stopPropagation()">
                    <button class="btn btn-primary" onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                    <button class="btn btn-outline-dark" onclick="buyNow(${p.id})"><i class="fas fa-bolt"></i> Buy</button>
                </div>
            </div>
        </div>
    `).join('');

    // Show/hide load more
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (count >= filtered.length) loadMoreBtn.style.display = 'none';
    else loadMoreBtn.style.display = '';
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        displayedProducts = 8;
        renderProducts(currentFilter, displayedProducts);
    });
});

// Category chips
document.querySelectorAll('.cat-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.dataset.category;
        currentFilter = cat;
        displayedProducts = 8;
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
            if (b.dataset.filter === cat) b.classList.add('active');
        });
        renderProducts(currentFilter, displayedProducts);
        document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    });
});

// Load more
document.getElementById('loadMoreBtn').addEventListener('click', () => {
    displayedProducts += 8;
    renderProducts(currentFilter, displayedProducts);
});

// Sort
document.getElementById('sortSelect').addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'price-low') productsData.sort((a, b) => a.price - b.price);
    else if (val === 'price-high') productsData.sort((a, b) => b.price - a.price);
    else if (val === 'newest') productsData.sort((a, b) => b.id - a.id);
    else productsData.sort((a, b) => b.reviews - a.reviews);
    renderProducts(currentFilter, displayedProducts);
});

// Initial render
renderProducts();

// ===== Cart Functions =====
function addToCart(id) {
    const product = productsData.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) existing.qty++;
    else cart.push({ ...product, qty: 1, selectedSize: product.sizes[0] });
    saveCart();
    updateCartUI();
    openCart();
    showToast(`${product.name} added to cart!`);
}

function buyNow(id) {
    addToCart(id);
    openCheckout();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) removeFromCart(id);
        else { saveCart(); updateCartUI(); }
    }
}

function saveCart() { localStorage.setItem('ssa_cart', JSON.stringify(cart)); }

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Your cart is empty</p><a href="#shop" class="btn btn-primary btn-sm" onclick="closeCart()">Start Shopping</a></div>';
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-img"><img src="${item.image}" alt="${item.name}"></div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="item-meta">Size: ${item.selectedSize}</span>
                    <div class="item-price">₹${item.price * item.qty}</div>
                    <div class="cart-item-qty">
                        <button onclick="updateQty(${item.id}, -1)"><i class="fas fa-minus"></i></button>
                        <span>${item.qty}</span>
                        <button onclick="updateQty(${item.id}, 1)"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
        cartFooter.style.display = 'block';
        cartTotal.textContent = `₹${totalPrice.toLocaleString()}`;
    }
}

function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
}

function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
}

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Init cart UI
updateCartUI();

// ===== Search =====
document.getElementById('searchToggle').addEventListener('click', () => searchOverlay.classList.add('active'));
document.getElementById('searchClose').addEventListener('click', () => searchOverlay.classList.remove('active'));

document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const results = document.getElementById('searchResults');
    if (query.length < 2) { results.innerHTML = ''; return; }
    const matches = productsData.filter(p => p.name.toLowerCase().includes(query) || p.category.includes(query));
    results.innerHTML = matches.slice(0, 6).map(p => `
        <div class="search-result-item" onclick="addToCart(${p.id}); document.getElementById('searchOverlay').classList.remove('active');">
            <img src="${p.image}" alt="${p.name}">
            <div>
                <strong>${p.name}</strong>
                <div style="color:#0e4a86; font-weight:600;">₹${p.price}</div>
            </div>
        </div>
    `).join('');
});

// ===== Checkout =====
document.getElementById('checkoutBtn').addEventListener('click', openCheckout);

function openCheckout() {
    closeCart();
    document.getElementById('checkoutModal').classList.add('active');
    nextStep(1);
}

function nextStep(step) {
    // Validate before moving forward
    if (step === 2 && !validateShippingForm()) return;

    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.checkout-steps .step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    document.querySelectorAll('.checkout-steps .step').forEach(s => {
        if (parseInt(s.dataset.step) <= step) s.classList.add('active');
    });
    if (step === 3) renderOrderSummary();
}

// ===== Form Validation =====
function validateShippingForm() {
    const fields = [
        { name: 'firstname', label: 'First Name' },
        { name: 'lastname', label: 'Last Name' },
        { name: 'cphone', label: 'Phone Number' },
        { name: 'cemail', label: 'Email Address' },
        { name: 'address', label: 'Delivery Address' },
        { name: 'city', label: 'City' },
        { name: 'pincode', label: 'PIN Code' }
    ];

    let isValid = true;
    // Clear previous errors
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('.form-group.has-error').forEach(el => el.classList.remove('has-error'));

    fields.forEach(field => {
        const input = document.querySelector(`[name="${field.name}"]`);
        if (!input) return;
        const value = input.value.trim();
        if (!value) {
            isValid = false;
            const group = input.closest('.form-group');
            group.classList.add('has-error');
            const errDiv = document.createElement('span');
            errDiv.className = 'field-error';
            errDiv.textContent = `Please fill in the ${field.label} field`;
            group.appendChild(errDiv);
        }
    });

    // Email format check
    const emailInput = document.querySelector('[name="cemail"]');
    if (emailInput && emailInput.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            isValid = false;
            const group = emailInput.closest('.form-group');
            if (!group.classList.contains('has-error')) {
                group.classList.add('has-error');
                const errDiv = document.createElement('span');
                errDiv.className = 'field-error';
                errDiv.textContent = 'Please enter a valid email address';
                group.appendChild(errDiv);
            }
        }
    }

    // Phone format check
    const phoneInput = document.querySelector('[name="cphone"]');
    if (phoneInput && phoneInput.value.trim()) {
        const phonePattern = /^[+]?[\d\s-]{10,}$/;
        if (!phonePattern.test(phoneInput.value.trim())) {
            isValid = false;
            const group = phoneInput.closest('.form-group');
            if (!group.classList.contains('has-error')) {
                group.classList.add('has-error');
                const errDiv = document.createElement('span');
                errDiv.className = 'field-error';
                errDiv.textContent = 'Please enter a valid phone number (min 10 digits)';
                group.appendChild(errDiv);
            }
        }
    }

    if (!isValid) {
        showToast('Please fill all required fields');
    }
    return isValid;
}

function renderOrderSummary() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('orderSummary').innerHTML = `
        ${cart.map(item => `<div class="os-item"><span>${item.name} x${item.qty}</span><span>₹${item.price * item.qty}</span></div>`).join('')}
        <div class="os-item"><span>Shipping</span><span>${total > 2000 ? 'FREE' : '₹150'}</span></div>
        <div class="os-total"><span>Total</span><span>₹${(total > 2000 ? total : total + 150).toLocaleString()}</span></div>
    `;
}

document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('checkoutModal').classList.remove('active');
});

document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateShippingForm()) {
        nextStep(1);
        return;
    }
    placeOrder();
});

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
}

// ===== Product Detail Modal =====
function openProductDetail(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;
    const discount = Math.round((1 - product.price / product.oldPrice) * 100);
    const modal = document.getElementById('productDetailModal');
    modal.innerHTML = `
        <div class="modal product-detail-modal">
            <button class="modal-close pd-close" onclick="closeProductDetail()"><i class="fas fa-times"></i></button>
            <div class="pd-grid">
                <div class="pd-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="pd-badge">${product.badge}</span>` : ''}
                </div>
                <div class="pd-info">
                    <span class="pd-category">${product.category.replace(/-/g, ' ')}</span>
                    <h2 class="pd-title">${product.name}</h2>
                    <div class="pd-rating">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                        <span>(${product.reviews} reviews)</span>
                    </div>
                    <div class="pd-price">
                        <span class="pd-current-price">₹${product.price}</span>
                        <span class="pd-old-price">₹${product.oldPrice}</span>
                        <span class="pd-discount">${discount}% OFF</span>
                    </div>
                    <p class="pd-description">${product.description || 'Premium quality product from Siva Suresh Agency. Made with the finest materials for durability and comfort.'}</p>
                    <div class="pd-size-section">
                        <h4>Select Size <span class="pd-required">*</span></h4>
                        <div class="pd-sizes" id="pdSizes-${product.id}">
                            ${product.sizes.map((size, i) => `<button class="pd-size-btn ${i === 0 ? 'active' : ''}" data-size="${size}" onclick="selectSize(this, ${product.id})">${size}</button>`).join('')}
                        </div>
                        <span class="pd-size-error" id="sizeError-${product.id}" style="display:none;">Please select a size</span>
                    </div>
                    <div class="pd-qty-section">
                        <h4>Quantity</h4>
                        <div class="pd-qty">
                            <button onclick="changePdQty(-1)"><i class="fas fa-minus"></i></button>
                            <span id="pdQty">1</span>
                            <button onclick="changePdQty(1)"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                    <div class="pd-actions">
                        <button class="btn btn-primary btn-lg" onclick="addToCartFromDetail(${product.id})"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                        <button class="btn btn-outline-dark btn-lg" onclick="buyNowFromDetail(${product.id})"><i class="fas fa-bolt"></i> Buy Now</button>
                    </div>
                    <div class="pd-features">
                        <div class="pd-feature"><i class="fas fa-truck"></i> Free delivery on orders above ₹2000</div>
                        <div class="pd-feature"><i class="fas fa-undo"></i> 7-day return policy</div>
                        <div class="pd-feature"><i class="fas fa-shield-alt"></i> Quality guaranteed</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    modal.classList.add('active');
}

let pdQuantity = 1;
function changePdQty(delta) {
    pdQuantity = Math.max(1, pdQuantity + delta);
    const el = document.getElementById('pdQty');
    if (el) el.textContent = pdQuantity;
}

function selectSize(btn, productId) {
    const container = btn.parentElement;
    container.querySelectorAll('.pd-size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const err = document.getElementById(`sizeError-${productId}`);
    if (err) err.style.display = 'none';
}

function getSelectedSize(productId) {
    const container = document.getElementById(`pdSizes-${productId}`);
    if (!container) return null;
    const active = container.querySelector('.pd-size-btn.active');
    return active ? active.dataset.size : null;
}

function addToCartFromDetail(id) {
    const size = getSelectedSize(id);
    if (!size) {
        document.getElementById(`sizeError-${id}`).style.display = 'block';
        return;
    }
    const product = productsData.find(p => p.id === id);
    const existing = cart.find(item => item.id === id && item.selectedSize === size);
    if (existing) existing.qty += pdQuantity;
    else cart.push({ ...product, qty: pdQuantity, selectedSize: size });
    saveCart();
    updateCartUI();
    showToast(`${product.name} (${size}) added to cart!`);
    closeProductDetail();
    pdQuantity = 1;
}

function buyNowFromDetail(id) {
    const size = getSelectedSize(id);
    if (!size) {
        document.getElementById(`sizeError-${id}`).style.display = 'block';
        return;
    }
    addToCartFromDetail(id);
    openCheckout();
}

function closeProductDetail() {
    document.getElementById('productDetailModal').classList.remove('active');
    pdQuantity = 1;
}

// ===== Toast Notification =====
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:100px;right:20px;background:#0e4a86;color:#fff;padding:12px 24px;border-radius:8px;font-size:0.88rem;font-weight:500;z-index:99999;animation:slideIn 0.3s ease;box-shadow:0 4px 20px rgba(0,0,0,0.15);';
    toast.innerHTML = `<i class="fas fa-check-circle" style="margin-right:8px;"></i>${message}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 2500);
}

// ===== AI Chatbot =====
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotMinimize = document.getElementById('chatbotMinimize');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

chatbotToggle.addEventListener('click', () => {
    chatbotWindow.classList.toggle('open');
    document.querySelector('.chatbot-badge').style.display = 'none';
});

chatbotMinimize.addEventListener('click', () => {
    chatbotWindow.classList.remove('open');
});

// Quick replies
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-reply')) {
        const msg = e.target.dataset.msg;
        sendChatMessage(msg);
    }
});

chatSend.addEventListener('click', () => {
    const msg = chatInput.value.trim();
    if (msg) sendChatMessage(msg);
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const msg = chatInput.value.trim();
        if (msg) sendChatMessage(msg);
    }
});

function sendChatMessage(message) {
    // Add user message
    appendMessage('user', message);
    chatInput.value = '';

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot';
    typingDiv.innerHTML = `<div class="message-avatar"><i class="fas fa-robot"></i></div><div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Simulate AI response
    setTimeout(() => {
        typingDiv.remove();
        const response = getAIResponse(message);
        appendMessage('bot', response);
    }, 1200);
}

function appendMessage(type, text) {
    const div = document.createElement('div');
    div.className = `chat-message ${type}`;
    const icon = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    div.innerHTML = `<div class="message-avatar">${icon}</div><div class="message-content"><p>${text}</p></div>`;
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function getAIResponse(message) {
    const msg = message.toLowerCase();

    // Product queries
    if (msg.includes('product') || msg.includes('what do you') || msg.includes('offer') || msg.includes('sell')) {
        return `We offer a wide range of products:<br><br>
        🥼 <strong>Doctor Coats</strong> - Full & half sleeve<br>
        👔 <strong>Hospital Uniforms</strong> - For all staff<br>
        🩺 <strong>Scrub Suits</strong> - V-neck & round neck<br>
        🛏️ <strong>Bedsheets & Pillow Covers</strong><br>
        🏥 <strong>Hospital Linen</strong> - Surgical items<br>
        🏨 <strong>Hotel Linen</strong> - Premium range<br><br>
        You can browse all products in our <a href="#shop" style="color:#0e4a86;font-weight:600;">Online Shop</a>!`;
    }

    if (msg.includes('price') || msg.includes('cost') || msg.includes('pricing') || msg.includes('rate')) {
        return `Here's our approximate price range:<br><br>
        🥼 Doctor Coats: ₹750 - ₹1,200<br>
        👔 Scrub Suits: ₹580 - ₹850<br>
        👕 Hospital Uniforms: ₹500 - ₹780<br>
        🛏️ Bedsheets: ₹150 - ₹480<br>
        🏥 Hospital Linen: ₹120 - ₹680<br>
        🏨 Hotel Linen: ₹200 - ₹620<br><br>
        💰 <strong>Bulk orders get special discounts!</strong> Contact us for custom quotes.`;
    }

    if (msg.includes('order') || msg.includes('buy') || msg.includes('how to') || msg.includes('purchase')) {
        return `Ordering is easy! Here's how:<br><br>
        1️⃣ Browse products in our <a href="#shop" style="color:#0e4a86;font-weight:600;">Shop</a><br>
        2️⃣ Click "Add to Cart" on items you want<br>
        3️⃣ Open your cart and click "Checkout"<br>
        4️⃣ Fill shipping details & select payment<br>
        5️⃣ Place your order!<br><br>
        We accept <strong>COD, UPI & Bank Transfer</strong>. For bulk orders, please <a href="#contact" style="color:#0e4a86;font-weight:600;">contact us</a> directly.`;
    }

    if (msg.includes('deliver') || msg.includes('shipping') || msg.includes('ship')) {
        return `📦 <strong>Delivery Information:</strong><br><br>
        ✅ We deliver all over India<br>
        ✅ Free shipping on orders above ₹2,000<br>
        ✅ Standard delivery: 3-5 business days<br>
        ✅ Express delivery available for urgent orders<br>
        ✅ Proper packaging for safe delivery<br><br>
        For bulk institutional orders, we offer special logistics support!`;
    }

    if (msg.includes('doctor coat') || msg.includes('lab coat')) {
        return `🥼 <strong>Our Doctor Coats:</strong><br><br>
        • Full sleeve & half sleeve options<br>
        • Premium wrinkle-resistant cotton blend<br>
        • Available in sizes S to XXL<br>
        • Price: ₹750 - ₹1,200<br>
        • White, off-white colors<br><br>
        Perfect for doctors, consultants & medical professionals. <a href="#shop" style="color:#0e4a86;font-weight:600;">Shop Now →</a>`;
    }

    if (msg.includes('scrub') || msg.includes('surgery') || msg.includes('ot dress')) {
        return `🩺 <strong>Our Scrub Suits:</strong><br><br>
        • V-neck & round neck designs<br>
        • Colors: Navy, Green, Maroon, Ink Blue & more<br>
        • Breathable, easy-care fabric<br>
        • Available in S to XXL<br>
        • Price: ₹580 - ₹850<br><br>
        Ideal for surgeons, nurses & OT staff. <a href="#shop" style="color:#0e4a86;font-weight:600;">Browse Scrub Suits →</a>`;
    }

    if (msg.includes('uniform') || msg.includes('nurse') || msg.includes('staff')) {
        return `👔 <strong>Hospital Uniforms:</strong><br><br>
        • Nurse uniforms (Ladies)<br>
        • Ward boy uniforms<br>
        • Office staff uniforms (Gents & Ladies)<br>
        • OT nighty<br>
        • Available in multiple colors<br>
        • Price: ₹500 - ₹780<br><br>
        Custom sizes & colors available on bulk orders!`;
    }

    if (msg.includes('bulk') || msg.includes('wholesale') || msg.includes('institutional')) {
        return `📦 <strong>Bulk Orders:</strong><br><br>
        We specialize in bulk supply for:<br>
        • Hospitals & Clinics<br>
        • Nursing Homes<br>
        • Hotels & Resorts<br>
        • Medical Colleges<br><br>
        ✅ Special bulk pricing<br>
        ✅ Custom manufacturing<br>
        ✅ Dedicated account manager<br><br>
        Call us: <strong>+91 93666 40060</strong> or <a href="#contact" style="color:#0e4a86;font-weight:600;">submit a quote request</a>.`;
    }

    if (msg.includes('contact') || msg.includes('phone') || msg.includes('call') || msg.includes('reach')) {
        return `📞 <strong>Contact Us:</strong><br><br>
        📍 PVT Towers, 37/10, Selvam Nagar, Erode - 638 011<br>
        📱 Siva: +91 93666 40060<br>
        📱 Suresh: +91 93666 40050<br>
        ✉️ sivasureshagency@gmail.com<br>
        ⏰ Mon-Sat: 9AM - 7PM<br><br>
        Or chat with us on <a href="https://wa.me/919366640050" style="color:#25d366;font-weight:600;">WhatsApp</a>!`;
    }

    if (msg.includes('return') || msg.includes('refund') || msg.includes('exchange')) {
        return `🔄 <strong>Returns & Exchange:</strong><br><br>
        • 7-day return policy for manufacturing defects<br>
        • Exchange available for size issues<br>
        • Refund processed within 5-7 days<br>
        • Custom-made items are non-returnable<br><br>
        Contact us at +91 93666 40050 for return requests.`;
    }

    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
        return `Hello! 😊 Welcome to Siva Suresh Agency! How can I help you today? You can ask me about:<br><br>
        • Our products & prices<br>
        • How to order<br>
        • Delivery information<br>
        • Bulk order inquiries<br><br>
        Just type your question!`;
    }

    if (msg.includes('thank') || msg.includes('thanks')) {
        return `You're welcome! 😊 Happy to help. If you have any more questions, feel free to ask anytime. Happy shopping! 🛒`;
    }

    // Default response
    return `Thanks for your message! I can help you with:<br><br>
    • Product information & pricing<br>
    • Ordering assistance<br>
    • Delivery & shipping queries<br>
    • Bulk order inquiries<br>
    • Contact information<br><br>
    Try asking something like "What products do you offer?" or "How to place an order?"<br><br>
    For complex queries, please call us at <strong>+91 93666 40060</strong>.`;
}

// ===== Back to Top =====
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Product Detail Modal Close on Overlay Click =====
document.getElementById('productDetailModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeProductDetail();
});

// ===== Contact Form =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
    btn.style.background = '#2ecc71';
    btn.style.borderColor = '#2ecc71';
    btn.disabled = true;
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.style.borderColor = ''; btn.disabled = false; e.target.reset(); }, 3000);
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== Reveal Animations =====
function revealElements() {
    document.querySelectorAll('.reveal').forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 80) el.classList.add('active');
    });
}
document.querySelectorAll('.service-card, .category-card, .testimonial-card, .about-content, .about-images, .contact-info, .contact-form-wrapper, .stat-item').forEach(el => el.classList.add('reveal'));
revealElements();

// ===== Make functions global for onclick handlers =====
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

// ===== User Authentication System =====
let currentUser = JSON.parse(localStorage.getItem('ssa_user') || 'null');

function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    const authBtnMobile = document.getElementById('authBtnMobile');
    if (currentUser) {
        authBtn.innerHTML = `<i class="fas fa-user-circle"></i>`;
        authBtn.title = currentUser.name;
        authBtn.onclick = openAccountPanel;
    } else {
        authBtn.innerHTML = `<i class="fas fa-user"></i>`;
        authBtn.title = 'Login / Register';
        authBtn.onclick = openLoginModal;
    }
}

function openLoginModal() {
    const modal = document.getElementById('authModal');
    modal.innerHTML = `
    <div class="modal auth-modal">
        <button class="modal-close" onclick="closeAuthModal()"><i class="fas fa-times"></i></button>
        <div class="auth-tabs">
            <button class="auth-tab active" onclick="switchAuthTab('login')">Login</button>
            <button class="auth-tab" onclick="switchAuthTab('register')">Register</button>
        </div>
        <div class="auth-form" id="loginForm">
            <h3><i class="fas fa-sign-in-alt"></i> Welcome Back</h3>
            <p class="auth-subtitle">Login to view your orders and manage your account</p>
            <div class="form-group">
                <label>Email / Phone</label>
                <input type="text" id="loginEmail" placeholder="Enter email or phone number">
                <span class="field-error" id="loginEmailError" style="display:none;"></span>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="loginPassword" placeholder="Enter password">
                <span class="field-error" id="loginPasswordError" style="display:none;"></span>
            </div>
            <button class="btn btn-primary btn-full" onclick="handleLogin()"><i class="fas fa-sign-in-alt"></i> Login</button>
            <p class="auth-switch">Don't have an account? <a onclick="switchAuthTab('register')">Register now</a></p>
        </div>
        <div class="auth-form" id="registerForm" style="display:none;">
            <h3><i class="fas fa-user-plus"></i> Create Account</h3>
            <p class="auth-subtitle">Register to start ordering and track your deliveries</p>
            <div class="form-row">
                <div class="form-group">
                    <label>First Name *</label>
                    <input type="text" id="regFirstName" placeholder="First name">
                    <span class="field-error" id="regFirstNameError" style="display:none;"></span>
                </div>
                <div class="form-group">
                    <label>Last Name *</label>
                    <input type="text" id="regLastName" placeholder="Last name">
                    <span class="field-error" id="regLastNameError" style="display:none;"></span>
                </div>
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" id="regEmail" placeholder="Email address">
                <span class="field-error" id="regEmailError" style="display:none;"></span>
            </div>
            <div class="form-group">
                <label>Phone *</label>
                <input type="tel" id="regPhone" placeholder="Phone number">
                <span class="field-error" id="regPhoneError" style="display:none;"></span>
            </div>
            <div class="form-group">
                <label>Password *</label>
                <input type="password" id="regPassword" placeholder="Create password (min 6 chars)">
                <span class="field-error" id="regPasswordError" style="display:none;"></span>
            </div>
            <div class="form-group">
                <label>Confirm Password *</label>
                <input type="password" id="regConfirmPassword" placeholder="Confirm password">
                <span class="field-error" id="regConfirmPasswordError" style="display:none;"></span>
            </div>
            <button class="btn btn-primary btn-full" onclick="handleRegister()"><i class="fas fa-user-plus"></i> Create Account</button>
            <p class="auth-switch">Already have an account? <a onclick="switchAuthTab('login')">Login here</a></p>
        </div>
    </div>`;
    modal.classList.add('active');
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    if (tab === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
        document.querySelectorAll('.auth-tab')[0].classList.add('active');
    } else {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
        document.querySelectorAll('.auth-tab')[1].classList.add('active');
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Clear errors
    document.getElementById('loginEmailError').style.display = 'none';
    document.getElementById('loginPasswordError').style.display = 'none';
    
    let valid = true;
    if (!email) {
        document.getElementById('loginEmailError').textContent = 'Please enter your email or phone';
        document.getElementById('loginEmailError').style.display = 'block';
        valid = false;
    }
    if (!password) {
        document.getElementById('loginPasswordError').textContent = 'Please enter your password';
        document.getElementById('loginPasswordError').style.display = 'block';
        valid = false;
    }
    if (!valid) return;
    
    // Check registered users
    const users = JSON.parse(localStorage.getItem('ssa_users') || '[]');
    const user = users.find(u => (u.email === email || u.phone === email) && u.password === password);
    
    if (user) {
        currentUser = { name: user.firstName + ' ' + user.lastName, email: user.email, phone: user.phone };
        localStorage.setItem('ssa_user', JSON.stringify(currentUser));
        closeAuthModal();
        updateAuthUI();
        showToast(`Welcome back, ${user.firstName}!`);
    } else {
        document.getElementById('loginPasswordError').textContent = 'Invalid email/phone or password';
        document.getElementById('loginPasswordError').style.display = 'block';
    }
}

function handleRegister() {
    const fields = [
        { id: 'regFirstName', label: 'First Name' },
        { id: 'regLastName', label: 'Last Name' },
        { id: 'regEmail', label: 'Email' },
        { id: 'regPhone', label: 'Phone' },
        { id: 'regPassword', label: 'Password' },
        { id: 'regConfirmPassword', label: 'Confirm Password' }
    ];
    
    let valid = true;
    fields.forEach(f => {
        const el = document.getElementById(f.id);
        const errEl = document.getElementById(f.id + 'Error');
        errEl.style.display = 'none';
        if (!el.value.trim()) {
            errEl.textContent = `Please fill in the ${f.label} field`;
            errEl.style.display = 'block';
            valid = false;
        }
    });
    
    if (!valid) return;
    
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('regEmailError').textContent = 'Please enter a valid email address';
        document.getElementById('regEmailError').style.display = 'block';
        return;
    }
    
    // Phone validation
    if (!/^[+]?[\d\s-]{10,}$/.test(phone)) {
        document.getElementById('regPhoneError').textContent = 'Please enter a valid phone number (min 10 digits)';
        document.getElementById('regPhoneError').style.display = 'block';
        return;
    }
    
    // Password validation
    if (password.length < 6) {
        document.getElementById('regPasswordError').textContent = 'Password must be at least 6 characters';
        document.getElementById('regPasswordError').style.display = 'block';
        return;
    }
    
    if (password !== confirmPassword) {
        document.getElementById('regConfirmPasswordError').textContent = 'Passwords do not match';
        document.getElementById('regConfirmPasswordError').style.display = 'block';
        return;
    }
    
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('ssa_users') || '[]');
    if (users.find(u => u.email === email)) {
        document.getElementById('regEmailError').textContent = 'An account with this email already exists';
        document.getElementById('regEmailError').style.display = 'block';
        return;
    }
    
    // Save user
    users.push({ firstName, lastName, email, phone, password, createdAt: new Date().toISOString() });
    localStorage.setItem('ssa_users', JSON.stringify(users));
    
    // Auto login
    currentUser = { name: firstName + ' ' + lastName, email, phone };
    localStorage.setItem('ssa_user', JSON.stringify(currentUser));
    closeAuthModal();
    updateAuthUI();
    showToast(`Welcome to SSA, ${firstName}! Account created successfully.`);
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function openAccountPanel() {
    const modal = document.getElementById('authModal');
    const orders = JSON.parse(localStorage.getItem('ssa_orders_' + currentUser.email) || '[]');
    
    modal.innerHTML = `
    <div class="modal account-modal">
        <button class="modal-close" onclick="closeAuthModal()"><i class="fas fa-times"></i></button>
        <div class="account-header">
            <div class="account-avatar"><i class="fas fa-user-circle"></i></div>
            <h3>${currentUser.name}</h3>
            <p>${currentUser.email}</p>
        </div>
        <div class="account-tabs">
            <button class="account-tab active" onclick="showAccountTab('orders')"><i class="fas fa-box"></i> My Orders</button>
            <button class="account-tab" onclick="showAccountTab('profile')"><i class="fas fa-user-edit"></i> Profile</button>
        </div>
        <div class="account-content" id="accountOrders">
            ${orders.length === 0 ? `
                <div class="empty-orders">
                    <i class="fas fa-box-open"></i>
                    <p>No orders yet</p>
                    <a href="#shop" class="btn btn-primary btn-sm" onclick="closeAuthModal()">Start Shopping</a>
                </div>
            ` : `
                <div class="orders-list">
                    ${orders.map(order => `
                        <div class="order-card">
                            <div class="order-card-header">
                                <div>
                                    <span class="order-id-label">Order #${order.id}</span>
                                    <span class="order-date">${new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <span class="order-status ${order.status}">${order.status}</span>
                            </div>
                            <div class="order-card-items">
                                ${order.items.map(item => `
                                    <div class="order-item-row">
                                        <span>${item.name} (${item.selectedSize}) x${item.qty}</span>
                                        <span>₹${item.price * item.qty}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="order-card-footer">
                                <span class="order-total">Total: ₹${order.total.toLocaleString()}</span>
                                <span class="order-payment">${order.payment}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
        <div class="account-content" id="accountProfile" style="display:none;">
            <div class="profile-info">
                <div class="profile-row"><label>Name:</label><span>${currentUser.name}</span></div>
                <div class="profile-row"><label>Email:</label><span>${currentUser.email}</span></div>
                <div class="profile-row"><label>Phone:</label><span>${currentUser.phone || 'Not set'}</span></div>
            </div>
        </div>
        <button class="btn btn-outline-dark btn-full" style="margin-top:15px;" onclick="handleLogout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
    </div>`;
    modal.classList.add('active');
}

function showAccountTab(tab) {
    document.querySelectorAll('.account-tab').forEach(t => t.classList.remove('active'));
    if (tab === 'orders') {
        document.getElementById('accountOrders').style.display = 'block';
        document.getElementById('accountProfile').style.display = 'none';
        document.querySelectorAll('.account-tab')[0].classList.add('active');
    } else {
        document.getElementById('accountOrders').style.display = 'none';
        document.getElementById('accountProfile').style.display = 'block';
        document.querySelectorAll('.account-tab')[1].classList.add('active');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('ssa_user');
    closeAuthModal();
    updateAuthUI();
    showToast('Logged out successfully');
}

// Override order placement to save to user's orders
function placeOrder() {
    if (!currentUser) {
        closeCheckoutModal();
        openLoginModal();
        showToast('Please login to place an order');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const paymentMethod = document.querySelector('[name="payment"]:checked');
    const order = {
        id: 'SSA' + Date.now().toString(36).toUpperCase(),
        date: new Date().toISOString(),
        items: cart.map(item => ({ name: item.name, selectedSize: item.selectedSize, qty: item.qty, price: item.price })),
        total: total > 2000 ? total : total + 150,
        payment: paymentMethod ? paymentMethod.value.toUpperCase() : 'COD',
        status: 'Processing'
    };
    
    // Save to user's orders
    const orderKey = 'ssa_orders_' + currentUser.email;
    const orders = JSON.parse(localStorage.getItem(orderKey) || '[]');
    orders.unshift(order);
    localStorage.setItem(orderKey, JSON.stringify(orders));
    
    // Show success
    document.getElementById('checkoutModal').classList.remove('active');
    document.getElementById('orderId').textContent = order.id;
    document.getElementById('successModal').classList.add('active');
    cart = [];
    saveCart();
    updateCartUI();
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('active');
}

// Init auth UI
updateAuthUI();

// Click outside to close auth modal
document.getElementById('authModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeAuthModal();
});

// Make new functions global
window.openLoginModal = openLoginModal;
window.switchAuthTab = switchAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.closeAuthModal = closeAuthModal;
window.openAccountPanel = openAccountPanel;
window.showAccountTab = showAccountTab;
window.handleLogout = handleLogout;
window.placeOrder = placeOrder;
window.closeCheckoutModal = closeCheckoutModal;
