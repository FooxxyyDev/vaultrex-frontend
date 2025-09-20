import React, { useState, useEffect } from "react";
import QrReader from "react-qr-reader";

export default function App() {
  // --- States ---
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemQty, setItemQty] = useState(1);

  // --- Backend URL ---
  const API_URL = "https://vaultrex-backend.onrender.com"; // ändra om din backend har annan URL

  // --- Login ---
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error("Fel vid inloggning");
      const data = await res.json();
      setLoggedIn(true);
      setUserId(data.userId);
      loadInventory(data.userId);
    } catch (err) {
      alert("Fel användare eller lösenord");
    }
  };

  // --- Logout ---
  const handleLogout = () => {
    setLoggedIn(false);
    setUserId(null);
    setEmail("");
    setPassword("");
    setInventory([]);
  };

  // --- Hämta inventarie ---
  const loadInventory = async (id) => {
    const res = await fetch(`${API_URL}/inventory/${id}`);
    const data = await res.json();
    setInventory(data);
  };

  // --- Lägg till artikel ---
  const addItem = async () => {
    await fetch(`${API_URL}/inventory/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        name: itemName,
        quantity: parseInt(itemQty)
      })
    });
    setItemName("");
    setItemQty(1);
    loadInventory(userId);
  };

  // --- QR scanna (dra av 1 st) ---
  const handleScan = async (scanned) => {
    if (scanned) {
      await fetch(`${API_URL}/inventory/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: scanned })
      });
      loadInventory(userId);
      alert(`Skannade: ${scanned} - kvantitet uppdaterad`);
    }
  };

  const handleError = (err) => console.error(err);

  // --- UI ---
  if (!loggedIn) {
    return (
      <div className="app">
        <header>
          <h1>Vaultrex</h1>
          <nav>
            <button onClick={() => setShowLogin(false)}>Hem</button>
            <button onClick={() => setShowLogin(false)}>Tjänster</button>
            <button onClick={() => setShowLogin(false)}>Q&A</button>
            <button onClick={() => setShowLogin(true)}>Logga in</button>
          </nav>
        </header>

        {!showLogin ? (
          <main>
            <section>
              <h2>Välkommen till Vaultrex</h2>
              <p>Vi erbjuder smart inventariehantering med QR-koder.</p>
            </section>
            <section>
              <h2>Tjänster</h2>
              <ul>
                <li>Inventariehantering</li>
                <li>QR-kod spårning</li>
                <li>Automatisk beställning</li>
              </ul>
            </section>
            <section>
              <h2>Frågor och svar</h2>
              <p><strong>Hur funkar det?</strong> Du loggar in och scannar dina artiklar.</p>
            </section>
          </main>
        ) : (
          <main className="login-section">
            <h2>Logga in</h2>
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
          </main>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Vaultrex Dashboard</h1>
        <button onClick={handleLogout}>Logga ut</button>
      </header>

      <main>
        <section>
          <h2>Ditt lager</h2>
          <ul>
            {inventory.map((item) => (
              <li key={item.id}>
                {item.name} – {item.quantity} st
              </li>
            ))}
          </ul>

          <h3>Lägg till artikel</h3>
          <input
            type="text"
            placeholder="Artikelnamn"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Antal"
            value={itemQty}
            onChange={(e) => setItemQty(e.target.value)}
          />
          <button onClick={addItem}>Lägg till</button>
        </section>

        <section>
          <h2>QR-scanner</h2>
          <p>Skanna artikelns namn (QR innehåller artikelns namn)</p>
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "300px" }}
          />
        </section>
      </main>
    </div>
  );
}
