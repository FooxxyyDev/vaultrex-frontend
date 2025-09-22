import React from "react";
import { getVendors } from "./store";

export default function Vendors() {
  const vendors = getVendors();
  return (
    <div className="dashboard">
      <h2>Leverantörer</h2>
      <div className="services-grid">
        {vendors.map((v) => (
          <div key={v.id} className="service-card" style={{ textAlign: "left" }}>
            <h3>{v.name}</h3>
            <p>Ledtid: {v.leadTimeDays} dagar</p>
            <p>ID: {v.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


