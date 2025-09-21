// src/App.jsx
import React, { useState } from "react";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">Vaultrex</div>
        <nav className="nav">
          <a href="#services">Tjänster</a>
          <a href="#faq">FAQ</a>
          <button className="login-btn" onClick={() => setShowLogin(!showLogin)}>
            {showLogin ? "Stäng login" : "Logga in"}
          </button>
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
      </section>

      <section id="faq" className="faq">
        <h2>Vanliga frågor</h2>
        <div className="faq-item">
          <h4>Hur funkar Vaultrex?</h4>
          <p>Vaultrex hjälper företag att hålla koll på lager och tjänster automatiskt.</p>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="login-modal">
          <div className="login-box">
            <h2>Logga in</h2>
            <form>
              <input type="email" placeholder="E-post" />
              <input type="password" placeholder="Lösenord" />
              <button type="submit">Logga in</button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">© 2025 Vaultrex</footer>
    </div>
  );
}

export default App;
