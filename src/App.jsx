import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [services, setServices] = useState([]);

  const backendURL = "https://vaultrex-backend.onrender.com";

  // ----- LOGIN -----
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${backendURL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      fetchInventory(data.user.id);
      fetchServices();
    } else {
      alert(data.message);
    }
  };

  // ----- FETCH INVENTORY -----
  const fetchInventory = async (userId) => {
    const res = await fetch(`${backendURL}/inventory/${userId}`);
    const data = await res.json();
    setInventory(data);
  };

  // ----- FETCH SERVICES -----
  const fetchServices = async () => {
    const res = await fetch(`${backendURL}/services`);
    const data = await res.json();
    setServices(data);
  };

  // ----- SUBSCRIBE -----
  const subscribeService = async (serviceId) => {
    const res = await fetch(`${backendURL}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, serviceId }),
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="app-container">
      {!user ? (
        <div className="login-panel">
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      ) : (
        <div className="dashboard">
          <h2>Welcome, {user.email}</h2>

          <section className="inventory-section">
            <h3>Inventory</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="services-section">
            <h3>Services</h3>
            <ul>
              {services.map((s) => (
                <li key={s.id}>
                  {s.name} (${s.price}){" "}
                  <button onClick={() => subscribeService(s.id)}>Subscribe</button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
