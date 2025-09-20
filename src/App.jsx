import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState("inventory");
  const [inventory, setInventory] = useState([]);
  const [services, setServices] = useState([]);
  const [scanResult, setScanResult] = useState("");

  // Inloggning
  const handleLogin = async () => {
    try {
      const res = await fetch("https://vaultrex-backend.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        fetchInventory();
        fetchServices();
      } else {
        alert("Fel email eller lösenord");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
    setTab("inventory");
  };

  // Hämta inventory
  const fetchInventory = async () => {
    if (!user) return;
    const res = await fetch(`https://vaultrex-backend.onrender.com/inventory/${user.id}`);
    const data = await res.json();
    setInventory(data);
  };

  // Hämta services
  const fetchServices = async () => {
    if (!user) return;
    const res = await fetch(`https://vaultrex-backend.onrender.com/services/${user.id}`);
    const data = await res.json();
    setServices(data);
  };

  // QR Scan
  const handleScan = async (code) => {
    if (!code) return;
    setScanResult(code);

    try {
      await fetch("https://vaultrex-backend.onrender.com/inventory/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, code }),
      });
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Vaultrex Inventory</h1>
        {user && <button className="logout-btn" onClick={handleLogout}>Logga ut</button>}
      </header>

      {!user ? (
        <div className="login-panel">
          <h2>Logga in</h2>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Lösenord" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Logga in</button>
        </div>
      ) : (
        <div className="dashboard">
          <nav>
            <button onClick={() => setTab("inventory")} className={tab === "inventory" ? "active" : ""}>Inventory</button>
            <button onClick={() => setTab("services")} className={tab === "services" ? "active" : ""}>Tjänster</button>
            <button onClick={() => setTab("qr")} className={tab === "qr" ? "active" : ""}>QR Scanner</button>
          </nav>

          <main>
            {tab === "inventory" && (
              <div className="tab-content">
                <h2>Inventory</h2>
                <ul>
                  {inventory.map((item) => (
                    <li key={item.id}>{item.name}: {item.quantity}</li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "services" && (
              <div className="tab-content">
                <h2>Mina Tjänster</h2>
                <ul>
                  {services.map((s) => (
                    <li key={s.id}>{s.name} - {s.status}</li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "qr" && (
              <div className="tab-content">
                <h2>QR Scanner</h2>
                <Scanner
                  onResult={(r) => handleScan(r?.text)}
                  onError={(err) => console.error(err)}
                  style={{ width: "300px", margin: "20px auto" }}
                />
                {scanResult && <p>Senaste kod: {scanResult}</p>}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
