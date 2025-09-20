import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);

  const login = async () => {
    const res = await fetch("https://vaultrex-backend.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      fetchInventory(data.user.id);
    } else {
      alert("Login failed");
    }
  };

  const fetchInventory = async (userId) => {
    const res = await fetch(
      `https://vaultrex-backend.onrender.com/inventory/${userId}`
    );
    const data = await res.json();
    setInventory(data);
  };

  if (!user) {
    return (
      <div className="login-container">
        <h1>Vaultrex Login</h1>
        <input
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
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user.email}</h1>
      <button onClick={() => setUser(null)}>Logout</button>
      <h2>Your Inventory</h2>
      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            {item.name} - {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
