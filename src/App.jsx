import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inventory, setInventory] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState("inventory");

  // ----- MOCK LOGIN -----
  const handleLogin = () => {
    if (email === "admin@vaultrex.com" && password === "Leary30!") {
      setUser({ email });
      fetchData();
    } else {
      alert("Fel e-post eller lösenord!");
    }
  };

  const fetchData = async () => {
    // Placeholder för att hämta inventory & services
    setInventory([
      { id: 1, name: "Skruv", quantity: 50 },
      { id: 2, name: "Muttrar", quantity: 30 },
    ]);

    setServices([
      { id: 1, name: "Premium Inventory Scan", price: 5 },
      { id: 2, name: "Auto-Update Inventory", price: 10 },
      { id: 3, name: "QR Bulk Scan", price: 15 },
    ]);
  };

  const handleSubscribe = (serviceId) => {
    alert(`Subscribed to service ${serviceId}`);
  };

  const handleScanQR = (item) => {
    alert(`QR scan for ${item.name}`);
  };

  if (!user) {
    return (
      <div className="login-container">
        <h1>Vaultrex Admin Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>Vaultrex Dashboard</h1>
        <nav>
          <button onClick={() => setActiveTab("inventory")}>Inventory</button>
          <button onClick={() => setActiveTab("services")}>Services</button>
        </nav>
      </header>

      <main>
        {activeTab === "inventory" && (
          <div className="inventory-tab">
            <h2>Your Inventory</h2>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>QR Scan</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <button onClick={() => handleScanQR(item)}>Scan QR</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "services" && (
          <div className="services-tab">
            <h2>Available Services</h2>
            <ul>
              {services.map((service) => (
                <li key={service.id}>
                  {service.name} - ${service.price}{" "}
                  <button onClick={() => handleSubscribe(service.id)}>Subscribe</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
