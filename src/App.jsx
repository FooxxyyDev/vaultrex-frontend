import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("inventory");

  const handleLogin = (e) => {
    e.preventDefault();
    // Här kan du byta ut mot riktig API-koll
    if (email && password) {
      setLoggedIn(true);
    } else {
      alert("Please enter email and password");
    }
  };

  if (!loggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Vaultrex Login</h1>
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
            <button type="submit">Log In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Vaultrex Dashboard</h1>
        <nav className="nav">
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
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </nav>
      </header>

      <main className="content">
        {activeTab === "inventory" && (
          <div className="card">
            <h2>Your Items</h2>
            <p>List and manage your inventory items here.</p>
          </div>
        )}

        {activeTab === "services" && (
          <div className="card">
            <h2>Available Services</h2>
            <p>Subscribe to and configure your services.</p>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="card">
            <h2>Your Profile</h2>
            <p>Manage your account and settings.</p>
          </div>
        )}
      </main>
    </div>
  );
}
