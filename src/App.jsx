import React, { useState } from "react";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://vaultrex-backend.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        setLoggedIn(true);
        setLoginMessage("Du är inloggad!");
        setShowLogin(false);
      } else {
        setLoginMessage(data.message || "Fel e-post eller lösenord");
      }
    } catch (err) {
      console.error(err);
      setLoginMessage("Något gick fel vid inloggningen");
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">Vaultrex</div>
        <nav className="nav">
          <a href="#services">Tjänster</a>
          <a href="#faq">FAQ</a>
          {!loggedIn && (
            <button
              className="login-btn"
              onClick={() => setShowLogin(!showLogin)}
            >
              {showLogin ? "Stäng login" : "Logga in"}
            </button>
          )}
          {loggedIn && <span className="logged-in">Inloggad</span>}
        </nav>
      </header>

      {/* Landing Content */}
      <section className="hero">
        <h1>Välkommen till Vaultrex</h1>
        <p>Smarta lösningar för inventering, tjänster och administration</p>
      </section>

      <section id="services" className="services">
        <h2>Våra tjänster</h2>
        <div className="service-card">
          <h3>Bas</h3>
          <p>Inventeringssystem för små företag.</p>
        </div>
        <div className="service-card">
          <h3>Extra</h3>
          <p>Tilläggstjänster för automatiserad beställning och scanning.</p>
        </div>
        <div className="service-card">
          <h3>Premium</h3>
          <p>Allt-i-ett lösning för stora företag med avancerad analys.</p>
        </div>
      </section>

      <section id="faq" className="faq">
        <h2>Vanliga frågor</h2>
        <div className="faq-item">
          <h4>Hur funkar Vaultrex?</h4>
          <p>Vaultrex hjälper företag att hålla koll på lager och tjänster automatiskt.</p>
        </div>
        <div className="faq-item">
          <h4>Kan jag uppgradera min plan?</h4>
          <p>Ja, du kan uppgradera eller nedgradera din plan när som helst.</p>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && !loggedIn && (
        <div className="login-modal">
          <div className="login-box">
            <h2>Logga in</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="E-post"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Logga in</button>
            </form>
            {loginMessage && <p className="login-message">{loginMessage}</p>}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">© 2025 Vaultrex</footer>
    </div>
  );
}

export default App;
