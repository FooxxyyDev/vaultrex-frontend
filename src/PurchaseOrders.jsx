import React, { useState } from "react";
import { getPOsWithVendor, sendPO, receiveToPO } from "./store";
import { getRole, canSendPO, canReceivePO } from "./auth";

export default function PurchaseOrders() {
  const [tick, setTick] = useState(0);
  const pos = getPOsWithVendor();
  const role = getRole();

  function onSend(poId) {
    sendPO(poId);
    setTick((t) => t + 1);
  }

  function onReceive(poId) {
    const po = pos.find((p) => p.id === poId);
    if (!po) return;
    receiveToPO(poId, po.lines);
    setTick((t) => t + 1);
  }

  return (
    <div className="dashboard">
      <h2>Inköpsorder</h2>
      {pos.length === 0 && <p>Inga POs ännu. De skapas automatiskt vid låg nivå.</p>}
      <div className="services-grid">
        {pos.map((po) => (
          <div key={po.id} className="service-card" style={{ textAlign: "left" }}>
            <h3>PO {po.id}</h3>
            <p>Leverantör: {po.vendor?.name || po.vendorId}</p>
            <p>Status: {po.status}</p>
            <ul>
              {po.lines.map((l, idx) => (
                <li key={idx}>{l.productId} × {l.qty}</li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 8 }}>
              {po.status === "draft" && canSendPO(role) && <button className="btn btn-outline" onClick={() => onSend(po.id)}>Skicka</button>}
              {(po.status === "draft" || po.status === "sent") && canReceivePO(role) && <button className="btn btn-primary" onClick={() => onReceive(po.id)}>Mottag</button>}
              <button className="btn" onClick={() => exportPOCSV(po)}>Export CSV</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function exportPOCSV(po) {
  // Simple CSV: PO header then lines
  const rows = [
    ["PO", po.id],
    ["Vendor", po.vendor?.name || po.vendorId],
    ["Status", po.status],
    [],
    ["productId", "qty"],
    ...po.lines.map((l) => [l.productId, l.qty]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `PO-${po.id}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}


