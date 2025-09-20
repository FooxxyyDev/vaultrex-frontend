import React, { useState, useEffect } from "react";
import { QRScanner } from "@yudiel/react-qr-scanner";
import "./App.css";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState("inventory");
  const [scanResult, setScanResult] = useState("");

  const API_URL = "https://vaultrex-backend.onrender.com";

  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      setLoggedIn(true);
      setUser(data.user);
      // hämta inventory osv
      fetch(`${API_URL}/inventory/${data.user.id}`)
        .then(r => r.json())
        .then(setInventory);
    } else {
      alert("Fel email eller lösenord");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
    setInventory([]);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="app">
      {!loggedIn ? (
        <div className="landing">
          <header>
            <h1>Vaultrex</h1>
            <nav>
              <button onClick={() => setShowLogin(false)}>Hem</button>
              <button onClick={() => setShowLogin(false)}>Tjänster</button>
              <button onClick={() => setShowLogin(false)}>FAQ</button>
              <button onClick={() => setShowLogin(true)}>Logga in</button>
            </nav>
          </header>

          {!showLogin ? (
            <main>
              <section className="hero">
                <h2>Välkommen till Vaultrex</h2>
                <p>Smart inventariehantering med QR-koder</p>
              </section>
              <section id="services">
                <h3>Tjänster</h3>
                <ul>
                  <li>Inventariehantering</li>
                  <li>Automatisk beställning</li>
                  <li>QR-skanning</li>
                </ul>
              </section>
              <section id="faq">
                <h3>FAQ</h3>
                <p><b>Hur fungerar tjänsten?</b> Du loggar in och hanterar dina produkter.</p>
              </section>
            </main>
          ) : (
            <main className="login-section">
              <h2>Logga in</h2>
              <input
                type="email"
                placeholder="Email"
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
            </main>
          )}
        </div>
      ) : (
        <div className="dashboard">
          <header>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Logga ut</button>
          </header>
          <nav className="tabs">
            <button onClick={() => setActiveTab("inventory")}>Inventarier</button>
            <button onClick={() => setActiveTab("services")}>Tjänster</button>
            <button onClick={() => setActiveTab("scanner")}>QR-skanner</button>
          </nav>
          <main>
            {activeTab === "inventory" && (
              <section>
                <h2>Dina produkter</h2>
                <ul>
                  {inventory.map(item => (
                    <li key={item.id}>{item.name} ({item.quantity})</li>
                  ))}
                </ul>
              </section>
            )}
            {activeTab === "services" && (
              <section>
                <h2>Dina tjänster</h2>
                {/* placeholder */}
              </section>
            )}
            {activeTab === "scanner" && (
              <section>
                <h2>QR-skanner</h2>
                <QRScanner
                  onResult={(result, error) => {
                    if (!!result) {
                      setScanResult(result.text);
                      // här kan du skicka till backend för att minska inventarie
                    }
                  }}
                />
                {scanResult && <p>Resultat: {scanResult}</p>}
              </section>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
