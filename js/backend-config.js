// Backend configuration
// Fill these from Supabase Project Settings > API.
window.SSA_BACKEND = {
    provider: 'supabase',
    supabaseUrl: 'https://kyzlxhncnqahlpfhtoky.supabase.co',
    supabaseAnonKey: 'sb_publishable_0hcswuIONUUJPdBl7RRIHw_JH7MsGeK',
    storageBucket: 'assets',
    authResetApiBase: 'https://us-central1-siva-suresh-agency.cloudfunctions.net/ssa'
};

// Razorpay configuration
// KEY ID is safe to expose in client-side code (per Razorpay docs).
// SECRET must NEVER go here — it is server-side only (needed only if you
// create Razorpay orders via API from a backend/Firebase Function).
window.SSA_RAZORPAY = {
    // ── TEST KEYS (replace with live keys when going to production) ──
    keyId: 'rzp_test_TI67q5KZaLNQgp',
    // keyId: 'rzp_live_XXXXXXXXXXXXXXXX',  // ← swap here for production
    // SECRET — keep this in your backend env only, NEVER in client JS:
    // secret: 'Hse2YynxbXqfPsefDnzQ4JIa'  // rzp_test secret (DO NOT COMMIT)
    businessName: 'Siva Suresh Agency',
    description: 'Hospital Linen & Medical Uniforms',
    themeColor: '#0d9488',
    logo: 'images/SSA Logo.png'
};
