(function (global) {
    function isProductRecordActive(product) {
        if (!product || typeof product !== 'object') return false;
        if (product.deleted === true || product.isActive === false || product.active === false || product.archived === true) return false;
        const status = String(product.status || '').trim().toLowerCase();
        if (status === 'inactive' || status === 'archived' || status === 'deleted') return false;
        // Hide products with no price or ₹0 price — they are incomplete/not ready for sale
        const price = parseFloat(product.price);
        if (!price || price <= 0) return false;
        return true;
    }

    function getVisibleProducts(products) {
        if (!Array.isArray(products)) return [];
        return products.filter(isProductRecordActive);
    }

    function getProductIdentity(product) {
        if (!product || typeof product !== 'object') return '';
        const name = String(product.name || '').trim();
        if (name) return name;
        return String(product.id || '').trim();
    }

    function isInventoryItemActive(item, activeProductNames) {
        if (!item || typeof item !== 'object') return false;
        const name = String(item.productName || item.product || '').trim();
        if (!name) return false;
        if (!Array.isArray(activeProductNames)) return true;
        return activeProductNames.includes(name);
    }

    const api = {
        isProductRecordActive,
        getVisibleProducts,
        getProductIdentity,
        isInventoryItemActive
    };

    global.ssaProductHelpers = api;
    global.isProductRecordActive = isProductRecordActive;
    global.getVisibleProducts = getVisibleProducts;
    global.getProductIdentity = getProductIdentity;
    global.isInventoryItemActive = isInventoryItemActive;
})(typeof window !== 'undefined' ? window : globalThis);
