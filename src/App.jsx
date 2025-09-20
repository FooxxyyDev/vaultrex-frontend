import React, { useState, useEffect } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [scanResult, setScanResult] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "https://vaultrex-backend.onrender.com";

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/inventory/${user.id}`)
        .then((res) => res.json())
        .then((data) => setInventory(data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Fel inloggningsuppgifter");
        } else {
          setUser(data.user);
          setActiveTab("inventory");
        }
      })
      .catch(() => alert("Serverfel vid inloggning"));
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
    setActiveTab("home");
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity) return;
    fetch(`${API_URL}/inventory/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        name: newItem.name,
        quantity: parseInt(newItem.quantity, 10),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setNewItem({ name: "", quantity: "" });
        return fetch(`${API_URL}/inventory/${user.id}`);
      })
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch((err) => console.error(err));
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="logo">Vaultrex</h1>
        <ul className="nav-links">
          <li onClick={() => setActiveTab("home")}>Start</li>
          <li onClick={() => setActiveTab("services")}>Tjänster</li>
          <li onClick={() => setActiveTab("scanner")}>QR-Skanner</li>
          {user && <li onClick={() => setActiveTab("inventory")}>Inventarie</li>}
        </ul>
        <div className="auth-section">
          {user ? (
            <button onClick={handleLogout} className="logout-btn">Logga ut</button>
          ) : (
            <button onClick={() => setActiveTab("login")} className="login-btn">Logga in</button>
          )}
        </div>
      </nav>

      <div className="content">
        {activeTab === "home" && (
          <section>
            <h2>Välkommen till Vaultrex</h2>
            <p>Hantera inventarier, tjänster och QR-skanning enkelt.</p>
          </section>
        )}

        {activeTab === "services" && (
          <section>
            <h2>Våra Tjänster</h2>
            <p>Läs om våra tjänster och hur det fungerar.</p>
          </section>
        )}

        {activeTab === "login" && (
          <section>
            <h2>Logga in</h2>
            <form onSubmit={handleLogin} className="login-form">
              <input
                type="email"
                placeholder="E-post"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Logga in</button>
            </form>
          </section>
        )}

        {activeTab === "inventory" && user && (
          <section>
            <h2>Ditt Inventarie</h2>
            <ul>
              {inventory.map((item) => (
                <li key={item.id}>{item.name} – {item.quantity} st</li>
              ))}
            </ul>
            <form onSubmit={addItem} className="add-form">
              <input
                type="text"
                placeholder="Artikelnamn"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Antal"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                required
              />
              <button type="submit">Lägg till</button>
            </form>
          </section>
        )}

        {activeTab === "scanner" && (
          <section>
            <h2>QR-Skanner</h2>
            <QrScanner
              onDecode={(result) => {
                if (result) {
                  setScanResult(result);
                }
              }}
              onError={(err) => console.error(err)}
            />
            {scanResult && <p>Resultat: {scanResult}</p>}
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
