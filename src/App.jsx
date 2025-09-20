import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [inventory, setInventory] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(0);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("https://vaultrex-backend.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      setActiveTab("dashboard");
      fetchInventory(data.user.id);
    } else {
      alert(data.message);
    }
  };

  const fetchInventory = async (userId) => {
    const res = await fetch(`https://vaultrex-backend.onrender.com/inventory/${userId}`);
    const data = await res.json();
    setInventory(data);
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
    setActiveTab("home");
    setInventory([]);
  };

  const addItem = async () => {
    if (!newItemName || newItemQty <= 0) return;
    const res = await fetch("https://vaultrex-backend.onrender.com/inventory/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, name: newItemName, quantity: newItemQty }),
    });
    const data = await res.json();
    setInventory([...inventory, data]);
    setNewItemName("");
    setNewItemQty(0);
  };

  const updateQty = async (id, qty) => {
    const res = await fetch("https://vaultrex-backend.onrender.com/inventory/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantity: qty }),
    });
    const data = await res.json();
    setInventory(inventory.map(item => item.id === id ? data : item));
  };

  const deleteItem = async (id) => {
    await fetch("https://vaultrex-backend.onrender.com/inventory/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setInventory(inventory.filter(item => item.id !== id));
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Vaultrex Inventory</h1>
        {user && <button className="logout-btn" onClick={handleLogout}>Logga ut</button>}
      </header>

      <nav className="tabs">
        <button onClick={() => setActiveTab("home")} className={activeTab === "home" ? "active" : ""}>Startsida</button>
        {user && <button onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "active" : ""}>Dashboard</button>}
        {!user && <button onClick={() => setActiveTab("login")} className={activeTab === "login" ? "active" : ""}>Login</button>}
      </nav>

      <main>
        {activeTab === "home" && (
          <section className="home">
            <h2>Välkommen till Vaultrex</h2>
            <p>Se och hantera dina inventarier på ett enkelt och futuristiskt sätt.</p>
          </section>
        )}

        {activeTab === "login" && !user && (
          <section className="login">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Lösenord" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">Logga in</button>
            </form>
          </section>
        )}

        {activeTab === "dashboard" && user && (
          <section className="dashboard">
            <h2>Inventory Dashboard</h2>

            <div className="add-item">
              <input type="text" placeholder="Artikel namn" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
              <input type="number" placeholder="Antal" value={newItemQty} onChange={(e) => setNewItemQty(parseInt(e.target.value))} />
              <button onClick={addItem}>Lägg till artikel</button>
            </div>

            <ul className="inventory-list">
              {inventory.map(item => (
                <li key={item.id}>
                  <span>{item.name} - {item.quantity} st</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)}>+1</button>
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity <= 0}>-1</button>
                  <button onClick={() => deleteItem(item.id)}>Ta bort</button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer>
        <p>&copy; 2025 Vaultrex</p>
      </footer>
    </div>
  );
}
