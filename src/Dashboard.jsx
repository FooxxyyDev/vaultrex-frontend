import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { getLowStockProducts, getInventoryMoves } from "./store";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const low = getLowStockProducts();
  const moves = getInventoryMoves();

  useEffect(() => {
    fetch("https://vaultrex-backend.onrender.com/inventory")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        const total = data.reduce((sum, item) => sum + item.quantity, 0);
        setTotalQuantity(total);
      })
      .catch((err) => console.error("Error fetching inventory:", err));
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Total items: {items.length}</p>
      <p>Total quantity: {totalQuantity}</p>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={items}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00ffff" />
            <XAxis dataKey="name" stroke="#00ffff" />
            <YAxis stroke="#00ffff" />
            <Tooltip />
            <Bar dataKey="quantity" fill="#00ffff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <div className="service-card" style={{ textAlign: "left" }}>
          <h3>Låg nivå</h3>
          {low.length === 0 ? <p>Inga låga nivåer 🎉</p> : (
            <ul>
              {low.map((p) => (
                <li key={p.id}>{p.name} — saldo {p.onHand} (min {p.minStock})</li>
              ))}
            </ul>
          )}
        </div>
        <div className="service-card" style={{ textAlign: "left" }}>
          <h3>Senaste rörelser</h3>
          {moves.length === 0 ? <p>Inga rörelser ännu</p> : (
            <ul>
              {moves.map((m) => (
                <li key={m.id}>{m.createdAt.slice(0,16).replace('T',' ')} — {m.reason} {m.qtyChange} på {m.productId}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
