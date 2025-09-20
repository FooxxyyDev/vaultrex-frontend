import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("home");
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Enkel demo-login
    if (email === "admin@vaultrex.se" && password === "Leary30!") {
      setLoggedIn(true);
      setTab("dashboard");
    } else {
      alert("Fel email eller lösenord!");
    }
  };

  if (!loggedIn) {
    return (
      <div className="app-container">
        <header>
          <h1>Vaultrex Inventory</h1>
        </header>
        <div className="login-panel">
          <h2>Login</h2>
          <input
            type="text"
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
          <button onClick={handleLogin}>Logga in</button>
        </div>
        <footer>
          <p>Vaultrex © 2025</p>
        </footer>
      </div>
    );
  }

  // Dashboard när inloggad
  return (
    <div className="app-container">
      <header>
        <h1>Vaultrex Dashboard</h1>
        <nav>
          <button onClick={() => setTab("inventory")}>Inventory</button>
          <button onClick={() => setTab("services")}>Mina Tjänster</button>
          <button onClick={() => { setLoggedIn(false); setTab("home"); }}>Logga ut</button>
        </nav>
      </header>

      <main>
        {tab === "inventory" && <div className="tab-content"><h2>Inventory</h2><p>Här kan du se och uppdatera dina artiklar.</p></div>}
        {tab === "services" && <div className="tab-content"><h2>Mina Tjänster</h2><p>Abonnera och hantera tjänster här.</p></div>}
        {tab === "home" && <div className="tab-content"><h2>Startsida</h2><p>Välkommen till Vaultrex! Se dina tjänster och inventory.</p></div>}
      </main>

      <footer>
        <p>Vaultrex © 2025</p>
      </footer>
    </div>
  );
}
