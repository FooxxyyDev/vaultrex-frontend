import React, { useState } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Dummy login för demo, byt till API-anrop senare
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@vaultrex.se" && password === "Leary30!") {
      setUser({ email });
      setShowLogin(false);
    } else {
      alert("Fel email eller lösenord!");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
  };

  if (user) {
    // Dashboard
    return (
      <div className="dashboard">
        <header>
          <h1>Vaultrex Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">Logga ut</button>
        </header>
        <section>
          <h2>Dina tjänster</h2>
          <ul>
            <li>Tjänst 1</li>
            <li>Tjänst 2</li>
            <li>Tjänst 3</li>
          </ul>
        </section>
      </div>
    );
  }

  // Startsida
  return (
    <div className="landing">
      <header>
        <h1>Välkommen till Vaultrex</h1>
        <button onClick={() => setShowLogin(true)} className="login-btn">
          Logga in
        </button>
      </header>

      <main>
        <section className="about">
          <h2>Om oss</h2>
          <p>Vi erbjuder smarta lösningar för inventariehantering och tjänster för ditt företag.</p>
        </section>

        <section className="services">
          <h2>Mina tjänster</h2>
          <ul>
            <li>Tjänst 1: Smarta lagersystem</li>
            <li>Tjänst 2: Automatiserad beställning</li>
            <li>Tjänst 3: QR-baserad inventering</li>
          </ul>
        </section>
      </main>

      {showLogin && (
        <div className="login-modal">
          <form onSubmit={handleLogin}>
            <h2>Logga in</h2>
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
            <button type="button" onClick={() => setShowLogin(false)}>Avbryt</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
