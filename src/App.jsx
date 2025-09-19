import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inventory, setInventory] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState("inventory");

  const login = async () => {
    const res = await fetch("https://vaultrex-backend.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      fetchInventory(data.user.id);
      fetchServices();
    } else {
      alert("Invalid login");
    }
  };

  const fetchInventory = async (userId) => {
    const res = await fetch(`https://vaultrex-backend.onrender.com/inventory/${userId}`);
    const data = await res.json();
    setInventory(data);
  };

  const fetchServices = async () => {
    const res = await fetch("https://vaultrex-backend.onrender.com/services");
    const data = await res.json();
    setServices(data);
  };

  const subscribe = async (serviceId) => {
    const res = await fetch("https://vaultrex-backend.onrender.com/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, serviceId }),
    });
    if (res.ok) alert("Subscribed!");
  };

  if (!user) {
    return (
      <div className="login-container">
        <h1>Vaultrex Login</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user.email}</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab("inventory")} className={activeTab === "inventory" ? "active" : ""}>Inventory</button>
        <button onClick={() => setActiveTab("services")} className={activeTab === "services" ? "active" : ""}>Services</button>
      </div>
      <div className="tab-content">
        {activeTab === "inventory" && (
          <div className="inventory-list">
            {inventory.map((item) => (
              <div key={item.id} className="inventory-item">
                {item.name} - Quantity: {item.quantity}
              </div>
            ))}
          </div>
        )}
        {activeTab === "services" && (
          <div className="services-list">
            {services.map((s) => (
              <div key={s.id} className="service-item">
                {s.name} - ${s.price} <button onClick={() => subscribe(s.id)}>Subscribe</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
