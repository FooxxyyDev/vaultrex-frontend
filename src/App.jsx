import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  const handleLogin = (e) => {
    e.preventDefault();
    // Hardcoded admin user
    if (email === "admin@vaultrex.se" && password === "Leary30!") {
      setUser({ email });
      setActiveTab("dashboard");
    } else {
      alert("Fel email eller lösenord!");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
    setActiveTab("home");
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Vaultrex Inventory</h1>
        {user && <button className="logout-btn" onClick={handleLogout}>Logga ut</button>}
      </header>

      <nav className="tabs">
        <button onClick={() => setActiveTab("home")} className={activeTab === "home" ? "active" : ""}>Startsida</button>
        <button onClick={() => setActiveTab("services")} className={activeTab === "services" ? "active" : ""}>Mina Tjänster</button>
        {!user && <button onClick={() => setActiveTab("login")} className={activeTab === "login" ? "active" : ""}>Login</button>}
      </nav>

      <main>
        {activeTab === "home" && (
          <section className="home">
            <h2>Välkommen till Vaultrex</h2>
            <p>Vi hjälper dig hålla koll på inventarier och tjänster med stilren futuristisk dashboard.</p>
          </section>
        )}

        {activeTab === "services" && (
          <section className="services">
            {user ? (
              <>
                <h2>Dina Tjänster</h2>
                <ul>
                  <li>Tjänst A - Abonnera</li>
                  <li>Tjänst B - Abonnera</li>
                  <li>Tjänst C - Abonnera</li>
                </ul>
              </>
            ) : (
              <p>Du måste logga in för att se dina tjänster.</p>
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
