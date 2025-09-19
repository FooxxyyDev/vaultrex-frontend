import React, { useState, useEffect } from "react";
import "./App.css";
import QrReader from "react-qr-reader";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(false);

  const BACKEND_URL = "https://vaultrex-backend.onrender.com";

  // LOGIN
  const login = async () => {
    const res = await fetch(`${BACKEND_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      fetchInventory(data.user.id);
    } else {
      setMessage(data.message || "Fel inloggning");
    }
  };

  // Hämta inventory
  const fetchInventory = async (userId) => {
    const res = await fetch(`${BACKEND_URL}/api/inventory/${userId}`);
    const data = await res.json();
    if (data.success) setInventory(data.items);
  };

  // QR-scan
  const handleScan = async (data) => {
    if (data) {
      const itemId = parseInt(data);
      const res = await fetch(`${BACKEND_URL}/api/inventory/use`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, amount: 1 })
      });
      const result = await res.json();
      if (result.success) {
        setInventory((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, quantity: result.item.quantity } : item
          )
        );
        setMessage(`Använde 1 av ${result.item.name}`);
      }
      setScanning(false);
    }
  };

  const handleError = (err) => console.error(err);

  if (!user) {
    return (
      <div className="login-container">
        <h1>Login</h1>
        {message && <p className="error">{message}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Logga in</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Välkommen {user.email}</h1>
      <button onClick={() => setScanning(!scanning)}>
        {scanning ? "Stäng QR Scanner" : "Scanna QR"}
      </button>
      {scanning && <QrReader delay={300} onError={handleError} onScan={handleScan} />}
      <h2>Inventory</h2>
      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            {item.name}: {item.quantity}
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
}
