// ===== Firebase Integration for Customer Site =====
// fireDb is set by js/firebase-db.js (module) which targets named DB "sivasureshagency"
// fsServerTimestamp and fsIncrement are also set by firebase-db.js

// ── Helper: ensure anonymous Firebase auth ───────────────────────────
async function _ensureAuth() {
    if (!window.auth) return;
    try { await window.auth.signInAnonymously(); } catch (e) { /* already signed in or disabled */ }
}

// ── Helper: mark an order as synced in localStorage ─────────────────
function _markSynced(orderId, userEmail) {
    const key = 'ssa_orders_' + userEmail;
    try {
        const orders = JSON.parse(localStorage.getItem(key) || '[]');
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx !== -1) { orders[idx]._synced = true; localStorage.setItem(key, JSON.stringify(orders)); }
    } catch (e) {}
}

// ===== Save Order to Firestore =====
async function saveOrderToFirebase(order, shippingDetails) {
    try {
        if (!window.fireDb) throw new Error('Firebase not initialised');
        await _ensureAuth();

        await fireDb.collection('orders').add({
            orderId: order.id,
            customerName: shippingDetails.firstname + ' ' + shippingDetails.lastname,
            customerEmail: shippingDetails.email,
            customerPhone: shippingDetails.phone,
            address: shippingDetails.address,
            city: shippingDetails.city,
            pincode: shippingDetails.pincode,
            items: order.items,
            total: order.total,
            payment: order.payment,
            status: 'Processing',
            trackingId: '',
            createdAt: fsServerTimestamp(),
            updatedAt: fsServerTimestamp()
        });

        // Mark as synced in localStorage so syncPendingOrders skips it
        _markSynced(order.id, shippingDetails.email);

        // Update or create customer record
        const customerRef = fireDb.collection('customers');
        const existingCustomer = await customerRef.where('email', '==', shippingDetails.email).get();
        if (existingCustomer.empty) {
            await customerRef.add({
                name: shippingDetails.firstname + ' ' + shippingDetails.lastname,
                email: shippingDetails.email,
                phone: shippingDetails.phone,
                orderCount: 1,
                totalSpent: order.total,
                createdAt: fsServerTimestamp()
            });
        } else {
            const doc = existingCustomer.docs[0];
            await doc.ref.update({
                orderCount: fsIncrement(1),
                totalSpent: fsIncrement(order.total),
                phone: shippingDetails.phone
            });
        }
    } catch (err) {
        console.error('Firebase order save error:', err);
        // Will be retried automatically by syncPendingOrders on next page load
    }
}

// ===== Auto-sync: push any unsynced localStorage orders to Firestore =====
async function syncPendingOrders(userEmail, userName, userPhone) {
    if (!window.fireDb || !userEmail) return;
    const key = 'ssa_orders_' + userEmail;
    let orders;
    try { orders = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return; }
    const pending = orders.filter(o => !o._synced);
    if (!pending.length) return;

    await _ensureAuth();

    let changed = false;
    for (const order of pending) {
        try {
            // Avoid duplicates: check if already in Firestore
            const existing = await fireDb.collection('orders').where('orderId', '==', order.id).get();
            if (!existing.empty) {
                order._synced = true; changed = true; continue;
            }
            // Push to Firestore
            await fireDb.collection('orders').add({
                orderId:       order.id,
                customerName:  userName  || '',
                customerEmail: userEmail,
                customerPhone: userPhone || '',
                address: '', city: '', pincode: '',
                items:   order.items  || [],
                total:   order.total  || 0,
                payment: order.payment || 'COD',
                status:  order.status  || 'Processing',
                trackingId: '',
                createdAt: fsServerTimestamp(),
                updatedAt: fsServerTimestamp()
            });
            order._synced = true; changed = true;
        } catch (e) {
            console.warn('Sync failed for order', order.id, e.message);
            // Will retry on next page load
        }
    }
    if (changed) {
        // Write back with _synced flags
        const all = JSON.parse(localStorage.getItem(key) || '[]');
        for (const p of pending) {
            const idx = all.findIndex(o => o.id === p.id);
            if (idx !== -1) all[idx]._synced = p._synced;
        }
        localStorage.setItem(key, JSON.stringify(all));
    }
}

// ===== Save Customer Registration to Firestore =====
async function saveCustomerToFirebase(customerData) {
    try {
        await _ensureAuth();
        const existing = await fireDb.collection('customers').where('email', '==', customerData.email).get();
        if (existing.empty) {
            await fireDb.collection('customers').add({
                name: customerData.firstName + ' ' + customerData.lastName,
                email: customerData.email,
                phone: customerData.phone,
                orderCount: 0,
                totalSpent: 0,
                createdAt: fsServerTimestamp()
            });
        }
    } catch (err) {
        console.error('Firebase customer save error:', err);
    }
}

// Expose to global scope
window.saveOrderToFirebase   = saveOrderToFirebase;
window.saveCustomerToFirebase = saveCustomerToFirebase;
window.syncPendingOrders      = syncPendingOrders;

