import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [inventory, setInventory] = useState([]);

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

  return (
    <div className="App">
      <header className="header">
        <h1>Vaultrex Inventory</h1>
        {user && <button className="logout-btn" onClick={handleLogout}>Logga ut</button>}
      </header>

      <nav className="tabs">
        <button onClick={() => setActiveTab("home")} className={activeTab === "home" ? "active" : ""}>Startsida</button>
        <button onClick={() => setActiveTab("dashboard")} className={activeTab === "dashboard" ? "active" : ""}>Mina Tjänster</button>
        {!user && <button onClick={() => setActiveTab("login")} className={activeTab === "login" ? "active" : ""}>Login</button>}
      </nav>

      <main>
        {activeTab === "home" && (
          <section className="home">
            <h2>Välkommen till Vaultrex</h2>
            <p>Vi hjälper dig hålla koll på inventarier och tjänster med stilren futuristisk dashboard.</p>
          </section>
        )}

        {activeTab === "dashboard" && (
          <section className="services">
            {user ? (
              <>
                <h2>Dina Artiklar</h2>
                <ul>
                  {inventory.map((item) => (
                    <li key={item.id}>{item.name} - {item.quantity} st</li>
                  ))}
                </ul>
              </>
            ) : (
              <p>Du måste logga in för att se dina artiklar.</p>
            )}
          </section>
        )}

        {activeTab === "login" && (
          <section className="login">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
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
      </main>

      <footer>
        <p>&copy; 2025 Vaultrex</p>
      </footer>
    </div>
  );
}
