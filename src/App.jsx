import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [scanQty, setScanQty] = useState(1);

  const API_URL = "https://vaultrex-backend.onrender.com"; // backend URL

  // Login
  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      fetchInventory(data.user.id);
    } else {
      alert(data.message || "Fel inloggning");
    }
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    setInventory([]);
    setEmail("");
    setPassword("");
  };

  // Fetch inventory
  const fetchInventory = async (userId) => {
    const res = await fetch(`${API_URL}/inventory/${userId}`);
    const data = await res.json();
    setInventory(data);
  };

  // QR scan / dra av antal
  const handleScan = async (itemId) => {
    const res = await fetch(`${API_URL}/inventory/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity: scanQty }),
    });
    const data = await res.json();
    if (data.success) {
      setInventory((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity: data.newQuantity } : i))
      );
    }
  };

  if (!user) {
    return (
      <div className="login-container">
        <h2>Vaultrex Login</h2>
        <input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Logga in</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Vaultrex Inventory</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logga ut
        </button>
      </header>

      <div className="inventory-section">
        <h2>Dina artiklar</h2>
        <label>
          Scan quantity:
          <input
            type="number"
            value={scanQty}
            onChange={(e) => setScanQty(parseInt(e.target.value))}
            min="1"
          />
        </label>
        <table>
          <thead>
            <tr>
              <th>Artikel</th>
              <th>Antal</th>
              <th>QR Scan</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
                  <button onClick={() => handleScan(item.id)}>Scan QR</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
