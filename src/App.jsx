import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Här ska du koppla mot backend login
    if (email === "admin@vaultrex.se" && password === "Leary30!") {
      setUser({ email });
    } else {
      alert("Fel e-post eller lösenord");
    }
  };

  const renderContent = () => {
    if (!user) {
      return (
        <div className="login-box">
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
      );
    }

    switch (activeTab) {
      case "home":
        return <div className="tab-content">Välkommen till Vaultrex Dashboard!</div>;
      case "inventory":
        return <div className="tab-content">Här ser du inventory. (Kommande: QR scanning)</div>;
      case "subscriptions":
        return <div className="tab-content">Här ser du dina abonnemang.</div>;
      case "settings":
        return <div className="tab-content">Inställningar för kontot.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Vaultrex Dashboard</h1>
        {user && (
          <nav>
            <button onClick={() => setActiveTab("home")}>Home</button>
            <button onClick={() => setActiveTab("inventory")}>Inventory</button>
            <button onClick={() => setActiveTab("subscriptions")}>Subscriptions</button>
            <button onClick={() => setActiveTab("settings")}>Settings</button>
            <button onClick={() => setUser(null)}>Logout</button>
          </nav>
        )}
      </header>
      <main>{renderContent()}</main>
    </div>
  );
}
