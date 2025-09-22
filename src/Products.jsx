import React, { useMemo, useState } from "react";
import { getProducts, getLowStockProducts, upsertProduct } from "./store";

export default function Products() {
  const [tick, setTick] = useState(0);
  const products = useMemo(() => getProducts(), [tick]);
  const low = useMemo(() => getLowStockProducts(), [tick]);

  function onQuickInc(productId) {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    upsertProduct({ ...p, onHand: (p.onHand || 0) + 1 });
    setTick((t) => t + 1);
  }

  return (
    <div className="dashboard">
      <h2>Produkter</h2>
      {low.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <strong>Låg nivå:</strong> {low.map((p) => p.name).join(", ")}
        </div>
      )}
      <div className="services-grid">
        {products.map((p) => (
          <div key={p.id} className="service-card" style={{ textAlign: "left" }}>
            <h3>{p.name}</h3>
            <p>SKU: {p.sku}</p>
            <p>Lagersaldo: {p.onHand}</p>
            <p>Min nivå: {p.minStock} | Omorder: {p.reorderQty}</p>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={!!p.autoReorder}
              onChange={(e) => {
                upsertProduct({ ...p, autoReorder: e.target.checked });
                setTick((t) => t + 1);
              }}
            />
            Auto‑PO
          </label>
            <button className="btn btn-outline" onClick={() => onQuickInc(p.id)}>+1</button>
          </div>
        ))}
      </div>
    </div>
  );
}


