// Simple in-memory store with localStorage persistence for MVP

const STORAGE_KEY = "vaultrex_store_v1";

function loadInitialData() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch (_) {}
  }
  const now = new Date().toISOString();
  const initial = {
    products: [
      { id: "sku-1001", sku: "1001", name: "Nitrilhandskar M", onHand: 24, minStock: 20, reorderQty: 50, vendorId: "v-axn", barcode: "1001" },
      { id: "sku-1002", sku: "1002", name: "Nitrilhandskar L", onHand: 12, minStock: 20, reorderQty: 50, vendorId: "v-axn", barcode: "1002" },
      { id: "sku-2001", sku: "2001", name: "Alkogel 500ml", onHand: 8, minStock: 10, reorderQty: 24, vendorId: "v-med", barcode: "2001" },
    ],
    vendors: [
      { id: "v-axn", name: "AxNord AB", leadTimeDays: 5 },
      { id: "v-med", name: "MedSupply", leadTimeDays: 7 },
    ],
    purchaseOrders: [
      // { id, vendorId, status: "draft|sent|received|closed", lines: [{ productId, qty }], createdAt, eta }
    ],
    inventoryMoves: [
      // { id, productId, qtyChange, reason: "consume|receive|adjust|transfer", createdAt, note }
    ],
    createdAt: now,
    updatedAt: now,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

let store = loadInitialData();

function save() {
  store.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

// Queries
export function getProducts() {
  return [...store.products];
}

export function getVendors() {
  return [...store.vendors];
}

export function getPurchaseOrders() {
  return [...store.purchaseOrders];
}

export function getLowStockProducts() {
  return store.products.filter((p) => p.onHand <= p.minStock);
}

export function findProductByCode(code) {
  return store.products.find((p) => p.barcode === code || p.sku === code || p.id === code);
}

// Commands
export function adjustInventory(productId, qtyChange, reason = "adjust", note = "") {
  const product = store.products.find((p) => p.id === productId);
  if (!product) return null;
  product.onHand = Math.max(0, (product.onHand || 0) + qtyChange);
  const move = { id: uid("mv"), productId, qtyChange, reason, createdAt: new Date().toISOString(), note };
  store.inventoryMoves.push(move);
  maybeAutoCreatePO(product);
  save();
  return { product: { ...product }, move };
}

export function consumeByCode(code, qty = 1) {
  const product = findProductByCode(code);
  if (!product) return { error: "Product not found" };
  return adjustInventory(product.id, -Math.abs(qty), "consume", `QR consume ${code}`);
}

export function receiveToPO(poId, lines) {
  const po = store.purchaseOrders.find((p) => p.id === poId);
  if (!po) return { error: "PO not found" };
  for (const line of lines) {
    adjustInventory(line.productId, line.qty, "receive", `PO ${poId}`);
  }
  po.status = "received";
  save();
  return { po: { ...po } };
}

export function createPOForVendor(vendorId, lines) {
  const po = {
    id: uid("po"),
    vendorId,
    status: "draft",
    lines: lines.map((l) => ({ productId: l.productId, qty: l.qty })),
    createdAt: new Date().toISOString(),
    eta: null,
  };
  store.purchaseOrders.push(po);
  save();
  return { ...po };
}

function maybeAutoCreatePO(product) {
  if (product.onHand > product.minStock) return;
  const existingOpen = store.purchaseOrders.find((po) => (po.status === "draft" || po.status === "sent") && po.lines.some((l) => l.productId === product.id));
  if (existingOpen) return;
  const vendorId = product.vendorId;
  const qty = Math.max(product.reorderQty || 1, 1);
  createPOForVendor(vendorId, [{ productId: product.id, qty }]);
}

// Simple selectors for UI
export function getPOsWithVendor() {
  const vendorsById = Object.fromEntries(store.vendors.map((v) => [v.id, v]));
  return getPurchaseOrders().map((po) => ({ ...po, vendor: vendorsById[po.vendorId] }));
}

export function getInventoryMoves() {
  return [...store.inventoryMoves].slice(-50).reverse();
}

export function resetStore() {
  localStorage.removeItem(STORAGE_KEY);
  store = loadInitialData();
  return store;
}

export function upsertProduct(product) {
  const idx = store.products.findIndex((p) => p.id === product.id);
  if (idx >= 0) store.products[idx] = { ...store.products[idx], ...product };
  else store.products.push({ ...product, id: product.id || uid("sku") });
  save();
}

export function upsertVendor(vendor) {
  const idx = store.vendors.findIndex((v) => v.id === vendor.id);
  if (idx >= 0) store.vendors[idx] = { ...store.vendors[idx], ...vendor };
  else store.vendors.push({ ...vendor, id: vendor.id || uid("v") });
  save();
}

export function sendPO(poId) {
  const po = store.purchaseOrders.find((p) => p.id === poId);
  if (!po) return { error: "PO not found" };
  po.status = "sent";
  save();
  return { ...po };
}


