import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventory, setInventory] = useState([]);
  const [services, setServices] = useState([]);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // --- Hämta inventory och services när användare loggar in ---
  useEffect(() => {
    if (user) {
      fetch("/api/inventory")
        .then(res => res.json())
        .then(data => setInventory(data))
        .catch(console.error);

      fetch("/api/services")
        .then(res => res.json())
        .then(data => setServices(data))
        .catch(console.error);
    }
  }, [user]);

  // --- Inloggning ---
  const handleLogin = (e) => {
    e.preventDefault();
    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.user);
        else alert("Fel användarnamn eller lösenord!");
      })
      .catch(console.error);
  };

  // --- Logga ut ---
  const handleLogout = () => setUser(null);

  // --- QR-skanning (mock) ---
  const handleScanQR = () => {
    const itemId = prompt("Skanna QR-kod / Ange artikel ID:");
    if (!itemId) return;
    fetch(`/api/inventory/scan/${itemId}`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        // Uppdatera inventory
        fetch("/api/inventory")
          .then(res => res.json())
          .then(setInventory);
      })
      .catch(console.error);
  };

  if (!user) {
    return (
      <div className="login-container">
        <h1>Vaultrex Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={loginData.email}
            onChange={e => setLoginData({...loginData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={e => setLoginData({...loginData, password: e.target.value})}
            required
          />
          <button type="submit">Logga in</button>
        </form>
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
        <button
          className={activeTab === "inventory" ? "active" : ""}
          onClick={() => setActiveTab("inventory")}
        >
          Inventory
        </button>
        <button
          className={activeTab === "services" ? "active" : ""}
          onClick={() => setActiveTab("services")}
        >
          Services
        </button>
        <button
          className={activeTab === "settings" ? "active" : ""}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </nav>

      <main>
        {activeTab === "inventory" && (
          <div className="inventory">
            <button onClick={handleScanQR}>Scan QR / Dra artikel</button>
            {inventory.map(item => (
              <div key={item.id} className="inventory-item">
                <span>{item.name} (Antal: {item.quantity})</span>
                <button onClick={() => alert(`Redigera ${item.name}`)}>Redigera</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "services" && (
          <div className="services">
            {services.map(service => (
              <div key={service.id} className="service-item">
                <span>{service.name}</span>
                <button onClick={() => alert(`Abonnera på ${service.name}`)}>Abonnera</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings">
            <h2>Inställningar</h2>
            <input type="text" placeholder="Ändra e-mail" />
            <input type="password" placeholder="Ändra lösenord" />
            <button>Uppdatera konto</button>
          </div>
        )}
      </main>
    </div>
  );
}
