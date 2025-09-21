import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("landing"); // landing | login | dashboard
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Här kan du byta ut mot riktig fetch till backend
    if (email === "admin@vaultrex.se" && password === "admin") {
      setPage("dashboard");
    } else {
      alert("Fel email eller lösenord");
    }
  };

  return (
    <div className="app-container">
      {page === "landing" && (
        <div className="landing">
          <h1 className="title">Välkommen till Vaultrex</h1>
          <p className="subtitle">
            Hantera dina inventarier och tjänster enkelt.
          </p>
          <button className="btn-primary" onClick={() => setPage("login")}>
            Logga in
          </button>
        </div>
      )}

      {page === "login" && (
        <div className="login">
          <h2 className="title">Logga in</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="E-post"
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
            <button type="submit" className="btn-primary">
              Logga in
            </button>
          </form>
          <button className="btn-secondary" onClick={() => setPage("landing")}>
            Tillbaka
          </button>
        </div>
      )}

      {page === "dashboard" && (
        <div className="dashboard">
          <h2 className="title">Ditt konto</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>Bas</h3>
              <p>Grundläggande funktioner för lager & tjänster</p>
            </div>
            <div className="service-card">
              <h3>Extra Tjänster</h3>
              <p>Utökade funktioner för avancerad hantering</p>
            </div>
          </div>
          <button className="btn-secondary" onClick={() => setPage("landing")}>
            Logga ut
          </button>
        </div>
      )}
    </div>
  );
}
