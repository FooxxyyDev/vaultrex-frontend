import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inventory, setInventory] = useState([]);
  const [services, setServices] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [activeTab, setActiveTab] = useState("inventory");

  const API = "https://vaultrex-backend.onrender.com";

  // --- LOGIN ---
  const handleLogin = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      fetchInventory(data.user.id);
      fetchServices(data.user.id);
    } else {
      alert("Fel e-post eller lösenord");
    }
  };

  // --- LOGOUT ---
  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
    setInventory([]);
    setServices([]);
  };

  // --- FETCH INVENTORY ---
  const fetchInventory = async (userId) => {
    const res = await fetch(`${API}/inventory/${userId}`);
    const data = await res.json();
    setInventory(data);
  };

  // --- QR-SCAN (minska antal) ---
  const handleScan = async (itemId) => {
    const qty = parseInt(prompt("Hur många ska dras av?"), 10);
    if (isNaN(qty) || qty <= 0) return;
    const res = await fetch(`${API}/inventory/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity: qty }),
    });
    const data = await res.json();
    if (data.success) fetchInventory(user.id);
    else alert("Fel vid uppdatering");
  };

  // --- FETCH SERVICES ---
  const fetchServices = async (userId) => {
    const res = await fetch(`${API}/services/${userId}`);
    const data = await res.json();
    setServices(data);
  };

  // --- UPDATE PASSWORD ---
  const handlePasswordChange = async () => {
    const res = await fetch(`${API}/settings/password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, newPassword }),
    });
    const data = await res.json();
    if (data.success) alert("Lösenord uppdaterat");
    else alert("Fel vid uppdatering");
    setNewPassword("");
  };

  // --- RENDER ---
  if (!user) {
    return (
      <div className="login-container">
        <h1>Vaultrex Login</h1>
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
        <h1>Vaultrex Dashboard</h1>
        <button onClick={handleLogout}>Logga ut</button>
      </header>

      <nav>
        <button onClick={() => setActiveTab("inventory")}>Inventory</button>
        <button onClick={() => setActiveTab("services")}>Mina tjänster</button>
        <button onClick={() => setActiveTab("settings")}>Inställningar</button>
      </nav>

      <main>
        {activeTab === "inventory" && (
          <div className="inventory">
            <h2>Inventory</h2>
            {inventory.map((item) => (
              <div key={item.id} className="inventory-item">
                <span>{item.name} - {item.quantity}</span>
                <button onClick={() => handleScan(item.id)}>Scan QR</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "services" && (
          <div className="services">
            <h2>Mina tjänster</h2>
            {services.map((s) => (
              <div key={s.id} className="service-item">
                <span>{s.name} - {s.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings">
            <h2>Inställningar</h2>
            <input
              type="password"
              placeholder="Nytt lösenord"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handlePasswordChange}>Byt lösenord</button>
          </div>
        )}
      </main>
    </div>
  );
}
